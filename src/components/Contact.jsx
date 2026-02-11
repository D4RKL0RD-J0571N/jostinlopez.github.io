import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Github, Linkedin, FileText, Check, Copy, Download, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from './ui/Modal';
import { Toast } from './ui/Toast';
import { useContent } from '../context/ContentContext';

export default function Contact() {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { globalSettings } = useContent();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            if (globalSettings.formEndpoint) {
                const response = await fetch(globalSettings.formEndpoint, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    setIsSubmitted(true);
                    e.target.reset();
                    setTimeout(() => setIsSubmitted(false), 5000);
                } else {
                    alert("Error sending message. Please try again.");
                }
            } else {
                // Simulation Mode
                await new Promise(r => setTimeout(r, 1000));
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 5000);
                e.target.reset();
            }
        } catch (error) {
            console.error("Form Error:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(globalSettings.email || 'contact@jostinlopez.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="contact" className="py-20 bg-bg-base relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-[50rem] h-[50rem] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <h2 className="font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary" style={{ fontSize: 'var(--h2)' }}>
                            {t('contact.heading')}
                        </h2>
                        <p className="text-text-secondary text-lg">
                            {t('contact.message')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <button
                                className="w-full group flex items-center gap-4 p-4 rounded-xl border border-bg-elevated/50 bg-bg-base/30 hover:bg-bg-base/50 transition-all text-left focus:outline-none focus:ring-2 focus:ring-accent/50"
                                onClick={handleCopyEmail}
                                aria-label={t('contact.emailAction')}
                            >
                                <div className="w-12 h-12 bg-bg-base rounded-lg flex items-center justify-center border border-bg-elevated text-accent group-hover:scale-110 transition-transform">
                                    <Mail size={20} />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-text-primary">{t('contact.emailLabel')}</h4>
                                    <p className="text-text-secondary text-sm">{t('contact.emailAction')}</p>
                                </div>
                                <div className="text-text-secondary">
                                    {copied ? <Check size={18} className="text-accent" /> : <Copy size={18} />}
                                </div>
                            </button>

                            <button
                                onClick={() => setIsResumeOpen(true)}
                                className="w-full group flex items-center gap-4 p-4 rounded-xl border border-bg-elevated/50 bg-bg-base/30 hover:bg-bg-base/50 transition-all text-left focus:outline-none focus:ring-2 focus:ring-accent/50"
                                aria-label={t('contact.resumeAction')}
                            >
                                <div className="w-12 h-12 bg-bg-base rounded-lg flex items-center justify-center border border-bg-elevated text-accent group-hover:scale-110 transition-transform">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-text-primary">{t('contact.resumeLabel')}</h4>
                                    <p className="text-text-secondary text-sm">{t('contact.resumeAction')}</p>
                                </div>
                                <div className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye size={18} />
                                </div>
                            </button>

                            <div className="pt-6 flex gap-4">
                                <a href={globalSettings.github || "https://github.com/D4RKL0RD-J0571N"} target="_blank" rel="noreferrer" className="p-3 bg-bg-base border border-bg-elevated rounded-lg hover:border-accent text-text-secondary hover:text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent/50" aria-label="Github Profile">
                                    <Github size={24} />
                                </a>
                                <a href={globalSettings.linkedin || "https://www.linkedin.com/in/jostin-lopez-b761261bb/"} target="_blank" rel="noreferrer" className="p-3 bg-bg-base border border-bg-elevated rounded-lg hover:border-accent text-text-secondary hover:text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent/50" aria-label="LinkedIn Profile">
                                    <Linkedin size={24} />
                                </a>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 bg-bg-surface p-8 rounded-2xl border border-bg-elevated shadow-xl">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary pl-1">{t('contact.form.name')}</label>
                                <input
                                    name="name"
                                    id="name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary pl-1">{t('contact.form.email')}</label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    spellCheck={false}
                                    className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-medium text-text-secondary pl-1">{t('contact.form.message')}</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    required
                                    rows={4}
                                    className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-all"
                                    placeholder="Hello..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                aria-busy={isSubmitting}
                                className="btn-primary w-full px-0 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-bg-base"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        {t('contact.form.send')}
                                        <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Resume Preview Modal */}
            <Modal
                isOpen={isResumeOpen}
                onClose={() => setIsResumeOpen(false)}
                title={t('contact.resumeLabel')}
            >
                <div className="flex flex-col h-full">
                    <div className="bg-bg-base p-4 border-b border-bg-elevated flex justify-end">
                        <a
                            href="/resume.pdf"
                            download="Jostin_Lopez_Resume.pdf"
                            className="btn-primary px-4 py-2 text-sm"
                        >
                            <Download size={18} className="mr-2" />
                            Download PDF
                        </a>
                    </div>
                    <div className="flex-grow bg-bg-surface flex items-center justify-center p-4">
                        <iframe
                            src="/resume.pdf#toolbar=0"
                            className="w-full h-[70vh] rounded shadow-2xl border border-bg-elevated"
                            title="Resume Preview"
                        />
                    </div>
                </div>
            </Modal>

            {/* Form Success Feedback */}
            <Toast
                isVisible={isSubmitted}
                onClose={() => setIsSubmitted(false)}
                message="Message sent successfully!"
            />
        </section>
    );
}
