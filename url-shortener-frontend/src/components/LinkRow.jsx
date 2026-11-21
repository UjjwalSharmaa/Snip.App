import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function LinkRow({ link, index }) {
  const [copied, setCopied] = useState(false)
  const shortUrl = `http://localhost:5000/${link.slug}`

  function handleCopy(e) {
    e.preventDefault()
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const createdLabel = new Date(link.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
      className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] items-center gap-4 px-6 py-4
                 border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-150 group"
    >
      {/* Link info */}
      <div className="min-w-0 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-violet/20 flex items-center justify-center shrink-0">
          <span className="text-violet text-xs font-display">{link.title?.[0]?.toUpperCase() || 'L'}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-cream font-body text-sm truncate">{link.title || 'Untitled link'}</p>
            {link.is_custom_alias && (
              <span className="text-[10px] uppercase tracking-wide bg-violet/20 text-violet px-1.5 py-0.5 rounded-full font-body shrink-0">
                Branded
              </span>
            )}
          </div>
          <p className="text-lime text-xs font-body truncate">snip.app/{link.slug}</p>
        </div>
      </div>

      {/* Clicks */}
      <div className="text-sm font-body text-cream hidden sm:block">
        {link.click_count ?? 0} {link.click_count === 1 ? 'click' : 'clicks'}
      </div>

      {/* Created date */}
      <div className="text-xs font-body text-slate hidden sm:block">{createdLabel}</div>

      {/* Actions */}
      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={handleCopy}
          className="text-xs font-body px-3 py-1.5 rounded-lg border border-white/10 text-cream
                     hover:border-white/30 transition-colors duration-150 whitespace-nowrap"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <Link
          to={`/analytics/${link.id}`}
          className="text-xs font-body px-3 py-1.5 rounded-lg bg-lime text-ink font-medium
                     hover:bg-lime/90 transition-colors duration-150 whitespace-nowrap"
        >
          View
        </Link>
      </div>
    </motion.div>
  )
}