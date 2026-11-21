import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { getAnalytics } from '../api/links'
import StatCard from '../components/StatCard'

const COLORS = ['#C6FF3D', '#8B7FFF', '#6B7280', '#F6F5F1']

export default function Analytics() {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAnalytics()
    }, [id])

    async function loadAnalytics() {
        try {
            const result = await getAnalytics(id)
            setData(result)
        } catch (err) {
            setError(err.response?.data?.error || 'Could not load analytics')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate font-body">
                Loading analytics...
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 font-body">{error}</p>
                <Link to="/dashboard" className="text-lime hover:underline font-body">← Back to dashboard</Link>
            </div>
        )
    }

    const { link, totalClicks, clicksByDay, clicksByDevice, clicksByCountry, clicksByCity } = data

    const formattedByDay = clicksByDay.map((d) => ({
        date: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        count: parseInt(d.count, 10),
    }))

    return (
        <div className="min-h-screen px-6 py-8 max-w-3xl mx-auto">
            <Link to="/dashboard" className="text-slate hover:text-cream text-sm font-body transition-colors duration-150">
                ← Back to dashboard
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 mb-8"
            >
                <h1 className="font-display text-2xl font-semibold text-cream">{link.title || 'Untitled link'}</h1>
                <p className="text-lime text-sm font-body mt-1">snip.app/{link.slug}</p>
                <p className="text-slate text-xs font-body mt-0.5 truncate">{link.original_url}</p>
            </motion.div>

            <div className="flex gap-3 mb-8">
                <StatCard label="Total Clicks" value={totalClicks} />
                <StatCard label="Countries" value={clicksByCountry.length} />
                <StatCard label="Cities" value={clicksByCity.length} />
            </div>

            {/* Clicks over time */}
            <div className="border border-white/10 rounded-xl p-5 mb-6">
                <h2 className="font-display text-sm font-semibold text-cream mb-4">Clicks over time</h2>
                {formattedByDay.length === 0 ? (
                    <p className="text-slate text-sm font-body py-8 text-center">No click data yet</p>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={formattedByDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ background: '#0F1115', border: '1px solid #ffffff20', borderRadius: 8 }}
                                labelStyle={{ color: '#F6F5F1' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#C6FF3D" strokeWidth={2} dot={{ fill: '#C6FF3D' }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Clicks by device */}
                <div className="border border-white/10 rounded-xl p-5">
                    <h2 className="font-display text-sm font-semibold text-cream mb-4">By device</h2>
                    {clicksByDevice.length === 0 ? (
                        <p className="text-slate text-sm font-body py-8 text-center">No data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={clicksByDevice}
                                    dataKey="count"
                                    nameKey="device"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={70}
                                    label={({ device }) => device}
                                    labelLine={false}
                                >
                                    {clicksByDevice.map((entry, index) => (
                                        <Cell key={entry.device} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#0F1115', border: '1px solid #ffffff20', borderRadius: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Clicks by country */}
                <div className="border border-white/10 rounded-xl p-5">
                    <h2 className="font-display text-sm font-semibold text-cream mb-4">Top countries</h2>
                    {clicksByCountry.length === 0 ? (
                        <p className="text-slate text-sm font-body py-8 text-center">
                            No location data yet — works once deployed live
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={clicksByCountry} layout="vertical">
                                <XAxis type="number" stroke="#6B7280" fontSize={12} allowDecimals={false} />
                                <YAxis dataKey="country" type="category" stroke="#6B7280" fontSize={12} width={70} />
                                <Tooltip contentStyle={{ background: '#0F1115', border: '1px solid #ffffff20', borderRadius: 8 }} />
                                <Bar dataKey="count" fill="#8B7FFF" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Top cities list */}
            <div className="border border-white/10 rounded-xl p-5 mt-6">
                <h2 className="font-display text-sm font-semibold text-cream mb-4">Top cities</h2>
                {clicksByCity.length === 0 ? (
                    <p className="text-slate text-sm font-body py-4 text-center">
                        No city data yet — works once deployed live
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {clicksByCity.map((c) => (
                            <div key={`${c.city}-${c.region}`} className="flex items-center justify-between text-sm font-body">
                                <span className="text-cream">{c.city}, {c.region}</span>
                                <span className="text-slate">{c.count} clicks</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}