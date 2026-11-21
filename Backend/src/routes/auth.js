const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/index");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please provide name, email and password" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3) RETURNING id, name, email', [name, email, hashedPassword]
        )

        const user = result.rows[0];
        const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong while registering the user." });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({
            user: { id: user.id, name: user.name, email: user.email },
            token
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong during login' })
    }
})

module.exports = router