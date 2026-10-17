"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight, MoveUpRight } from "lucide-react";

type Project = {
  title: string;
  description: string;
  skills: string[];
  link?: string;
  imagePath?: string;
};

const jobProjects: Project[] = [
  {
    title: "Urology Report Generator",
    description:
      "Built a MedGemma-based report generator tuned on 600+ studies, achieving 94.8% report similarity. An evaluation pipeline uses BiomedCLIP to flag potential hallucinations; FlashAttention increased image capacity 5x and brought report generation under 60 seconds.",
    skills: ["Python", "PyTorch", "OpenCV", "MedGemma", "LoRA", "Slurm"],
    link: "https://github.com/hadimalik12/urology_report_generator",
  },
  {
    title: "Credit Card Fraud Detector",
    description:
      "Built a four-model fraud benchmark on 590K IEEE-CIS transactions, reaching 0.9007 ROC-AUC. Compared PCA and anomaly-detection methods; DBSCAN achieved 85.0% recall and 82.3% accuracy.",
    skills: ["Python", "PyTorch", "scikit-learn", "PCA", "DBSCAN"],
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/vulnscan.png",
    title: "VulnScan",
    description:
      "Developed a command-line vulnerability scanner for local and remote networks. It scans ports, grabs banners, maps services to CVEs through the NVD API, and exports HTML and JSON reports.",
    skills: ["Python", "Networking", "CPE Matching", "NVD API"],
    link: "https://github.com/hadimalik12/vulnerability-scanner",
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/wandersync.png",
    title: "WanderSync",
    description:
      "Built an Android travel planner for shared itineraries, destinations, dining, accommodations, and notes, with Firebase authentication and real-time syncing.",
    skills: ["Java", "Android", "Firebase", "UI Design"],
    link: "https://github.com/Benito-Karkada/CS2340C_Team27",
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/githublogo.png",
    title: "QuranID",
    description:
      "Created a tool that identifies Quranic verses from spoken audio using Google Cloud Speech-to-Text and Levenshtein matching.",
    skills: ["Python", "Speech-to-Text", "Audio Processing"],
    link: "https://github.com/hadimalik12/quranID",
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/hadimalikportfolio.png",
    title: "hadimalik.com",
    description: "This portfolio website, built with Next.js, TypeScript, and Tailwind CSS.",
    skills: ["TypeScript", "Next.js", "Tailwind CSS"],
    link: "https://github.com/hadimalik12/hadimalik-portfolio",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group lg:p-6 mb-4 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 rounded-lg bg-transparent border border-transparent transition-all duration-300 ease-in-out lg:hover:scale-[1.01] lg:hover:backdrop-blur-sm lg:hover:bg-white/5 lg:hover:border-white/10">
      {project.imagePath && (
        <CardHeader className="h-full w-full lg:w-1/3 mb-4 p-0">
          <Image
            src={project.imagePath}
            alt={`Screenshot of ${project.title}`}
            width={1920}
            height={1080}
            className="bg-[#141414] mt-2 border border-transparent rounded-md"
          />
        </CardHeader>
      )}
      <CardContent className={`flex flex-col p-0 w-full ${project.imagePath ? "lg:w-2/3" : ""}`}>
        <p className="text-white font-bold group-hover:text-primary">
          {project.title}
          {project.link && <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />}
        </p>
        <CardDescription className="py-3 text-muted-foreground">{project.description}</CardDescription>
        <CardFooter className="p-0 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <Badge key={skill} className="bg-gray-800 text-gray-300 hover:bg-gray-700 border-0">{skill}</Badge>
          ))}
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">Projects</h2>
      </div>
      {jobProjects.map((project, index) => (
        <div key={project.title}>
          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:cursor-pointer">
              <ProjectCard project={project} />
            </a>
          ) : (
            <ProjectCard project={project} />
          )}
          {index < jobProjects.length - 1 && <div className="my-4 h-px w-full bg-white/10" />}
        </div>
      ))}
      <div className="lg:pl-6 mt-12">
        <a href="https://hadimalik12.github.io/hadimalik-portfolio/Hadi_Malik_Resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-medium leading-tight text-emerald-400 group">
          <span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">View Full Resume</span>
          <MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
        </a>
      </div>
    </section>
  );
}
