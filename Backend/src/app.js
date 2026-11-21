const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const urlRoutes = require('./routes/url')
const pool = require('./db/index')
const linksRoutes = require('./routes/links')
const redirectRoutes = require('./routes/redirect')


const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api', urlRoutes);
app.use('/api/links', linksRoutes);
app.use('/', redirectRoutes)

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await pool.query('SELECT 1')
    console.log('✅ PostgreSQL connected')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Database connection failed:', err.message)
    process.exit(1)
  }
}

startServer()