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