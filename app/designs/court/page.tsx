import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Plus } from "lucide-react";
import CourtViewport from "@/components/court/CourtViewport";
import { jobPositions, jobProjects, type Project } from "@/lib/portfolio";
import "./court.css";

export const metadata: Metadata = { title: "Hadi Malik · The court", description: "I build software. I love basketball. Explore Hadi Malik’s experience and projects on the court." };

function ExperienceList() {
  return <div className="court-jobs">{jobPositions.map(job => <details key={job.place} className="court-job">
    <summary><span className="court-job-name"><span className="court-date">{job.timeline}</span><strong>{job.place.startsWith("Georgia") ? "Georgia Tech" : job.place}</strong><span>{job.currentPosition}</span></span><Plus size={18} className="court-expand" /></summary>
    <div className="court-job-detail"><ul>{job.bullets.map(b => <li key={b}>{b}</li>)}</ul><div className="court-tags">{job.skills.map(s => <span key={s}>{s}</span>)}</div></div>
  </details>)}</div>;
}

function ProjectCard({ project }: { project: Project }) {
  return <article className="court-project">
    <h3>{project.link ? <a href={project.link} target="_blank" rel="noopener noreferrer">{project.title}<ArrowUpRight size={18} /></a> : project.title}</h3>
    <p>{project.description}</p><div className="court-tags">{project.skills.map(s => <span key={s}>{s}</span>)}</div>
  </article>;
}

export default function CourtPage() {
  return <div className="court-page">
    <a className="court-skip" href="#court-index">Skip animation and browse all work</a>
    <div className="court-stage"><CourtViewport /><div className="court-vignette" /></div>
    <div className="court-progress" aria-hidden="true"><span data-court-label>Introduction</span><div><i data-court-progress /></div></div>
    <main className="court-story" id="court-top">
      <section className="court-intro court-chapter" data-court-scene="0" data-court-name="Introduction" aria-labelledby="court-title">
        <div className="court-intro-copy">
          <p className="court-eyebrow">Software engineer · Georgia Tech</p>
          <h1 id="court-title">HADI<br />MALIK</h1>
          <p className="court-intro-description">I build software.<br />I love basketball.</p>
          <div className="court-socials">
            <a href="https://github.com/hadimalik12" target="_blank" rel="noopener noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={12} /></a>
            <a href="https://www.linkedin.com/in/hadimalik12/" target="_blank" rel="noopener noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} /></a>
            <a href="/Hadi_Malik_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={12} /></a>
          </div>
        </div>
        <a className="court-scroll-cue" href="#court-education"><ArrowDown size={18} /> Scroll to explore</a>
      </section>

      <section className="court-chapter" id="court-education" data-court-scene="1" data-court-name="Education" aria-labelledby="education-title">
        <div className="court-panel court-education"><p className="court-eyebrow">Education</p><h2 id="education-title">Georgia Tech</h2>
          <div className="court-degree"><h3>B.S. Computer Science</h3><p>Expected December 2026</p></div>
          <div className="court-degree"><h3>M.S. Computer Science</h3><p>Expected May 2028</p></div>
        </div>
      </section>

      <section className="court-chapter" id="court-work" data-court-scene="2" data-court-name="Experience" aria-labelledby="experience-title">
        <div className="court-panel"><div className="court-section-heading"><h2 id="experience-title">Experience</h2><a className="court-text-link court-resume" href="/Hadi_Malik_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={14} /></a></div><ExperienceList /></div>
      </section>

      {(["Machine learning", "Software engineering"] as const).map((category, i) => <section key={category} className="court-chapter court-project-chapter" id={i === 0 ? "court-projects" : "court-software"} data-court-scene={3 + i} data-court-name={category} aria-labelledby={`category-${i}`}>
        <div className="court-panel"><p className="court-eyebrow">Projects</p><h2 id={`category-${i}`}>{category}</h2><div className="court-project-grid">{jobProjects.filter(p => p.category === category).map(p => <ProjectCard key={p.title} project={p} />)}</div></div>
      </section>)}

      <section className="court-chapter court-finish" id="court-contact" data-court-scene="5" data-court-name="Contact" aria-labelledby="contact-title">
        <div className="court-panel"><h2 id="contact-title">Contact</h2><p className="court-email">hmalik39 [at] gatech [dot] edu</p><a className="court-browse" href="#court-index">Browse all experience & projects <ArrowDown size={16} /></a></div>
      </section>

      <section className="court-directory" id="court-index" data-court-scene="6" data-court-name="All work" aria-labelledby="all-work-title">
        <div className="court-directory-panel"><div className="court-section-heading"><h2 id="all-work-title">All work</h2><a className="court-text-link" href="#court-top">Back to start ↑</a></div>
          <div className="court-directory-grid"><div><h3>Experience</h3><ExperienceList /></div><div><h3>Projects</h3>
            {(["Machine learning", "Software engineering"] as const).map(category => <div className="court-directory-projects" key={category}><h4>{category}</h4>{jobProjects.filter(p => p.category === category).map(p => <details className="court-project-detail" key={p.title}><summary>{p.title}<Plus size={16} className="court-expand" /></summary><div><p>{p.description}</p><div className="court-tags">{p.skills.map(s => <span key={s}>{s}</span>)}</div>{p.link && <a className="court-text-link" href={p.link} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={14} /></a>}</div></details>)}</div>)}
          </div></div>
          <footer><span>Hadi Malik</span><span>hmalik39 [at] gatech [dot] edu</span><a className="court-text-link" href="/Hadi_Malik_Resume.pdf" target="_blank" rel="noopener noreferrer">Full résumé <ArrowUpRight size={14} /></a></footer>
        </div>
      </section>
    </main>
  </div>;
}
