const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, firstName, lastName, email, phone, password, role } = req.body;

  // Basic validation
  if (!username || !firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkUserQuery, [email, username], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error checking user.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'User with this email or username already exists.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user
      const insertUserQuery = `
        INSERT INTO users (username, first_name, last_name, email, phone_number, password_hash, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      // Default role to Customer if not provided or invalid
      const userRole = ['Admin', 'Receptionist', 'Technician', 'Customer'].includes(role) ? role : 'Customer';

      db.query(insertUserQuery, [username, firstName, lastName, email, phone || '', hashedPassword, userRole], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Database error registering user.' });
        }

        res.status(201).json({ message: 'User registered successfully.' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Please provide email/username and password.' });
  }

  const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
  db.query(query, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = results[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Create JWT Token
    const payload = {
      id: user.user_id,
      role: user.role,
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture
      }
    });
  });
};
