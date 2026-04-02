export interface Certification {
  name: string;
  provider: "anthropic" | "udemy" | "platzi" | "other";
  url?: string;
}

export const certifications: Certification[] = [
  { name: "Claude Code in Action", provider: "anthropic", url: "" },
  { name: "Agent Skills", provider: "anthropic", url: "" },
  { name: "AI Fluency", provider: "anthropic", url: "" },
  { name: "Python", provider: "udemy", url: "" },
  { name: "React", provider: "platzi", url: "" },
  { name: "FastAPI", provider: "udemy", url: "" },
];
