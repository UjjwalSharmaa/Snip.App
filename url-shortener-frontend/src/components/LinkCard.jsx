import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function LinkCard({ link }) {
    const [copied, setCopied] = useState(false)
    const shortUrl = `http://localhost:5000/${link.slug}`
    const displayUrl = `snip.app/${link.slug}`

    function handleCopy() {
        navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4
                 hover:border-white/20 transition-colors duration-200"
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {link.is_custom_alias && (
                        <span className="text-[10px] uppercase tracking-wide bg-violet/20 text-violet px-2 py-0.5 rounded-full font-body">
                            Branded
                        </span>
                    )}
                    <p className="font-display text-cream truncate">{link.title || 'Untitled link'}</p>
                </div>
                <p className="text-lime text-sm font-body mt-1 truncate">{displayUrl}</p>
                <p className="text-slate text-xs font-body mt-0.5 truncate">{link.original_url}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={handleCopy}
                    className="text-xs font-body px-3 py-1.5 rounded-lg border border-white/10 text-cream
                     hover:border-white/30 transition-colors duration-150"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <Link
                    to={`/analytics/${link.id}`}
                    className="text-xs font-body px-3 py-1.5 rounded-lg bg-lime text-ink font-medium
                     hover:bg-lime/90 transition-colors duration-150"
                >
                    Analytics
                </Link>
            </div>
        </motion.div>
    )
}