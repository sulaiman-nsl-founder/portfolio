import React, { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { discoverProjects, FALLBACK_IMAGE, readableTopic } from './data/github';

const capabilities = [
  ['Hardware', 'Schematic Design', 'PCB Design', 'Power Electronics', 'Sensors', 'Hardware Bring-up'],
  ['Embedded', 'ESP32', 'STM32', 'Embedded C/C++', 'FreeRTOS', 'Peripheral Integration'],
  ['Communication', 'UART', 'I2C', 'SPI', 'CAN', 'RS485 · MQTT · BLE'],
  ['Product', 'CAD', '3D Printing', 'Enclosures', 'Rapid Prototyping', 'DFM · DFT'],
  ['Debugging', 'Oscilloscope', 'Logic Analyzer', 'Multimeter', 'Root-Cause Analysis', 'Validation'],
];


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
    <nav className="nav" aria-label="Main navigation">
      <a className="mark-link" href="#/" aria-label="Sulaiman home"><svg className="nav-mark" viewBox="0 0 64 48" aria-hidden="true"><path d="M8 40V8l12 22L32 8v32M40 13c3-4 8-6 13-4 4 1 6 4 6 7 0 4-3 6-8 7l-5 1c-5 1-7 4-7 8 0 5 4 8 10 8 5 0 9-2 12-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
      <a className="nav-link" href="#/work">Projects</a>
      <a className="nav-link" href="#about">About</a>
      <a className="nav-link" href="#experience">Experience</a>
      <a className="nav-link nav-contact" href="#contact">Contact</a>
    </nav>
  </header>;
}

function SectionHeading({ eyebrow, title }) {
  return <div className="section-heading"><span>{eyebrow}</span><h2>{title}</h2></div>;
}

function BlueprintGraphic() {
  const [activeLabel, setActiveLabel] = useState(null);
  const labels = [
    ['power', 'POWER PATH', '22% 19%'],
    ['control', 'CONTROL LOOP', '67% 33%'],
    ['test', 'TEST POINT', '26% 73%'],
  ];
  return <div className="blueprint-stage" aria-label="Animated product system blueprint" role="img">
    <svg className="blueprint-lines" viewBox="0 0 900 360" aria-hidden="true">
      <defs><pattern id="blueprint-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="1" /></pattern></defs>
      <rect width="900" height="360" fill="url(#blueprint-grid)" />
      <path className="trace trace-a" d="M70 270H220V210H355V125H490V185H650V85H820" />
      <path className="trace trace-b" d="M110 70H280V145H410V275H580V220H790" />
      <path className="trace trace-c" d="M450 40V125M450 275V320M650 85V35" />
      <rect className="system-board" x="355" y="125" width="190" height="150" rx="2" />
      <rect className="system-core" x="405" y="165" width="90" height="70" rx="1" />
      <path className="system-detail" d="M380 150h25m-25 20h25m100-20h25m-25 20h25M380 250h25m-25-20h25m100 20h25m-25-20h25" />
      <circle className="target target-one" cx="220" cy="210" r="7" /><circle className="target target-two" cx="650" cy="85" r="7" /><circle className="target target-three" cx="450" cy="275" r="7" />
    </svg>
    {labels.map(([id, title, position]) => <button className={`blueprint-label ${activeLabel === id ? 'is-active' : ''}`} key={id} style={{ left: position.split(' ')[0], top: position.split(' ')[1] }} onClick={() => setActiveLabel(activeLabel === id ? null : id)}><span className="label-dot" />{title}<span className="label-index">0{id === 'power' ? 1 : id === 'control' ? 2 : 3}</span></button>)}
    <span className="blueprint-caption">FIG. 01 / PRODUCT SYSTEM STUDY</span>
    <span className="blueprint-measure measure-one">REV. 03</span><span className="blueprint-measure measure-two">24V / 3A</span>
  </div>;
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
      <h1><span className="hero-greeting">Hello, I’m</span><span className="hero-name">Sulaiman</span><span className="hero-role">Hardware &amp; Product Development Engineer</span></h1>
      <BlueprintGraphic />
      <div className="hero-bottom"><p className="hero-statement">I design, prototype, debug and build connected physical products.</p><div className="hero-actions"><a className="button button-dark" href="#/work">View work <span>↗</span></a><a className="text-link" href="#/about">About me <span>↗</span></a></div></div>
    </section>
    <section className="page-section work-preview" id="work"><SectionHeading eyebrow="02 / Selected work" title="Built in the real world." /><ProjectGallery projects={visible} /><a className="text-link section-link" href="#/work">View all work <span>↗</span></a></section>
    <section className="dark-section"><div className="page-section"><SectionHeading eyebrow="03 / Capabilities" title="From first circuit to field test." /><div className="capability-grid">{capabilities.map(([title, ...items]) => <div className="capability" key={title}><h3>{title}</h3>{items.map((item) => <p key={item}>{item}</p>)}</div>)}</div></div></section>
    <About /><Experience /><Contact />
  </>;
}

function About() {
  return <section className="page-section split-section" id="about"><SectionHeading eyebrow="04 / About" title="Engineering is a loop." /><div className="split-copy"><p className="large-copy">I work across electronics, embedded systems and physical product development, taking ideas from early prototypes through PCB design, firmware, mechanical integration, debugging and validation.</p><p>Every iteration is an opportunity to measure what happened, understand why, and build the next version with more confidence.</p></div></section>;
}

function Experience() {
  const stages = ['Requirements', 'System architecture', 'Electronics + PCB', 'Firmware + mechanics', 'Debugging + validation', 'Iteration to product'];
  return <section className="page-section experience-section" id="experience"><SectionHeading eyebrow="05 / Experience" title="The way I build." /><div className="experience-track">{stages.map((stage, index) => <div className="experience-step" key={stage}><span>0{index + 1}</span><strong>{stage}</strong></div>)}</div></section>;
}

function Contact() {
  return <section className="contact-section" id="contact"><div className="contact-panel"><div className="contact-copy"><SectionHeading eyebrow="06 / Contact" title="Ready to build something real?" /><p>Have a hardware problem, product idea or engineering project? Let’s take it from first requirements to a tested prototype.</p><div className="contact-links"><a href="mailto:hello@example.com">Email <span>↗</span></a><a href="https://github.com/sulaiman-nsl-founder" target="_blank" rel="noreferrer">GitHub <span>↗</span></a></div></div><form className="contact-form" action="mailto:hello@example.com" method="post" encType="text/plain"><div className="form-grid"><label>Name<input id="contact-name" name="name" type="text" placeholder="Your name" required /></label><label>Email<input id="contact-email" name="email" type="email" placeholder="you@example.com" required /></label></div><label>Message<textarea id="contact-message" name="message" placeholder="What would you like to build?" rows="5" required /></label><button type="submit">Send message <span>↗</span></button></form></div></section>;
}

function Work({ projects }) {
  return <main className="page-section inner-page"><SectionHeading eyebrow="Work / All projects" title="A record of things built, tested and learned." /><ProjectGallery projects={projects} /></main>;
}

function ProjectDetail({ project }) {
  if (!project) return <main className="page-section inner-page"><p className="eyebrow">404 / Not found</p><h1>Project unavailable.</h1><a className="text-link" href="#/work">Return to work <span>↗</span></a></main>;
  return <main className="project-detail"><div className="page-section"><a className="back-link" href="#/work">← Back to work</a><div className="detail-intro"><p className="eyebrow">Project / {project.topics[0] ? readableTopic(project.topics[0]) : 'Engineering'}</p><h1>{project.title}</h1><p className="detail-summary">{project.description}</p><div className="detail-links"><a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">View on GitHub <span>↗</span></a>{project.linkedinUrl && <a className="text-link" href={project.linkedinUrl} target="_blank" rel="noreferrer">View on LinkedIn <span>↗</span></a>}</div></div><img className="detail-hero" src={project.heroImage} alt={`${project.title} hero`} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} /><div className="detail-layout"><aside><p className="eyebrow">Project metadata</p><p className="metadata-line">{project.year || 'Undated'} · {project.status}</p><div className="topic-list">{project.topics.map((topic) => <span key={topic}>{readableTopic(topic)}</span>)}</div></aside><article><h2>Engineering notes</h2>{project.sections.length ? project.sections.map((section) => <section className="readme-section" key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>) : <p>This project is ready for a detailed engineering README. Document the problem, requirements, design decisions, debugging process, testing and results in the repository to build out this case study.</p>}</article></div></div></main>;
}

function App() {
  const route = useHashRoute();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  useEffect(() => { discoverProjects().then((items) => { setProjects(items); setStatus('ready'); }).catch(() => setStatus('error')); }, []);
  const currentSlug = route.startsWith('#/work/') ? route.slice('#/work/'.length) : null;
  const currentProject = useMemo(() => projects.find((project) => project.slug === currentSlug), [projects, currentSlug]);
  const page = currentSlug ? <ProjectDetail project={currentProject} /> : route === '#/work' ? <Work projects={projects} /> : <Home projects={projects} />;
  return <><Header />{status === 'error' && <div className="notice" role="status">GitHub projects are temporarily unavailable. The portfolio shell is still available.</div>}{page}<footer className="site-footer"><div>SULAIMAN</div><p>Hardware & Product Development Engineer</p><span>© {new Date().getFullYear()}</span></footer></>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
