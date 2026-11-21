export default function Input({ label, type = 'text', value, onChange, placeholder, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate font-body">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-cream font-body
                   placeholder:text-slate/60
                   focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime/50
                   transition-colors duration-200"
            />
        </div>
    )
}