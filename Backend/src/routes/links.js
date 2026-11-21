const express = require('express');
const { nanoid } = require('nanoid');
const pool = require('../db/index');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.post('/demo', async (req, res) => {
    const { originalUrl } = req.body

    if (!originalUrl) {
        return res.status(400).json({ error: 'originalUrl is required' })
    }

    try {
        new URL(originalUrl)
    } catch {
        return res.status(400).json({ error: 'Please provide a valid URL (include https://)' })
    }

    // generate a fake-looking slug just for preview, nothing is saved
    const { nanoid } = require('nanoid')
    const previewSlug = nanoid(6)

    res.json({ previewSlug })
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { originalUrl, customAlias, title } = req.body;
        const userId = req.userId;

        if (!originalUrl) {
            return res.status(400).json({ error: "Original URL is required" });
        }
        try {
            new URL(originalUrl);
        }
        catch {
            return res.status(400).json({ error: 'Please provide a valid URL (include https://)' });
        }
        let slug;
        let isCustomAlias = false;
        if (customAlias) {
            const AliasPattern = /^[a-zA-Z0-9-_]+$/;
            if (!AliasPattern.test(customAlias)) {
                return res.status(400).json({ error: 'Alias can only contain letters, numbers, hyphens, and underscores' })
            }
            const existing = await pool.query('SELECT id FROM urls WHERE slug = $1', [customAlias])
            if (existing.rows.length > 0) {
                return res.status(409).json({ error: 'This alias is already taken, try another' })
            }

            slug = customAlias
            isCustomAlias = true
        } else {
            // auto-generate a random slug, retry if it collides (extremely rare)
            let attempts = 0
            while (attempts < 5) {
                const candidate = nanoid(7)
                const existing = await pool.query('SELECT id FROM urls WHERE slug = $1', [candidate])
                if (existing.rows.length === 0) {
                    slug = candidate
                    break
                }
                attempts++
            }
            if (!slug) {
                return res.status(500).json({ error: 'Could not generate a unique slug, please try again' })
            }
        }

        const result = await pool.query(
            `INSERT INTO urls (user_id, slug, is_custom_alias, original_url, title)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, slug, original_url, title, is_custom_alias, created_at`,
            [userId, slug, isCustomAlias, originalUrl, title || null]
        )

        res.status(201).json({ link: result.rows[0] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong while creating the link' })
    }
})

// GET all links for the logged-in user (protected)
// GET all links for the logged-in user (protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
         u.id, u.slug, u.original_url, u.title, u.is_custom_alias, u.created_at,
         COUNT(c.id) AS click_count
       FROM urls u
       LEFT JOIN clicks c ON c.url_id = u.id
       WHERE u.user_id = $1
       GROUP BY u.id
       ORDER BY u.created_at DESC`,
            [req.userId]
        )
        res.json({ links: result.rows })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong while fetching your links' })
    }
})

router.get('/:id/analytics', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId

        // confirm this link belongs to the logged-in user
        const linkResult = await pool.query(
            'SELECT id, slug, original_url, title, created_at FROM urls WHERE id = $1 AND user_id = $2',
            [id, userId]
        )

        if (linkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' })
        }

        const link = linkResult.rows[0]

        // total clicks
        const totalResult = await pool.query(
            'SELECT COUNT(*) AS total FROM clicks WHERE url_id = $1',
            [id]
        )
        const totalClicks = parseInt(totalResult.rows[0].total, 10)

        // clicks by day (last 30 days)
        const byDayResult = await pool.query(
            `SELECT DATE(clicked_at) AS date, COUNT(*) AS count
       FROM clicks
       WHERE url_id = $1 AND clicked_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(clicked_at)
       ORDER BY date ASC`,
            [id]
        )

        // clicks by device
        const byDeviceResult = await pool.query(
            `SELECT device, COUNT(*) AS count
       FROM clicks
       WHERE url_id = $1
       GROUP BY device
       ORDER BY count DESC`,
            [id]
        )

        // clicks by country
        const byCountryResult = await pool.query(
            `SELECT country, COUNT(*) AS count
       FROM clicks
       WHERE url_id = $1 AND country IS NOT NULL
       GROUP BY country
       ORDER BY count DESC
       LIMIT 10`,
            [id]
        )

        // clicks by city
        const byCityResult = await pool.query(
            `SELECT city, region, country, COUNT(*) AS count
       FROM clicks
       WHERE url_id = $1 AND city IS NOT NULL
       GROUP BY city, region, country
       ORDER BY count DESC
       LIMIT 10`,
            [id]
        )

        res.json({
            link,
            totalClicks,
            clicksByDay: byDayResult.rows,
            clicksByDevice: byDeviceResult.rows,
            clicksByCountry: byCountryResult.rows,
            clicksByCity: byCityResult.rows
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong while fetching analytics' })
    }
})

module.exports = router