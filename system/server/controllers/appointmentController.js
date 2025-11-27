const db = require('../config/db');

exports.createAppointment = (req, res) => {
  const { serviceId, date, time, notes } = req.body;
  const customerId = req.userId; // From auth middleware

  if (!serviceId || !date || !time) {
    return res.status(400).json({ message: 'Please provide service, date, and time.' });
  }

  // Combine date and time into a single DATETIME string
  const appointmentDate = `${date} ${time}:00`;

  const query = `
    INSERT INTO appointments (customer_id, service_id, appointment_date, customer_notes, status)
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  db.query(query, [customerId, serviceId, appointmentDate, notes], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error creating appointment.' });
    }
    res.status(201).json({ message: 'Appointment booked successfully.', appointmentId: result.insertId });
  });
};

exports.updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status, reason, category } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  let query = 'UPDATE appointments SET status = ?';
  const params = [status];

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

  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error updating appointment.' });
    }
    res.json({ message: 'Appointment status updated successfully.' });
  });
};

exports.updateAppointment = (req, res) => {
  const { id } = req.params;
  const { serviceId, date, time, notes } = req.body;
  const userId = req.userId;

  // Only allow updating if status is Pending
  const checkQuery = 'SELECT status, customer_id FROM appointments WHERE appointment_id = ?';
  
  db.query(checkQuery, [id], (err, results) => {
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

    db.query(updateQuery, [serviceId, appointmentDate, notes, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error updating appointment.' });
      }
      res.json({ message: 'Appointment updated successfully.' });
    });
  });
};