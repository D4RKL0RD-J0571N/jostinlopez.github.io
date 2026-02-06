import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    };

    const links = [
        { name: t('nav.about'), href: '#about' },
        { name: t('nav.projects'), href: '#projects' },
        { name: t('nav.creative'), href: '#creative' },
        { name: t('nav.contact'), href: '#contact' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300",
            scrolled ? "bg-bg-base/90 backdrop-blur-md border-b border-bg-elevated" : "bg-transparent"
        )}>
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <a href="#" className="font-mono text-xl font-bold text-text-primary hover:text-accent transition-colors">
                    J0571N
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors"
                        aria-label="Toggle Language"
                    >
                        <Globe size={16} />
                        <span className="uppercase">{i18n.language}</span>
                    </button>

                    <div className="h-5 w-px bg-bg-elevated mx-2" />

                    <div className="flex gap-4">
                        <a href="https://github.com/D4RKL0RD-J0571N" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent" aria-label="Github Profile"><Github size={20} /></a>
                        <a href="https://www.linkedin.com/in/jostin-lopez-b761261bb/?locale=en_US" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent" aria-label="LinkedIn Profile"><Linkedin size={20} /></a>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors"
                        aria-label="Toggle Language"
                    >
                        <span className="uppercase">{i18n.language}</span>
                    </button>
                    <button
                        className="text-text-secondary hover:text-accent"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close Menu" : "Open Menu"}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-bg-base border-b border-bg-elevated overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-slate-300 hover:text-teal-400"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
