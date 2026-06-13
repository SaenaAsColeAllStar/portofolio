export const prerender = false;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { positioning } from '../../data/positioning';
import { capabilityMatrix } from '../../data/skills';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime?.env;
    if (!env?.AI) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Cloudflare Workers AI binding is not configured.' 
      }), { status: 500, headers: { 'content-type': 'application/json' } });
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid chat history or messages array.' 
      }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // Load content collections dynamically to feed the LLM as system context
    const blog = await getCollection('blog');
    const projects = await getCollection('projects');
    const caseStudies = await getCollection('caseStudies');
    const notes = await getCollection('notes');
    const certificates = await getCollection('certificates');

    // Build the portfolio RAG context block
    const systemPrompt = `You are the AI System Assistant for Saepul Husna's professional portfolio. Saepul Husna is also known as CTOS.
Your objective is to answer visitor inquiries about Saepul Husna (CTOS), his experience, skills, projects, and contact info in a helpful, concise, and professional manner.

About Saepul Husna (CTOS):
- Title: ${positioning.title}
- Headline: ${positioning.headline}
- Description: ${positioning.subheadline}
- Focus: ${positioning.recruiterSummary}

Core Capabilities:
${capabilityMatrix.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Selected Projects:
${projects.map(p => `- ${p.data.title}: ${p.data.excerpt} | Category: ${p.data.category} | Role: ${p.data.role} | Stack: ${p.data.stack.join(', ')} | URL: /projects/${p.id}`).join('\n')}

In-depth Case Studies:
${caseStudies.map(cs => `- ${cs.data.title}: ${cs.data.excerpt} | Year: ${cs.data.year} | Role: ${cs.data.role} | URL: /case-studies/${cs.id}`).join('\n')}

Technical Notes:
${notes.map(n => `- ${n.data.title}: ${n.data.excerpt} | Category: ${n.data.category} | URL: /notes/${n.id}`).join('\n')}

Certificates:
${certificates.map(c => `- ${c.data.title} issued by ${c.data.issuer} | Credential ID: ${c.data.credentialId || 'N/A'} | URL: /certificates/${c.id}`).join('\n')}

Contact Information:
- Email: Saepulhusna70@gmail.com
- LinkedIn: https://www.linkedin.com/in/Saepulhusna234
- GitHub: https://github.com/SaenaAsColeAllStar
- Contact Form: Available at /contact
- Guestbook Page: Available at /guestbook

Instructions:
1. Speak as Saepul's system assistant. Keep answers professional, friendly, and structured. Use bullet points for readability.
2. If asked how to contact him, direct the user to /contact or provide his email / social links.
3. Use markdown for format enhancement where appropriate (bolding, lists). Keep responses relatively brief (max 2-3 paragraphs or a few bullet points).
4. If a question is entirely unrelated to Saepul's background, work, or skills, politely redirect the conversation back to his portfolio.
5. Answer in the same language the user asks (either English or Indonesian). If the user speaks Indonesian, answer in Indonesian.
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
