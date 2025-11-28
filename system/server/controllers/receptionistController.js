const db = require('../config/db');

exports.getDashboardStats = (req, res) => {
  const queries = {
    counts: `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status IN ('In Progress', 'in-progress', 'in_progress', 'In-Progress') THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments
      WHERE (marked_for_deletion = 0 OR marked_for_deletion IS NULL)
    `,
    today: `
      SELECT 
        a.appointment_id, a.appointment_date, a.status, a.customer_notes, a.technician_id,
        u.first_name as client_first, u.last_name as client_last, u.phone_number, u.email, u.address,
        s.name as service_name, sc.name as category_name,
        t.first_name as tech_first, t.last_name as tech_last
      FROM appointments a
      JOIN users u ON a.customer_id = u.user_id
      JOIN services s ON a.service_id = s.service_id
      LEFT JOIN service_categories sc ON s.category_id = sc.category_id
      LEFT JOIN users t ON a.technician_id = t.user_id
      WHERE DATE(a.appointment_date) = CURDATE() AND (a.marked_for_deletion = 0 OR a.marked_for_deletion IS NULL)
      ORDER BY a.appointment_date ASC
    `,
    pending_list: `
      SELECT 
        a.appointment_id, a.appointment_date, a.status, a.customer_notes, a.technician_id,
        u.first_name as client_first, u.last_name as client_last, u.phone_number, u.email, u.address,
        s.name as service_name, sc.name as category_name,
        t.first_name as tech_first, t.last_name as tech_last
      FROM appointments a
      JOIN users u ON a.customer_id = u.user_id
      JOIN services s ON a.service_id = s.service_id
      LEFT JOIN service_categories sc ON s.category_id = sc.category_id
      LEFT JOIN users t ON a.technician_id = t.user_id
      WHERE a.status = 'Pending' AND (a.marked_for_deletion = 0 OR a.marked_for_deletion IS NULL)
      ORDER BY a.appointment_date ASC
      LIMIT 10
    `,
    services: `
      SELECT s.name as service_name, sc.name as category_name, sc.icon, sc.color, COUNT(*) as count
      FROM appointments a
      JOIN services s ON a.service_id = s.service_id
      LEFT JOIN service_categories sc ON s.category_id = sc.category_id
      WHERE (a.marked_for_deletion = 0 OR a.marked_for_deletion IS NULL)
      GROUP BY s.name, sc.name, sc.icon, sc.color
    `
  };

  db.query(queries.counts, (err, countRes) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(queries.today, (err, todayRes) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(queries.pending_list, (err, pendingRes) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(queries.services, (err, servicesRes) => {
          if (err) return res.status(500).json({ error: err.message });

          const formatAppointment = (row) => ({
            id: row.appointment_id.toString(),
            clientName: `${row.client_first} ${row.client_last}`,
            phone: row.phone_number,
            email: row.email,
            address: row.address || 'No address provided',
            service: row.category_name ? `${row.service_name} - ${row.category_name}` : row.service_name,
            date: new Date(row.appointment_date).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            }),
            time: new Date(row.appointment_date).toLocaleTimeString('en-US', { 
              hour: '2-digit', minute: '2-digit' 
            }),
            technicianId: row.technician_id ? row.technician_id.toString() : undefined,
            technician: row.tech_first ? `${row.tech_first} ${row.tech_last}` : 'Unassigned',
            status: (row.status || 'Pending').toLowerCase().replace(' ', '-'),
            notes: row.customer_notes
          });

          // Group services by category
          const categoryMap = {};
          
          servicesRes.forEach(row => {
            const catName = row.category_name || 'Uncategorized';
            if (!categoryMap[catName]) {
              categoryMap[catName] = {
                name: catName,
                count: 0,
                icon: row.icon || 'Box',
                color: row.color || '#9CA3AF',
                services: []
              };
            }
            categoryMap[catName].count += row.count;
            categoryMap[catName].services.push({
              name: row.service_name,
              count: row.count
            });
          });

          const serviceSummary = Object.values(categoryMap);

          res.json({
            stats: {
              total: countRes[0].total,
              pending: countRes[0].pending,
              'in-progress': countRes[0].in_progress,
              confirmed: countRes[0].confirmed,
              completed: countRes[0].completed,
              cancelled: countRes[0].cancelled
            },
            todayAppointments: todayRes.map(formatAppointment),
            pendingAppointments: pendingRes.map(formatAppointment),
            serviceSummary
          });
        });
      });
    });
  });
};

exports.getAllAppointments = (req, res) => {
  const query = `
    SELECT 
      a.appointment_id, a.appointment_date, a.status, a.customer_notes,
      a.cancellation_reason, a.cancellation_category, a.rejection_reason,
      a.created_at, a.updated_at,
      u.first_name as client_first, u.last_name as client_last, u.phone_number, u.email, u.address,
      s.name as service_name, sc.name as category_name,
      t.first_name as tech_first, t.last_name as tech_last,
      r.rating, r.feedback_text as feedback
    FROM appointments a
    JOIN users u ON a.customer_id = u.user_id
    JOIN services s ON a.service_id = s.service_id
    LEFT JOIN service_categories sc ON s.category_id = sc.category_id
    LEFT JOIN users t ON a.technician_id = t.user_id
    LEFT JOIN reviews r ON a.appointment_id = r.appointment_id
    WHERE (a.marked_for_deletion = 0 OR a.marked_for_deletion IS NULL)
    ORDER BY a.appointment_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = results.map(row => ({
      id: row.appointment_id.toString(),
      clientName: `${row.client_first} ${row.client_last}`,
      phone: row.phone_number,
      email: row.email,
      address: row.address || 'No address provided',
      service: row.service_name,
      category: row.category_name,
      date: new Date(row.appointment_date).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }),
      time: new Date(row.appointment_date).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit' 
      }),
      technician: row.tech_first ? `${row.tech_first} ${row.tech_last}` : 'Unassigned',
      status: (row.status || 'Pending').toLowerCase().replace(/[ _]/g, '-'),
      notes: row.customer_notes,
      rating: row.rating,
      feedback: row.feedback,
      cancellationReason: row.cancellation_reason,
      cancellationCategory: row.cancellation_category,
      rejectionReason: row.rejection_reason,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json(formatted);
  });
};

exports.getServices = (req, res) => {
  const query = `
    SELECT s.service_id, s.name, sc.name as category_name 
    FROM services s
    LEFT JOIN service_categories sc ON s.category_id = sc.category_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getTechnicians = (req, res) => {
  const query = 'SELECT user_id, first_name, last_name FROM users WHERE role = "Technician" AND status = "Active"';
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getAllCategories = (req, res) => {
    const query = 'SELECT * FROM service_categories';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createAppointment = (req, res) => {
  const { clientName, phone, email, address, serviceId, date, time, technicianId, notes } = req.body;

  // Helper to create appointment
  const insertAppointment = (customerId) => {
    const appointmentDate = `${date} ${time}`; 
    const query = `
      INSERT INTO appointments (customer_id, service_id, technician_id, appointment_date, customer_notes, status)
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;
    db.query(query, [customerId, serviceId, technicianId || null, appointmentDate, notes], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Appointment created successfully', id: result.insertId });
    });
  };

  // Check if user exists
  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      insertAppointment(results[0].user_id);
    } else {
      // Create new user
      const [firstName, ...lastNameParts] = clientName.split(' ');
      const lastName = lastNameParts.join(' ') || 'Customer';
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000); // Generate username
      const bcrypt = require('bcryptjs');
      const defaultPass = bcrypt.hashSync('password123', 10);
      
      const createUserQuery = `
        INSERT INTO users (username, first_name, last_name, email, phone_number, address, password_hash, role, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Customer', 'Active')
      `;
      db.query(createUserQuery, [username, firstName, lastName, email, phone, address, defaultPass], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        insertAppointment(result.insertId);
      });
    }
  });
};

exports.updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status, reason, category, technicianId } = req.body;
  
  let query = 'UPDATE appointments SET status = ?';
  const params = [status];

  if (status === 'cancelled') {
    query += ', cancellation_reason = ?, cancellation_category = ?, cancelled_by = ?';
    params.push(reason, category, req.userId);
  } else if (status === 'rejected') {
    query += ', rejection_reason = ?';
    params.push(reason);
  } else if (status.toLowerCase() === 'confirmed' && technicianId) {
    query += ', technician_id = ?';
    params.push(technicianId);
  }

  query += ' WHERE appointment_id = ?';
  params.push(id);

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated successfully' });
  });
};

exports.updateAppointmentDetails = (req, res) => {
  const { id } = req.params;
  const { date, time, technicianId } = req.body;
  
  const appointmentDate = `${date} ${time}`;
  const query = 'UPDATE appointments SET appointment_date = ?, technician_id = ? WHERE appointment_id = ?';
  
  db.query(query, [appointmentDate, technicianId || null, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment details updated successfully' });
  });
};

exports.softDeleteAppointment = (req, res) => {
  const { id } = req.params;
  const query = `
    UPDATE appointments 
    SET marked_for_deletion = 1, 
        deletion_marked_at = NOW(), 
        deletion_marked_by = ? 
    WHERE appointment_id = ?
  `;
  
  db.query(query, [req.userId, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment moved to recycle bin' });
  });
};

exports.getDeletedAppointments = (req, res) => {
  const query = `
    SELECT 
      a.appointment_id, a.appointment_date, a.deletion_marked_at,
      u.first_name as customer_first, u.last_name as customer_last,
      s.name as service_name,
      d.first_name as marked_by_first, d.last_name as marked_by_last
    FROM appointments a
    JOIN users u ON a.customer_id = u.user_id
    JOIN services s ON a.service_id = s.service_id
    LEFT JOIN users d ON a.deletion_marked_by = d.user_id
    WHERE a.marked_for_deletion = 1
    ORDER BY a.deletion_marked_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.restoreAppointment = (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE appointments SET marked_for_deletion = 0, deletion_marked_at = NULL, deletion_marked_by = NULL WHERE appointment_id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment restored' });
  });
};

exports.permanentDeleteAppointment = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM appointments WHERE appointment_id = ? AND marked_for_deletion = 1';
  
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment permanently deleted' });
  });
};

exports.emptyRecycleBin = (req, res) => {
  const query = 'DELETE FROM appointments WHERE marked_for_deletion = 1';
  
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Recycle bin emptied' });
  });
};
