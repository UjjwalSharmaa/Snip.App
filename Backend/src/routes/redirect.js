const express = require('express');
const pool = require("../db/index");
const getGeoLocation = require('../utils/geo')

const router = express.Router();


router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params

        const result = await pool.query(
            'SELECT id, original_url FROM urls WHERE slug = $1',
            [slug]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' })
        }

        const link = result.rows[0]

        const ipAddress =
            req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            req.socket.remoteAddress ||
            'unknown'

        const userAgent = req.headers['user-agent'] || 'unknown'

        let device = 'Desktop'
        if (/mobile/i.test(userAgent)) device = 'Mobile'
        else if (/tablet|ipad/i.test(userAgent)) device = 'Tablet'

        // redirect FIRST, so the user doesn't wait on the geo lookup
        res.redirect(link.original_url)

        // log the click AFTER responding — doesn't block the user's redirect
        const geo = await getGeoLocation(ipAddress)

        await pool.query(
            `INSERT INTO clicks (url_id, ip_address, city, region, country, device, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [link.id, ipAddress, geo.city, geo.region, geo.country, device, userAgent]
        )
    } catch (err) {
        console.error(err)
        if (!res.headersSent) {
            res.status(500).json({ error: 'Something went wrong while redirecting' })
        }
    }
})

module.exports = router;
