const express = require('express');
const app = express();
require('dotenv').config();
const fileRoutes = require('./routes/fileRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the File Upload API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
