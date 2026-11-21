import { motion } from 'framer-motion'
import Logo from '../components/Logo'

export default function DashboardNavbar({ totalClicks, totalLinks, user, onLogout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-6 py-4 border-b border-white/10"
    >
      <div className="flex items-center gap-6">
        <Logo />
        <div className="hidden sm:flex items-center gap-4 text-xs font-body text-slate">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            {totalClicks} total clicks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet" />
            {totalLinks} links
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-cream font-body hidden sm:inline">{user?.name}</span>
        <button
          onClick={onLogout}
          className="border-2 border-cream px-2 py-1 hover:border-red-500 hover:bg-red-300 hover:text-black rounded-lg text-sm text-cream font-body transition-colors duration-150"
        >
          Log out
        </button>
      </div>
    </motion.div>
  )
}