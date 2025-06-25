const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/neows', require('./routes/neows'));
app.use('/api/apod', require('./routes/apod'));
app.use('/api/epic', require('./routes/epic'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  
});
