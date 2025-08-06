"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveUpRight } from "lucide-react";

const jobProjects = [
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/vulnscan.png",
    title: "VulnScan",
    description:
      "Developed a command-line vulnerability scanner for scanning local or remote networks. It performs port scanning, banner grabbing, maps detected services to CVEs using the NVD API, supports CPE matching and CVSS filtering, includes interactive host discovery, and exports results as HTML and JSON reports.",
    skills: [
      "Python",
      "Socket Programming",
      "Networking",
      "Multithreading",
      "Banner Grabbing",
      "CPE Matching",
      "CVSS Filtering",
      "NVD API",
      "Port Scanning"
    ],
    link: "https://github.com/hadimalik12/vulnerability-scanner",
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/wandersync.png",
    title: "WanderSync",
    description:
      "WanderSync is a travel planning app for organizing solo or group itineraries. Users can manage destinations, dining, accommodations, and travel notes, and collaborate in real time. Built with Firebase for authentication and data storage, the app supports live syncing, vacation tracking, and shared updates across user",
    skills: [
      "Java",
      "Android",
      "Firebase",
      "User Authentication",
      "UI Design",
      "Data Modeling",
      "Travel Planning",
      "Agile Development"
    ],
    link: "https://github.com/Benito-Karkada/CS2340C_Team27",
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/githublogo.png",
    title: "QuranID",
    description:
      "QuranID is a tool that identifies Quranic verses from spoken audio. It transcribes a user’s recitation using Google Cloud’s Speech-to-Text API and matches it to the closest verse using Levenshtein distance.",
    skills: [
      "Python",
      "Google Cloud Speech-to-Text",
      "Audio Processing",
      "Levenshtein Matching",
      "Speech Recognition",
    ],
    link: "https://github.com/hadimalik12/quranID",
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/hadimalikportfolio.png",
    title: "hadimalik.com",
    description:
      "My portfolio website (what you are currently viewing). Based on Brittany Chiang's website.",
    skills: ["Typescript", "JavaScript", "Tailwind CSS"],
    link: "https://github.com/hadimalik12/hadimalik-portfolio",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Projects
        </h2>
      </div>
      <>
        {jobProjects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:cursor-pointer"
          >
            <Card
              className="group lg:p-6 mb-4 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 rounded-lg bg-transparent border border-transparent transition-all duration-300 ease-in-out lg:hover:scale-[1.01] lg:hover:backdrop-blur-sm lg:hover:bg-white/5 lg:hover:border-white/10"
            >
              <CardHeader className="h-full w-full lg:w-1/3 mb-4 p-0">
                <Image
                  src={project.imagePath}
                  alt={`Screenshot of ${project.title}`}
                  width={1920}
                  height={1080}
                  priority
                  className="bg-[#141414] mt-2 border border-transparent rounded-md"
                />
              </CardHeader>
              <CardContent className="flex flex-col p-0 w-full lg:w-2/3">
                <p className="text-white font-bold group-hover:text-primary">
                  {project.title}{" "}
                  <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                </p>
                <CardDescription className="py-3 text-muted-foreground">
                  {project.description}
                </CardDescription>
                <CardFooter className="p-0 flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-gray-800 text-gray-300 hover:bg-gray-700 border-0"
                    >
                      {skill}
                    </Badge>
                  ))}
                </CardFooter>
              </CardContent>
            </Card>
          </a>
        ))}
      </>
    </section>
  );
}