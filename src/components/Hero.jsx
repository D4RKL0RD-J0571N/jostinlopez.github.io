// Hero.jsx - v1.1 - Fixed Framer Motion Imports
import React from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Download, MousePointer2 } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { useTranslation } from 'react-i18next';

export default function Hero() {
    const { t } = useTranslation();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX - innerWidth / 2);
        mouseY.set(clientY - innerHeight / 2);
    };

    const gridX = useTransform(mouseX, [-500, 500], [10, -10]);
    const gridY = useTransform(mouseY, [-500, 500], [10, -10]);
    const glow1X = useTransform(mouseX, [-500, 500], [30, -30]);
    const glow1Y = useTransform(mouseY, [-500, 500], [30, -30]);

    return (
        <section
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
        >
            {/* Background Elements - Particles/Grid */}
            <motion.div
                style={{ x: gridX, y: gridY }}
                className="absolute inset-0 z-0 opacity-20"
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
            </motion.div>

            <div className="absolute inset-0 z-0 max-w-full overflow-hidden">
                <motion.div
                    style={{ x: glow1X, y: glow1Y }}
                    className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[100px] animate-pulse"
                />
                <motion.div
                    style={{ x: glow1X, y: glow1Y, rotate: 45 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="font-mono text-accent text-lg mb-4 block tracking-wider">
                        {t('hero.greeting')}
                    </span>

                    <h1 className="text-4xl md:text-7xl font-bold mb-6 text-text-primary h-[3.5em] md:h-[auto] leading-tight">
                        <TypeAnimation
                            sequence={[
                                t('hero.titles.0'), // "Creative Technologist"
                                2000,
                                t('hero.titles.1'), // "Systems Engineer"
                                2000,
                                t('hero.titles.2'), // "GenAI Experimenter"
                                2000
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary"
                        />
                    </h1>

                    <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t('hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a
                            href="#projects"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px var(--accent-glow)" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                        >
                            {t('hero.cta.projects')}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </motion.a>
                        <motion.a
                            href="/resume.pdf"
                            download="Jostin_Lopez_Resume.pdf"
                            whileHover={{ scale: 1.05, backgroundColor: "var(--bg-surface)", borderColor: "var(--accent)", color: "var(--accent)" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-ghost"
                        >
                            {t('hero.cta.cv')}
                            <Download className="ml-2 w-5 h-5" />
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 inset-x-0 mx-auto w-fit text-text-secondary flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
            >
                <span className="text-xs font-mono tracking-widest uppercase opacity-70">{t('hero.scroll')}</span>
                <MousePointer2 className="w-5 h-5 opacity-70" />
            </motion.div>
        </section>
    );
}
