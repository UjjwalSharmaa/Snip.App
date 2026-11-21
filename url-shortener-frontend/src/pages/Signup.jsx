import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Logo from '../components/Logo'

export default function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await api.post('/auth/register', { name, email, password })
            login(res.data.user, res.data.token)
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-sm"
            >
                <Link to="/" className="font-display text-xl font-semibold text-cream">
                    <Logo />
                </Link>

                <h1 className="font-display text-3xl font-semibold mt-8 mb-1">Create your account</h1>
                <p className="text-slate text-sm mb-8">Start shortening, tracking, and branding your links.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ujjwal Sharma" required />
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />

                    {error && (
                        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-lime text-ink font-display font-semibold rounded-lg py-2.5
                       hover:bg-lime/90 active:scale-[0.98] transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="text-sm text-slate mt-6 text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-lime hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    )
}