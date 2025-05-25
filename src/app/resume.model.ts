export interface ResumeModel {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    currentPosition: string;
    company: string;
    experienceYears: number;
    skills: string[];
    education: string[];
    industry: string;
    summary: string;
    lastActive: Date;
    resumeUpdated: Date;
    salary: string;
  }