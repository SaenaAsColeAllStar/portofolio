export const prerender = false;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { positioning } from '../../data/positioning';
import { capabilityMatrix } from '../../data/skills';
import { checkRateLimit } from '../../utils/rateLimit';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  const ip = request.headers.get('cf-connecting-ip') || '127.0.0.1';

  try {
    // Check rate limit: Max 30 chat requests per 10 minutes
    const limitCheck = await checkRateLimit(env, ip, 'chat', 30, 10);
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'System AI assistant is busy. Too many messages from this IP. Please wait a few minutes.' 
      }), { status: 429, headers: { 'content-type': 'application/json' } });
    }

    if (!env?.AI) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Cloudflare Workers AI binding is not configured.' 
      }), { status: 500, headers: { 'content-type': 'application/json' } });
    }

    const body = await request.json();
    const { messages, locale = 'en' } = body;

    const activeLocale = (locale === 'id' ? 'id' : 'en') as 'en' | 'id';

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: activeLocale === 'en' ? 'Invalid chat history or messages array.' : 'Riwayat obrolan atau array pesan tidak valid.'
      }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // Load content collections dynamically to feed the LLM as system context
    const blog = await getCollection('blog');
    const projects = await getCollection('projects');
    const caseStudies = await getCollection('caseStudies');
    const notes = await getCollection('notes');
    const certificates = await getCollection('certificates');

    // Filter collections by locale
    const activeProjects = projects.filter(p => p.id.startsWith(activeLocale + "/"));
    const activeCaseStudies = caseStudies.filter(cs => cs.id.startsWith(activeLocale + "/"));
    const activeNotes = notes.filter(n => n.id.startsWith(activeLocale + "/"));
    const activeCertificates = certificates.filter(c => c.id.startsWith(activeLocale + "/"));

    const activePositioning = positioning[activeLocale];
    const activeCapabilityMatrix = capabilityMatrix[activeLocale];

    function getCleanUrl(basePath: string, id: string) {
      const cleanSlug = id.split('/').slice(1).join('/');
      return activeLocale === 'en' ? `${basePath}/${cleanSlug}` : `/id${basePath}/${cleanSlug}`;
    }

    // Build the portfolio RAG context block
    const systemPrompt = `You are the AI System Assistant for Saepul Husna's professional portfolio. Saepul Husna is also known as CTOS.
Your objective is to answer visitor inquiries about Saepul Husna (CTOS), his experience, skills, projects, and contact info in a helpful, concise, and professional manner.

About Saepul Husna (CTOS):
- Title: ${activePositioning.title}
- Headline: ${activePositioning.headline}
- Description: ${activePositioning.subheadline}
- Focus: ${activePositioning.recruiterSummary}

Core Capabilities:
${activeCapabilityMatrix.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Selected Projects:
${activeProjects.map(p => `- ${p.data.title}: ${p.data.excerpt} | Category: ${p.data.category} | Role: ${p.data.role} | Stack: ${p.data.stack.join(', ')} | URL: ${getCleanUrl('/projects', p.id)}`).join('\n')}

In-depth Case Studies:
${activeCaseStudies.map(cs => `- ${cs.data.title}: ${cs.data.excerpt} | Year: ${cs.data.year} | Role: ${cs.data.role} | URL: ${getCleanUrl('/case-studies', cs.id)}`).join('\n')}

Technical Notes:
${activeNotes.map(n => `- ${n.data.title}: ${n.data.excerpt} | Category: ${n.data.category} | URL: ${getCleanUrl('/notes', n.id)}`).join('\n')}

Certificates:
${activeCertificates.map(c => `- ${c.data.title} issued by ${c.data.issuer} | Credential ID: ${c.data.credentialId || 'N/A'} | URL: ${getCleanUrl('/certificates', c.id)}`).join('\n')}

Contact Information:
- Email: Saepulhusna70@gmail.com
- LinkedIn: https://www.linkedin.com/in/Saepulhusna234
- GitHub: https://github.com/SaenaAsColeAllStar
- Contact Form: Available at ${activeLocale === 'en' ? '/contact' : '/id/contact'}
- Guestbook Page: Available at ${activeLocale === 'en' ? '/guestbook' : '/id/guestbook'}

Instructions:
1. Speak as Saepul's system assistant. Keep answers professional, friendly, and structured. Use bullet points for readability.
2. If asked how to contact him, direct the user to ${activeLocale === 'en' ? '/contact' : '/id/contact'} or provide his email / social links.
3. Use markdown for format enhancement where appropriate (bolding, lists). Keep responses relatively brief (max 2-3 paragraphs or a few bullet points).
4. If a question is entirely unrelated to Saepul's background, work, or skills, politely redirect the conversation back to his portfolio.
5. YOU MUST RESPOND STRICTLY IN ${activeLocale === 'en' ? 'ENGLISH' : 'BAHASA INDONESIA'} (Indonesian). Communicate ONLY in this language because the user is currently reading the ${activeLocale === 'en' ? 'English' : 'Indonesian'} version of the website.
`;

    // Execute the Llama 3.1 8B Instruct Fast model
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    });

    const answer = aiResponse?.response || aiResponse?.result?.response || 'Sorry, I am unable to generate a response at this moment.';

    return new Response(JSON.stringify({ 
      success: true, 
      response: answer 
    }), { 
      status: 200, 
      headers: { 'content-type': 'application/json' } 
    });

  } catch (err) {
    console.error('Chat API error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An internal server error occurred while invoking the AI model.' 
    }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};
