"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { FileTextSharp, Github as PixelGithub, Linkedin as PixelLinkedin, QuoteTextInline } from "pixelarticons/react";
import SignalTerminal from "./SignalTerminal";
import { jobPositions, jobProjects } from "@/lib/portfolio";

type Section = "about" | "education" | "experience" | "projects" | "contact";

type DecodeRegistration = { complete: () => void; cancel: () => void };
const CompletionContext = createContext<(() => DecodeRegistration) | null>(null);
const PlaybackContext = createContext(true);

function Sequence({ stages }: { stages: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const advance = useCallback(() => setActive(current => current + 1), []);
  const ignore = useCallback(() => {}, []);
  // Every stage occupies its final space from the first frame. Upcoming stages
  // remain invisible and begin decoding only when the prior stage has finished.
  return <>{stages.map((stage, index) => {
    const state = index < active ? "complete" : index === active ? "active" : "waiting";
    return <div className="signal-sequence-stage" data-sequence-state={state} aria-hidden={state === "waiting"} key={index}>
      <PlaybackContext.Provider value={index <= active}>
        <DecodeGroup onComplete={index === active ? advance : ignore}>{stage}</DecodeGroup>
      </PlaybackContext.Provider>
    </div>;
  })}</>;
}

function DecodeTogether({ children }: { children: ReactNode }) {
  // An expanded panel forms a separate simultaneous batch, independent of the
  // page's initial sequence and of other panels the visitor may open.
  return <CompletionContext.Provider value={null}>{children}</CompletionContext.Provider>;
}

const cipher = "0123456789-_+*/{}[]<>~^=:;#@%&";
const verbs = ["creating", "building", "learning", "living", "hooping"];
const quotes = [
  "Be a connoisseur, not a customer.",
  "When you're born, you look like your parents. When you die, you look like your decisions.",
  "The curse of discipline is that every day looks the same. The curse of indiscipline is that every year looks the same.",
  "The brain is a muscle, and like any muscle, the more you work it, the stronger it becomes.",
];

function cipherAt(seed: number, position: number, tick: number) {
  let value = seed ^ Math.imul(position + 1, 0x45d9f3b) ^ Math.imul(tick + 1, 0x119de1f3);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return cipher[((value ^ (value >>> 16)) >>> 0) % cipher.length];
}

function DecodeText({ text, byLine = false }: { text: string; byLine?: boolean }) {
  const register = useContext(CompletionContext);
  const playback = useContext(PlaybackContext);
  const registerRef = useRef(register);
  registerRef.current = register;
  const [motion, setMotion] = useState({ progress: 0, elapsed: 0 });
  const textRef = useRef<HTMLSpanElement>(null);
  const [lineOffsets, setLineOffsets] = useState<Record<number, number>>({});
  const seed = useMemo(() => {
    let hash = 2166136261;
    for (const character of text) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
    return hash >>> 0;
  }, [text]);

  useEffect(() => {
    if (!byLine || !textRef.current) return;
    const element = textRef.current;
    let cancelled = false;
    const measureLines = () => {
      if (cancelled) return;
      const characters = Array.from(element.querySelectorAll<HTMLElement>('[data-character-index]'));
      if (!characters.length) return;
      const lines: { top: number; characters: { index: number; left: number }[] }[] = [];
      for (const character of characters) {
        const rect = character.getBoundingClientRect();
        let line = lines.find(candidate => Math.abs(candidate.top - rect.top) < 2);
        if (!line) { line = { top: rect.top, characters: [] }; lines.push(line); }
        line.characters.push({ index: Number(character.dataset.characterIndex), left: rect.left });
      }
      const offsets: Record<number, number> = {};
      for (const line of lines) {
        const left = Math.min(...line.characters.map(character => character.left));
        const right = Math.max(...line.characters.map(character => character.left));
        for (const character of line.characters) offsets[character.index] = (character.left - left) / Math.max(1, right - left);
      }
      setLineOffsets(offsets);
    };
    measureLines();
    const observer = new ResizeObserver(measureLines);
    observer.observe(element.parentElement ?? element);
    document.fonts.ready.then(measureLines);
    return () => { cancelled = true; observer.disconnect(); };
  }, [text, byLine]);

  useEffect(() => {
    if (!playback) {
      setMotion({ progress: 0, elapsed: 0 });
      return;
    }
    const registration = registerRef.current?.();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion({ progress: 1, elapsed: 0 });
      registration?.complete();
      return () => registration?.cancel();
    }
    let frame = 0;
    const start = performance.now();
    const duration = byLine ? 1800 : Math.min(2200, Math.max(1500, text.length * 18));
    const render = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      setMotion({ progress, elapsed });
      if (progress < 1) frame = requestAnimationFrame(render);
      else registration?.complete();
    };
    setMotion({ progress: 0, elapsed: 0 });
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); registration?.cancel(); };
  }, [text, byLine, playback]);

  // For paragraphs and bullets, each measured visual line gets the same sweep,
  // including after a resize. Settled text sheds the temporary animation spans.
  const sweep = motion.progress * motion.progress * (3 - 2 * motion.progress);
  let offset = 0;
  return <><span ref={textRef} className="signal-decode" data-decoding={motion.progress < 1} aria-hidden="true">{motion.progress === 1 ? text : text.split(/(\s+)/).map((word, wordIndex) => {
    const wordStart = offset;
    offset += word.length;
    if (/^\s+$/.test(word)) return word;
    return <span className="signal-decode-word" key={wordIndex}>{Array.from(word, (character, index) => {
      const position = wordStart + index;
      const offset = byLine ? (lineOffsets[position] ?? 0) : position / text.length;
      const phase = Math.min(1, Math.max(0, (sweep - offset * .78) / .22));
      const opacity = phase * phase * (3 - 2 * phase);
      const punctuation = ".,·:/()–—".includes(character);
      const tick = phase > 0 && phase < 1 ? Math.floor((motion.elapsed + position * 19) / 140) : 0;
      return <span className="signal-decode-character" data-character-index={position} key={index}>
        <span className="signal-decode-cipher" style={{ opacity: punctuation ? 0 : (1 - opacity) * .55 }}>{cipherAt(seed, position, tick)}</span>
        <span className="signal-decode-letter" style={{ opacity: punctuation ? 1 : opacity }}>{character}</span>
      </span>;
    })}</span>;
  })}</span><span className="signal-sr-only">{text}</span></>;
}

function DecodeGroup({ onComplete, children }: { onComplete: () => void; children: ReactNode }) {
  const pending = useRef(new Set<symbol>());
  const completed = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const register = useCallback(() => {
    const token = Symbol();
    pending.current.add(token);
    return {
      complete: () => {
        pending.current.delete(token);
        queueMicrotask(() => {
          if (mounted.current && !completed.current && pending.current.size === 0) {
            completed.current = true;
            onComplete();
          }
        });
      },
      cancel: () => { pending.current.delete(token); },
    };
  }, [onComplete]);

  return <CompletionContext.Provider value={register}>{children}</CompletionContext.Provider>;
}

function SectionRow({ number, title, meta, open, onClick }: { number: string; title: string; meta: string; open: boolean; onClick: () => void }) {
  return <button className="signal-section-row" type="button" aria-expanded={open} aria-controls={open ? "signal-panel-" + title.toLowerCase().replace(/\s+/g, "-") : undefined} onClick={onClick}>
    <span className="signal-number"><DecodeText text={number} /></span>
    <span className="signal-section-name"><DecodeText text={title} /></span>
    <span className="signal-section-meta"><DecodeText text={meta} /></span>
    <span className="signal-toggle" aria-hidden="true">{open ? "−" : "+"}</span>
  </button>;
}

function DetailRow({ title, subtitle, meta, open, onClick, id, index }: { title: string; subtitle?: string; meta?: string; open: boolean; onClick: () => void; id: string; index: number }) {
  return <button className="signal-detail-row" type="button" aria-expanded={open} aria-controls={open ? id : undefined} onClick={onClick}>
    <span className="signal-detail-number"><DecodeText text={String(index + 1).padStart(2, "0")} /></span>
    <span className="signal-detail-primary"><span><DecodeText text={title} /></span>{subtitle && <small><DecodeText text={subtitle} /></small>}</span>
    {meta && <span className="signal-detail-meta"><DecodeText text={meta} /></span>}
    <span className="signal-toggle" aria-hidden="true">{open ? "−" : "+"}</span>
  </button>;
}

function Skills({ skills }: { skills: string[] }) {
  return <ul className="signal-skills" aria-label="Skills">{skills.map(skill => <li key={skill}><DecodeText text={skill} /></li>)}</ul>;
}

function TypedVerbs() {
  const register = useContext(CompletionContext);
  const playback = useContext(PlaybackContext);
  const [wordIndex, setWordIndex] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const completion = useRef<DecodeRegistration | null>(null);
  const firstWordComplete = useRef(false);
  const sectionRevealTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (sectionRevealTimer.current) window.clearTimeout(sectionRevealTimer.current);
  }, []);

  useEffect(() => {
    if (!playback || completion.current) return;
    completion.current = register?.() ?? null;
    return () => completion.current?.cancel();
  }, [playback, register]);

  useEffect(() => {
    if (!playback) return;
    const word = verbs[wordIndex];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCharacters(word.length);
      if (!firstWordComplete.current) {
        firstWordComplete.current = true;
        completion.current?.complete();
      }
      return;
    }
    if (!deleting && characters === word.length && !firstWordComplete.current) {
      firstWordComplete.current = true;
      sectionRevealTimer.current = window.setTimeout(() => completion.current?.complete(), 220);
    }
    const delay = !deleting && characters === word.length ? 3800 : deleting ? 45 : 80;
    const timer = window.setTimeout(() => {
      if (!deleting && characters < word.length) setCharacters(current => current + 1);
      else if (!deleting) setDeleting(true);
      else if (characters > 0) setCharacters(current => current - 1);
      else {
        setDeleting(false);
        setWordIndex(current => (current + 1) % verbs.length);
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [characters, deleting, playback, wordIndex]);

  return <p className="signal-typed-verbs" aria-label={verbs.join(", ")}>
    <span aria-hidden="true">{verbs[wordIndex].slice(0, characters)}<span className="signal-typed-cursor">_</span></span>
  </p>;
}

function PixelIconReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const register = useContext(CompletionContext);
  const playback = useContext(PlaybackContext);
  const registerRef = useRef(register);
  registerRef.current = register;
  const [motion, setMotion] = useState({ progress: 0, elapsed: 0 });

  useEffect(() => {
    if (!playback) {
      setMotion({ progress: 0, elapsed: 0 });
      return;
    }
    const registration = registerRef.current?.();
    let frame = 0;
    const start = performance.now() + delay;
    const duration = 1050;
    const render = (now: number) => {
      const elapsed = Math.max(0, now - start);
      const progress = Math.min(1, elapsed / duration);
      setMotion({ progress, elapsed });
      if (progress < 1) frame = requestAnimationFrame(render);
      else registration?.complete();
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      registration?.cancel();
    };
  }, [delay, playback]);

  const eased = motion.progress * motion.progress * (3 - 2 * motion.progress);
  return <span className="signal-pixel-reveal" aria-hidden="true">
    <span className="signal-pixel-resolved" style={{ clipPath: `inset(0 ${100 - eased * 100}% 0 0)`, opacity: .25 + eased * .75 }}>{children}</span>
    {motion.progress > 0 && motion.progress < 1 && <span className="signal-pixel-scan" style={{ left: `${eased * 100}%` }} />}
  </span>;
}

function AtlantaClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <div className="signal-clock" aria-label={`Current time in Atlanta: ${time}`}>
    <span>atlanta</span>
    <span aria-hidden="true">•</span>
    <time>{time}</time>
  </div>;
}

function QuoteCorner() {
  const [open, setOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 9000);
    return () => window.clearTimeout(timer);
  }, [open, quoteIndex]);

  const nextQuote = () => setQuoteIndex(current => (current + 1) % quotes.length);

  return <aside className="signal-quote-shell" aria-label="Favorite quotes">
    {open && <div className="signal-quote-panel" key={quoteIndex}>
      <button className="signal-quote-close" type="button" onClick={() => setOpen(false)} aria-label="Close quote">×</button>
      <div className="signal-quote-copy">
        <span aria-hidden="true">“</span>
        <blockquote><DecodeText key={quotes[quoteIndex]} text={quotes[quoteIndex]} byLine /></blockquote>
      </div>
      <button className="signal-quote-next" type="button" onClick={nextQuote}>
        <span>next</span><span aria-hidden="true">→</span>
      </button>
    </div>}
    <button className="signal-quote-launcher" type="button" aria-expanded={open} onClick={() => setOpen(current => !current)} aria-label={open ? "Close favorite quote" : "Show a favorite quote"} data-tooltip="quotes">
      <QuoteTextInline aria-hidden="true" />
    </button>
  </aside>;
}

export default function SignalPortfolio() {
  const [expandedSections, setExpandedSections] = useState<Set<Section>>(() => new Set());
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(() => new Set());
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(() => new Set());
  const [openedSections, setOpenedSections] = useState<Set<Section>>(() => new Set());
  const [openedJobs, setOpenedJobs] = useState<Set<number>>(() => new Set());
  const [openedProjects, setOpenedProjects] = useState<Set<number>>(() => new Set());

  const toggleSection = (next: Section) => {
    setOpenedSections(current => new Set(current).add(next));
    setExpandedSections(current => {
      const updated = new Set(current);
      if (updated.has(next)) updated.delete(next);
      else updated.add(next);
      return updated;
    });
  };

  const toggleJob = (index: number) => {
    setOpenedJobs(current => new Set(current).add(index));
    setExpandedJobs(current => {
      const updated = new Set(current);
      if (updated.has(index)) updated.delete(index);
      else updated.add(index);
      return updated;
    });
  };

  const toggleProject = (index: number) => {
    setOpenedProjects(current => new Set(current).add(index));
    setExpandedProjects(current => {
      const updated = new Set(current);
      if (updated.has(index)) updated.delete(index);
      else updated.add(index);
      return updated;
    });
  };

  return <div className="signal" id="top">
    <a className="signal-skip" href="#signal-main">Skip to content</a>
    <AtlantaClock />
    <main id="signal-main" className="signal-main">
      <Sequence stages={[
        <div className="signal-intro signal-name-stage" key="name">
          <h1><DecodeText text="Hadi Malik" /></h1>
        </div>,
        <div className="signal-verb-stage" key="verbs">
          <TypedVerbs />
        </div>,
        <div className="signal-index" aria-label="Portfolio sections" key="sections">
          <div className="signal-section">
            <SectionRow number="01" title="About me" meta="Introduction" open={expandedSections.has("about")} onClick={() => toggleSection("about")} />
            {openedSections.has("about") && <div className="signal-panel" id="signal-panel-about-me" hidden={!expandedSections.has("about")}>
              <DecodeTogether><p className="signal-about-copy"><DecodeText text="Studying computer science at Georgia Tech with a concentration in intelligence and cybersecurity. Interested in opportunities in software engineering, machine learning engineering, and security engineering." byLine /></p></DecodeTogether>
            </div>}
          </div>

          <div className="signal-section">
            <SectionRow number="02" title="Education" meta="Georgia Tech" open={expandedSections.has("education")} onClick={() => toggleSection("education")} />
            {openedSections.has("education") && <div className="signal-panel" id="signal-panel-education" hidden={!expandedSections.has("education")}>
              <DecodeTogether>
                <p className="signal-panel-label"><DecodeText text="GEORGIA INSTITUTE OF TECHNOLOGY" /></p>
                <div className="signal-degree"><span><DecodeText text="B.S. Computer Science" /></span><span><DecodeText text="December 2026" /></span></div>
                <div className="signal-degree"><span><DecodeText text="M.S. Computer Science" /></span><span><DecodeText text="May 2028" /></span></div>
              </DecodeTogether>
            </div>}
          </div>

          <div className="signal-section">
            <SectionRow number="03" title="Experience" meta="4 roles" open={expandedSections.has("experience")} onClick={() => toggleSection("experience")} />
            {openedSections.has("experience") && <div className="signal-panel" id="signal-panel-experience" hidden={!expandedSections.has("experience")}>
              <DecodeTogether>
                {jobPositions.map((job, index) => <div className="signal-detail-item" key={job.place + index}>
                  <DetailRow title={job.place === "Georgia Tech School of Cybersecurity and Privacy" ? "Georgia Tech" : job.place} subtitle={job.currentPosition} meta={job.timeline} open={expandedJobs.has(index)} onClick={() => toggleJob(index)} id={"signal-job-" + index} index={index} />
                  {openedJobs.has(index) && <div className="signal-detail-content" id={"signal-job-" + index} hidden={!expandedJobs.has(index)}>
                    <DecodeTogether>
                      <ul className="signal-bullets">{job.bullets.map(bullet => <li key={bullet}><DecodeText text={bullet} byLine /></li>)}</ul>
                      <Skills skills={job.skills} />
                    </DecodeTogether>
                  </div>}
                </div>)}
              </DecodeTogether>
            </div>}
          </div>

          <div className="signal-section">
            <SectionRow number="04" title="Projects" meta="5 projects" open={expandedSections.has("projects")} onClick={() => toggleSection("projects")} />
            {openedSections.has("projects") && <div className="signal-panel" id="signal-panel-projects" hidden={!expandedSections.has("projects")}>
              <DecodeTogether>
                {(["Machine learning", "Software engineering"] as const).map(category => <div className="signal-project-category" key={category}>
                  <p className="signal-panel-label"><DecodeText text={category.toUpperCase()} /></p>
                  {jobProjects.map((project, index) => project.category === category ? <div className="signal-detail-item" key={project.title}>
                    <DetailRow title={project.title} open={expandedProjects.has(index)} onClick={() => toggleProject(index)} id={"signal-project-" + index} index={index} />
                    {openedProjects.has(index) && <div className="signal-detail-content" id={"signal-project-" + index} hidden={!expandedProjects.has(index)}>
                      <DecodeTogether>
                        <ul className="signal-bullets">{project.bullets.map(bullet => <li key={bullet}><DecodeText text={bullet} byLine /></li>)}</ul>
                        <Skills skills={project.skills} />
                        {project.link && <a className="signal-project-link" href={project.link} target="_blank" rel="noopener noreferrer">
                          <span className="signal-project-link-icon"><Github size={15} aria-hidden="true" /></span>
                          <span className="signal-project-link-copy"><small>github</small><strong><DecodeText text="Open repository" /></strong></span>
                          <ArrowUpRight className="signal-project-link-arrow" size={14} aria-hidden="true" />
                        </a>}
                      </DecodeTogether>
                    </div>}
                  </div> : null)}
                </div>)}
              </DecodeTogether>
            </div>}
          </div>

          <div className="signal-section">
            <SectionRow number="05" title="Contact" meta="Email" open={expandedSections.has("contact")} onClick={() => toggleSection("contact")} />
            {openedSections.has("contact") && <div className="signal-panel" id="signal-panel-contact" hidden={!expandedSections.has("contact")}>
              <DecodeTogether><p className="signal-email"><DecodeText text="hmalik39 [at] gatech [dot] edu" /></p></DecodeTogether>
            </div>}
          </div>
        </div>,
        <div className="signal-links" key="links">
          <a className="signal-pixel-link" href="https://github.com/hadimalik12" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><PixelIconReveal><PixelGithub /></PixelIconReveal></a>
          <a className="signal-pixel-link" href="https://www.linkedin.com/in/hadimalik12/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><PixelIconReveal delay={90}><PixelLinkedin /></PixelIconReveal></a>
          <Link className="signal-pixel-link signal-resume-icon" href="/Hadi_Malik_Resume.pdf" prefetch={false} target="_blank" rel="noopener noreferrer" aria-label="Full résumé" title="Full résumé"><PixelIconReveal delay={180}><FileTextSharp /></PixelIconReveal></Link>
        </div>,
      ]} />
    </main>
    <SignalTerminal />
    <QuoteCorner />
  </div>;
}
