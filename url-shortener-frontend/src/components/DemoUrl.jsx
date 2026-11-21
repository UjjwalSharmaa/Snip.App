import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function DemoUrl() {
    const [url, setUrl] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        setResult(null)

        try {
            const res = await api.post('/links/demo', { originalUrl: url })
            setResult(res.data.previewSlug)
        } catch (err) {
            setError(err.response?.data?.error || 'Enter a valid URL to see the magic')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-xl">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your long, ugly link here..."
                    className="flex-1 bg-white/5 hover:border-lime/90 border border-white/10 rounded-lg px-4 py-3 text-cream font-body
                     placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-lime/90 focus:border-lime/90
                     transition-colors duration-200"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-lime text-ink font-display font-semibold rounded-lg px-6 py-3
                     hover:bg-violet active:scale-[0.98] transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {loading ? 'Shrinking...' : 'Shrink it'}
                </button>
            </form>

            {error && (
                <p className="text-sm text-red-400 font-body mt-3">{error}</p>
            )}

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="mt-4 border border-lime/30 bg-lime/5 rounded-lg p-4 flex items-center justify-between gap-3 overflow-hidden"
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: 'auto' }}
                                transition={{ duration: 0.4 }}
                                className="text-lime font-display font-medium whitespace-nowrap"
                            >
                                snip.app/{result}
                            </motion.span>
                        </div>
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-xs font-body px-3 py-1.5 rounded-lg bg-lime text-ink font-medium
                         hover:bg-lime/90 transition-colors duration-150 whitespace-nowrap"
                        >
                            Sign up to save it →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-slate text-xs font-body mt-3">
                Free preview — sign up to track clicks, brand your links, and see who's clicking from where.
            </p>
        </div>
    )
}