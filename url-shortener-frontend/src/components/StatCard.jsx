import { motion } from 'framer-motion'

export default function StatCard({ label, value }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-white/10 rounded-xl p-4 flex-1"
        >
            <p className="text-slate text-xs font-body uppercase tracking-wide">{label}</p>
            <p className="font-display text-3xl font-semibold text-cream mt-1">{value}</p>
        </motion.div>
    )
}