// Shared portfolio content for the original site and layout previews.

export const jobPositions = [
  {
    timeline: "May 2026 – Aug 2026",
    currentPosition: "Software Engineer Intern",
    place: "Amazon",
    bullets: [
      "Built a debugging and analytics platform with React, S3, and CloudFront, used by 15+ Alexa Smart Home teams.",
      "Cut debug time by 4 hours by building data pipelines with REST APIs and Lambda to merge DynamoDB/CloudWatch data.",
      "Enabled sub-500ms analysis of millions of daily requests by deploying distributed systems on Lambda in NA/EU/FE.",
      "Automated 99% of tests by implementing integration tests with TestNG, JUnit, and seeded data to cover edge cases.",
    ],
    description:
      "Built a React, S3, and CloudFront debugging platform used by 15+ Alexa Smart Home teams. Connected DynamoDB and CloudWatch data through REST APIs and Lambda, cutting debug time by 4 hours and enabling sub-500ms analysis of millions of daily requests. Automated 99% of tests with integration coverage.",
    skills: ["React", "AWS Lambda", "S3", "CloudFront", "DynamoDB", "CloudWatch"],
    link: "https://www.amazon.com/alexa-smart-home/b?ie=UTF8&node=21442899011",
  },
  {
    timeline: "Aug 2025 – Present",
    currentPosition: "Machine Learning Research Assistant",
    place: "Georgia Tech School of Cybersecurity and Privacy",
    bullets: [
      "Co-authored the paper “Causal Model Provenance via Shard Witness Auditing” and submitted it to AISTATS 2026.",
      "Designed fine-tuning tests with Hugging Face Trainer, loss sequences, and MIN-K to identify training-data traces.",
      "Evaluated KGW watermarking with calibrated detectors to test whether training-data signals survive model fine-tuning.",
    ],
    description:
      "Researching model provenance and training-data traces with Prof. Vassilis Zikas. Co-authored “Causal Model Provenance via Shard Witness Auditing,” submitted to AISTATS 2026, and evaluated fine-tuning tests and KGW watermarking with calibrated detectors.",
    skills: ["Machine Learning", "Hugging Face", "Model Provenance", "Watermarking"],
    link: "https://faculty.cc.gatech.edu/~vzikas/",
  },
  {
    timeline: "May 2025 – Jul 2025",
    currentPosition: "Software Engineer Intern",
    place: "In Good Company Works",
    bullets: [
      "Created a full-stack AI advisor with React, Node.js, and Firebase, guiding 15 businesses across 50+ client sessions.",
      "Reduced onboarding time by 60% by building personalized RAG pipelines with OpenAI Responses API and LangChain.",
      "Cut backend latency by 50% by creating secure REST APIs with Node.js on GCP, OAuth 2.0, and JWT authentication.",
      "Increased user engagement by 20% by shipping a companion iOS app with Swift for personalized mobile AI guidance.",
    ],
    description:
      "Built a full-stack AI advisor used by 15 businesses across 50+ client sessions. Personalized RAG pipelines reduced onboarding time by 60%; secure Node.js APIs cut backend latency by 50%; a companion Swift app increased engagement by 20%.",
    skills: ["React", "Node.js", "Firebase", "RAG", "GCP", "Swift"],
    link: "https://abeltheadvisor.web.app",
  },
  {
    timeline: "May 2024 – Aug 2024",
    currentPosition: "Software Engineer Intern",
    place: "Verifacto Inc.",
    bullets: [
      "Achieved 99% accuracy on insurance documents by fine-tuning a LiLT classifier with PyTorch/HF Transformers.",
      "Improved query efficiency by 70% by migrating MySQL queries to MongoDB with vector indexes for fast data retrieval.",
      "Built an AI database chatbot using Python/LangChain, cutting time-to-insight by 60% via natural-language queries.",
    ],
    description:
      "Fine-tuned a LiLT classifier for insurance documents, achieving 99% accuracy. Migrated MySQL queries to MongoDB with vector indexes, improving query efficiency by 70%, and built a natural-language database chatbot that cut time-to-insight by 60%.",
    skills: ["Python", "PyTorch", "Hugging Face", "MongoDB", "LangChain"],
    link: "https://verifacto.com",
  },
];

export type Project = {
  category: "Machine learning" | "Software engineering";
  title: string;
  description: string;
  bullets: string[];
  skills: string[];
  link?: string;
  imagePath?: string;
};

export const jobProjects: Project[] = [
  {
    title: "Urology Report Generator",
    category: "Machine learning",
    description:
      "Built a MedGemma-based report generator tuned on 600+ studies, achieving 94.8% report similarity. An evaluation pipeline uses BiomedCLIP to flag potential hallucinations; FlashAttention increased image capacity 5x and brought report generation under 60 seconds.",
    bullets: [
      "Built a MedGemma-based report generator tuned on 600+ studies, achieving 94.8% report similarity.",
      "Used BiomedCLIP in an evaluation pipeline to flag potential hallucinations.",
      "Increased image capacity 5x with FlashAttention and brought report generation under 60 seconds.",
    ],
    skills: ["Python", "PyTorch", "OpenCV", "MedGemma", "LoRA", "Slurm"],
    link: "https://github.com/hadimalik12/urology_report_generator",
  },
  {
    title: "Credit Card Fraud Detector",
    category: "Machine learning",
    description:
      "Built a four-model fraud benchmark on 590K IEEE-CIS transactions, reaching 0.9007 ROC-AUC. Compared PCA and anomaly-detection methods; DBSCAN achieved 85.0% recall and 82.3% accuracy.",
    bullets: [
      "Built a four-model fraud benchmark on 590K IEEE-CIS transactions, reaching 0.9007 ROC-AUC.",
      "Compared PCA and anomaly-detection methods; DBSCAN achieved 85.0% recall and 82.3% accuracy.",
    ],
    skills: ["Python", "PyTorch", "scikit-learn", "PCA", "DBSCAN"],
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/vulnscan.png",
    title: "VulnScan",
    category: "Software engineering",
    description:
      "Developed a command-line vulnerability scanner for local and remote networks. It scans ports, grabs banners, maps services to CVEs through the NVD API, and exports HTML and JSON reports.",
    bullets: [
      "Developed a command-line vulnerability scanner for local and remote networks.",
      "Scans ports, grabs banners, maps services to CVEs through the NVD API, and exports HTML and JSON reports.",
    ],
    skills: ["Python", "Networking", "CPE Matching", "NVD API"],
    link: "https://github.com/hadimalik12/vulnerability-scanner",
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/wandersync.png",
    title: "WanderSync",
    category: "Software engineering",
    description:
      "Built an Android travel planner for shared itineraries, destinations, dining, accommodations, and notes, with Firebase authentication and real-time syncing.",
    bullets: [
      "Built an Android travel planner for shared itineraries, destinations, dining, accommodations, and notes.",
      "Added Firebase authentication and real-time syncing.",
    ],
    skills: ["Java", "Android", "Firebase", "UI Design"],
    link: "https://github.com/Benito-Karkada/CS2340C_Team27",
  },
  {
    imagePath: "https://hadimalik12.github.io/hadimalik-portfolio/hadimalikportfolio.png",
    title: "hadimalik.com",
    category: "Software engineering",
    description: "This portfolio website, built with Next.js, TypeScript, and Tailwind CSS.",
    bullets: [
      "Built this portfolio website with Next.js and TypeScript.",
      "Styled it with Tailwind CSS.",
    ],
    skills: ["TypeScript", "Next.js", "Tailwind CSS"],
    link: "https://github.com/hadimalik12/hadimalik-portfolio",
  },
];
