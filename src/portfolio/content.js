import { EMAIL, EXP, RES, PRJ, SKILLS, LINKS } from '../data.js';

export { EMAIL, SKILLS, LINKS };

const internship = EXP[0], arrhythmia = RES[0], brain = RES[1], resume = PRJ[0], diet = PRJ[1];

export const CASES = [
  {
    id: 'starr-insurance', number: '01', kind: 'claims', label: 'Experience',
    title: 'Making complex claims a little clearer.',
    marquee: 'Turning unstructured data into useful intelligence.',
    category: 'Applied machine learning', tags: ['Machine learning', 'GenAI', 'Insurance'],
    name: 'AI at Starr Insurance', date: internship.d, organization: internship.o,
    intro: 'From finding similar claims to predicting severity and improving data quality: practical AI built around real business questions.',
    metrics: [['90%', 'Claim severity model accuracy'], ['3', 'Applied AI workstreams']],
    sections: [
      { title: 'The context', paragraphs: ['At Starr Insurance in New York, I worked on AI tools that make historical claims and business data easier to use. The work spanned retrieval, predictive modeling, and automated data quality.'] },
      { title: 'The approach', bullets: internship.b },
      { title: 'What I took away', paragraphs: ['Model development was only part of the work. Weekly presentations and stakeholder feedback shaped each iteration, connecting technical decisions to how the tools would be used.'] },
    ],
    stack: ['Python', 'TF-IDF', 'Embeddings', 'Gaussian models', 'Meta LLaMA'],
  },
  {
    id: 'arrhythmia', number: '02', kind: 'heart', label: 'Arrhythmia research',
    title: 'Finding the signal in every heartbeat.',
    marquee: 'Better signals. Better generalization. Better recognition.',
    category: 'Healthcare research', tags: ['Signal processing', 'Domain adaptation'],
    name: arrhythmia.t, date: arrhythmia.d, organization: 'Research Assistant · SRMIST',
    intro: 'A domain-adapted approach to multi-class arrhythmia recognition, combining signal decomposition with a carefully tuned Random Forest.',
    metrics: [['98%', 'Test accuracy'], ['3', 'Research team members']],
    sections: [
      { title: 'The question', paragraphs: ['How can an arrhythmia classifier capture useful signal features while handling differences between datasets? This project combined Hilbert Vibration Decomposition with domain adaptation to address that question.'] },
      { title: 'The approach', bullets: arrhythmia.b },
      { title: 'The outcome', paragraphs: ['The optimized, domain-adapted Random Forest achieved 98% test accuracy and improved cross-domain performance. I led the three-person research team, working with faculty to define scope, milestones, and reviews.'] },
    ], stack: arrhythmia.c, url: arrhythmia.url,
  },
  {
    id: 'brain-tumor', number: '03', kind: 'brain', label: 'Brain tumor research',
    title: 'Helping a model focus on what matters.',
    marquee: 'Attention, representation, and a clearer picture.',
    category: 'Deep learning research', tags: ['Computer vision', 'Deep learning', 'CBAM'],
    name: brain.t, date: brain.d, organization: 'Healthcare image classification research',
    intro: 'An attention-based hybrid CNN–Autoencoder designed to extract more useful representations from brain tumor images.',
    metrics: [['95%', 'Test accuracy'], ['1,400', 'Brain tumor images']],
    sections: [
      { title: 'The question', paragraphs: ['This project explored how a hybrid CNN–Autoencoder with attention could capture spatial features for multiclass brain tumor image classification.'] },
      { title: 'The approach', bullets: brain.b },
      { title: 'The outcome', paragraphs: ['The model reached 95% test accuracy on 1,400 images. I helped lead the project, guided implementation, mentored teammates, and co-authored and presented the conference paper.'] },
    ], stack: brain.c, url: brain.url,
  },
  {
    id: 'resumefit', number: '04', kind: 'resume', label: 'ResumeFit',
    title: 'A better fit for the next opportunity.',
    marquee: 'Less searching. More relevant opportunities.',
    category: 'Applied natural language processing', tags: ['Semantic search', 'NLP', 'FastAPI'],
    name: resume.t, date: resume.d, organization: 'Academic project',
    intro: 'A semantic job-matching platform that brings resume analysis, optimization, and application tracking into one workflow.',
    metrics: [['80%', 'Reduction in application time'], ['< 2s', 'Analysis per job']],
    sections: [
      { title: 'The idea', paragraphs: ['Job descriptions and resumes do not always use the same words for the same skills. ResumeFit uses sentence-transformer embeddings and hybrid scoring to match opportunities by meaning, with supporting tools for resume optimization and application tracking.'] },
      { title: 'How it works', bullets: resume.b },
      { title: 'The result', paragraphs: ['The platform supported 100+ tracked applications across 30+ job descriptions. Authentication, profiles, and automated workflows made it usable as a multi-user system.'] },
    ], stack: resume.c, url: resume.url,
  },
  {
    id: 'smart-diet', number: '05', kind: 'diet', label: 'Smart Diet',
    title: 'Good food. Smarter recommendations.',
    marquee: 'A little machine learning, a lot of possibilities.',
    category: 'Recommendation systems & LLMs', tags: ['Recommendations', 'LLMs', 'Microservices'],
    name: diet.t, date: diet.d, organization: 'Academic project',
    intro: 'A nutrition recommendation platform that combines recipe retrieval with budget-aware meal planning and a lightweight language model.',
    metrics: [['500K+', 'Recipes in the dataset'], ['156ms', 'Query latency']],
    sections: [
      { title: 'The idea', paragraphs: ['This project connects fast recipe recommendations with practical meal planning. A k-NN retrieval engine finds recipes using cosine similarity, while TinyLlama helps generate meal plans, shopping lists, and cost estimates.'] },
      { title: 'How it works', bullets: diet.b },
      { title: 'The result', paragraphs: ['The recommendation engine achieved 95% budget accuracy. FastAPI and Streamlit services were packaged with Docker and deployed on Hugging Face Spaces, with three modules connected through a REST API.'] },
    ], stack: diet.c, url: diet.url,
  },
];

export const PROJECTS = [CASES[3], CASES[4], CASES[1], CASES[2]];
export const SLIDES = [
  { id: 'about', label: 'About', title: 'Curiosity is where it starts.', marquee: 'A little about the human behind the work.', category: 'Columbia University · Data science & AI', kind: 'about', path: '/about', action: 'Meet Sai Teja', caption: 'A builder, a researcher, and an always-curious mind.' },
  { id: 'skills', label: 'Skills', title: 'The tools behind the ideas.', marquee: 'Think. Experiment. Learn. Build. Repeat.', category: 'Python · Machine learning · GenAI · Cloud', kind: 'skills', path: '/skills', action: 'Open my toolkit', caption: 'From the first notebook to a working application.' },
  { id: 'projects', label: 'Projects', title: 'Good questions, working answers.', marquee: 'Small experiments. Useful possibilities.', category: 'Applications · Healthcare research · Intelligent systems', kind: 'projects', path: '/projects', action: 'Explore projects', caption: 'A few things I’ve built, tested, and learned from.' },
  { id: 'experience', label: 'Experience', title: 'Learning by building in the real world.', marquee: 'From data to decisions, with people in the loop.', category: 'Starr Insurance · Applied AI · Research', kind: 'experience', path: '/experience', action: 'Follow the journey', caption: 'Putting machine learning to work on meaningful problems.' },
  { id: 'contact', label: 'Contact', title: 'Good things start with a little hello.', marquee: 'Have a question, an idea, or an opportunity?', category: 'Let’s make something useful.', kind: 'contact' },
];

export function readRoute(hash) {
  let path;
  try { path = decodeURIComponent((hash || '#/').slice(1)).replace(/\/$/, '') || '/'; }
  catch { return { page: 'missing', key: hash }; }
  if (path === '/') return { page: 'home', key: '/' };
  if (path === '/about') return { page: 'about', key: path };
  if (['/skills', '/projects', '/experience'].includes(path)) return { page: 'section', section: path.slice(1), key: path };
  if (path === '/contact') return { page: 'work', slide: 4, key: '/work/contact' };
  if (path === '/work') return { page: 'work', slide: 0, key: '/work/about' };
  if (path.startsWith('/work/')) {
    const slide = SLIDES.findIndex(item => item.id === path.slice(6));
    if (slide >= 0) return { page: 'work', slide, key: path };
    const index = CASES.findIndex(item => item.id === path.slice(6));
    if (index >= 0) return { page: 'case', index, key: `/project/${CASES[index].id}` };
  }
  if (path.startsWith('/project/') || path.startsWith('/case/')) {
    const id = path.split('/')[2];
    const index = CASES.findIndex(item => item.id === id);
    if (index >= 0) return { page: 'case', index, key: `/project/${id}` };
  }
  return { page: 'missing', key: path };
}

export function slideAfter(index, direction) {
  return Math.max(0, Math.min(SLIDES.length - 1, index + direction));
}
