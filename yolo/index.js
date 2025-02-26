const express = require('express');
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken')

const mysql = require('mysql2');

const db = mysql.createConnection({
  // host: process.env.DB_HOST || 'localhost',
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydatabase',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    // process.exit(0)
  }
  console.log('Connected to MySQL database');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/user', (req, res) => {
  // get all user in database
  const sql = `SELECT id, username, email, hashed_password as password FROM users`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.stack);
      return;
    }
    console.log('Data fetched:', results);
    res.json(results);
  }
  )
})

app.get('/mock', (req, res) => {
  res.send('mock')
})

app.get('/mock_2', (req, res) => {
  res.send('mock_2')
})

app.post('/your-endpoint', (req, res) => {
  console.log(req.body);  // Log request body
  res.send('Data received');
});

// login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Add your login logic here
  // const hashedPassword = await bcrypt.hash(password, 3);
  const hashedPassword = Buffer.from(password, 'utf-8').toString('base64');
  console.log(username, hashedPassword)
  const sql = `SELECT * FROM users WHERE username = '${username}' AND hashed_password = '${hashedPassword}'`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.stack);
      return;
    }
    console.log('Data fetched:', results);
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    } else {
      // return jwt signing the user
      const token = jwt.sign({ username }, 'mock');
      return res.json({ message: 'Login successful', token });

      // return res.json({ message: 'Login successful' });
    }
  });
});

app.put('/edit/:user_id', async (req, res) => {
  // update user
  const { user_id } = req.params;
  const { username, password, email } = req.body
  const hashedPassword = Buffer.from(password, 'utf-8').toString('base64');
  const sql = `
  UPDATE users
  SET username = ?, email = ?, hashed_password = ?
  WHERE id = ?;
`;
  console.log(user_id, '=== ', req.body)

  const values = [username, email, hashedPassword, user_id];

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

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate inputs
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = Buffer.from(password, 'utf-8').toString('base64');

    const query = 'INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Failed to register user' });
      }

      return res.status(201).json({
        message: 'User registered successfully',
        userId: result.insertId,
      });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
