const express = require('express');
const app = express();
const PORT = 8000;
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'my-secret-pw',
  database: process.env.DB_NAME || 'mydatabase',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return
  }
  console.log('Connected to MySQL database');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/user/:id', (req, res) => {
  if (req.params.id === undefined) {
    res.json('Please provide an ID')
    return
  }

  const sql = `SELECT id, username, email, hashed_password as password FROM users where id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.json(err.stack);
      return;
    }
    res.json(results);
  })
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json('Please provide an email and password')
  }

  // Query to find user by username
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error' })
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = results[0];
    const isMatch = await verifyPasswordBcrypt(password, user.hashed_password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ username: user.username, id: user.id }, 'yolo', { expiresIn: '1m' });
    const refreshToken = jwt.sign({ username: user.username, id: user.id }, 'yolo', { expiresIn: '7d' });

    // refresh token
    return res.json({ message: 'Login successful', data: { token, refreshToken, id: user.id, username: user.username, email: user.email } });
  });
});

app.get('/verify_token', async (req, res) => {
  // check if token is expired
  // then check refresh token is valid then generate new token
  const token = req.headers.authorization.split(' ')[1];
  const refreshToken = req.headers.refresh_token.split(' ')[1];
  let decodedToken
  let decodedRefreshToken

  try {
    decodedToken = jwt.verify(token, 'yolo')
  } catch (err) {
    decodedToken = null
  }

  try {
    decodedRefreshToken = jwt.verify(refreshToken, 'yolo');
  } catch (err) {
    decodedRefreshToken = null
  }

  if (decodedToken == null) {
    if (decodedRefreshToken == null) return res.json({ error: 'RefetchToken is expired please login again' })

    db.query(`SELECT * FROM users WHERE id = ${decodedRefreshToken.id}`, (err, result) => {
      if (err) return res.status(400).json({ error: 'Invalid user information' })

      const newToken = jwt.sign({ username: result[0].id, id: result[0].id }, 'yolo', { expiresIn: '1m' });
      res.json({ message: 'Generated new token', data: { token: newToken } });
    })
    return
  }

  res.json({ message: 'Token is valid' });
})

app.put('/edit/:user_id', validateAuthHeader, async (req, res) => {
  // app.put('/edit/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { username, email } = req.body
  // const hashedPassword = Buffer.from(password, 'utf-8').toString('base64');
  const sql = `
  UPDATE users
  SET username = ?, email = ? WHERE id = ?;
`;

  const values = [username, email, user_id];

  // Execute the query safely using parameterized values
  db.execute(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.send('error')
      return
    }
    res.send('User updated successfully:')
  });

})

app.post('/reset-password', async (req, res) => {
  try {
    const token = req.body.token;
    const newPassword = req.body.new_password;
    let decodedToken
    try {
      decodedToken = jwt.verify(token, 'yolo')
    } catch (err) {
      throw new Error('Invalid token')
    }

    db.query('SELECT * FROM users WHERE id = ?', decodedToken.userId, async (err, user) => {
      if (err) throw new Error('Error retrieving user');
      const hashedPasswordBcrypt = await hashPasswordBcrypt(newPassword);

      db.execute('UPDATE users SET hashed_password = ? WHERE id = ?', [hashedPasswordBcrypt, decodedToken.userId], (err, result) => {
        if (err) throw new Error('Error updating password');
        res.send({ message: 'Password updated successfully' })
      })
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required' });


  try {
    const hashedPassword = await hashPasswordBcrypt(password);

    const query = 'INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to register user due to duplidate email or username please try again' });


      return res.status(201).json({
        message: 'User registered successfully',
        data: null
      });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/password-reset-request', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email field is required' });
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, result) => {
      if (err) return res.status(500).json({ error: 'Email is not exists !!' });
      if (!result.length) return res.status(404).json({ error: 'Email not found' });
      const token = jwt.sign({ userId: result[0].id }, 'yolo', { expiresIn: '5m' });
      // ? note assume it send into email then i will redirect to reset password page
      const hostname = process.env.NODE_ENV == 'production' ? req.hostname : `http://${req.hostname}:3000`
      const redirectUrl = hostname + '/reset-password/' + token;
      res.status(200).json({ message: 'Password reset request sent', resetUrl: redirectUrl });
    });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


function hashPasswordBcrypt(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        reject(err);
      } else {
        resolve(hashedPassword);
      }
    });
  });
}

function verifyPasswordBcrypt(plainPassword, hashedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
}

function validateAuthHeader(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ error: 'Invalid authorization header' });
    }
    const token = authHeader.split(' ')[1];
    const decodedTokenJwt = jwt.verify(token, 'yolo'); // Validate the token
    req.user = decodedTokenJwt;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authorization header' });
  }
};