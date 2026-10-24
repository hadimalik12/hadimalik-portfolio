import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Github, Linkedin } from "lucide-react";
import { jobPositions, jobProjects, type Project } from "@/lib/portfolio";
import GlassCard, { CursorGlow } from "./GlassCard";

export const variants = [
  { id: "studio", name: "Studio", description: "A spacious showcase" },
  { id: "grid", name: "Grid", description: "A modular overview" },
  { id: "focus", name: "Focus", description: "A personal field guide" },
] as const;
export type Variant = (typeof variants)[number]["id"];
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function SocialLinks() {
  return <div className="pd-socials">
    <a href="https://github.com/hadimalik12" {...external} aria-label="GitHub"><Github size={18} /></a>
    <a href="https://www.linkedin.com/in/hadimalik12/" {...external} aria-label="LinkedIn"><Linkedin size={18} /></a>
  </div>;
}

function SectionHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return <div className="pd-section-heading"><h2 className="pd-section-title">{title}</h2>{children}</div>;
}

function Hero({ variant }: { variant: Variant }) {
  return <section className="pd-hero" aria-labelledby="pd-title">
    <div className="pd-hero-copy">
      <p className="pd-label pd-hero-eyebrow"><span className="pd-dot" /> Software engineer · Georgia Tech</p>
      <h1 id="pd-title">Hadi Malik</h1>
      <div className="pd-actions">
        <a href="#experience" className="pd-button pd-button-primary">Experience <ArrowDown size={16} /></a>
        <a href="/Hadi_Malik_Resume.pdf" {...external} className="pd-button">View résumé <ArrowUpRight size={16} /></a>
      </div>
      {variant !== "focus" && <SocialLinks />}
      {variant === "focus" && <><nav className="pd-side-nav" aria-label="Sections"><a href="#education">Education <ArrowRight size={15} /></a><a href="#experience">Experience <ArrowRight size={15} /></a><a href="#projects">Projects <ArrowRight size={15} /></a><a href="#contact">Contact <ArrowRight size={15} /></a></nav><SocialLinks /></>}
    </div>
    <div className="pd-portrait-panel">
      <div className="pd-portrait-orbit" aria-hidden="true" />
      <Image className="pd-avatar" src="/avatar.png" alt="Hadi’s illustrated avatar" width={480} height={480} priority />
    </div>
    <div className="pd-focus-strip"><span>Looking for opportunities in:</span><div><span>Software engineering</span><span>Machine learning engineering</span><span>Security engineering</span></div></div>
  </section>;
}

function Education() {
  return (
    <section id="education" className="pd-education-section pd-section">
      <SectionHeading title="Education" />
      <div className="pd-degree-grid">
        <GlassCard className="pd-degree">
          <span className="pd-school">Georgia Tech</span>
          <h3>B.S. Computer Science</h3>
          <span>Expected December 2026</span>
        </GlassCard>
        <GlassCard className="pd-degree">
          <span className="pd-school">Georgia Tech</span>
          <h3>M.S. Computer Science</h3>
          <span>Expected May 2028</span>
        </GlassCard>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="pd-experience pd-section">
      <SectionHeading title="Experience">
        <a className="pd-text-link pd-resume-link" href="/Hadi_Malik_Resume.pdf" {...external}>
          Full résumé <ArrowUpRight size={16} />
        </a>
      </SectionHeading>
      <div className="pd-experience-cards">
        {jobPositions.map((job) => (
          <GlassCard key={job.place} className="pd-experience-card" href={job.link} label={`${job.place} — ${job.currentPosition} (opens in a new tab)`}>
            <div className="pd-experience-date">{job.timeline}</div>
            <div className="pd-experience-body">
              <div className="pd-experience-title">
                <h3>{job.place === "Georgia Tech School of Cybersecurity and Privacy" ? "Georgia Tech" : job.place}</h3>
                <ArrowUpRight className="pd-card-arrow" size={19} aria-hidden="true" />
              </div>
              <p className="pd-experience-role">{job.currentPosition}</p>
              <ul className="pd-experience-bullets">
                {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              <ul className="pd-skills" aria-label="Technologies and skills">
                {job.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <GlassCard className="pd-work-card" href={project.link} label={project.link ? `${project.title} on GitHub (opens in a new tab)` : undefined}>
      <div className="pd-work-title"><h4>{project.title}</h4>{project.link && <ArrowUpRight className="pd-card-arrow" size={18} aria-hidden="true" />}</div>
      <p>{project.description}</p>
      <ul className="pd-skills" aria-label="Technologies">
        {project.skills.map((skill) => <li key={skill}>{skill}</li>)}
      </ul>
    </GlassCard>
  );
}

function Projects() {
  const categories = ["Machine learning", "Software engineering"] as const;
  return (
    <section id="projects" className="pd-projects pd-section">
      <SectionHeading title="Projects" />
      {categories.map((category) => (
        <section className="pd-work-group" key={category} aria-labelledby={`projects-${category.replaceAll(" ", "-")}`}>
          <h3 id={`projects-${category.replaceAll(" ", "-")}`}>{category}</h3>
          <div className="pd-work-grid">
            {jobProjects.filter((project) => project.category === category).map((project) => <ProjectCard key={project.title} project={project} />)}
          </div>
        </section>
      ))}
    </section>
  );
}

function Contact() {
  return <section id="contact" className="pd-contact pd-section"><SectionHeading title="Contact" /><p className="pd-contact-address">hmalik39 [at] gatech [dot] edu</p></section>;
}

export default function PortfolioDesign({ variant }: { variant: Variant }) {
  return <div className={`pd pd-${variant}`}>
    <CursorGlow />
    <a className="pd-skip" href="#portfolio-main">Skip to content</a>
    <aside className="pd-design-bar" aria-label="Design comparison"><Link href="/" className="pd-original">← Original</Link><nav aria-label="Choose a layout">{variants.map(item => <Link key={item.id} href={`/designs/${item.id}`} aria-current={variant === item.id ? "page" : undefined}><span>{item.name}</span><span className="pd-option-description">{item.description}</span></Link>)}</nav><span className="pd-exploration-label">Layout explorations</span></aside>
    <div className="pd-shell"><header className="pd-header"><a href="#top" className="pd-wordmark" aria-label="Hadi Malik, back to top">hm</a><nav aria-label="Main navigation"><a href="#education">Education</a><a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#contact">Contact</a></nav></header>
      <main id="portfolio-main"><div id="top" /><Hero variant={variant} /><div className="pd-content"><Education /><Experience /><Projects /><Contact /></div></main>
      <footer className="pd-footer"><a className="pd-wordmark" href="#top">hm</a><span>Hadi Malik</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></footer>
    </div>
  </div>;
}
