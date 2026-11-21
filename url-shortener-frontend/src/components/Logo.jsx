export default function Logo({ size = 'default' }) {
    const isLarge = size === 'large'
    const iconSize = isLarge ? 28 : 20
    const textSize = isLarge ? 'text-2xl' : 'text-xl'

    return (
        <span className="inline-flex items-center gap-2">
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M8 20 L24 12"
                    stroke="#3A3D43"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />
                <path
                    d="M8 20 L14.5 16.7"
                    stroke="#C6FF3D"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />
                <circle cx="14.5" cy="16.7" r="3" fill="#C6FF3D" />
            </svg>
            <span className={`font-display font-semibold text-cream ${textSize}`}>
                snip<span className="text-lime">.</span>
            </span>
        </span>
    )
}