const db = require('../config/db');

exports.getDashboardStats = (req, res) => {
  const query = 'CALL sp_get_admin_dashboard_stats()';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching stats.' });
    }
    // results[0] contains the result set of the stored procedure
    res.json(results[0][0]);
  });
};

exports.getAllUsers = (req, res) => {
  const { role } = req.query;
  let query = 'SELECT user_id, username, first_name, last_name, email, phone_number, address, role, status, created_at FROM users';
  const params = [];

  if (role) {
    query += ' WHERE role = ?';
    params.push(role);
  }
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching users.' });
    }
    res.json(results);
  });
};

exports.getAllAppointments = (req, res) => {
  const query = `
    SELECT a.*, 
           u.first_name as customer_first_name, u.last_name as customer_last_name,
           u.email as customer_email, u.phone_number as customer_phone, u.address as customer_address,
           t.first_name as tech_first_name, t.last_name as tech_last_name,
           s.name as service_name, sc.name as category_name,
           r.rating, r.feedback_text,
           cb.role as cancelled_by_role, cb.user_id as cancelled_by_id
    FROM appointments a
    JOIN users u ON a.customer_id = u.user_id
    LEFT JOIN users t ON a.technician_id = t.user_id
    JOIN services s ON a.service_id = s.service_id
    LEFT JOIN service_categories sc ON s.category_id = sc.category_id
    LEFT JOIN reviews r ON a.appointment_id = r.appointment_id
    LEFT JOIN users cb ON a.cancelled_by = cb.user_id
    WHERE a.marked_for_deletion = 0 OR a.marked_for_deletion IS NULL
    ORDER BY a.appointment_date DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching appointments.' });
    }
    res.json(results);
  });
};

exports.getMonthlyStats = (req, res) => {
  const query = `
    SELECT 
      DATE_FORMAT(appointment_date, '%b') as month, 
      COUNT(*) as appointments,
      COALESCE(SUM(total_cost), 0) as revenue
    FROM appointments 
    WHERE appointment_date >= DATE_SUB(NOW(), INTERVAL 10 MONTH)
    GROUP BY YEAR(appointment_date), MONTH(appointment_date) 
    ORDER BY YEAR(appointment_date), MONTH(appointment_date)
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching monthly stats.' });
    }
    res.json(results);
  });
};

exports.getServiceDistribution = (req, res) => {
  const query = `
    SELECT sc.name, COUNT(*) as value 
    FROM appointments a
    JOIN services s ON a.service_id = s.service_id
    JOIN service_categories sc ON s.category_id = sc.category_id
    GROUP BY sc.category_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching service distribution.' });
    }
    res.json(results);
  });
};

exports.getRecentActivity = (req, res) => {
  const query = `
    SELECT al.description as action, al.created_at as time, u.first_name, u.last_name, u.role
    FROM activity_logs al
    JOIN users u ON al.user_id = u.user_id
    ORDER BY al.created_at DESC
    LIMIT 5
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching recent activity.' });
    }
    res.json(results);
  });
};

exports.getAllTechnicians = (req, res) => {
  const query = `
    SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone_number, u.address,
           tp.specialty, tp.availability_status, tp.total_jobs_completed, tp.average_rating,
           (SELECT COUNT(*) FROM appointments WHERE technician_id = u.user_id AND status IN ('Pending', 'Confirmed', 'In Progress')) as active_jobs
    FROM users u
    JOIN technician_profiles tp ON u.user_id = tp.user_id
    WHERE u.role = 'Technician'
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching technicians.' });
    }
    res.json(results);
  });
};

exports.getUserActivityLogs = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT log_id, action_type, description, created_at 
    FROM activity_logs 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching user activity logs.' });
    }
    res.json(results);
  });
};

exports.getReportsData = (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateWhere = "";
  let dateAnd = "";
  let joinCondition = "";
  let queryParams = [];

  if (startDate && endDate) {
    dateWhere = "WHERE appointment_date BETWEEN ? AND ?";
    dateAnd = "AND appointment_date BETWEEN ? AND ?";
    joinCondition = "AND a.appointment_date BETWEEN ? AND ?";
    queryParams = [startDate, endDate];
  } else if (startDate) {
    dateWhere = "WHERE appointment_date >= ?";
    dateAnd = "AND appointment_date >= ?";
    joinCondition = "AND a.appointment_date >= ?";
    queryParams = [startDate];
  } else if (endDate) {
    dateWhere = "WHERE appointment_date <= ?";
    dateAnd = "AND appointment_date <= ?";
    joinCondition = "AND a.appointment_date <= ?";
    queryParams = [endDate];
  }

  const queries = {
    summary: `
      SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments
      ${dateWhere}
    `,
    monthly: `
      SELECT 
          DATE_FORMAT(appointment_date, '%b %Y') as month,
          COUNT(*) as appointments,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled,
          COALESCE(SUM(CASE WHEN status = 'Completed' THEN total_cost ELSE 0 END), 0) as revenue
      FROM appointments
      ${dateWhere || "WHERE appointment_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)"}
      GROUP BY YEAR(appointment_date), MONTH(appointment_date)
      ORDER BY YEAR(appointment_date), MONTH(appointment_date)
    `,
    services: `
      SELECT 
          s.name,
          COUNT(a.appointment_id) as requests,
          COALESCE(SUM(CASE WHEN a.status = 'Completed' THEN a.total_cost ELSE 0 END), 0) as revenue,
          COALESCE(AVG(r.rating), 0) as rating
      FROM services s
      LEFT JOIN appointments a ON s.service_id = a.service_id ${joinCondition}
      LEFT JOIN reviews r ON a.appointment_id = r.appointment_id
      GROUP BY s.service_id
    `,
    staff: `
      SELECT 
          u.first_name, u.last_name,
          COUNT(CASE WHEN a.status = 'Completed' THEN 1 END) as totalHandled,
          COALESCE(AVG(r.rating), 0) as rating
      FROM users u
      LEFT JOIN appointments a ON u.user_id = a.technician_id ${joinCondition}
      LEFT JOIN reviews r ON a.appointment_id = r.appointment_id
      WHERE u.role = 'Technician'
      GROUP BY u.user_id
    `,
    peakHours: `
      SELECT 
        DATE_FORMAT(appointment_date, '%l %p') as hour, 
        COUNT(*) as bookings 
      FROM appointments 
      ${dateWhere}
      GROUP BY HOUR(appointment_date) 
      ORDER BY HOUR(appointment_date)
    `,
    peakDays: `
      SELECT 
        DATE_FORMAT(appointment_date, '%a') as day, 
        COUNT(*) as bookings 
      FROM appointments 
      ${dateWhere}
      GROUP BY DAYOFWEEK(appointment_date) 
      ORDER BY DAYOFWEEK(appointment_date)
    `,
    cancellationReasons: `
      SELECT 
        cancellation_category as reason, 
        COUNT(*) as count 
      FROM appointments 
      WHERE status = 'Cancelled' AND cancellation_category IS NOT NULL 
      ${dateAnd}
      GROUP BY cancellation_category
    `,
    revenueStats: `
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN total_cost ELSE 0 END), 0) as totalRevenue,
        COALESCE(AVG(CASE WHEN status = 'Completed' THEN total_cost ELSE NULL END), 0) as avgPerAppointment,
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN total_cost ELSE 0 END), 0) as totalPaid
      FROM appointments
      WHERE status != 'Cancelled' AND status != 'Rejected'
      ${dateAnd}
    `
  };

  // Execute all queries
  // Note: In a real app, might want to use Promise.all with db.promise() or similar
  // Here using nested callbacks for simplicity with the current db setup
  db.query(queries.summary, queryParams, (err, summaryRes) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.query(queries.monthly, queryParams, (err, monthlyRes) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.query(queries.services, queryParams, (err, servicesRes) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.query(queries.staff, queryParams, (err, staffRes) => {
          if (err) return res.status(500).json({ error: err.message });
          
          db.query(queries.peakHours, queryParams, (err, peakHoursRes) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query(queries.peakDays, queryParams, (err, peakDaysRes) => {
              if (err) return res.status(500).json({ error: err.message });

              db.query(queries.cancellationReasons, queryParams, (err, cancellationReasonsRes) => {
                if (err) return res.status(500).json({ error: err.message });

                db.query(queries.revenueStats, queryParams, (err, revenueStatsRes) => {
                  if (err) return res.status(500).json({ error: err.message });

                  res.json({
                    summary: summaryRes[0],
                    monthly: monthlyRes,
                    services: servicesRes,
                    staff: staffRes,
                    peakHours: peakHoursRes,
                    peakDays: peakDaysRes,
                    cancellationReasons: cancellationReasonsRes,
                    revenueStats: revenueStatsRes[0]
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

exports.getAllServices = (req, res) => {
  const query = `
    SELECT s.service_id, s.name, s.estimated_price as price, s.description, 
           c.name as category, c.color, c.icon
    FROM services s 
    LEFT JOIN service_categories c ON s.category_id = c.category_id
  `;
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

exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { color, icon } = req.body;
    const query = 'UPDATE service_categories SET color = ?, icon = ? WHERE category_id = ?';
    db.query(query, [color, icon, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Category updated successfully' });
    });
};

// --- Technician Management ---

exports.getTechnicianDetails = (req, res) => {
  const { techId } = req.params;
  
  const queries = {
    profile: `
      SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone_number, u.status,
             tp.specialty, tp.availability_status, tp.total_jobs_completed, tp.average_rating
      FROM users u
      JOIN technician_profiles tp ON u.user_id = tp.user_id
      WHERE u.user_id = ?
    `,
    reviews: `
      SELECT r.review_id, r.appointment_id, r.rating, r.feedback_text, r.created_at,
             c.first_name as customer_first, c.last_name as customer_last,
             s.name as service_name
      FROM reviews r
      JOIN users c ON r.customer_id = c.user_id
      JOIN appointments a ON r.appointment_id = a.appointment_id
      JOIN services s ON a.service_id = s.service_id
      WHERE r.technician_id = ?
      ORDER BY r.created_at DESC
    `,
    schedule: `
      SELECT a.appointment_id, a.appointment_date, 
             DATE_FORMAT(a.appointment_date, '%H:%i') as appointment_time,
             a.status,
             s.name as service_name,
             c.first_name as client_first, c.last_name as client_last,
             COALESCE(c.address, 'Manila') as client_location
      FROM appointments a
      JOIN services s ON a.service_id = s.service_id
      JOIN users c ON a.customer_id = c.user_id
      WHERE a.technician_id = ? AND a.status IN ('upcoming', 'confirmed', 'in-progress')
      ORDER BY a.appointment_date ASC
    `
  };

  db.query(queries.profile, [techId], (err, profileRes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (profileRes.length === 0) return res.status(404).json({ message: 'Technician not found' });

    db.query(queries.reviews, [techId], (err, reviewsRes) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.query(queries.schedule, [techId], (err, scheduleRes) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          ...profileRes[0],
          reviews: reviewsRes,
          schedule: scheduleRes
        });
      });
    });
  });
};

exports.updateTechnicianStatus = (req, res) => {
  const { techId } = req.params;
  const { action } = req.body; // 'ban', 'demote', 'activate'

  let query = "";
  let params = [];

  if (action === 'ban') {
    query = "UPDATE users SET status = 'banned' WHERE user_id = ?";
    params = [techId];
  } else if (action === 'demote') {
    // Change role to customer and maybe set status to active if it was something else
    query = "UPDATE users SET role = 'customer' WHERE user_id = ?";
    params = [techId];
  } else if (action === 'activate') {
    query = "UPDATE users SET status = 'active' WHERE user_id = ?";
    params = [techId];
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Technician ${action}d successfully` });
  });
};

exports.updateTechnicianProfile = (req, res) => {
  const { techId } = req.params;
  const { first_name, last_name, phone_number, address, specialty } = req.body;

  console.log(`Updating technician ${techId}:`, req.body);

  // Validate specialty
  const ALLOWED_SPECIALTIES = [
    'Hardware Repair', 'Software Support', 'Network Setup', 'Data Recovery',
    'System Maintenance', 'Virus Removal', 'Custom Build', 'Consultation', 'General'
  ];

  if (specialty && !ALLOWED_SPECIALTIES.includes(specialty)) {
    return res.status(400).json({ error: `Invalid specialty: ${specialty}` });
  }

  // Update user table
  const userQuery = "UPDATE users SET first_name = ?, last_name = ?, phone_number = ?, address = ? WHERE user_id = ?";
  
  db.query(userQuery, [first_name, last_name, phone_number, address, techId], (err, result) => {
    if (err) {
      console.error("Error updating user table:", err);
      return res.status(500).json({ error: err.message });
    }

    // Update technician_profiles table
    // Check if profile exists first to avoid ON DUPLICATE KEY issues if index is missing or weird
    db.query("SELECT profile_id FROM technician_profiles WHERE user_id = ?", [techId], (err, rows) => {
      if (err) {
        console.error("Error checking profile existence:", err);
        return res.status(500).json({ error: err.message });
      }

      const targetSpecialty = specialty || 'General';
      
      if (rows.length > 0) {
        // Update existing
        const updateQuery = "UPDATE technician_profiles SET specialty = ? WHERE user_id = ?";
        db.query(updateQuery, [targetSpecialty, techId], (err, result) => {
          if (err) {
            console.error("Error updating technician_profiles:", err);
            return res.status(500).json({ error: err.message });
          }
          console.log("Updated existing profile specialty to:", targetSpecialty);
          res.json({ message: "Technician profile updated successfully" });
        });
      } else {
        // Insert new
        const insertQuery = "INSERT INTO technician_profiles (user_id, specialty, availability_status) VALUES (?, ?, 'Offline')";
        db.query(insertQuery, [techId, targetSpecialty], (err, result) => {
          if (err) {
            console.error("Error inserting technician_profiles:", err);
            return res.status(500).json({ error: err.message });
          }
          console.log("Inserted new profile with specialty:", targetSpecialty);
          res.json({ message: "Technician profile created and updated successfully" });
        });
      }
    });
  });
};

// --- Appointment Management ---

exports.getAppointmentDetails = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT a.*, 
           DATE_FORMAT(a.appointment_date, '%H:%i') as appointment_time,
           u.first_name, u.last_name, u.email, u.phone_number, u.address,
           s.name as service_name,
           t.first_name as tech_first, t.last_name as tech_last,
           r.rating, r.feedback_text,
           c.first_name as cancelled_by_first, c.last_name as cancelled_by_last, c.role as cancelled_by_role
    FROM appointments a
    JOIN users u ON a.customer_id = u.user_id
    JOIN services s ON a.service_id = s.service_id
    LEFT JOIN users t ON a.technician_id = t.user_id
    LEFT JOIN reviews r ON a.appointment_id = r.appointment_id
    LEFT JOIN users c ON a.cancelled_by = c.user_id
    WHERE a.appointment_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Appointment not found' });
    
    const appt = result[0];
    const formatted = {
      id: appt.appointment_id.toString(),
      clientName: `${appt.first_name} ${appt.last_name}`,
      service: appt.service_name,
      date: new Date(appt.appointment_date).toLocaleDateString(),
      time: appt.appointment_time, // Assuming this exists or is handled
      status: appt.status,
      phone: appt.phone_number,
      email: appt.email,
      address: appt.address || 'No address provided',
      notes: appt.customer_notes, // Changed from notes to customer_notes based on DB schema
      technician: appt.tech_first ? `${appt.tech_first} ${appt.tech_last}` : 'Unassigned',
      rating: appt.rating,
      feedback: appt.feedback_text,
      cancellationReason: appt.cancellation_reason,
      cancellationCategory: appt.cancellation_category,
      rejectionReason: appt.rejection_reason,
      cancelledByRole: appt.cancelled_by_role,
      cancelledById: appt.cancelled_by ? appt.cancelled_by.toString() : undefined,
      cancelledByName: appt.cancelled_by_first ? `${appt.cancelled_by_first} ${appt.cancelled_by_last}` : undefined
    };
    
    res.json(formatted);
  });
};

exports.updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status, reason, category, technicianId } = req.body;
  const userId = req.userId || req.body.userId; // Use authenticated user ID

  console.log(`Updating appointment ${id} status to ${status}. TechnicianId: ${technicianId}`);

  let query = 'UPDATE appointments SET status = ?';
  let params = [status];

  // Always update technician if provided
  if (technicianId) {
      query += ', technician_id = ?';
      params.push(technicianId);
  }

  if (status === 'Cancelled') {
    query += ', cancellation_reason = ?, cancellation_category = ?, cancelled_by = ?';
    params.push(reason, category, userId);
  } else if (status === 'Rejected') {
      query += ', rejection_reason = ?, cancellation_category = ?, cancelled_by = ?';
      params.push(reason, category, userId);
  }

  query += ' WHERE appointment_id = ?';
  params.push(id);

  db.query(query, params, (err, result) => {
    if (err) {
        console.error("Error updating appointment status:", err);
        return res.status(500).json({ error: err.message });
    }
    
    // Log activity
    const action = `Appointment ${status}`;
    const desc = `Appointment #${id} was ${status.toLowerCase()}${category ? ` Category: ${category}` : ''}${reason ? ` Reason: ${reason}` : ''}`;
    db.query('INSERT INTO activity_logs (user_id, action_type, description) VALUES (?, ?, ?)', 
      [userId, action, desc]);

    res.json({ message: 'Appointment updated successfully' });
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

exports.deleteAppointment = (req, res) => {
  const { id } = req.params;
  const userId = req.userId || null; // Assuming auth middleware adds user to req

  // Soft delete (Mark for deletion)
  const query = 'UPDATE appointments SET marked_for_deletion = 1, deletion_marked_at = NOW(), deletion_marked_by = ? WHERE appointment_id = ?';
  
  db.query(query, [userId, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment marked for deletion' });
  });
};

exports.restoreAppointment = (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE appointments SET marked_for_deletion = 0, deletion_marked_at = NULL, deletion_marked_by = NULL WHERE appointment_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment restored successfully' });
    });
};

exports.permanentDeleteAppointment = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM appointments WHERE appointment_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment permanently deleted' });
    });
};

exports.emptyRecycleBin = (req, res) => {
    db.query('DELETE FROM appointments WHERE marked_for_deletion = 1', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Recycle bin emptied successfully' });
    });
};

exports.createAppointment = (req, res) => {
    const { customer_id, service_id, appointment_date, notes, address } = req.body;
    // Basic validation
    if (!customer_id || !service_id || !appointment_date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'INSERT INTO appointments (customer_id, service_id, appointment_date, status, customer_notes, service_address, created_at) VALUES (?, ?, ?, "Pending", ?, ?, NOW())';
    
    db.query(query, [customer_id, service_id, appointment_date, notes, address], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error creating appointment.' });
        }
        
        // Log activity
        const userId = req.userId || null;
        const action = 'Create Appointment';
        const desc = `Created appointment #${result.insertId}`;
        if (userId) {
             db.query('INSERT INTO activity_logs (user_id, action_type, description) VALUES (?, ?, ?)', 
                  [userId, action, desc]);
        }

        res.json({ message: 'Appointment created successfully', id: result.insertId });
    });
};

exports.getRecycleBinCount = (req, res) => {
    const query = 'SELECT COUNT(*) as count FROM appointments WHERE marked_for_deletion = 1';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ count: results[0].count });
    });
};

exports.bulkDeleteAppointments = (req, res) => {
    const { ids } = req.body;
    const userId = req.userId || null;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No appointment IDs provided' });
    }

    const query = 'UPDATE appointments SET marked_for_deletion = 1, deletion_marked_at = NOW(), deletion_marked_by = ? WHERE appointment_id IN (?)';
    
    db.query(query, [userId, ids], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${result.affectedRows} appointments moved to recycle bin` });
    });
};

exports.getMarkedForDeletion = (req, res) => {
    const query = `
        SELECT a.appointment_id, a.appointment_date, a.deletion_marked_at, a.marked_for_deletion,
               u.first_name as marked_by_first, u.last_name as marked_by_last,
               c.first_name as customer_first, c.last_name as customer_last,
               s.name as service_name
        FROM appointments a
        LEFT JOIN users u ON a.deletion_marked_by = u.user_id
        LEFT JOIN users c ON a.customer_id = c.user_id
        LEFT JOIN services s ON a.service_id = s.service_id
        WHERE a.marked_for_deletion = 1
        ORDER BY a.deletion_marked_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching marked for deletion:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// --- User Management ---

exports.createUser = async (req, res) => {
    const { username, first_name, last_name, email, phone_number, password, role } = req.body;
    try {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO users (username, first_name, last_name, email, phone_number, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, "Active")';
        db.query(query, [username, first_name, last_name, email, phone_number, hashedPassword, role], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (role === 'Technician') {
                db.query('INSERT INTO technician_profiles (user_id, specialty, availability_status) VALUES (?, "General", "Available")', [result.insertId]);
            }
            res.json({ message: 'User created successfully', id: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, role, status } = req.body;
    
    const query = 'UPDATE users SET first_name=?, last_name=?, email=?, phone_number=?, role=?, status=? WHERE user_id=?';
    db.query(query, [first_name, last_name, email, phone_number, role, status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated successfully' });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    // Note: This might fail if user has related records (FK constraints). 
    // For now, assuming simple delete or we'd need to cascade/soft delete.
    // Given "proceed with database changes", we might need ON DELETE CASCADE, but let's try simple delete first.
    db.query('DELETE FROM users WHERE user_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted successfully' });
    });
};

// --- Service Management ---

exports.createService = (req, res) => {
    const { name, category, price, description, color, icon } = req.body;
    // First get or create category
    db.query('SELECT category_id FROM service_categories WHERE name = ?', [category], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        let catId;
        if (results.length > 0) {
            catId = results[0].category_id;
            // Update category color/icon if provided
            if (color || icon) {
                const updateQuery = 'UPDATE service_categories SET color = COALESCE(?, color), icon = COALESCE(?, icon) WHERE category_id = ?';
                db.query(updateQuery, [color, icon, catId], (err) => {
                    if (err) console.error('Error updating category details:', err);
                });
            }
            insertService(catId);
        } else {
            db.query('INSERT INTO service_categories (name, color, icon) VALUES (?, ?, ?)', [category, color, icon], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                catId = result.insertId;
                insertService(catId);
            });
        }
    });

    function insertService(catId) {
        const query = 'INSERT INTO services (category_id, name, estimated_price, description) VALUES (?, ?, ?, ?)';
        db.query(query, [catId, name, price, description], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Service created successfully', id: result.insertId });
        });
    }
};

exports.updateService = (req, res) => {
    const { id } = req.params;
    const { name, price, description, category } = req.body;

    const doUpdate = (catId) => {
        const query = 'UPDATE services SET name=?, estimated_price=?, description=?, category_id=? WHERE service_id=?';
        db.query(query, [name, price, description, catId, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Service updated successfully' });
        });
    };

    if (category) {
        db.query('SELECT category_id FROM service_categories WHERE name = ?', [category], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (results.length > 0) {
                doUpdate(results[0].category_id);
            } else {
                db.query('INSERT INTO service_categories (name) VALUES (?)', [category], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    doUpdate(result.insertId);
                });
            }
        });
    } else {
        // If no category provided, just update other fields (optional, but safer to require category)
        const query = 'UPDATE services SET name=?, estimated_price=?, description=? WHERE service_id=?';
        db.query(query, [name, price, description, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Service updated successfully' });
        });
    }
};

exports.deleteService = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM services WHERE service_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Service deleted successfully' });
    });
};

exports.promoteToTechnician = (req, res) => {
  const { userId, specialty } = req.body;

  if (!userId || !specialty) {
    return res.status(400).json({ message: 'User ID and specialty are required' });
  }

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    // 1. Update user role
    const updateRoleQuery = "UPDATE users SET role = 'Technician' WHERE user_id = ?";
    db.query(updateRoleQuery, [userId], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }

      // 2. Create technician profile
      const createProfileQuery = `
        INSERT INTO technician_profiles (user_id, specialty, availability_status, total_jobs_completed, average_rating)
        VALUES (?, ?, 'Available', 0, 0)
      `;
      
      db.query(createProfileQuery, [userId, specialty], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          res.json({ message: 'User promoted to technician successfully' });
        });
      });
    });
  });
};