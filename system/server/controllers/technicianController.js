const db = require('../config/db');

exports.getAssignedJobs = (req, res) => {
  const technicianId = req.userId;
  
  const query = `
    SELECT a.*, u.first_name as customer_first_name, u.last_name as customer_last_name, 
           u.email as customer_email, u.phone_number as customer_phone, u.profile_picture as customer_profile_picture,
           s.name as service_name,
           r.rating, r.feedback_text,
           cb.role as cancelled_by_role, cb.user_id as cancelled_by_id
    FROM appointments a
    JOIN users u ON a.customer_id = u.user_id
    JOIN services s ON a.service_id = s.service_id
    LEFT JOIN reviews r ON a.appointment_id = r.appointment_id
    LEFT JOIN users cb ON a.cancelled_by = cb.user_id
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
    SELECT tp.*, u.first_name, u.last_name, u.email, u.phone_number, u.address, u.created_at, u.profile_picture
    FROM users u
    LEFT JOIN technician_profiles tp ON u.user_id = tp.user_id
    WHERE u.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching profile.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    const data = results[0];
    // Provide defaults if profile is missing
    if (!data.specialty) {
        data.specialty = 'General';
        data.availability_status = 'Available';
        data.average_rating = 0;
        data.total_jobs_completed = 0;
    }
    
    res.json(data);
  });
};

exports.updateAvailability = (req, res) => {
  const userId = req.userId;
  const { status } = req.body; // 'Available', 'On Job', 'Offline'

  const query = 'UPDATE technician_profiles SET availability_status = ? WHERE user_id = ?';

  (req.db || db).query(query, [status, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error updating availability.' });
    }
    res.json({ message: 'Availability updated successfully.' });
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.userId;
  const { name, email, phone, specialization, address, bio } = req.body;
  
  // Split name into first and last (simple split)
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || '';

  const runTransaction = (conn, shouldRelease) => {
      conn.beginTransaction(err => {
        if (err) {
            if (shouldRelease) conn.release();
            return res.status(500).json({ message: 'Database transaction error.' });
        }

        // Update users table
        const userQuery = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ? WHERE user_id = ?';
        conn.query(userQuery, [firstName, lastName, email, phone, address, userId], (err, result) => {
          if (err) {
            return conn.rollback(() => {
              if (shouldRelease) conn.release();
              res.status(500).json({ message: 'Error updating user info.' });
            });
          }

          // Update technician_profiles table
          const techQuery = 'UPDATE technician_profiles SET specialty = ?, bio = ? WHERE user_id = ?';
          conn.query(techQuery, [specialization, bio, userId], (err, result) => {
            if (err) {
              return conn.rollback(() => {
                if (shouldRelease) conn.release();
                res.status(500).json({ message: 'Error updating technician info.' });
              });
            }

            conn.commit(err => {
              if (err) {
                return conn.rollback(() => {
                  if (shouldRelease) conn.release();
                  res.status(500).json({ message: 'Error committing transaction.' });
                });
              }
              if (shouldRelease) conn.release();
              res.json({ message: 'Profile updated successfully.' });
            });
          });
        });
      });
  };

  if (!req.db) {
      db.getConnection((err, conn) => {
          if (err) return res.status(500).json({ message: 'Database connection error.' });
          runTransaction(conn, true);
      });
  } else {
      runTransaction(req.db, false);
  }
};

exports.getNotifications = (req, res) => {
  const technicianId = req.userId;

  const queries = {
    assignments: `
      SELECT a.appointment_id, a.appointment_date, a.created_at, s.name as service_name
      FROM appointments a
      JOIN services s ON a.service_id = s.service_id
      WHERE a.technician_id = ? AND a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY a.created_at DESC
    `,
    reviews: `
      SELECT r.rating, r.created_at, u.first_name, u.last_name
      FROM reviews r
      JOIN appointments a ON r.appointment_id = a.appointment_id
      JOIN users u ON a.customer_id = u.user_id
      WHERE a.technician_id = ? AND r.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY r.created_at DESC
    `,
    completed: `
      SELECT a.appointment_id, a.updated_at, s.name as service_name, u.first_name, u.last_name
      FROM appointments a
      JOIN services s ON a.service_id = s.service_id
      JOIN users u ON a.customer_id = u.user_id
      WHERE a.technician_id = ? AND a.status = 'Completed' AND a.updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY a.updated_at DESC
    `
  };

  db.query(queries.assignments, [technicianId], (err, assignments) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(queries.reviews, [technicianId], (err, reviews) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(queries.completed, [technicianId], (err, completed) => {
        if (err) return res.status(500).json({ error: err.message });

        const notifications = [
          ...assignments.map(a => ({
            id: `assign-${a.appointment_id}`,
            type: 'assignment',
            title: 'New appointment assigned',
            message: `You have been assigned to a ${a.service_name} on ${new Date(a.appointment_date).toLocaleDateString()}.`,
            time: a.created_at,
            color: 'blue'
          })),
          ...reviews.map(r => ({
            id: `review-${r.created_at}`,
            type: 'review',
            title: 'New Rating Received',
            message: `${r.first_name} ${r.last_name} gave you ${r.rating} stars!`,
            time: r.created_at,
            color: 'yellow'
          })),
          ...completed.map(c => ({
            id: `complete-${c.appointment_id}`,
            type: 'completed',
            title: 'Job completed successfully',
            message: `You marked "${c.service_name}" for ${c.first_name} ${c.last_name} as completed.`,
            time: c.updated_at,
            color: 'green'
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json(notifications);
      });
    });
  });
};