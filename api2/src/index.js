const express = require('express');
const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());

// Health check — requis pour le docker-compose depends_on
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API1 running on port ${PORT}`);
});