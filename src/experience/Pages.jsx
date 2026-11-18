import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import intranet from '../assets/work/intranet.webp';
import admin from '../assets/work/admin.webp';
import protectedSite from '../assets/work/protected.webp';
import environment from '../assets/work/environment.webp';
import gis from '../assets/work/gis.webp';
import hospital from '../assets/work/workImgTwo.png';
import './pages.css';

const github = 'https://github.com/evaano';
const resume = 'https://drive.google.com/file/d/1wXbxwt6TyojadYmgPvXmz0mFU3-QWYTH/view';
const projects = [
  { name: 'Environment Intranet', category: 'Internal platform', image: intranet, description: 'A shared workspace for ministry staff.' },
  { name: 'Maldives Environment GIS', category: 'Interactive map', image: gis, description: 'A map portal for exploring environmental data across the Maldives.' },
  { name: 'Maldives Protected Areas', category: 'Public website', image: protectedSite, description: 'A public guide to protected areas in the Maldives.' },
  { name: 'Protected Areas Admin', category: 'Administration', image: admin, description: 'The administrative workspace for managing protected area records.' },
  { name: 'Environment Ministry', category: 'Government website', image: environment, description: 'The ministry’s public website for environmental information and updates.' },
  { name: 'HMH Inventory', category: 'Hospital operations', image: hospital, description: 'An inventory application for Hulhumalé Hospital.' },
];

function positionHighlight(event) {
  if (event.pointerType !== 'mouse') return;
  const frame = event.currentTarget;
  const bounds = frame.getBoundingClientRect();
  frame.style.setProperty('--pointer-x', (event.clientX - bounds.left) + 'px');
  frame.style.setProperty('--pointer-y', (event.clientY - bounds.top) + 'px');
}

function ProjectScreenshot({ image, name }) {
  const [zoomed, setZoomed] = useState(false);

  return <div className="project-screenshot">
    <button type="button" className="screenshot-zoom" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
      Enlarge screenshot
    </button>
    <div className={zoomed ? 'screenshot-scroll zoomed' : 'screenshot-scroll'}
      tabIndex={zoomed ? 0 : undefined} role="region" aria-label={name + ' screenshot preview'}>
      <div className="screenshot-frame" onPointerMove={positionHighlight} onPointerEnter={positionHighlight}>
        <img className="project-hero" src={image} alt={name + ' interface'} />
        {!zoomed && <div className="screenshot-lens" aria-hidden="true"><img src={image} alt="" /></div>}
      </div>
    </div>
  </div>;
}
ProjectScreenshot.propTypes = { image: PropTypes.string.isRequired, name: PropTypes.string.isRequired };

function ProjectDialog({ project, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const node = dialog.current;
    if (project && !node.open) node.showModal();
    if (!project && node.open) node.close();
  }, [project]);

  return <dialog ref={dialog} className="portfolio-dialog project-dialog" aria-labelledby="project-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    {project && <div className="portfolio-panel">
      <div className="portfolio-topline"><span>Selected work / Project detail</span><button className="portfolio-close" onClick={onClose} aria-label="Close project details">×</button></div>
      <h2 id="project-title">{project.name}</h2>
      <p className="portfolio-kicker">{project.category}</p>
      <ProjectScreenshot key={project.name} image={project.image} name={project.name} />
      <p>{project.description}</p>
    </div>}
  </dialog>;
}
ProjectDialog.propTypes = { project: PropTypes.object, onClose: PropTypes.func.isRequired };

function Work() {
  const [project, setProject] = useState(null);
  return <>
    <h1 id="portfolio-title">Selected <em>work.</em></h1>
    <p className="portfolio-intro">Recent projects in conservation, public services, and healthcare.</p>
    <div className="project-list">{projects.map((item, index) => <button className="project-row" onPointerMove={positionHighlight} key={item.name} onClick={() => setProject(item)}>
      <span className="project-number">0{index + 1}</span>
      <img src={item.image} alt="" />
      <span className="project-copy"><span className="project-category">{item.category}</span><strong>{item.name}</strong></span>
      <span className="project-arrow" aria-hidden="true">↗</span>
    </button>)}</div>
    <ProjectDialog project={project} onClose={() => setProject(null)} />
  </>;
}

function About() {
  return <>
    <h1 id="portfolio-title">A little <em>about me.</em></h1>
    <p className="portfolio-intro">I’m Evan Rasheed, a computer science student and developer based in Hulhumale, Maldives. I enjoy building thoughtful interfaces, useful systems, and interactive experiences across web and mobile.</p>
    <div className="skill-groups">
      <section><h2>Interfaces</h2><p>React · TypeScript · JavaScript · Three.js · PixiJS</p></section>
      <section><h2>Apps &amp; systems</h2><p>Remix · React Native · Python · C</p></section>
    </div>
    <a className="portfolio-link" href={resume} target="_blank" rel="noreferrer">View résumé ↗</a>
  </>;
}

function Contact() {
  const [copyStatus, setCopyStatus] = useState('');
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('evaan0202@gmail.com');
      setCopyStatus('Email copied to clipboard.');
    } catch {
      setCopyStatus('Could not copy. Please select the email address instead.');
    }
  };
  return <>
    <h1 id="portfolio-title">Let’s <em>connect.</em></h1>
    <p className="portfolio-intro">Have an idea or just want to say hello? I’d love to hear from you.</p>
    <div className="contact-email"><span>Email</span><a href="mailto:evaan0202@gmail.com">evaan0202@gmail.com</a><button onClick={copyEmail}>Copy email</button><p role="status">{copyStatus}</p></div>
    <div className="contact-grid">
      <div><span>Find me</span><a href={github} target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/evan-rashyd-603a20292/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
      <div><span>Call</span><a href="tel:+9609190402">+960 9190402</a></div>
      <div><span>Based in</span><p>Hulhumale, Maldives</p></div>
    </div>
  </>;
}

export default function Pages({ page, onClose }) {
  if (!page) return null;
  return <section className="portfolio-inline" aria-labelledby="portfolio-title">
    <div className="portfolio-topline"><button className="portfolio-close" style={{ marginLeft: 'auto' }} onClick={onClose} aria-label="Back to overview">×</button></div>
    {page === 'work' && <Work />}{page === 'about' && <About />}{page === 'contact' && <Contact />}
  </section>;
}
Pages.propTypes = { page: PropTypes.oneOf(['work', 'about', 'contact']), onClose: PropTypes.func.isRequired };
