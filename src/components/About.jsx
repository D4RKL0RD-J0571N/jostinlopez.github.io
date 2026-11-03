import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { Code2, Brain, Gamepad2, Globe, Cpu, CheckCircle2 } from 'lucide-react';

export default function About() {
    const { t } = useTranslation();

    const skills = [
        {
            icon: <Code2 size={24} />,
            label: t('about.skills.engineering'),
            tech: t('about.techDetails.engineering', 'Clean Arch, SDD, IoC')
        },
        {
            icon: <Brain size={24} />,
            label: t('about.skills.ai'),
            tech: t('about.techDetails.ai', 'Python, FastAPI, Streamlit, Local LLMs')
        },
        {
            icon: <Gamepad2 size={24} />,
            label: t('about.skills.games'),
            tech: t('about.techDetails.games', 'C#, Unity 6, HLSL, ScriptableObjects')
        },
        {
            icon: <Globe size={24} />,
            label: t('about.skills.systems'),
            tech: t('about.techDetails.systems', 'React 19, TypeScript, Next.js, Tailwind')
        },
    ];

    const stats = [
        { label: 'Methodology', value: 'Spec-Driven Dev' },
        { label: 'Domain Layer', value: 'Zero-Dep Pure C#' },
        { label: 'Reconciliation', value: '100% Zero-Error' },
        { label: 'Deployment', value: 'Portable & Cloud' }
    ];

    return (
        <section id="about" className="py-20 bg-bg-base border-t border-bg-elevated/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full text-text-primary">
                        {t('about.heading')}
                    </h2>
                </div>

                <div className="grid md:grid-cols-12 gap-12 items-start">
                    {/* Bio & Status Section */}
                    <motion.div
                        className="md:col-span-8"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                            <div className="relative group shrink-0 w-32 md:w-40 aspect-square mx-auto md:mx-0">
                                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                <div className="w-full h-full bg-bg-base rounded-xl overflow-hidden relative border border-bg-elevated">
                                    <img
                                        src="/assets/avatar-jostin.svg"
                                        alt="Jostin López"
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/assets/project-placeholder.svg';
                                        }}
                                    />
                                    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 px-2 py-1 bg-bg-base/90 backdrop-blur-md rounded text-[10px] border border-accent/30 shadow-lg">
                                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                        <span className="font-mono text-accent uppercase tracking-wider font-semibold">
                                            {t('about.systemStatus.online', 'sys:online')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 text-center md:text-left">
                                <div className="space-y-4 text-text-secondary text-base md:text-lg leading-relaxed">
                                    <p>{t('about.content')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Core Competencies */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {skills.map((skill, idx) => (
                                <Card key={idx} className="p-4 hover:-translate-y-1 h-full flex flex-col justify-between border border-bg-elevated/70 hover:border-accent/40 rounded-xl transition-all">
                                    <div className="text-accent mb-3 transition-transform group-hover:scale-110 origin-left">
                                        {skill.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-primary mb-1 text-sm md:text-base leading-snug">
                                            {skill.label}
                                        </h3>
                                        <p className="text-[11px] text-text-secondary font-mono leading-tight">
                                            {skill.tech}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Architectural Readout */}
                    <div className="md:col-span-4 relative h-full">
                        <div className="bg-bg-surface/50 rounded-2xl border border-bg-elevated p-6 space-y-6 shadow-xl backdrop-blur-sm">
                            <div className="flex items-center gap-3 border-b border-bg-elevated pb-4">
                                <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                                    <Cpu size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-text-primary tracking-wide">
                                        System Telemetry
                                    </h4>
                                    <span className="font-mono text-[10px] text-accent tracking-wider uppercase">
                                        {t('about.systemStatus.ready', 'Ready for Production')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {stats.map((s, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-bg-base/60 border border-bg-elevated/60">
                                        <span className="text-text-secondary font-medium flex items-center gap-1.5">
                                            <CheckCircle2 size={13} className="text-accent shrink-0" />
                                            {s.label}
                                        </span>
                                        <span className="font-mono text-accent font-semibold">{s.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-bg-elevated/60 text-center">
                                <div className="font-mono text-[11px] text-text-secondary/70 tracking-widest uppercase">
                                    Clean Code · Modularity · Observability
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
