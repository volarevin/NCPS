const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/technician', require('./routes/technicianRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('NCPS Server is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});