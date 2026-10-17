"use client";

export default function About() {
  return (
    <section id="about" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">About</h2>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-start text-muted-foreground lg:px-6">
          I’m studying Computer Science at Georgia Tech, where I’ll complete my B.S. in December 2026 and my M.S. in May 2028. I’m drawn to the intersection of software engineering, machine learning, and security: building systems that work well at scale and earn people’s trust.
        </p>
        <p className="text-start text-muted-foreground lg:px-6">
          At <span className="text-white font-medium">Amazon</span>, I built debugging and analytics tools for Alexa Smart Home teams. I also research model provenance and training-data signals with Georgia Tech’s School of Cybersecurity and Privacy. Earlier, I built AI products at <span className="text-white font-medium">In Good Company Works</span> and <span className="text-white font-medium">Verifacto</span>.
        </p>
        <p className="text-start text-muted-foreground lg:px-6">
          Outside of tech, I enjoy pickup basketball and discovering new food spots around town.
        </p>
      </div>
    </section>
  );
}
