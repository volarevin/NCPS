const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.createAppointment = (req, res) => {
  const { serviceId, date, time, notes, address, saveAddress } = req.body;
  const customerId = req.userId; // From auth middleware

  if (!serviceId || !date || !time || !address) {
    return res.status(400).json({ message: 'Please provide service, date, time, and address.' });
  }

  // Combine date and time into a single DATETIME string
  const appointmentDate = `${date} ${time}:00`;

  // If saveAddress is true, save it to customer_addresses
  if (saveAddress) {
    // Check if address already exists to avoid duplicates (simple check)
    (req.db || db).query('SELECT * FROM customer_addresses WHERE user_id = ? AND address_line = ?', [customerId, address], (err, results) => {
        if (!err && results.length === 0) {
            (req.db || db).query('INSERT INTO customer_addresses (user_id, address_line, address_label) VALUES (?, ?, ?)', 
                [customerId, address, 'Saved Address']);
        }
    });
  }

  const query = `
    INSERT INTO appointments (customer_id, service_id, appointment_date, customer_notes, service_address, status)
    VALUES (?, ?, ?, ?, ?, 'Pending')
  `;

  (req.db || db).query(query, [customerId, serviceId, appointmentDate, notes, address], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error creating appointment.' });
    }
    res.status(201).json({ message: 'Appointment booked successfully.', appointmentId: result.insertId });
  });
};

exports.updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status, reason, category, technicianId } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  let query = 'UPDATE appointments SET status = ?';
  const params = [status];

  if (technicianId) {
    query += ', technician_id = ?';
    params.push(technicianId);
  }

  if (status === 'Cancelled' || status === 'Rejected') {
    if (reason) {
      query += ', cancellation_reason = ?';
      params.push(reason);
    }
    if (category) {
      query += ', cancellation_category = ?';
      params.push(category);
    }
    // Also track who cancelled it if we have user info in request (from middleware)
    if (req.userId) {
        query += ', cancelled_by = ?';
        params.push(req.userId);
    }
  }

  query += ' WHERE appointment_id = ?';
  params.push(id);

  (req.db || db).query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error updating appointment.' });
    }
    res.json({ message: 'Appointment status updated.' });
  });
};

exports.updateAppointment = (req, res) => {
  const { id } = req.params;
  const { serviceId, date, time, notes } = req.body;
  const userId = req.userId;

  // Only allow updating if status is Pending
  const checkQuery = 'SELECT status, customer_id FROM appointments WHERE appointment_id = ?';
  
  (req.db || db).query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error checking appointment.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    const appointment = results[0];
    
    if (appointment.customer_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this appointment.' });
    }

    if (appointment.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending appointments can be updated.' });
    }

    const appointmentDate = `${date} ${time}:00`;
    
    const updateQuery = `
      UPDATE appointments 
      SET service_id = ?, appointment_date = ?, customer_notes = ?
      WHERE appointment_id = ?
    `;

    (req.db || db).query(updateQuery, [serviceId, appointmentDate, notes, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error updating appointment.' });
      }
      res.json({ message: 'Appointment updated successfully.' });
    });
  });
};

exports.rateAppointment = (req, res) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;
  const userId = req.userId;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Please provide a valid rating (1-5).' });
  }

  // Check appointment validity
  const checkQuery = 'SELECT * FROM appointments WHERE appointment_id = ?';
  (req.db || db).query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    const appointment = results[0];

    if (appointment.customer_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    if (appointment.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only rate completed appointments.' });
    }

    // Check if already rated
    const checkRatingQuery = 'SELECT * FROM reviews WHERE appointment_id = ?';
    (req.db || db).query(checkRatingQuery, [id], (err, ratingResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error.' });
      }

      if (ratingResults.length > 0) {
        return res.status(400).json({ message: 'You have already rated this appointment.' });
      }

      // Insert review
      const insertQuery = `
        INSERT INTO reviews (appointment_id, customer_id, technician_id, rating, feedback_text)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      (req.db || db).query(insertQuery, [id, userId, appointment.technician_id, rating, feedback], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Database error saving review.' });
        }

        // Manually update technician rating to ensure it syncs (in case trigger is missing/broken)
        const updateRatingQuery = `
          UPDATE technician_profiles 
          SET average_rating = (SELECT AVG(rating) FROM reviews WHERE technician_id = ?)
          WHERE user_id = ?
        `;

        (req.db || db).query(updateRatingQuery, [appointment.technician_id, appointment.technician_id], (updateErr) => {
          if (updateErr) {
            console.error('Error updating technician rating:', updateErr);
          }
          res.status(201).json({ message: 'Rating submitted successfully.' });
        });
      });
    });
  });
};

exports.createWalkInAppointment = async (req, res) => {
  const { 
    customerId, 
    newUser, 
    walkinDetails, 
    serviceId, 
    date, 
    time, 
    address, 
    notes 
  } = req.body;

  if (!serviceId || !date || !time || !address) {
    return res.status(400).json({ message: 'Please provide service, date, time, and address.' });
  }

  const appointmentDate = `${date} ${time}:00`;
  const connection = req.db || db;

  const runTransaction = async () => {
    const query = (sql, args) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
    };

    try {
      await query('START TRANSACTION', []);

      let finalCustomerId = customerId;

      // 1. Handle New User Creation
      if (newUser) {
        const { firstName, lastName, email, phone } = newUser;
        // Generate username and password
        const username = email.split('@')[0] + Math.floor(Math.random() * 10000);
        const password = Math.random().toString(36).slice(-8) + "1!"; // Simple random password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userResult = await query(
          `INSERT INTO users (username, first_name, last_name, email, phone_number, password_hash, role, status)
           VALUES (?, ?, ?, ?, ?, ?, 'Customer', 'Active')`,
          [username, firstName, lastName, email, phone, hashedPassword]
        );
        finalCustomerId = userResult.insertId;
      }

      // 2. Create Appointment
      let insertQuery = '';
      let params = [];

      if (finalCustomerId) {
        insertQuery = `
          INSERT INTO appointments (customer_id, service_id, appointment_date, customer_notes, service_address, status, is_walk_in)
          VALUES (?, ?, ?, ?, ?, 'Pending', 1)
        `;
        params = [finalCustomerId, serviceId, appointmentDate, notes, address];
      } else if (walkinDetails) {
        // Guest Walk-in
        insertQuery = `
          INSERT INTO appointments (customer_id, service_id, appointment_date, customer_notes, service_address, status, is_walk_in, walkin_name, walkin_phone, walkin_email)
          VALUES (NULL, ?, ?, ?, ?, 'Pending', 1, ?, ?, ?)
        `;
        params = [serviceId, appointmentDate, notes, address, walkinDetails.name, walkinDetails.phone, walkinDetails.email];
      } else {
        throw new Error('No customer information provided.');
      }

      const apptResult = await query(insertQuery, params);

      await query('COMMIT', []);
      
      res.status(201).json({ 
        message: 'Walk-in appointment created successfully.', 
        appointmentId: apptResult.insertId,
        userId: finalCustomerId 
      });

    } catch (error) {
      await query('ROLLBACK', []);
      console.error('Walk-in creation error:', error);
      res.status(500).json({ message: error.message || 'Database error.' });
    }
  };

  runTransaction();
};