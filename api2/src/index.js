const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4002;

// Connexion à MongoDB

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`
    );
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectDB();

// shema alert 

const alertSchema = new mongoose.Schema({
  ip:          { type: String, required: true },
  country:     String,
  countryCode: String,
  city:        String,
  isp:         String,
  abuseScore:  { type: Number, default: 0 },
  isMalicious: { type: Boolean, default: false },
  reason:      String,
  createdAt:   { type: Date, default: Date.now }
});

const Alert = mongoose.model('Alert', alertSchema);

// géolocalisation ip-api.com

const geolocateIP = async (ip) => {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    if (data.status === 'success') return data;
  } catch (error) {
    console.error('Error geolocating IP:', error);
  }
  return null;
};
// reputation abuseipdb.com
const checkAbuseIPDB = async (ip) => {
  try {
  
    const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
      headers: { Key: process.env.ABUSEIPDB_API_KEY, Accept: 'application/json' }
    });

    const data = await response.json();
    return data.data?.abuseConfidenceScore ?? null;
  } catch (error) {
    console.error('Error checking AbuseIPDB:', error);
  }
  return null;    
};
//Routes 
app.post('/analyse', async (req, res) => {
  const {ip} = req.body;
  if(!ip) return res.status(400).json({error: 'IP required'});

  const existing = await Alert.findOne({
    ip,
  });
  if (existing) return res.json(existing);

  const geo = await geolocateIP(ip);

  const abuseScore = await checkAbuseIPDB(ip);

  const isMalicious = (abuseScore!== null && abuseScore > 25);
  const reason = isMalicious ? `AbuseIPDB score: ${abuseScore}/100`: `No significant threat detected`;

  const alert = new Alert({
    ip,
    country: geo?.country ?? 'Unknown',
    countryCode: geo?.countryCode ?? 'XX',
    city: geo?.city ?? 'Unknown',
    isp: geo?.isp ?? 'Unknown',
    abuseScore: abuseScore ?? 0,
    isMalicious,
    reason
  })

  await alert.save();
  res.json(alert);
});


app.get('/alerts', async (req, res) => {
  try{
    const alerts = await Alert.find().sort({ createdAt: -1}).limit(100);
    res.json(alerts);
  }catch (err) {
    res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/alerts/malicious',async (req,res) => {
  try{
    const alerts = await Alert.find({isMalicious: true}).sort({ createdAt: -1});
    res.json(alerts);
  }catch( err){
    res.status(500).json({error: 'Internal server error'});
  }
})

app.get('/stats/countries', async (req,res) => {
   try {
    const stats = await Alert.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Health check 
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API2 running on port ${PORT}`);
});