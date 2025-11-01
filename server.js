// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jokebookRoutes = require('./routes/jokebookRoutes');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/jokebook', jokebookRoutes);


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
