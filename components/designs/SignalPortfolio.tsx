"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { jobPositions, jobProjects } from "@/lib/portfolio";

type Section = "education" | "experience" | "projects" | "contact";

type DecodeRegistration = { complete: () => void; cancel: () => void };
const CompletionContext = createContext<(() => DecodeRegistration) | null>(null);

function Sequence({ stages }: { stages: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const advance = useCallback(() => setActive(current => current + 1), []);
  const ignore = useCallback(() => {}, []);
  // Keep every revealed stage in the same keyed list. Moving a completed stage
  // into a separate list remounts it and restarts its DecodeText animations.
  return <>{stages.slice(0, active + 1).map((stage, index) =>
    <DecodeGroup key={index} onComplete={index === active ? advance : ignore}>{stage}</DecodeGroup>
  )}</>;
}

function DecodeTogether({ children }: { children: ReactNode }) {
  // An expanded panel forms a separate simultaneous batch, independent of the
  // page's initial sequence and of other panels the visitor may open.
  return <CompletionContext.Provider value={null}>{children}</CompletionContext.Provider>;
}

const cipher = "0123456789-_+*/{}[]<>~^=:;#@%&";

function cipherAt(seed: number, position: number, tick: number) {
  let value = seed ^ Math.imul(position + 1, 0x45d9f3b) ^ Math.imul(tick + 1, 0x119de1f3);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return cipher[((value ^ (value >>> 16)) >>> 0) % cipher.length];
}

function DecodeText({ text }: { text: string }) {
  const register = useContext(CompletionContext);
  const registerRef = useRef(register);
  registerRef.current = register;
  const [motion, setMotion] = useState({ progress: 0, elapsed: 0 });
  const seed = useMemo(() => {
    let hash = 2166136261;
    for (const character of text) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
    return hash >>> 0;
  }, [text]);

  useEffect(() => {
    const registration = registerRef.current?.();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion({ progress: 1, elapsed: 0 });
      registration?.complete();
      return () => registration?.cancel();
    }
    let frame = 0;
    const start = performance.now();
    const duration = Math.min(2200, Math.max(1500, text.length * 18));
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
  }, [text]);

  // A soft sweep crossfades each glyph into its final letter. Words keep their
  // natural wrapping, and the settled text sheds the temporary animation spans.
  const sweep = motion.progress * motion.progress * (3 - 2 * motion.progress);
  let offset = 0;
  return <><span className="signal-decode" data-decoding={motion.progress < 1} aria-hidden="true">{motion.progress === 1 ? text : text.split(/(\s+)/).map((word, wordIndex) => {
    const wordStart = offset;
    offset += word.length;
    if (/^\s+$/.test(word)) return word;
    return <span className="signal-decode-word" key={wordIndex}>{Array.from(word, (character, index) => {
      const position = wordStart + index;
      const phase = Math.min(1, Math.max(0, (sweep - position / text.length * .78) / .22));
      const opacity = phase * phase * (3 - 2 * phase);
      const punctuation = ".,·:/()–—".includes(character);
      const tick = phase > 0 && phase < 1 ? Math.floor((motion.elapsed + position * 19) / 140) : 0;
      return <span className="signal-decode-character" key={index}>
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
  return <button className="signal-section-row" type="button" aria-expanded={open} aria-controls={open ? "signal-panel-" + title.toLowerCase() : undefined} onClick={onClick}>
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
    <main id="signal-main" className="signal-main">
      <Sequence stages={[
        <div className="signal-intro" key="name">
          <h1><DecodeText text="Hadi Malik" /><span className="signal-cursor" aria-hidden="true">_</span></h1>
        </div>,
        <div className="signal-intro" key="intro">
          <p className="signal-description">
            <span className="signal-intro-line"><DecodeText text="Studying computer science at Georgia Tech with a concentration in" /></span>
            <span className="signal-intro-line"><DecodeText text="intelligence and cybersecurity. Interested in opportunities in software" /></span>
            <span className="signal-intro-line"><DecodeText text="engineering, machine learning engineering, and security engineering." /></span>
          </p>
        </div>,
        <div className="signal-index" aria-label="Portfolio sections" key="sections">
          <div className="signal-section">
            <SectionRow number="01" title="Education" meta="Georgia Tech" open={expandedSections.has("education")} onClick={() => toggleSection("education")} />
            {openedSections.has("education") && <div className="signal-panel" id="signal-panel-education" hidden={!expandedSections.has("education")}>
              <DecodeTogether>
                <p className="signal-panel-label"><DecodeText text="GEORGIA INSTITUTE OF TECHNOLOGY" /></p>
                <div className="signal-degree"><span><DecodeText text="B.S. Computer Science" /></span><span><DecodeText text="December 2026" /></span></div>
                <div className="signal-degree"><span><DecodeText text="M.S. Computer Science" /></span><span><DecodeText text="May 2028" /></span></div>
              </DecodeTogether>
            </div>}
          </div>

          <div className="signal-section">
            <SectionRow number="02" title="Experience" meta="4 roles" open={expandedSections.has("experience")} onClick={() => toggleSection("experience")} />
            {openedSections.has("experience") && <div className="signal-panel" id="signal-panel-experience" hidden={!expandedSections.has("experience")}>
              <DecodeTogether>
                {jobPositions.map((job, index) => <div className="signal-detail-item" key={job.place + index}>
                  <DetailRow title={job.place === "Georgia Tech School of Cybersecurity and Privacy" ? "Georgia Tech" : job.place} subtitle={job.currentPosition} meta={job.timeline} open={expandedJobs.has(index)} onClick={() => toggleJob(index)} id={"signal-job-" + index} index={index} />
                  {openedJobs.has(index) && <div className="signal-detail-content" id={"signal-job-" + index} hidden={!expandedJobs.has(index)}>
                    <DecodeTogether>
                      <ul className="signal-bullets">{job.bullets.map(bullet => <li key={bullet}><DecodeText text={bullet} /></li>)}</ul>
                      <Skills skills={job.skills} />
                    </DecodeTogether>
                  </div>}
                </div>)}
              </DecodeTogether>
            </div>}
          </div>

          <div className="signal-section">
            <SectionRow number="03" title="Projects" meta="6 projects" open={expandedSections.has("projects")} onClick={() => toggleSection("projects")} />
            {openedSections.has("projects") && <div className="signal-panel" id="signal-panel-projects" hidden={!expandedSections.has("projects")}>
              <DecodeTogether>
                {(["Machine learning", "Software engineering"] as const).map(category => <div className="signal-project-category" key={category}>
                  <p className="signal-panel-label"><DecodeText text={category.toUpperCase()} /></p>
                  {jobProjects.map((project, index) => project.category === category ? <div className="signal-detail-item" key={project.title}>
                    <DetailRow title={project.title} open={expandedProjects.has(index)} onClick={() => toggleProject(index)} id={"signal-project-" + index} index={index} />
                    {openedProjects.has(index) && <div className="signal-detail-content" id={"signal-project-" + index} hidden={!expandedProjects.has(index)}>
                      <DecodeTogether>
                        <ul className="signal-bullets">{project.bullets.map(bullet => <li key={bullet}><DecodeText text={bullet} /></li>)}</ul>
                        <Skills skills={project.skills} />
                        {project.link && <a className="signal-project-link" href={project.link} target="_blank" rel="noopener noreferrer"><DecodeText text="View project" /> <ArrowUpRight size={14} aria-hidden="true" /></a>}
                      </DecodeTogether>
                    </div>}
                  </div> : null)}
                </div>)}
              </DecodeTogether>
            </div>}
          </div>

          <div className="signal-section">
            <SectionRow number="04" title="Contact" meta="School email" open={expandedSections.has("contact")} onClick={() => toggleSection("contact")} />
            {openedSections.has("contact") && <div className="signal-panel" id="signal-panel-contact" hidden={!expandedSections.has("contact")}>
              <DecodeTogether><p className="signal-email"><DecodeText text="hmalik39 [at] gatech [dot] edu" /></p></DecodeTogether>
            </div>}
          </div>
        </div>,
        <div className="signal-links" key="links">
          <a href="https://github.com/hadimalik12" target="_blank" rel="noopener noreferrer"><DecodeText text="GitHub" /> <ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href="https://www.linkedin.com/in/hadimalik12/" target="_blank" rel="noopener noreferrer"><DecodeText text="LinkedIn" /> <ArrowUpRight size={13} aria-hidden="true" /></a>
          <a className="signal-resume" href="/Hadi_Malik_Resume.pdf" target="_blank" rel="noopener noreferrer"><DecodeText text="Full résumé" /> <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>,
      ]} />
    </main>
  </div>;
}
