import { describe, it, expect } from 'vitest';
import { projectSchema, completeConfigSchema, projectsArraySchema } from './validation';
import actualProjects from '../data/projects.json';

describe('Validation Schemas', () => {
    it('should validate a valid project', () => {
        const validProject = {
            id: 'test-project',
            title: 'Test Project',
            category: 'AI',
            featured: true,
            tags: ['React', 'Vite'],
            description: 'A test project description'
        };
        const result = projectSchema.safeParse(validProject);
        expect(result.success).toBe(true);
    });

    it('should fail on invalid project ID', () => {
        const invalidProject = {
            id: '',
            title: 'Test Project',
            category: 'AI',
            featured: true,
            tags: [],
            description: ''
        };
        const result = projectSchema.safeParse(invalidProject);
        expect(result.success).toBe(false);
    });

    it('should validate all projects in src/data/projects.json', () => {
        const result = projectsArraySchema.safeParse(actualProjects);
        if (!result.success) {
            console.error(result.error);
        }
        expect(result.success).toBe(true);
    });

    it('should validate complete config', () => {
        const validConfig = {
            projects: actualProjects,
            timeline: [],
            gallery: [],
            globalSettings: {
                accentColor: '#14b8a6',
                fontHeading: 'Inter',
                fontBody: 'Inter',
                formEndpoint: ''
            },
            sectionOrder: ['hero', 'projects']
        };
        const result = completeConfigSchema.safeParse(validConfig);
        expect(result.success).toBe(true);
    });
});
