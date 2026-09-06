import React, { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const GITHUB_USERNAME = 'sulaiman-nsl-founder';
const FEATURED_TOPIC = 'portfolio-featured';
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"%3E%3Crect width="900" height="600" fill="%23171717"/%3E%3Cpath d="M80 460h740M220 460V180h460v280M300 180v-70h300v70M390 250h120v90H390z" fill="none" stroke="%23fff" stroke-width="4"/%3E%3Ctext x="80" y="530" fill="%23fff" font-family="Arial" font-size="24" letter-spacing="4"%3EENGINEERING PROJECT%3C/text%3E%3C/svg%3E';

const capabilities = [
  ['Hardware', 'Schematic Design', 'PCB Design', 'Power Electronics', 'Sensors', 'Hardware Bring-up'],
  ['Embedded', 'ESP32', 'STM32', 'Embedded C/C++', 'FreeRTOS', 'Peripheral Integration'],
  ['Communication', 'UART', 'I2C', 'SPI', 'CAN', 'RS485 · MQTT · BLE'],
  ['Product', 'CAD', '3D Printing', 'Enclosures', 'Rapid Prototyping', 'DFM · DFT'],
  ['Debugging', 'Oscilloscope', 'Logic Analyzer', 'Multimeter', 'Root-Cause Analysis', 'Validation'],
];

function readableTopic(topic) {
  return topic.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function parseReadme(readme) {
  if (!readme) return [];
  return readme
    .split(/^##?\s+/m)
    .map((section) => {
      const [heading, ...body] = section.split('\n');
      return { heading: heading?.replace(/[#*_]/g, '').trim(), body: body.join('\n').trim() };
    })
    .filter((section) => section.heading && section.body)
    .slice(0, 10);
}

async function githubJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
  return response.json();
}

async function loadProjects() {
  const repositories = await githubJson(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
  const publicRepos = repositories.filter((repo) => !repo.fork && !repo.archived);
  return Promise.all(publicRepos.map(async (repo) => {
    const topics = repo.topics || [];
    let readme = '';
    let gallery = [];
    try {
      const [readmeResponse, contents] = await Promise.all([
        githubJson(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`),
        githubJson(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/portfolio`),
      ]);
      readme = readmeResponse.content ? atob(readmeResponse.content.replace(/\n/g, '')) : '';
      gallery = Array.isArray(contents)
        ? contents.filter((item) => item.type === 'file' && /\.(jpe?g|png|webp|gif)$/i.test(item.name)).map((item) => item.download_url)
        : [];
    } catch {
      // Individual repository enrichment is optional; the repository still renders.
    }
    const heroImage = gallery.find((image) => /hero\.(jpe?g|png|webp|gif)$/i.test(image)) || gallery[0] || FALLBACK_IMAGE;
    return {
      id: repo.id,
      slug: repo.name.toLowerCase(),
      title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
      description: repo.description || 'A hardware and product development project.',
      topics: topics.filter((topic) => topic !== FEATURED_TOPIC),
      featured: topics.includes(FEATURED_TOPIC),
      updatedAt: repo.updated_at,
      githubUrl: repo.html_url,
      heroImage,
      gallery: gallery.length ? gallery : [heroImage],
      readme,
      sections: parseReadme(readme),
    };
  }));
}

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  useEffect(() => {
    const update = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}

function Header() {
  return <header className="site-header">
    <a className="wordmark" href="#/" aria-label="Sulaiman home">SULAIMAN<span className="wordmark-sub">Hardware & Product Development Engineer</span></a>
    <nav aria-label="Main navigation">
      <a href="#/work">Work</a>
      <a href="#/about">About</a>
      <a href="#/contact">Contact</a>
    </nav>
  </header>;
}

function SectionHeading({ eyebrow, title }) {
  return <div className="section-heading"><span>{eyebrow}</span><h2>{title}</h2></div>;
}

function ProjectTile({ project }) {
  return <a className="project-tile" href={`#/work/${project.slug}`}>
    <div className="project-image-wrap"><img src={project.heroImage} alt={`${project.title} project`} loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} /></div>
    <div className="project-tile-copy"><div><span className="project-number">{String(project.id).slice(-2)}</span><h3>{project.title}</h3><p>{project.description}</p></div><span className="arrow" aria-hidden="true">↗</span></div>
  </a>;
}

function ProjectGallery({ projects }) {
  if (!projects.length) return <div className="empty-state">No public projects are ready to display yet. Add a repository with a README and a <code>portfolio/hero.jpg</code> image to begin.</div>;
  return <div className="masonry-grid">{projects.map((project) => <ProjectTile key={project.id} project={project} />)}</div>;
}

function Home({ projects }) {
  const featured = projects.filter((project) => project.featured).slice(0, 6);
  const visible = featured.length ? featured : projects.slice(0, 6);
  return <>
    <section className="hero page-section" id="top">
      <p className="eyebrow">01 / Engineering practice</p>
      <h1>Hardware &amp; Product<br />Development Engineer</h1>
      <div className="hero-bottom"><p className="hero-statement">I design, prototype, debug and build connected physical products.</p><div className="hero-actions"><a className="button button-dark" href="#/work">View work <span>↗</span></a><a className="text-link" href="#/about">About me <span>↗</span></a></div></div>
    </section>
    <section className="page-section work-preview" id="work"><SectionHeading eyebrow="02 / Selected work" title="Built in the real world." /><ProjectGallery projects={visible} /><a className="text-link section-link" href="#/work">View all work <span>↗</span></a></section>
    <section className="dark-section"><div className="page-section"><SectionHeading eyebrow="03 / Capabilities" title="From first circuit to field test." /><div className="capability-grid">{capabilities.map(([title, ...items]) => <div className="capability" key={title}><h3>{title}</h3>{items.map((item) => <p key={item}>{item}</p>)}</div>)}</div></div></section>
    <About /><Contact />
  </>;
}

function About() {
  return <section className="page-section split-section" id="about"><SectionHeading eyebrow="04 / About" title="Engineering is a loop." /><div className="split-copy"><p className="large-copy">I work across electronics, embedded systems and physical product development, taking ideas from early prototypes through PCB design, firmware, mechanical integration, debugging and validation.</p><p>Every iteration is an opportunity to measure what happened, understand why, and build the next version with more confidence.</p></div></section>;
}

function Contact() {
  return <section className="page-section contact-section" id="contact"><SectionHeading eyebrow="05 / Contact" title="Have a hardware problem, product idea or engineering project?" /><div className="contact-row"><p>Let’s build it.</p><a className="button button-dark" href="mailto:hello@example.com">Email me <span>↗</span></a></div></section>;
}

function Work({ projects }) {
  return <main className="page-section inner-page"><SectionHeading eyebrow="Work / All projects" title="A record of things built, tested and learned." /><ProjectGallery projects={projects} /></main>;
}

function ProjectDetail({ project }) {
  if (!project) return <main className="page-section inner-page"><p className="eyebrow">404 / Not found</p><h1>Project unavailable.</h1><a className="text-link" href="#/work">Return to work <span>↗</span></a></main>;
  return <main className="project-detail"><div className="page-section"><a className="back-link" href="#/work">← Back to work</a><div className="detail-intro"><p className="eyebrow">Project / {project.topics[0] ? readableTopic(project.topics[0]) : 'Engineering'}</p><h1>{project.title}</h1><p className="detail-summary">{project.description}</p><a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">View on GitHub <span>↗</span></a></div><img className="detail-hero" src={project.heroImage} alt={`${project.title} hero`} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} /><div className="detail-layout"><aside><p className="eyebrow">Topics</p><div className="topic-list">{project.topics.map((topic) => <span key={topic}>{readableTopic(topic)}</span>)}</div></aside><article><h2>Engineering notes</h2>{project.sections.length ? project.sections.map((section) => <section className="readme-section" key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>) : <p>This project is ready for a detailed engineering README. Document the problem, requirements, design decisions, debugging process, testing and results in the repository to build out this case study.</p>}</article></div></div></main>;
}

function App() {
  const route = useHashRoute();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  useEffect(() => { loadProjects().then((items) => { setProjects(items.sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.updatedAt) - new Date(a.updatedAt))); setStatus('ready'); }).catch(() => setStatus('error')); }, []);
  const currentSlug = route.startsWith('#/work/') ? route.slice('#/work/'.length) : null;
  const currentProject = useMemo(() => projects.find((project) => project.slug === currentSlug), [projects, currentSlug]);
  const page = currentSlug ? <ProjectDetail project={currentProject} /> : route === '#/work' ? <Work projects={projects} /> : <Home projects={projects} />;
  return <><Header />{status === 'error' && <div className="notice" role="status">GitHub projects are temporarily unavailable. The portfolio shell is still available.</div>}{page}<footer className="site-footer"><div>SULAIMAN</div><p>Hardware & Product Development Engineer</p><span>© {new Date().getFullYear()}</span></footer></>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
