"use client";
/* eslint-disable */

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 ">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          About
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-start text-muted-foreground lg:px-6">
          My interest in technology has always been driven by curiosity—
          understanding how things work—and a passion for building software that
          creates real impact in my community. Studying Artificial Intelligence
          and Cybersecurity at Georgia Tech, I focus on developing AI-powered
          solutions while learning how to secure these systems against modern
          threats.
        </p>
        <p className="text-start text-muted-foreground lg:px-6">
          This past summer, I worked as a Software Engineer at{" "}
          <span className="text-white font-medium">In Good Company Works</span>,
          a startup supporting managers of disabled employees. There, I built an
          AI advisor tool to help streamline workplace communication and
          accessibility. Previously, I interned at{" "}
          <span className="text-white font-medium">Verifacto Inc.</span>, an
          automotive SaaS company offering LMS and DMS solutions. I helped
          develop an AI chatbot that connected directly to customer databases to
          provide real-time support.
        </p>
        <p className="text-start text-muted-foreground lg:px-6">
          Outside of tech, I’d call myself an amateur athlete and a food enthusiast. I love playing pickup basketball
          with friends and watching LeBron dominate the NBA. I also loving checking out new food spots around town after a nice hoop session.
        </p>
      </div>
    </section>
  );
}