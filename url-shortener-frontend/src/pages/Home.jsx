import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import DemoUrl from '../components/DemoUrl'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' },
}

const features = [
  {
    title: 'Branded links',
    desc: 'Ditch the random characters. Create memorable aliases like snip.app/launch-sale that your audience actually trusts.',
    icon: '🏷️',
  },
  {
    title: 'Real-time analytics',
    desc: 'See every click as it happens — broken down by city, country, device, and time. No guessing, just data.',
    icon: '📊',
  },
  {
    title: 'Built for Everyone',
    desc: 'A clean REST API, JWT auth, and a schema designed to scale. Built the same way production link tools are.',
    icon: '⚡',
  },
]

const faqs = [
  {
    q: 'Is it free to use?',
    a: 'Yes — creating an account, shortening links, and viewing analytics is completely free.',
  },
  {
    q: 'Can I track where my clicks come from?',
    a: 'Every click is logged with city, region, and country (once your link is shared publicly), along with device type and timestamp.',
  },
  {
    q: 'What is a branded link?',
    a: 'Instead of a random string like snip.app/aB3xK9, you can choose a custom alias like snip.app/my-launch — easier to remember and share.',
  },
  {
    q: 'Do my links expire?',
    a: 'No — links remain active indefinitely once created.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="px-6 pt-12 pb-20 max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl sm:text-6xl font-semibold text-cream leading-tight"
        >
          Long links, <span className="text-lime">shrunk</span>.
          <br />
          Every click, <span className="text-violet">tracked</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-slate font-body mt-5 max-w-lg mx-auto"
        >
          Shorten, brand, and track your links with real analytics — who clicked, from where, and on what device.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <DemoUrl />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-3xl font-semibold text-cream text-center mb-12">
            Everything you need to manage links
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="border border-white/10 rounded-xl p-6 hover:border-lime/30 transition-colors duration-200"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-display text-lg font-semibold text-cream mt-4">{f.title}</h3>
                <p className="text-slate text-sm font-body mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS-STYLE TECH SECTION (honest, no fake numbers) */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 {...fadeUp} className="font-display text-3xl font-semibold text-cream mb-3">
            Built on a real production stack
          </motion.h2>
          <motion.p {...fadeUp} className="text-slate font-body mb-10">
            No shortcuts — a genuine full-stack architecture under the hood.
          </motion.p>

          <motion.div
            {...fadeUp}
            className="grid sm:grid-cols-4 gap-4 text-left"
          >
            {['React + Vite', 'Node.js + Express', 'PostgreSQL', 'JWT Auth'].map((tech) => (
              <div key={tech} className="border border-white/10  hover:border-lime-500 transition-colors duration-200 rounded-xl p-4">
                <p className="font-display text-cream text-sm">{tech}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-3xl font-semibold text-cream text-center mb-10"> <span className="text-lime">FAQs</span> —
            Frequently asked Questions
          </motion.h2>

          <div className="flex flex-col gap-3 ">
            {faqs.map((item) => (
              <motion.details
                key={item.q}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="border border-white/10 rounded-xl p-4 group"
              >
                <summary className="font-display text-cream hover:text-lime cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-slate group-open:rotate-180 transition-transform duration-200">⌄</span>
                </summary>
                <p className="text-slate text-sm font-body mt-3 leading-relaxed">{item.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-24 border-t border-white/5 text-center">
        <motion.h2 {...fadeUp} className="font-display text-3xl sm:text-4xl font-semibold text-cream">
          Ready to shrink your first link?
        </motion.h2>
        <motion.div {...fadeUp} className="mt-8">
          <Link
            to="/signup"
            className="inline-block bg-lime text-ink font-display font-semibold rounded-lg px-8 py-3
                       hover:bg-violet active:scale-[0.98] transition-all duration-150"
          >
            Get started for free
          </Link>
        </motion.div>
      </section>

      <footer className="px-6 py-8 border-t border-white/5 text-center">
        <p className="text-slate text-xs font-body">
          Built by Ujjwal Sharma — a full-stack link management platform.
        </p>
      </footer>
    </div>
  )
}