import { z } from 'zod';

export const projectSchema = z.object({
    id: z.string().min(1, "ID is required"),
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    featured: z.boolean(),
    tags: z.string().or(z.array(z.string())), // Allow legacy string format but prefer array
    description: z.string(),
    long_description: z.string().optional(),
    metrics: z.array(z.string()).optional(),
    repo: z.string().optional().or(z.literal('')),
    demo: z.string().optional().or(z.literal('')),
    links: z.object({
        repo: z.string().optional(),
        demo: z.string().optional()
    }).optional(),
    thumbnail: z.string().optional().or(z.literal(''))
});

export const projectsArraySchema = z.array(projectSchema);

export const settingsSchema = z.object({
    accentColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid Hex Color"),
    fontHeading: z.string(),
    fontBody: z.string(),
    formEndpoint: z.string().url().optional().or(z.literal('')),
    email: z.string().email("Invalid Email Address").optional().or(z.literal('')),
    github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
    linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
    resumeUrl: z.string().optional().or(z.literal(''))
});

export const gallerySchema = z.array(z.object({
    id: z.number().or(z.string()),
    url: z.string().optional(),
    image: z.string().optional(),
    title: z.string(),
    type: z.string().optional(),
    category: z.string().optional(),
    color: z.string().optional(),
    summary: z.string().optional(),
    metrics: z.string().optional(),
    stack: z.array(z.string()).optional()
}));

export const timelineSchema = z.array(z.object({
    id: z.number().or(z.string()),
    period: z.string().optional(),
    year: z.string().optional(),
    title: z.string().optional(),
    role: z.string().optional(),
    company: z.string().optional(),
    description: z.string(),
    isCurrent: z.boolean().optional(),
    tags: z.array(z.string()).optional()
}));

export const completeConfigSchema = z.object({
    projects: projectsArraySchema,
    timeline: timelineSchema,
    gallery: gallerySchema,
    globalSettings: settingsSchema,
    sectionOrder: z.array(z.string())
});
