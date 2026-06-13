export interface Technology {
	name: string;
	category: "framework" | "language" | "platform" | "tool" | "database" | "ai";
	description: string;
}

export const technologies: Technology[] = [
	{ name: "Astro", category: "framework", description: "Static-first web framework with island architecture." },
	{ name: "Vue 3", category: "framework", description: "Progressive UI framework for interactive islands." },
	{ name: "TypeScript", category: "language", description: "Type-safe development across frontend and backend." },
	{ name: "Node.js", category: "platform", description: "Server-side JavaScript runtime for APIs and tooling." },
	{ name: "Python", category: "language", description: "Automation scripts, AI workflows, and data pipelines." },
	{ name: "Cloudflare", category: "platform", description: "Edge computing, CDN, DNS, and serverless deployment." },
	{ name: "Docker", category: "tool", description: "Containerized environments for reproducible deployments." },
	{ name: "GitHub Actions", category: "tool", description: "CI/CD pipelines for automated testing and deployment." },
	{ name: "PostgreSQL", category: "database", description: "Relational database for structured application data." },
	{ name: "Redis", category: "database", description: "In-memory caching for performance-critical operations." },
	{ name: "OpenAI / LLMs", category: "ai", description: "AI-powered workflows and intelligent automation." },
	{ name: "Terraform", category: "tool", description: "Infrastructure as Code for cloud provisioning." },
];

export const technologyCategories: Record<Technology["category"], string> = {
	framework: "Frameworks",
	language: "Languages",
	platform: "Platforms",
	tool: "DevOps & Tools",
	database: "Data Stores",
	ai: "AI & ML",
};
