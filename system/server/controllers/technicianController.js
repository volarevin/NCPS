const db = require('../config/db');

exports.getAssignedJobs = (req, res) => {
  const technicianId = req.userId;
  
  const query = `
    SELECT a.*, u.first_name as customer_first_name, u.last_name as customer_last_name, 
           u.email as customer_email, u.phone_number as customer_phone,
           s.service_name
    FROM appointments a
    JOIN users u ON a.customer_id = u.user_id
    JOIN services s ON a.service_id = s.service_id
    WHERE a.technician_id = ?
    ORDER BY a.appointment_date ASC
  `;

  db.query(query, [technicianId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching jobs.' });
    }
    res.json(results);
  });
};

exports.getProfile = (req, res) => {
  const userId = req.userId;
  
  const query = `
    SELECT tp.*, u.first_name, u.last_name, u.email, u.phone_number
    FROM technician_profiles tp
    JOIN users u ON tp.user_id = u.user_id
    WHERE u.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching profile.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Profile not found.' });
    }
    res.json(results[0]);
  });
};

exports.updateAvailability = (req, res) => {
  const userId = req.userId;
  const { status } = req.body; // 'Available', 'On Job', 'Offline'

  const query = 'UPDATE technician_profiles SET availability_status = ? WHERE user_id = ?';

  db.query(query, [status, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error updating availability.' });
    }
    res.json({ message: 'Availability updated successfully.' });
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.userId;
  const { name, email, phone, specialization } = req.body;
  
  // Split name into first and last (simple split)
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || '';

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: 'Database transaction error.' });

    // Update users table
    const userQuery = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE user_id = ?';
    db.query(userQuery, [firstName, lastName, email, phone, userId], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: 'Error updating user info.' });
        });
      }

      // Update technician_profiles table
      const techQuery = 'UPDATE technician_profiles SET specialty = ? WHERE user_id = ?';
      db.query(techQuery, [specialization, userId], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: 'Error updating technician info.' });
          });
        }

        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error committing transaction.' });
            });
          }
          res.json({ message: 'Profile updated successfully.' });
        });
      });
    });
  });
};