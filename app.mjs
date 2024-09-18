import express from "express"
import db from "./db.mjs"
import cors from "cors"
import { body } from "express-validator"
import validation from "./validation.mjs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import authorize from "./authorize.mjs"

const app = express();
app.use(cors());
app.use(express.json());


app.post('/api/register', [
  body('name').notEmpty(),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
], validation, async (req, res) => {
  const { name, email, password } = req.body;
  const hpassword = await bcrypt.hash(password, 10);
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const sql = 'INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    await db.query(sql, [null, name, email, hpassword, null, now, 'active'])
  } catch (error) {
    if (error.errno === 1062) return res.status(500).json({ message: 'Email is already taken' });
    return res.status(500).json({ message: 'An error occured' });
  }
  res.status(200).send()
});


app.post("/api/login", [
  body('email').notEmpty().isEmail(),
  body('password').notEmpty()
], validation, async (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  try {
    const response = await db.query(sql, [email])
    const user = response[0].at(0) ?? null;
    if(user === null)
      return res.status(401).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password);
    if(!match)
      return res.status(401).json({ message: 'Invalid credentials' })

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql2 = 'UPDATE users SET lastlogin=? WHERE id=?';
    await db.query(sql2, [now, user.id])

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, 'fantastic-and-cool-key', { expiresIn: '1h' });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'An error occured' });
  }
})

//Here's the CRUD
app.get("/api/test", authorize, async (req, res) => {
  return res.status(200).json({message: `Hola mundo!: ${req.user.name}`})
})

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
