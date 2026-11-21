async function getGeoLocation(ip) {
    const isLocal = ip === '::1' ||
        ip === '127.0.0.1' ||
        ip === 'unknown' ||
        ip.startsWith('192.168.') ||
        ip.startsWith('10.')

    if (isLocal) {
        return { city: null, region: null, country: null, latitude: null, longitude: null }
    }

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,region,country`)
        const data = await response.json()

        if (data.status !== 'success') {
            return { city: null, region: null, country: null }
        }

        return {
            city: data.city || null,
            region: data.region || null,
            country: data.country || null
        }
    } catch (err) {
        console.error('Geo lookup failed:', err.message)
        return { city: null, region: null, country: null }
    }
}

module.exports = getGeoLocation;
