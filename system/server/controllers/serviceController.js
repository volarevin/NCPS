const db = require('../config/db');

exports.getAllServices = (req, res) => {
  const query = 'SELECT * FROM services ORDER BY service_name ASC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error fetching services.' });
    }
    res.json(results);
  });
};