import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { Code2, Brain, Gamepad2, Layers } from 'lucide-react';

export default function About() {
    const { t } = useTranslation();

    const skills = [
        { icon: <Code2 size={24} />, label: t('about.skills.engineering'), tech: 'React, Node, Python' },
        { icon: <Brain size={24} />, label: t('about.skills.ai'), tech: 'GenAI, LLMs, NLP' },
        { icon: <Gamepad2 size={24} />, label: t('about.skills.games'), tech: 'Unity, C#, Unreal' },
        { icon: <Layers size={24} />, label: t('about.skills.systems'), tech: 'Architecture, Cloud' },
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
                                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="w-full h-full bg-bg-base rounded-xl overflow-hidden relative border border-bg-elevated">
                                    <img
                                        src="/avatar.jpg"
                                        alt="Profile"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        onError={(e) => { e.target.src = "https://placehold.co/400x400/0f172a/2dd4bf?text=J0571N" }}
                                    />
                                    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 px-2 py-1 bg-bg-base/90 backdrop-blur-md rounded text-[10px] border border-accent/20 shadow-lg">
                                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                        <span className="font-mono text-accent uppercase tracking-wider">
                                            sys:online
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 text-center md:text-left">
                                <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
                                    <p>{t('about.content')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Core Competencies */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {skills.map((skill, idx) => (
                                <Card key={idx} className="p-4 hover:-translate-y-1 h-full flex flex-col justify-between">
                                    <div className="text-accent mb-3 transition-transform group-hover:scale-110 origin-left">
                                        {skill.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-primary mb-1 text-sm md:text-base">{skill.label}</h3>
                                        <p className="text-[10px] md:text-xs text-text-secondary font-mono leading-tight">{skill.tech}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column / Decorative */}
                    <div className="hidden md:block md:col-span-4 relative h-full min-h-[300px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl border border-accent/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
                            <div className="text-center p-8 space-y-4">
                                <Code2 size={48} className="mx-auto text-accent/40" />
                                <div className="font-mono text-xs text-accent/60 tracking-widest uppercase">
                                    System Architecture<br />Optimization<br />Scalability
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
