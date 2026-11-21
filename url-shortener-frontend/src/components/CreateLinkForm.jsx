import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createLink } from '../api/links'

export default function CreateLinkForm({ onCreated }) {
    const [originalUrl, setOriginalUrl] = useState('')
    const [customAlias, setCustomAlias] = useState('')
    const [title, setTitle] = useState('')
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const link = await createLink({
                originalUrl,
                customAlias: customAlias || undefined,
                title: title || undefined,
            })
            onCreated(link)
            setOriginalUrl('')
            setCustomAlias('')
            setTitle('')
            setShowAdvanced(false)
        } catch (err) {
            setError(err.response?.data?.error || 'Could not create link')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="border border-white/10 rounded-xl p-5">
            <div className="flex gap-2">
                <input
                    type="url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="Paste a long URL — https://..."
                    required
                    className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-cream font-body
                     placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime/50
                     transition-colors duration-200"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-lime text-ink font-display font-semibold rounded-lg px-5
                     hover:bg-lime/90 active:scale-[0.98] transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {loading ? 'Shrinking...' : 'Shorten'}
                </button>
            </div>

            <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-slate hover:text-cream font-body mt-3 transition-colors duration-150"
            >
                {showAdvanced ? '− Hide options' : '+ Add branded alias or title'}
            </button>

            <AnimatePresence>
                {showAdvanced && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="flex gap-3 mt-3">
                            <input
                                type="text"
                                value={customAlias}
                                onChange={(e) => setCustomAlias(e.target.value)}
                                placeholder="custom-alias (optional)"
                                className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-2 text-sm text-cream font-body
                           placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime/50"
                            />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title (optional)"
                                className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-2 text-sm text-cream font-body
                           placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime/50"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mt-3">
                    {error}
                </p>
            )}
        </form>
    )
}