import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
	}),
});

const projectStatus = z.enum(["live", "archived", "experiment", "in-progress"]);

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		excerpt: z.string(),
		category: z.string(),
		domains: z.array(z.string()).default([]),
		role: z.string(),
		stack: z.array(z.string()).default([]),
		year: z.number().int().min(2000),
		status: projectStatus.default("in-progress"),
		featured: z.boolean().default(false),
		impact: z.string().optional(),
		repoUrl: z.string().url().optional(),
		demoUrl: z.string().url().optional(),
		caseStudySlug: z.string().optional(),
		cover: image().optional(),
	}),
});

const caseStudies = defineCollection({
	loader: glob({ base: "./src/content/case-studies", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		excerpt: z.string(),
		projectSlug: z.string().optional(),
		role: z.string(),
		year: z.number().int().min(2000),
		summary: z.string(),
		problem: z.string(),
		requirements: z.array(z.string()).default([]),
		constraints: z.array(z.string()).default([]),
		architecture: z.string(),
		decisions: z.array(z.string()).default([]),
		results: z.array(z.string()).default([]),
		metrics: z.record(z.union([z.string(), z.number()])).optional(),
		lessons: z.array(z.string()).default([]),
		cover: image().optional(),
	}),
});

const notes = defineCollection({
	loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
		category: z.string(),
		tags: z.array(z.string()).default([]),
		publishedAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		draft: z.boolean().default(false),
	}),
});

const certificates = defineCollection({
	loader: glob({ base: "./src/content/certificates", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		issuer: z.string(),
		issuedAt: z.coerce.date(),
		credentialId: z.string().optional(),
		credentialUrl: z.string().url().optional(),
		skills: z.array(z.string()).default([]),
		category: z.string(),
		priority: z.number().int().optional(),
		cover: image().optional(),
	}),
});

export const collections = { blog, projects, caseStudies, notes, certificates };
