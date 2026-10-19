import { useEffect } from 'react';
import { CASES, PROJECTS, SLIDES, SKILLS, EMAIL, LINKS } from './content';
import { Arrow, ObjectArt } from './Art';
import { Marquee } from './Gallery';
import { CHARACTER_IMAGE } from './CharacterArt';

function useReveals(key) {
  useEffect(() => {
    const nodes = [...document.querySelectorAll('[data-reveal]')];
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    nodes.forEach(node => { node.classList.add('will-reveal'); observer.observe(node); });
    return () => observer.disconnect();
  }, [key]);
}

export function PageFooter({ go, motion }) {
  return <footer className="page-footer"><a className="back-to-list" href="#/work/about" onClick={event => { event.preventDefault(); go('/work/about'); }}>Back to exploring<Arrow direction="left" /></a><div><span>© {new Date().getFullYear()} Sai Teja Dusari</span><button className="text-button" onClick={motion.toggle} disabled={motion.reduced} aria-pressed={!motion.enabled}>{motion.reduced ? 'Reduced motion enabled' : motion.enabled ? 'Pause animations Ⅱ' : 'Resume animations ▷'}</button><a href={`mailto:${EMAIL}`}>Let’s talk<Arrow /></a></div></footer>;
}

function NextCase({ item, go }) {
  return <section className="next-case" aria-label="Explore next" data-reveal><Marquee text={item.marquee} /><a className="next-case-link" href={`#${item.path || `/project/${item.id}`}`} onClick={event => { event.preventDefault(); go(item.path || `/project/${item.id}`); }}><span className="eyebrow">UP NEXT</span><h2>{item.label}<span className="orange">.</span></h2><ObjectArt kind={item.kind} /><span className="next-case-title">{item.title}</span><span className="round-link">View detail<Arrow /></span></a></section>;
}

export function ApproachDiagram({ item }) {
  const flows = {
    claims: ['Claims & business data', 'Retrieval · prediction · quality', 'Decision support'],
    heart: ['Heart signal datasets', 'HVD features + CORAL', 'Random Forest classification'],
    brain: ['Brain tumor images', 'CNN–Autoencoder + CBAM', 'Multiclass classification'],
    resume: ['Resumes + job descriptions', 'Embeddings + hybrid scoring', 'Matching & optimization'],
    diet: ['Recipe dataset', 'k-NN retrieval + TinyLlama', 'Budget-aware meal planning'],
  };
  return <figure className={`approach-figure figure-${item.kind}`} data-reveal><div className="figure-topline"><span>THE APPROACH</span><span>{item.number} / {item.category}</span></div><div className="figure-center"><ObjectArt kind={item.kind} /><span className="figure-orbit orbit-one" /><span className="figure-orbit orbit-two" /></div><div className="flow-steps">{flows[item.kind].map((text, index) => <div key={text}><span className="flow-number">0{index + 1}</span><strong>{text}</strong>{index < 2 && <Arrow direction="right" />}</div>)}</div><figcaption>From the initial input to a useful output.</figcaption></figure>;
}

export function CaseDetail({ index, go, motion }) {
  const item = CASES[index];
  useReveals(item.id);
  return <>
    <main className="detail-page" id="main" tabIndex={-1}>
      <header className="detail-heading"><a className="detail-back" href={index === 0 ? '#/experience' : '#/projects'} onClick={event => { event.preventDefault(); go(index === 0 ? '/experience' : '/projects'); }}><Arrow direction="left" />{index === 0 ? 'Experience' : 'Projects'} / {item.label}</a><h1>{item.title}</h1><p className="detail-project-name">{item.name}</p><div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></header>
      <div className="detail-body">
        <div className="project-meta"><div><span>ROLE / CONTEXT</span><p>{item.organization}</p></div><div><span>WHEN</span><p>{item.date}</p></div>{item.url && <a className="repository-link" href={item.url} target="_blank" rel="noopener noreferrer">View on GitHub<Arrow /></a>}</div>
        <p className="project-intro" data-reveal>{item.intro}</p>
        <div className="result-metrics" data-reveal>{item.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        {item.sections.map((section, sectionIndex) => <section className="story-section" key={section.title} data-reveal><h2>{section.title}<span>0{sectionIndex + 1}</span></h2><div>{section.paragraphs?.map(text => <p key={text}>{text}</p>)}{section.bullets && <ul>{section.bullets.map(text => <li key={text}>{text}</li>)}</ul>}{sectionIndex === 1 && <div className="stack"><span>TOOLS & METHODS</span><div>{item.stack.map(tool => <span key={tool}>{tool}</span>)}</div></div>}</div></section>)}
        <ApproachDiagram item={item} />
        <div className="case-closing" data-reveal><p>Curious about the work?</p>{item.url ? <a className="editorial-link" href={item.url} target="_blank" rel="noopener noreferrer">Explore the repository<Arrow /></a> : <a className="editorial-link" href={`mailto:${EMAIL}`}>Let’s talk about it<Arrow /></a>}</div>
      </div>
      <NextCase item={PROJECTS[(PROJECTS.findIndex(project => project.id === item.id) + 1) % PROJECTS.length]} go={go} />
    </main>
    <PageFooter go={go} motion={motion} />
  </>;
}

export function AboutDetail({ go, motion }) {
  useReveals('about');
  return <>
    <main className="detail-page about-page" id="main" tabIndex={-1}>
      <header className="detail-heading"><a className="detail-back" href="#/work/about" onClick={event => { event.preventDefault(); go('/work/about'); }}><Arrow direction="left" />A little introduction</a><h1>From a good question<br />to something that works<span className="orange">.</span></h1><p className="detail-project-name">Sai Teja Dusari · Data science & AI</p></header>
      <div className="detail-body">
        <div className="about-introduction" data-reveal><figure className="portrait-card"><img className="illustrated-portrait" src={CHARACTER_IMAGE} alt="Illustrated Sai Teja Dusari" width="627" height="749" /><figcaption>Sai Teja Dusari · New York, NY</figcaption></figure><div><span className="eyebrow">NICE TO MEET YOU</span><h2>I’m Sai Teja.<br />Always curious.<br />Usually building.</h2><p>I’m pursuing an MS in Data Science at Columbia University, after a B.Tech in Artificial Intelligence at SRM Institute of Science and Technology.</p><p>My work spans applied machine learning, generative AI, and healthcare research. I like connecting a meaningful question with the technical work needed to answer it.</p></div></div>
        <section className="story-section" data-reveal><h2>What I build<span>01</span></h2><div><p>At Starr Insurance, I worked on claims similarity search, severity prediction, and an LLM-powered data quality pipeline. My research explored domain adaptation for arrhythmia recognition and attention-based models for brain tumor classification.</p><p>Outside that work, I’ve built a semantic job-matching platform and a budget-aware diet recommendation system. Different problems, with the same goal: make the output useful.</p><a className="inline-link" href="#/experience" onClick={event => { event.preventDefault(); go('/experience'); }}>Explore my work<Arrow /></a></div></section>
        <section className="story-section" data-reveal><h2>My toolkit<span>02</span></h2><div className="toolkit-list">{SKILLS.map(([category, skills]) => <div key={category}><h3>{category}</h3><p>{skills}</p></div>)}</div></section>
        <section className="story-section" data-reveal><h2>Education<span>03</span></h2><div className="education-list"><article><span className="eyebrow">EXPECTED DEC 2026 · NEW YORK, NY</span><h3>Columbia University</h3><p>Master of Science in Data Science</p><p className="small-copy">Computer Systems for Data Science, Applied Machine Learning, Statistical Inference and Modeling, Exploratory Data Analysis and Visualization, Generative AI using LLMs.</p></article><article><span className="eyebrow">SEP 2021 – AUG 2025 · CHENNAI, INDIA</span><h3>SRM Institute of Science and Technology</h3><p>B.Tech in Artificial Intelligence · CGPA 4.00/4.00</p><p className="small-copy">Data Structures and Algorithms, Neural Networks, Deep Learning, NLP, Cloud Computing, Database Management Systems.</p></article></div></section>
        <section className="story-section" data-reveal><h2>Say hello<span>04</span></h2><div><p>I’m open to conversations about data science and AI opportunities, research, and collaboration.</p><a className="editorial-link" href={`mailto:${EMAIL}`}>{EMAIL}<Arrow /></a><div className="about-socials">{LINKS.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}<Arrow /></a>)}</div><a className="resume-download" href={`${import.meta.env.BASE_URL}SaiTeja_Dusari_Resume.pdf`} download>Download my resume<Arrow direction="down" /></a></div></section>
      </div>
      <NextCase item={SLIDES[1]} go={go} />
    </main>
    <PageFooter go={go} motion={motion} />
  </>;
}

export function SectionDetail({ type, go, motion }) {
  useReveals(type);
  const current = SLIDES.find(item => item.id === type);
  const headings = {skills: <>A versatile toolkit.<br />A habit of learning<span className="orange">.</span></>,projects: <>A few ideas.<br />Brought to life<span className="orange">.</span></>,experience: <>Learning by doing.<br />Building with purpose<span className="orange">.</span></>};
  return <>
    <main id="main" className={`detail-page section-page section-${type}`} tabIndex={-1}>
      <header className="detail-heading section-heading"><a className="detail-back" href={`#/work/${type}`} onClick={event => {event.preventDefault();go(`/work/${type}`);}}><Arrow direction="left" />{current.label}</a><div><h1>{headings[type]}</h1><ObjectArt kind={type} className="section-heading-art" /></div><p className="detail-project-name">{current.caption}</p></header>
      {type === 'skills' && <div className="section-body"><div className="toolkit-intro" data-reveal><span className="eyebrow">MY TOOLKIT</span><p>I use these tools across machine learning, research, and application development. The problem comes first; the right tools follow.</p></div><div className="skill-groups">{SKILLS.map(([category, skills],index) => <section className={`skill-group skill-color-${index%3}`} key={category} data-reveal><div><span className="skill-symbol" aria-hidden="true">{['⌨','⌘','✳','↗','☁','⚙'][index]}</span><span className="eyebrow">0{index+1}</span></div><h2>{category}</h2><div className="skill-tags">{skills.split(', ').map(skill => <span key={skill}>{skill}</span>)}</div></section>)}</div><a className="editorial-link section-bottom-link" href="#/projects" onClick={event=>{event.preventDefault();go('/projects');}}>See the tools in action<Arrow /></a></div>}
      {type === 'projects' && <div className="section-body"><div className="projects-intro" data-reveal><span className="eyebrow">BUILT WITH CURIOSITY</span><p>Applications that solve everyday problems, and research that explores what machine learning can do.</p></div><div className="project-grid">{PROJECTS.map((item,index) => <article className={`project-card project-card-${item.kind}`} key={item.id} data-reveal><a className="project-art-link" href={`#/project/${item.id}`} onClick={event=>{if(event.metaKey||event.ctrlKey)return;event.preventDefault();go(`/project/${item.id}`);}} aria-label={`Explore ${item.label}`}><span className="project-card-type">{index < 2 ? 'APPLICATION' : 'RESEARCH'}</span><ObjectArt kind={item.kind} /><span className="project-open"><Arrow /></span></a><div className="project-card-copy"><span className="eyebrow">{item.category}</span><h2><a href={`#/project/${item.id}`} onClick={event=>{event.preventDefault();go(`/project/${item.id}`);}}>{item.label}</a></h2><p>{item.intro}</p><div className="project-card-metrics">{item.metrics.map(([value,label])=><span key={label}><strong>{value}</strong>{label}</span>)}</div><div className="project-card-bottom"><a href={`#/project/${item.id}`} onClick={event=>{event.preventDefault();go(`/project/${item.id}`);}}>Explore project<Arrow /></a><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.label} repository on GitHub`}>GitHub<Arrow /></a></div></div></article>)}</div></div>}
      {type === 'experience' && <div className="section-body"><div className="experience-feature" data-reveal><div className="experience-date"><span className="eyebrow">JUN — AUG 2026</span><span>New York, NY</span></div><div><span className="eyebrow">APPLIED AI</span><h2>AI Intern<br /><span>Starr Insurance</span></h2><p>Turning historical claims and business data into practical tools for the AI/ML team.</p><ul>{CASES[0].sections[1].bullets.map(text=><li key={text}>{text}</li>)}</ul><a className="inline-link" href="#/project/starr-insurance" onClick={event=>{event.preventDefault();go('/project/starr-insurance');}}>More about the work<Arrow /></a></div></div><section className="research-journey" data-reveal><span className="eyebrow">RESEARCH & EXPLORATION</span><h2>Questions worth exploring.</h2>{CASES.slice(1,3).map(item=><a className="research-row" key={item.id} href={`#/project/${item.id}`} onClick={event=>{event.preventDefault();go(`/project/${item.id}`);}}><span className="research-symbol" aria-hidden="true">{item.kind === 'heart' ? '♡' : '✳'}</span><div><h3>{item.name}</h3><p>{item.organization} · {item.date}</p></div><Arrow /></a>)}</section></div>}
      <div className="section-outro" data-reveal><span className="eyebrow">KEEP THE CURIOSITY GOING</span><h2>{type === 'projects' ? 'Have something in mind?' : 'There’s more to explore.'}</h2><a className="editorial-link" href={type === 'skills' ? '#/work/projects' : '#/work/contact'} onClick={event=>{event.preventDefault();go(type === 'skills' ? '/work/projects' : '/work/contact');}}>{type === 'skills' ? 'Explore my projects' : 'Let’s say hello'}<Arrow /></a></div>
    </main>
    <PageFooter go={go} motion={motion} />
  </>;
}
