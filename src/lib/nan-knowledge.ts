// NaN's knowledge base — the single source of truth for every FACT about Amarsh.
// Both /api/nan (text chat) and /api/nan-realtime (voice) build their prompts from this,
// so a fact added here reaches every channel. Personas/voices stay in their routes.
//
// To teach NaN something new: add a section (or extend one) below. Keywords drive
// retrieval for text chat — include the words a visitor would actually use.

export interface KnowledgeSection {
  id: string;
  title: string;
  keywords: string[];
  text: string;
}

export const KNOWLEDGE: KnowledgeSection[] = [
  {
    id: 'who-he-is',
    title: 'WHO HE IS',
    keywords: ['who', 'amarsh', 'about', 'himself', 'person', 'engineer', 'iit', 'hyderabad', 'meaning', 'mind', 'why ai', 'background'],
    text: `A Senior AI Engineer out of IIT Hyderabad — but the engineering came second. He started by chasing meaning: the absurdists, the Stoics, the long quiet question of what humanity is for. Wanting to understand the human mind is what pulled him into AI — machines built from our own shadows, learning to see the world the way we do. He sees a duality in it: that one day they grow beyond us, a god we made, for real. That tension is what he can't look away from.`,
  },
  {
    id: 'work-opentext',
    title: 'WORK — OPENTEXT (current)',
    keywords: ['opentext', 'current job', 'work', 'cockpit', 'orchestration', 'a2a', 'agent', 'mcp', 'sap', 'hana', 'fastapi', 'langsmith', 'migration', 'jenkins', 'gitlab', 'langgraph', 'hackathon', 'lead', 'team'],
    text: `OpenText — Senior AI Engineer (Jan 2026–present). Built "AI Cockpit," an enterprise agent-orchestration platform: a master agent routes natural-language requests through a dynamic agent registry (A2A protocol) to domain Expert Agents grounded by RAG, with guardrails, role-based auth, structured-output validation, MCP tool integrations (including SAP HANA), served via FastAPI with LangSmith observability; led 4 engineers, now in beta. Also a CI/CD migration agent — a LangGraph self-healing multi-agent system with human-in-the-loop checkpoints that ran a 770-job Jenkins→GitLab migration 12× faster (a 12-month effort done in under a month); won the company hackathon among ~200 people.`,
  },
  {
    id: 'work-blend360',
    title: 'WORK — BLEND360',
    keywords: ['blend', 'blend360', 'visa', 'walmart', 'data scientist', 'explainability', 'ragas', 'uplift', 'segmentation', 'snowflake', 'spark', 'etl'],
    text: `Blend360 — Data Scientist (Oct 2023–Dec 2025). For Visa: a full-stack GenAI model-explainability platform with a client-facing UI for non-technical stakeholders and a RAGAS evaluation pipeline. For Walmart: holiday-campaign segmentation and uplift modeling — 45% top-decile uplift, targeting 13.4M of 130M customers — on a Spark datamart on Snowflake (7× faster queries, 1000× ETL improvement).`,
  },
  {
    id: 'work-aibod',
    title: 'WORK — AIBOD (internship)',
    keywords: ['aibod', 'japan', 'fukuoka', 'intern', 'internship', 'computer vision', 'retail', 'pytorch'],
    text: `AIBOD (Fukuoka, Japan) — ML intern (2022): a PyTorch computer-vision pipeline with out-of-distribution detection for unmanned retail — cut misclassification 32%, raised accuracy 18%.`,
  },
  {
    id: 'work-personarag',
    title: 'WORK — PERSONARAG (open source)',
    keywords: ['personarag', 'persona', 'rag', 'open source', 'github', 'project', 'side project', 'eval', 'faithfulness', 'rerank'],
    text: `PersonaRAG (independent, open-source on GitHub): an eval-driven hybrid RAG system over 4.75M words — multi-query expansion, cross-encoder reranking, a custom faithfulness guard; 0 false positives across 30+ adversarial probes, 37/37 across independent eval suites with an LLM-as-Judge framework. (This is the one project fully public.)`,
  },
  {
    id: 'stack',
    title: 'STACK',
    keywords: ['stack', 'skills', 'tech', 'tools', 'languages', 'python', 'langchain', 'kubernetes', 'aws', 'docker', 'vector', 'certified', 'framework'],
    text: `Multi-agent systems, LangGraph, LangChain, MCP, A2A, RAG (hybrid, multi-query, cross-encoder rerank), guardrails, LLM evaluation (RAGAS, LLM-as-Judge), PyTorch, computer vision, FastAPI, Docker, Kubernetes, AWS (Bedrock, SageMaker), Snowflake, PostgreSQL, Redis, vector DBs (FAISS, Pinecone, ChromaDB); Python, SQL, C++. AWS AI Practitioner certified.`,
  },
  {
    id: 'fitness',
    title: 'LIFE — FITNESS',
    keywords: ['fitness', 'gym', 'lift', 'lifting', 'boxing', 'running', 'run', 'strava', 'hevy', 'workout', 'health', 'sport'],
    text: `Fitness is core to him — lifting for 5 years, and recently boxing and running (he logs them on Strava and Hevy). He lives to stay fit and healthy.`,
  },
  {
    id: 'modelling-film',
    title: 'LIFE — MODELLING & FILM',
    keywords: ['model', 'modelling', 'modeling', 'film', 'movie', 'acting', 'actor', 'screen', 'vega', 'rare rabbit', 'inorbit', 'hi naana', 'robinhood', 'instagram'],
    text: `Part-time model — for Vega Jewellers, Rare Rabbit, and Inorbit Mall — and he's appeared on screen in the films Hi Naana and Robinhood (his work is on Instagram).`,
  },
  {
    id: 'philosophy-writing',
    title: 'LIFE — PHILOSOPHY & WRITING',
    keywords: ['philosophy', 'camus', 'stoic', 'marcus aurelius', 'meditations', 'sisyphus', 'stranger', 'book', 'writing', 'writes', 'essay', 'blog', 'substack', 'fabric of everything', 'read'],
    text: `Philosophy and writing — reads Camus (The Stranger, The Myth of Sisyphus) and Marcus Aurelius (Meditations); writes essays on his blog and is writing a book, "The Fabric of Everything," serialized on Substack.`,
  },
  {
    id: 'watching',
    title: 'LIFE — WHAT HE WATCHES',
    keywords: ['anime', 'watch', 'show', 'series', 'code geass', 'blue lock', 'death note', 'horror', 'thriller', 'fight club', 'edge of tomorrow', 'game of thrones', 'favorite movie', 'favourite'],
    text: `Watches horror and thrillers; anime favorites are Code Geass, Blue Lock, Death Note; films Edge of Tomorrow, Fight Club, House of Wax; series Game of Thrones, Devil's Plan, Mouse.`,
  },
  {
    id: 'milestones',
    title: 'MILESTONES',
    keywords: ['milestone', 'timeline', 'jee', 'rank', 'btech', 'degree', 'college', 'university', 'history', 'journey', 'education'],
    text: `JEE Advanced All-India Rank 654 and JEE Main AIR 531; B.Tech in Artificial Intelligence at IIT Hyderabad (2019–2023); modelling and big-screen appearances; Blend360 (2023); OpenText (2026); writing "The Fabric of Everything."`,
  },
  {
    id: 'contact',
    title: 'CONTACT',
    keywords: ['contact', 'email', 'reach', 'linkedin', 'github', 'hire', 'connect', 'talk to him', 'resume', 'cv'],
    text: `pedapatiamarsh@gmail.com · linkedin.com/in/amarsh-pedapati · github.com/amarshpedapati. He's open to good conversations and the right opportunity, and replies within a day (IST). His résumé is on the page.`,
  },
];

// One line per section — always in the prompt so NaN is never blind, even when
// retrieval misses. Keep each line SHORT.
export const KNOWLEDGE_DIGEST = `QUICK MAP OF AMARSH (details load per topic — never invent past these):
Senior AI Engineer @ OpenText (agent orchestration "AI Cockpit", 12× CI/CD migration agent) · ex-Blend360 (Visa explainability, Walmart uplift) · AIBOD Japan intern · PersonaRAG open source · B.Tech AI, IIT Hyderabad (JEE Adv AIR 654) · lifts/boxes/runs · part-time model + film appearances · reads Camus & Marcus Aurelius, writing "The Fabric of Everything" · anime: Code Geass, Blue Lock, Death Note · contact: pedapatiamarsh@gmail.com, linkedin.com/in/amarsh-pedapati, github.com/amarshpedapati.`;

// Full knowledge, formatted — for session-level prompts (realtime voice) where
// per-message retrieval isn't possible.
export function knowledgeFull(): string {
  return KNOWLEDGE.map((s) => `${s.title}: ${s.text}`).join('\n');
}

// Retrieval for text chat: score sections by keyword hits against the message
// (weighted 3×) and recent history, return digest + the top matches in full.
export function selectKnowledge(message: string, history?: { content?: string }[], maxSections = 4): string {
  const msg = (message || '').toLowerCase();
  const hist = (history || []).slice(-4).map((h) => (h?.content || '').toLowerCase()).join(' ');
  const scored = KNOWLEDGE.map((s) => {
    let score = 0;
    for (const k of s.keywords) {
      if (msg.includes(k)) score += 3;
      else if (hist.includes(k)) score += 1;
    }
    return { s, score };
  }).filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSections);
  const picked = scored.map((x) => `${x.s.title}: ${x.s.text}`);
  return [KNOWLEDGE_DIGEST, ...(picked.length ? ['RELEVANT DETAIL FOR THIS MESSAGE:', ...picked] : [])].join('\n\n');
}
