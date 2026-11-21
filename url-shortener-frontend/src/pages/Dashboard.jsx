import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLinks } from '../api/links'
import { useAuth } from '../context/AuthContext'
import DashboardNavbar from '../components/DashboardNavbar'
import SearchBar from '../components/SearchBar'
import CreateLinkForm from '../components/CreateLinkForm'
import LinkRow from '../components/LinkRow'

export default function Dashboard() {
    const [links, setLinks] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('latest')
    const [showCreate, setShowCreate] = useState(false)
    const { user, logout } = useAuth()

    useEffect(() => {
        loadLinks()
    }, [])

    async function loadLinks() {
        try {
            const data = await getLinks()
            setLinks(data)
        } catch (err) {
            console.error('Failed to load links', err)
        } finally {
            setLoading(false)
        }
    }

    function handleCreated(newLink) {
        setLinks((prev) => [{ ...newLink, click_count: 0 }, ...prev])
        setShowCreate(false)
    }

    const filteredAndSorted = useMemo(() => {
        let result = links.filter((l) =>
            (l.title || '').toLowerCase().includes(search.toLowerCase()) ||
            l.slug.toLowerCase().includes(search.toLowerCase()) ||
            l.original_url.toLowerCase().includes(search.toLowerCase())
        )

        if (sortBy === 'clicks') {
            result = [...result].sort((a, b) => (b.click_count ?? 0) - (a.click_count ?? 0))
        } else if (sortBy === 'alphabetical') {
            result = [...result].sort((a, b) => (a.title || a.slug).localeCompare(b.title || b.slug))
        }
        // 'latest' is already the default order from the backend

        return result
    }, [links, search, sortBy])

    const totalClicks = links.reduce((sum, l) => sum + (parseInt(l.click_count, 10) || 0), 0)

    return (
        <div className="min-h-screen">
            <DashboardNavbar
                totalClicks={totalClicks}
                totalLinks={links.length}
                user={user}
                onLogout={logout}
            />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between px-6 pt-6">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-cream">Your links</h1>
                        <p className="text-slate text-sm font-body mt-0.5">
                            {links.length} {links.length === 1 ? 'link' : 'links'} created
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-lime text-ink font-display font-semibold rounded-lg px-4 py-2 text-sm
                       hover:bg-lime/90 active:scale-[0.98] transition-all duration-150"
                    >
                        {showCreate ? 'Cancel' : '+ New link'}
                    </button>
                </div>

                <AnimatePresence>
                    {showCreate && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden px-6"
                        >
                            <div className="pt-4">
                                <CreateLinkForm onCreated={handleCreated} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                <div className="border-t border-white/10">
                    {loading && (
                        <p className="text-slate text-sm font-body px-6 py-8">Loading your links...</p>
                    )}

                    {!loading && filteredAndSorted.length === 0 && links.length === 0 && (
                        <div className="text-center py-16 px-6">
                            <p className="text-cream font-display text-lg mb-1">No links yet</p>
                            <p className="text-slate text-sm font-body">Create your first one to get started.</p>
                        </div>
                    )}

                    {!loading && filteredAndSorted.length === 0 && links.length > 0 && (
                        <div className="text-center py-16 px-6">
                            <p className="text-slate text-sm font-body">No links match "{search}"</p>
                        </div>
                    )}

                    {filteredAndSorted.map((link, i) => (
                        <LinkRow key={link.id} link={link} index={i} />
                    ))}
                </div>
            </div>
        </div>
    )
}