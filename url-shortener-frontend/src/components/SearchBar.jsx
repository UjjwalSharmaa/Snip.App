export default function SearchBar({ search, onSearchChange, sortBy, onSortChange }) {
    return (
        <div className="flex items-center gap-3 px-6 py-4">
            <div className="relative flex-1 max-w-xs">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search your links..."
                    className="w-full bg-transparent border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-cream font-body
                     placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime/50
                     transition-colors duration-200"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate text-sm">⌕</span>
            </div>

            <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-cream font-body
                   focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime/50
                   transition-colors duration-200"
            >
                <option value="latest" className="bg-ink">Latest</option>
                <option value="clicks" className="bg-ink">Most clicks</option>
                <option value="alphabetical" className="bg-ink">A–Z</option>
            </select>
        </div>
    )
}