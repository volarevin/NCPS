const db = require('../config/db');

exports.getDashboardStats = (req, res) => {
  const userId = req.userId;
  const query = 'CALL sp_get_customer_stats(?)';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching stats.' });
    }
    res.json(results[0][0]);
  });
};

exports.getAppointments = (req, res) => {
  const userId = req.userId;
  const query = `
    SELECT a.*, s.name as service_name, u.first_name as tech_first_name, u.last_name as tech_last_name
    FROM appointments a
    JOIN services s ON a.service_id = s.service_id
    LEFT JOIN users u ON a.technician_id = u.user_id
    WHERE a.customer_id = ?
    ORDER BY a.appointment_date DESC
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching appointments.' });
    }
    res.json(results);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.userId;
  const { firstName, lastName, email, phone } = req.body;

  const query = `
    UPDATE users 
    SET first_name = ?, last_name = ?, email = ?, phone_number = ?
    WHERE user_id = ?
  `;

  db.query(query, [firstName, lastName, email, phone, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error updating profile.' });
    }
    res.json({ message: 'Profile updated successfully.' });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.userId;
  const query = 'SELECT first_name, last_name, email, phone_number FROM users WHERE user_id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching profile.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(results[0]);
  });
};