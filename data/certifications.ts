export interface Certification {
  name: string;
  provider: "anthropic" | "udemy" | "platzi" | "other";
  url?: string;
}

export const certifications: Certification[] = [
  { name: "Claude Code in Action", provider: "anthropic" },
  { name: "Agent Skills", provider: "anthropic" },
  { name: "AI Fluency", provider: "anthropic" },
  { name: "Python", provider: "udemy" },
  { name: "React", provider: "platzi" },
  { name: "FastAPI", provider: "udemy" },
];
