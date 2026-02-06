import { useTranslation } from 'react-i18next';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Timeline() {
    const { t } = useTranslation();
    const { timeline } = useContent();

    return (
        <section id="timeline" className="py-20 bg-bg-base border-t border-bg-elevated/50">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    <h2 className="text-3xl font-bold mb-12 border-l-4 border-accent pl-4 text-text-primary">
                        {t('timeline.title', 'Professional History')}
                    </h2>

                    <div className="relative pl-8 md:pl-12 border-l border-bg-elevated/50 space-y-12 py-4">
                        {timeline.map((role) => (
                            <div key={role.id} className="relative">
                                <span className={`absolute flex items-center justify-center w-6 h-6 bg-bg-surface rounded-full -left-[45px] md:-left-[61px] ring-4 ring-bg-base border z-10 ${role.isCurrent ? 'border-accent/50' : 'border-bg-elevated'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${role.isCurrent ? 'bg-accent animate-pulse' : 'bg-bg-elevated'}`} />
                                </span>
                                <time className={`block mb-2 text-xs font-mono font-bold uppercase tracking-widest ${role.isCurrent ? 'text-accent/60' : 'text-text-secondary/60'}`}>{role.period}</time>
                                <h3 className="flex items-center mb-1 text-xl font-bold text-text-primary tracking-tight">{role.title}</h3>
                                <p className="text-base text-text-secondary leading-relaxed opacity-80">{role.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
