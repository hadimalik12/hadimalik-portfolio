"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveUpRight } from "lucide-react";

const jobPositions = [
  {
    timeline: "May 2026 – Aug 2026",
    currentPosition: "Software Engineer Intern",
    place: "Amazon",
    description:
      "Built a React, S3, and CloudFront debugging platform used by 15+ Alexa Smart Home teams. Connected DynamoDB and CloudWatch data through REST APIs and Lambda, cutting debug time by 4 hours and enabling sub-500ms analysis of millions of daily requests. Automated 99% of tests with integration coverage.",
    skills: ["React", "AWS Lambda", "S3", "CloudFront", "DynamoDB", "CloudWatch"],
    link: "https://www.amazon.com/alexa-smart-home/b?ie=UTF8&node=21442899011",
  },
  {
    timeline: "Aug 2025 – Present",
    currentPosition: "Machine Learning Research Assistant",
    place: "Georgia Tech School of Cybersecurity and Privacy",
    description:
      "Researching model provenance and training-data traces with Prof. Vassilis Zikas. Co-authored “Causal Model Provenance via Shard Witness Auditing,” submitted to AISTATS 2026, and evaluated fine-tuning tests and KGW watermarking with calibrated detectors.",
    skills: ["Machine Learning", "Hugging Face", "Model Provenance", "Watermarking"],
    link: "https://faculty.cc.gatech.edu/~vzikas/",
  },
  {
    timeline: "May 2025 – Jul 2025",
    currentPosition: "Software Engineer Intern",
    place: "In Good Company Works",
    description:
      "Built a full-stack AI advisor used by 15 businesses across 50+ client sessions. Personalized RAG pipelines reduced onboarding time by 60%; secure Node.js APIs cut backend latency by 50%; a companion Swift app increased engagement by 20%.",
    skills: ["React", "Node.js", "Firebase", "RAG", "GCP", "Swift"],
    link: "https://abeltheadvisor.web.app",
  },
  {
    timeline: "May 2024 – Aug 2024",
    currentPosition: "Software Engineer Intern",
    place: "Verifacto Inc.",
    description:
      "Fine-tuned a LiLT classifier for insurance documents, achieving 99% accuracy. Migrated MySQL queries to MongoDB with vector indexes, improving query efficiency by 70%, and built a natural-language database chatbot that cut time-to-insight by 60%.",
    skills: ["Python", "PyTorch", "Hugging Face", "MongoDB", "LangChain"],
    link: "https://verifacto.com",
  },
];

export default function ExpCard() {
  return (
    <section id="experience" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">Experience</h2>
      </div>
      {jobPositions.map((job, index) => (
        <div key={job.place}>
          <a href={job.link} target="_blank" rel="noopener noreferrer" className="hover:cursor-pointer">
            <Card className="glass-card group lg:p-6 mb-4 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 rounded-lg bg-transparent border border-transparent shadow-none">
              <CardHeader className="h-full lg:w-40 shrink-0 p-0">
                <CardTitle className="text-base text-muted-foreground whitespace-nowrap">{job.timeline}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col p-0 w-full">
                <p className="text-foreground group-hover:text-primary transition-colors duration-300">
                  {job.currentPosition} • {job.place}
                  <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                </p>
                <CardDescription className="py-3 text-muted-foreground">{job.description}</CardDescription>
                <CardFooter className="p-0 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-0">{skill}</Badge>
                  ))}
                </CardFooter>
              </CardContent>
            </Card>
          </a>
          {index < jobPositions.length - 1 && <div className="my-4 h-px w-full bg-white/10" />}
        </div>
      ))}
    </section>
  );
}
