import { lazy, Suspense, useEffect, useState } from 'react';
import { UserRound, Layers3, Sparkles, Send, ArrowUpRight, MapPin, Rotate3D, RotateCcw } from 'lucide-react';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import Pages from './experience/Pages';
import './experience/shell.css';

const CharacterStage = lazy(() => import('./experience/CharacterStage'));
const sections = [
  { id: 'world', label: 'Overview', icon: UserRound },
  { id: 'work', label: 'Work', icon: Layers3 },
  { id: 'about', label: 'About', icon: Sparkles },
  { id: 'contact', label: 'Contact', icon: Send },
];
const pageFromHash = () => sections.some(item => item.id === location.hash.slice(1)) ? location.hash.slice(1) : 'world';

export default function App() {
  const [section, setSection] = useState(pageFromHash);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const sync = () => setSection(pageFromHash());
    const escape = event => { if (event.key === 'Escape' && !document.querySelector('dialog[open]')) location.hash = 'world'; };
    window.addEventListener('hashchange', sync);
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('keydown', escape); };
  }, []);
  const navigate = id => { location.hash = id; setSection(id); };

  return <main className="profile-shell">
    <div className="character-stage"><Suspense fallback={<div className="stage-loading">Loading avatar<span>✦</span></div>}><CharacterStage activeTab={section} replay={replay} /></Suspense></div>
    <div className="shell-grain" aria-hidden="true" />
    <header className="profile-header">
      <button className="motion-replay" type="button" onClick={() => setReplay(count => count + 1)}><RotateCcw size={16} /> Replay animation</button>
    </header>
    <nav className="profile-nav" aria-label="Portfolio navigation">
      <span className="nav-line" aria-hidden="true" />
      {sections.map(({ id, label, icon: Icon }, index) => <a key={id} href={`#${id}`} onClick={() => navigate(id)} className={`nav-item ${section === id ? 'active' : ''}`} aria-label={label} aria-current={section === id ? 'page' : undefined} title={label}>
        <span className="nav-indicator" aria-hidden="true" /><Icon size={20} strokeWidth={1.35}/><span className="nav-label">{label}</span><span className="nav-number">0{index + 1}</span>
      </a>)}
      <span className="nav-line end" aria-hidden="true" />
    </nav>
    {section === 'world' && <section className="profile-copy" aria-labelledby="profile-name">
      <div className="profile-title"><h1 id="profile-name">Evan <em>Rasheed</em></h1><div className="name-flourish"><span>✦</span><i /></div></div>
      <p className="profile-role">Computer Science student <span>&amp;</span> developer</p>
      <p className="profile-location"><MapPin size={13} strokeWidth={1.5}/> Hulhumale, Maldives</p>
      <div className="profile-divider"><span>✦</span></div>
      <p className="profile-description">I build web and mobile apps and experiment with 3D on the web.</p>
      <div className="profile-tags" aria-label="Interests"><span>React</span><span>Web &amp; Mobile</span><span>Interactive experiences</span></div>
      <button className="profile-cta" onClick={() => navigate('work')}><span>Explore selected work</span><ArrowUpRight size={17}/></button>
    </section>}
    <footer className="profile-footer"><div><span className="footer-star">✧</span> <span>Avatar by pixiv · Motion by Overte / Hanami</span></div><div className="viewer-hint"><Rotate3D size={16}/> DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</div></footer>
    <Pages page={section === 'world' ? null : section} onClose={() => navigate('world')} />
  </main>;
}

