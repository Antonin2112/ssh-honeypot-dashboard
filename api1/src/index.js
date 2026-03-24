const express = require('express');
const app = express();
const cors = require('cors');  
const PORT = process.env.PORT || 4001;
const fs = require('fs');
const readline = require('readline');
app.use(express.json());

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const initDb = async () => {
  try {
    await pool.connect();
    await pool.query(`
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,  
    ip VARCHAR(255) NOT NULL,    
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    username VARCHAR(255),        
    password VARCHAR(255),       
    country VARCHAR(255),        
    command TEXT,                 
    event_type VARCHAR(255) NOT NULL,  
    session_id VARCHAR(255) NOT NULL   
);
`);
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

initDb();


const watchCowrieLogs = () => {
  
    const logFile = '/cowrie/var/log/cowrie/cowrie.json';

    // Si le fichier n'existe pas encore, on réessaie dans 5 secondes
    if (!fs.existsSync(logFile)) {
      console.log('Waiting for Cowrie log file...');
      setTimeout(watchCowrieLogs, 5000);
      return;
    }

    console.log('Watching Cowrie logs...');
    let fileSize = fs.statSync(logFile).size; // on retient où on en est
    

    fs.watchFile(logFile, () => {
    const newSize = fs.statSync(logFile).size;

    if (newSize < fileSize) {
    fileSize = 0;
    }
    const stream = fs.createReadStream(logFile, { 
        start: fileSize,  // ← on part de là où on s'est arrêté
        end: newSize 
    });
    fileSize = newSize; // ← on met à jour la position
    const rl = readline.createInterface({ input: stream }); // ← stream défini !
    rl.on('line', async (line) => {
            try { 
                const event = JSON.parse(line);
                await pool.query(
                    'INSERT INTO events (ip, username, password, country, command, event_type, session_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [event.src_ip, event.username, event.password, event.geoip?.country_name, event.input, event.eventid, event.session]
                );
            } catch (err) {
                console.error('Error processing log line:', err);
            }
        });
    });
};

watchCowrieLogs();



//routes 
app.use(cors());   

app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY timestamp DESC LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/stats/credentials', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT username, COUNT(*) AS count 
      FROM events
      GROUP BY username
      ORDER BY count DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching credential stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/stats/countries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT country, COUNT(*) AS count 
      FROM events
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching country stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/stats/active-sessions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM events WHERE event_type = 'cowrie.session.connect') -
        (SELECT COUNT(*) FROM events WHERE event_type = 'cowrie.session.closed') AS active
    `)
    res.json({ active: Math.max(0, parseInt(result.rows[0].active)) })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Health check — requis pour le docker-compose depends_on
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API 1 running on port ${PORT}`);
});

