import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero-copy reveal">
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true" />
          Building thoughtful software
        </p>
        <h1 id="hero-title">Hadi Malik</h1>
        <p className="hero-intro">
          Software engineer exploring the space where intelligent systems,
          secure infrastructure, and human-centered products meet.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            Explore my work <ArrowDown size={17} aria-hidden="true" />
          </a>
          <a
            className="button button-secondary"
            href="/Hadi_Malik_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View resume <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <p className="hero-location">
          <MapPin size={16} aria-hidden="true" /> Atlanta, Georgia
        </p>
      </div>

      <div className="hero-visual reveal reveal-delay" aria-hidden="true">
        <div className="portrait-frame">
          <Image
            src="/avatar.png"
            alt=""
            width={480}
            height={480}
            priority
            className="portrait"
          />
        </div>
        <div className="hero-note hero-note-top">
          <span className="note-label">Focus</span>
          <strong>AI + Security</strong>
        </div>
        <div className="hero-note hero-note-bottom">
          <span className="note-label">Currently</span>
          <strong>Georgia Tech</strong>
        </div>
      </div>

      <a className="scroll-cue" href="#about" aria-label="Scroll to about section">
        <span>Scroll to discover</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}
