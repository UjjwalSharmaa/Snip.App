const express = require('express')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ status: 'API is working!' })
})

// protected test route
router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: 'You are logged in!', userId: req.userId })
})

module.exports = router