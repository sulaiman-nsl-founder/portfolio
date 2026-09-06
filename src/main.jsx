import React, { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { discoverProjects, FALLBACK_IMAGE, readableTopic } from './data/github';

const capabilities = [
  ['Hardware', 'KiCad PCB Design', 'Schematic Design', 'Component Selection', 'BOM Preparation', 'Power Management', 'Board Bring-up'],
  ['Embedded', 'ESP32 · ESP32-S3', 'STM32', 'Nordic nRF54L15', 'Embedded C/C++', 'Zephyr RTOS', 'Firmware Debugging'],
  ['Connectivity', 'I2C · SPI · UART', 'GPIO · PWM · ADC', 'BLE · Wi-Fi', 'MQTT · ESP-NOW', 'Sensor Interfaces', 'Motor Drivers'],
  ['Product', 'Fusion 360', 'FDM 3D Printing', 'Enclosures + Fixtures', 'Klipper', 'Prototype Assembly', 'Mechanical Integration'],
  ['Validation', 'SMD Soldering', 'Hardware Debugging', 'Functional Testing', 'Battery Systems', 'Actuator Interfaces', 'Iterative Prototyping'],
];

const experienceItems = [
  { role: 'IoT Junior Engineer / R&D', company: 'Cavin Infotech', period: 'Oct 2025 - Present', location: 'Chennai, Tamil Nadu', highlights: ['Develop IoT product prototypes with ESP32, STM32 and Nordic microcontrollers.', 'Integrate sensors, displays, wireless modules and batteries into functional hardware.', 'Perform bring-up, board-level debugging, functional testing and firmware development.', 'Developed Smart Collar BLE functionality and optimized a connected TFT display prototype.'] },
  { role: 'Product Developer / R&D', company: 'Tarcin Robotic LLP', period: '7 months', location: 'Tamil Nadu', highlights: ['Developed IoT and embedded prototypes for robotics and product-development applications.', 'Integrated sensors, actuators, displays and communication modules.', 'Designed and fabricated mechanical prototypes with Fusion 360 and FDM 3D printing.'] },
  { role: 'R&D Intern', company: 'RasoiRobotics Pvt. Ltd.', period: '5 months', location: 'Tamil Nadu', highlights: ['Worked on automation and robotics R&D projects involving controllers, sensors and data acquisition.', 'Performed sensor integration, hardware testing and hardware-software troubleshooting.', 'Assisted with PCB development and testing during prototype development.'] },
  { role: 'Part-Time Project Engineer', company: 'Hashind Solutions', period: '1 year', location: 'India', highlights: ['Built embedded and robotics projects using microcontrollers, sensors and wireless communication.', 'Trained 2,000+ students in robotics and embedded systems through hands-on projects.', 'Supported WRO teams, with two teams reaching state finals and one advancing internationally.'] },
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
      <a className="mark-link" href="#/" aria-label="Mohamed Sulaiman home"><svg className="nav-mark" viewBox="0 0 64 48" aria-hidden="true"><path d="M8 40V8l12 22L32 8v32M40 13c3-4 8-6 13-4 4 1 6 4 6 7 0 4-3 6-8 7l-5 1c-5 1-7 4-7 8 0 5 4 8 10 8 5 0 9-2 12-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
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
      <h1><span className="hero-greeting">Hello, I’m</span><span className="hero-name">Mohamed Sulaiman</span><span className="hero-role">Hardware Design Engineer</span></h1>
      <div className="hero-bottom"><p className="hero-statement">I develop electronics hardware, embedded systems and connected product prototypes from requirements through testing.</p><div className="hero-actions"><a className="button button-dark" href="#/work">View work <span>↗</span></a><a className="text-link" href="#about">About me <span>↗</span></a></div></div>
    </section>
    <section className="page-section work-preview" id="work"><SectionHeading eyebrow="02 / Selected work" title="Built in the real world." /><ProjectGallery projects={visible} /><a className="text-link section-link" href="#/work">View all work <span>↗</span></a></section>
    <section className="dark-section"><div className="page-section"><SectionHeading eyebrow="03 / Capabilities" title="From first circuit to field test." /><div className="capability-grid">{capabilities.map(([title, ...items]) => <div className="capability" key={title}><h3>{title}</h3>{items.map((item) => <p key={item}>{item}</p>)}</div>)}</div></div></section>
    <About /><Experience /><Contact />
  </>;
}

function About() {
  return <section className="page-section split-section" id="about"><SectionHeading eyebrow="04 / About" title="Engineering is a loop." /><div className="split-copy"><p className="large-copy">I enjoy turning ideas into working products and solving problems that sit between hardware and software. I’m passionate about embedded systems, PCB design, IoT, rapid prototyping, and hands-on debugging. I like taking things apart, understanding why they fail, finding practical solutions, and building them better.</p><p>I enjoy taking hardware from an idea to a working prototype. My hands-on experience includes component selection, BOM preparation, sensor integration, hardware bring-up, board-level debugging, power management, and functional testing. I especially enjoy troubleshooting problems, understanding the root cause, and turning a non-working system into a reliable one.</p><div className="credential-row"><span>B.E. Electronics &amp; Communication Engineering</span><span>SSM Institute of Engineering and Technology · 2021 - 2025</span><span>English · Tamil</span></div></div></section>;
}

function Experience() {
  return <section className="page-section experience-section" id="experience"><SectionHeading eyebrow="05 / Experience" title="Hardware, firmware and product R&amp;D." /><div className="career-list">{experienceItems.map((item) => <article className="career-item" key={`${item.company}-${item.role}`}><div className="career-meta"><span>{item.period}</span><span>{item.location}</span></div><div><h3>{item.role} · {item.company}</h3><ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div></article>)}</div></section>;
}

function ContactIcon({ type }) {
  if (type === 'email') return <svg className="contact-link-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3zM3 6l9 7 9-7" /></svg>;
  if (type === 'github') return <svg className="contact-link-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-2.8 17.55c.45.08.62-.2.62-.44v-1.55c-2.52.55-3.05-1.2-3.05-1.2-.4-1.02-.98-1.3-.98-1.3-.8-.55.06-.54.06-.54.88.06 1.34.91 1.34.91.79 1.34 2.07.95 2.58.73.08-.57.31-.95.56-1.17-2.01-.23-4.13-1.01-4.13-4.48 0-.99.35-1.8.91-2.43-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.47.93A8.6 8.6 0 0 1 12 7.3c.76 0 1.52.1 2.23.3 1.7-1.17 2.46-.93 2.46-.93.5 1.25.18 2.17.1 2.4.56.63.9 1.44.9 2.43 0 3.48-2.12 4.25-4.14 4.48.32.28.6.82.6 1.66v2.47c0 .24.16.53.62.44A9 9 0 0 0 12 3z" /></svg>;
  return <svg className="contact-link-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm3 5v8m0-11v.01M12 17v-4a3 3 0 0 1 6 0v4m-6-4h6" /></svg>;
}

function Contact() {
  return <section className="contact-section" id="contact"><div className="contact-panel"><div className="contact-copy"><SectionHeading eyebrow="06 / Contact" title="Ready to build something real?" /><p>Have a hardware problem, product idea or engineering project? Let’s take it from first requirements to a tested prototype.</p><div className="contact-links"><a href="mailto:sulaiman.nsl.lab@gmail.com"><ContactIcon type="email" />Email <span>↗</span></a><a href="https://github.com/sulaiman-nsl-founder" target="_blank" rel="noreferrer"><ContactIcon type="github" />GitHub <span>↗</span></a><a href="https://linkedin.com/in/mohamed-sulaiman-nsl/" target="_blank" rel="noreferrer"><ContactIcon type="linkedin" />LinkedIn <span>↗</span></a></div></div><form className="contact-form" action="mailto:sulaiman.nsl.lab@gmail.com" method="post" encType="text/plain"><div className="form-grid"><label>Name<input id="contact-name" name="name" type="text" placeholder="Your name" required /></label><label>Email<input id="contact-email" name="email" type="email" placeholder="you@example.com" required /></label></div><label>Message<textarea id="contact-message" name="message" placeholder="What would you like to build?" rows="5" required /></label><button type="submit">Send message <span>↗</span></button></form></div></section>;
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
  return <><Header />{status === 'error' && <div className="notice" role="status">GitHub projects are temporarily unavailable. The portfolio shell is still available.</div>}{page}<footer className="site-footer"><div>MOHAMED SULAIMAN</div><p>Hardware Design Engineer · Embedded Electronics · PCB Design · Product R&amp;D</p><span>© {new Date().getFullYear()}</span></footer></>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
