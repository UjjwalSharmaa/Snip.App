import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from './Logo'

export default function Navbar() {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto"
        >
            <Link to="/" className="font-display text-xl font-semibold text-cream">
                <Logo />
            </Link>
            <div className="flex items-center gap-6">
                <Link to="/login" className="text-sm text-white hover:text-lime font-body transition-colors duration-150">
                    Log in
                </Link>
                <Link
                    to="/signup"
                    className="text-sm bg-lime text-ink font-display font-semibold rounded-lg px-4 py-2
                     hover:bg-lime/90 active:scale-[0.98] transition-all duration-150"
                >
                    Get started free
                </Link>
            </div>
        </motion.nav>
    )
}