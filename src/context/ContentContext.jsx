import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProjects from '../data/projects.json';
import initialTimeline from '../data/timeline.json';
import initialGallery from '../data/gallery.json';
import { hexToRgbChannels } from '../utils/applyTheme';

const ContentContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};

export const ContentProvider = ({ children }) => {
    // Helper for safe parsing
    const safeParse = (key, fallback, validator = (val) => val) => {
        try {
            const saved = localStorage.getItem(key);
            if (!saved) return fallback;
            const parsed = JSON.parse(saved);
            return validator(parsed) ? parsed : fallback;
        } catch (e) {
            console.error(`Error parsing ${key} from localStorage:`, e);
            return fallback;
        }
    };

    // Initialize Projects State
    const [projects, setProjects] = useState(() => safeParse('portfolio_projects', initialProjects, Array.isArray));

    // Initialize Timeline State
    const [timeline, setTimeline] = useState(() => safeParse('portfolio_timeline', initialTimeline, Array.isArray));

    // Initialize Gallery State
    const [gallery, setGallery] = useState(() => safeParse('portfolio_gallery', initialGallery, Array.isArray));

    // Initialize Section Order
    const [sectionOrder, setSectionOrder] = useState(() => {
        const defaultOrder = ['hero', 'about', 'projects', 'timeline', 'gallery', 'contact'];
        const saved = safeParse('portfolio_section_order', defaultOrder, Array.isArray);

        // Data Migration: Ensure all new default sections exist in the saved order
        const missingSections = defaultOrder.filter(section => !saved.includes(section));
        if (missingSections.length > 0) {
            const newOrder = [...saved];

            // Smart placement for Timeline: After 'projects'
            if (missingSections.includes('timeline')) {
                const projectsIndex = newOrder.indexOf('projects');
                if (projectsIndex !== -1) {
                    newOrder.splice(projectsIndex + 1, 0, 'timeline');
                } else {
                    newOrder.splice(2, 0, 'timeline'); // Fallback position
                }
            }

            // Append any other missing sections
            missingSections
                .filter(s => s !== 'timeline')
                .forEach(s => newOrder.push(s));

            return newOrder;
        }
        return saved;
    });

    const [globalSettings, setGlobalSettings] = useState(() =>
        safeParse('portfolio_settings', {
            accentColor: '#14b8a6',
            fontHeading: 'Inter',
            fontBody: 'Inter',
            formEndpoint: '',
            email: 'contact@jostinlopez.com',
            github: 'https://github.com/D4RKL0RD-J0571N',
            linkedin: 'https://www.linkedin.com/in/jostin-lopez-b761261bb/',
            resumeUrl: '/resume.pdf'
        }, (val) => typeof val === 'object' && val !== null)
    );

    const [legalModal, setLegalModal] = useState({ isOpen: false, title: '', content: '' });

    // Persist to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    }, [projects]);

    useEffect(() => {
        localStorage.setItem('portfolio_timeline', JSON.stringify(timeline));
    }, [timeline]);

    useEffect(() => {
        localStorage.setItem('portfolio_gallery', JSON.stringify(gallery));
    }, [gallery]);

    useEffect(() => {
        localStorage.setItem('portfolio_section_order', JSON.stringify(sectionOrder));
    }, [sectionOrder]);

    useEffect(() => {
        localStorage.setItem('portfolio_settings', JSON.stringify(globalSettings));
        // Real-time CSS Variable Injection with RGB support
        if (globalSettings.accentColor) {
            document.documentElement.style.setProperty('--accent', hexToRgbChannels(globalSettings.accentColor));
        }
    }, [globalSettings]);

    // --- Project Actions ---

    const addProject = (project) => {
        setProjects(prev => [project, ...prev]);
    };

    const updateProject = (id, updatedData) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deleteProject = (id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const moveProject = (id, direction) => {
        setProjects(prev => {
            const index = prev.findIndex(p => p.id === id);
            if (index < 0) return prev;

            const newProjects = [...prev];
            if (direction === 'up' && index > 0) {
                [newProjects[index - 1], newProjects[index]] = [newProjects[index], newProjects[index - 1]];
            } else if (direction === 'down' && index < newProjects.length - 1) {
                [newProjects[index + 1], newProjects[index]] = [newProjects[index], newProjects[index + 1]];
            }
            return newProjects;
        });
    };

    // --- Section Actions ---

    const moveSection = (sectionId, direction) => {
        setSectionOrder(prev => {
            const index = prev.indexOf(sectionId);
            if (index < 0) return prev;

            const newOrder = [...prev];
            if (direction === 'up' && index > 0) {
                [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
            } else if (direction === 'down' && index < newOrder.length - 1) {
                [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
            }
            return newOrder;
        });
    };

    const updateSettings = (newSettings) => {
        setGlobalSettings(prev => ({ ...prev, ...newSettings }));
    };

    // --- Data Reset (Emergency Hatch) ---
    const resetData = () => {
        setProjects(initialProjects);
        setTimeline(initialTimeline);
        setGallery(initialGallery);
        setSectionOrder(['hero', 'about', 'projects', 'timeline', 'gallery', 'contact']);
        setGlobalSettings({
            accentColor: '#14b8a6',
            fontHeading: 'Inter',
            fontBody: 'Inter',
            formEndpoint: '',
            email: 'contact@jostinlopez.com',
            github: 'https://github.com/D4RKL0RD-J0571N',
            linkedin: 'https://www.linkedin.com/in/jostin-lopez-b761261bb/',
            resumeUrl: '/resume.pdf'
        });
        localStorage.removeItem('portfolio_projects');
        localStorage.removeItem('portfolio_timeline');
        localStorage.removeItem('portfolio_gallery');
        localStorage.removeItem('portfolio_section_order');
        localStorage.removeItem('portfolio_settings');
    };

    const openLegalModal = (title, content) => {
        setLegalModal({ isOpen: true, title, content });
    };

    const closeLegalModal = () => {
        setLegalModal(prev => ({ ...prev, isOpen: false }));
    };

    const value = {
        projects,
        timeline,
        gallery,
        sectionOrder,
        globalSettings,
        legalModal,
        addProject,
        updateProject,
        deleteProject,
        moveProject,
        moveSection,
        updateSettings,
        resetData,
        openLegalModal,
        closeLegalModal,
        setTimeline // Exposed if we want to edit timeline in the future
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};
