"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight, MoveUpRight } from "lucide-react";

const jobPositions = [
  {
    timeline: "May 2025 — Jul 2025",
    currentPosition: "Software Engineer Intern",
    place: "In Good Company Works",
    previousPositions: [""],
    description:
      "Developed an AI advisor to support businesses employing individuals with disabilities. I built the chatbot from scratch while collaborating closely with the design team, and later created a companion iOS app. After launch, I worked with test users to gather feedback and iterate on the experience.",
    skills: [
      "Retreival Augmented Generation (RAG)",
      "LLMs",
      "Next.js",
      "Firebase",
      "iOS Development",
      "Google Cloud Platform",
      "UI/UX Design",
      "User Testing",
    ],
    link: "https://abeltheadvisor.web.app",
  },
  {
    timeline: "May 2024 — Aug 2024",
    currentPosition: "Software Engineer Intern",
    place: "Verifacto Inc.",
    previousPositions: [""],
    description:
      "Trained an AI model on thousands of insurance documents to identify and extract relevant fields. Also developed an AI-powered chatbot that enables customers to query and retrieve information from their databases. Additionally, localized the company’s website by translating its content into Spanish.",
    skills: [
      "LLMs",
      "LangChain",
      "SQL",
      "PHP",
      "MongoDB",
    ],
    link: "https://verifacto.com",
  },
  {
    timeline: "Jan 2024 — Present",
    currentPosition: "Data Science Research Assistant",
    place: "Georgia Tech VIP - ACT Driving Simulator",
    previousPositions: [""],
    description:
      "Analyzed raw EEG data representing electrical activity from eight regions of the brain to determine patterns of brain activity and assess whether users were exhibiting signs of stress.",
    skills: [
      "MATLAB",
      "EEGLAB",
      "Data Analysis",
      "Data Preprocessing",
      "CUMSUM Novelty Detection",
    ],
    link: "https://sites.gatech.edu/actlab/",
  },
  {
    timeline: "Sep 2024 — Dec 2024",
    currentPosition: "iOS Developer",
    place: "GT iOS Club - Smarty Pants",
    previousPositions: [""],
    description:
      "Collaborated with a team of 20+ students to develop SmartyPants, an iOS app designed to help students form study groups across campus. I was responsible for building the profile page, where users could store their name, email, major, preferred programming languages, meeting format, ideal group size, etc. Our team won \"Best Design\" at club showcase.",
    skills: [
      "Swift",
      "SwiftUI",
      "UIImagePickerController",
      "Firebase",
    ],
    link: "https://github.com/gtiosclub/SmartyPants",
  },
  {
    timeline: "Jan 2023 - May 2024",
    currentPosition: "Web and Salesforce Developer",
    place: "Darul Huda Inc.",
    previousPositions: [""],
    description:
      "I integrated Salesforce and Mailchimp to automate the tuition collection process for our evening classes, replacing the previous manual system. I also made updates to the website and spent time teaching as an instructor, directly supporting student learning.",
    skills: [
      "Salesforce",
      "Mailchimp",
      "Excel",
      "WordPress",
      "Teaching",
    ],
    link: "https://darulhudamasjid.com",
  },
];

export default function ExpCard() {
  return (
    <section id="experience" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Experience
        </h2>
      </div>
      <>
        {jobPositions.map((job, index) => (
          <div key={index}>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:cursor-pointer"
            >
              <Card
                className="group lg:p-6 mb-4 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 rounded-lg bg-transparent border border-transparent transition-all duration-300 ease-in-out lg:hover:scale-[1.01] lg:hover:backdrop-blur-sm lg:hover:bg-white/5 lg:hover:border-white/10"
              >
                <CardHeader className="h-full lg:w-40 shrink-0 p-0">
                  <CardTitle className="text-base text-muted-foreground whitespace-nowrap">
                    {job.timeline}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col p-0 w-full">
                  <p className="text-white group-hover:text-primary">
                    {job.currentPosition} • {job.place}
                    <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                  </p>

                  {job.previousPositions.map((position, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">
                      {position}
                    </p>
                  ))}

                  <CardDescription className="py-3 text-muted-foreground">
                    {job.description}
                  </CardDescription>

                  <CardFooter className="p-0 flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        className="bg-gray-800 text-gray-300 hover:bg-gray-700 border-0"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </CardFooter>
                </CardContent>
              </Card>
            </a>

            {index < jobPositions.length - 1 && (
              <div className="my-4 h-px w-full bg-white/10" />
            )}
          </div>
        ))}
      </>
      <div className="lg:pl-6 mt-12">
        <a
          href="https://hadimalik12.github.io/hadimalik-portfolio/Hadi_Malik_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-medium leading-tight text-emerald-400 group"
        >
          <span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">
            View Full Resume
          </span>
          <MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
        </a>
      </div>
    </section>
  );
}