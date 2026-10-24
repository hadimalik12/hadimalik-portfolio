"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveUpRight } from "lucide-react";

import { jobPositions } from "@/lib/portfolio";

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
