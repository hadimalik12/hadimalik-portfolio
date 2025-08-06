"use client";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Contact
        </h2>
      </div>
      <div className="flex flex-col gap-2 lg:px-6 mb-8">
        <p className="text-muted-foreground text-sm lg:text-base lg:text-start">
          Thank you for your interest in me and/or my work. I am open to any feedback, questions, suggestions, or opportunities you may have. Feel free to reach me at:{" "}
          <span className="text-foreground font-medium">
            hmalik39 [at] gatech [dot] edu
          </span>
        </p>
      </div>
    </section>
  );
}