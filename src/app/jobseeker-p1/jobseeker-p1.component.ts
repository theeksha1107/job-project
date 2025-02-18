import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jobseeker-p1',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // No HttpClientModule needed
  templateUrl: './jobseeker-p1.component.html',
  styleUrls: ['./jobseeker-p1.component.css']
})
export class JobseekerP1Component {
  searchText: string = '';
  skillset: string = '';
  city: string = '';
  experience: string = '';
  workMode: string = '';
  selectedJob: any = null;
  selectedFile: File | null = null;
  applicantName: string = '';
  applicantEmail: string = '';

  jobs = [
    {
      title: "Software Engineer",
      company: "Google",
      location: "Bangalore, India",
      experience: "2+ years",
      workMode: "Remote",
      skillset: "JavaScript, Angular, TypeScript",
      salary: "₹10L - ₹12.5L",
      description: "Google is a multinational company focused on AI, cloud computing, and internet services.",
      responsibilities: [
        "Develop high-quality web applications",
        "Collaborate with cross-functional teams",
        "Maintain and enhance software performance"
      ],
      contact: "sivakumarlogesh3@gmail.com",
      website: "https://careers.google.com"
    },
    {
      title: "UI/UX Designer",
      company: "Meta",
      location: "Mumbai, India",
      experience: "3+ years",
      workMode: "Hybrid",
      skillset: "Figma, Adobe XD, User Research",
      salary: "₹7.5L - ₹9L",
      description: "Meta is a leader in social networking, metaverse technologies, and digital interactions.",
      responsibilities: [
        "Design engaging user interfaces",
        "Conduct user research and usability tests",
        "Collaborate with developers and product teams"
      ],
      contact: "jobs@meta.com",
      website: "https://www.metacareers.com"
    },
    {
      title: "Data Scientist",
      company: "Microsoft",
      location: "Hyderabad, India",
      experience: "5+ years",
      workMode: "On-Site",
      skillset: "Python, Machine Learning, AI",
      salary: "₹12L - ₹15L",
      description: "Microsoft pioneers software, cloud computing, and AI-driven technologies.",
      responsibilities: [
        "Analyze large data sets for insights",
        "Build predictive models and machine learning algorithms",
        "Optimize AI performance"
      ],
      contact: "hr@microsoft.com",
      website: "https://careers.microsoft.com"
    }
  ];

  skillsets = ["JavaScript", "Angular", "Python", "Machine Learning", "React"];
  cities = ["Bangalore, India", "Mumbai, India", "Hyderabad, India"];
  experiences = ["1+ years", "2+ years", "3+ years"];
  workModes = ["Remote", "Hybrid", "On-Site"];

  get filteredJobs() {
    return this.jobs.filter(job =>
      (this.searchText === '' || job.title.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (this.skillset === '' || job.skillset.includes(this.skillset)) &&
      (this.city === '' || job.location === this.city) &&
      (this.experience === '' || job.experience === this.experience) &&
      (this.workMode === '' || job.workMode === this.workMode)
    );
  }

  openJobDetails(job: any) {
    this.selectedJob = job;
  }

  closeJobDetails() {
    this.selectedJob = null;
  }

  applyJob(job: any) {
    alert(`You have applied to the job: ${job.title} at ${job.company}`);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  applyForJob() {
    if (!this.selectedFile) {
      alert("Please upload your resume.");
      return;
    }
    if (!this.applicantName || !this.applicantEmail) {
      alert("Please fill in your name and email.");
      return;
    }

    const formData = new FormData();
    formData.append("name", this.applicantName);
    formData.append("email", this.applicantEmail);
    formData.append("resume", this.selectedFile);
    formData.append("job_title", this.selectedJob.title);
    formData.append("company", this.selectedJob.company);

    fetch("http://localhost:8000/apply", {
      method: "POST",
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(() => {
      alert("Application submitted successfully!");
      this.closeJobDetails();
    })
    .catch(error => {
      alert("Error submitting application: " + error.message);
    });
  }
}
