import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-hot-job',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule,FormsModule],
  templateUrl: './post-hot-job.component.html',
  styleUrls: ['./post-hot-job.component.css']
})
export class PostHotJobComponent implements OnInit {
  // Job posting form
  jobPostForm: FormGroup;
  isPostingJob = false;
  isNavbarOpen = false;
  openDropdownId: string | null = null;
  
  // Dropdown options
  locations: string[] = ['Remote', 'Bangalore', 'chennai', 'mumbai'];
  experiences: string[] = ['0-1 Years', '1-3 Years', '3-5 Years', '5-8 Years', '8+ Years'];
  jobTypes: string[] = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  workModes: string[] = ['Remote', 'Hybrid', 'On-site'];
  salaryRanges: string[] = ['30k-50k', '50k-80k', '80k-1L'];

  // Filter states
  filters = {
    location: '',
    experience: '',
    jobType: '',
    workMode: '',
    salaryRange: '',
    skills: ''
  };

  // Sample jobs data
  jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechSolutions Inc.',
      location: 'Remote',
      experience: '3-5 Years',
      salary: '80k-120k',
      jobType: 'Full-time',
      workMode: 'Remote',
      skills: ['Angular', 'TypeScript', 'HTML', 'CSS', 'React'],
      description: 'We are looking for a Senior Frontend Developer with strong experience in Angular and TypeScript. The ideal candidate will have a solid understanding of web technologies and a passion for creating responsive user interfaces.',
      postedDate: new Date('2025-03-20'),
      deadline: new Date('2025-04-20'),
      applicants: 45
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'DataDriven Co.',
      location: 'Bangalore',
      experience: '5-8 Years',
      salary: '80k-1L',
      jobType: 'Full-time',
      workMode: 'Hybrid',
      skills: ['Node.js', 'Python', 'MongoDB', 'AWS', 'Docker'],
      description: 'Join our team of backend engineers working on scalable services that power our data analytics platform. You will design and implement APIs, optimize database queries, and ensure system reliability.',
      postedDate: new Date('2025-03-15'),
      deadline: new Date('2025-04-15'),
      applicants: 32
    },
   
  ];

  // Filtered jobs list
  filteredJobs = [...this.jobs];

  constructor(private fb: FormBuilder) {
    this.jobPostForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      salary: ['', Validators.required],
      experience: ['', Validators.required],
      jobType: [this.jobTypes[0]],
      workMode: [this.workModes[0]],
      deadline: ['', Validators.required],
      skills: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  toggleJobPostForm(): void {
    this.isPostingJob = !this.isPostingJob;
    if (!this.isPostingJob) {
      this.jobPostForm.reset({
        jobType: this.jobTypes[0],
        workMode: this.workModes[0]
      });
    }
  }

  submitJob(): void {
    if (this.jobPostForm.valid) {
      const newJob = {
        id: this.jobs.length + 1,
        title: this.jobPostForm.value.title,
        company: this.jobPostForm.value.company,
        location: this.jobPostForm.value.location,
        experience: this.jobPostForm.value.experience,
        salary: this.jobPostForm.value.salary,
        jobType: this.jobPostForm.value.jobType,
        workMode: this.jobPostForm.value.workMode,
        skills: this.jobPostForm.value.skills.split(',').map((skill: string) => skill.trim()),
        description: this.jobPostForm.value.description,
        postedDate: new Date(),
        deadline: new Date(this.jobPostForm.value.deadline),
        applicants: 0
      };

      this.jobs.unshift(newJob);
      this.applyFilters();
      this.toggleJobPostForm();
      // In a real app, you would send this to a backend API
    }
  }

  applyFilters(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const locationMatch = !this.filters.location || job.location === this.filters.location;
      const experienceMatch = !this.filters.experience || job.experience === this.filters.experience;
      const jobTypeMatch = !this.filters.jobType || job.jobType === this.filters.jobType;
      const workModeMatch = !this.filters.workMode || job.workMode === this.filters.workMode;
      const salaryMatch = !this.filters.salaryRange || job.salary === this.filters.salaryRange;
      const skillsMatch = !this.filters.skills || 
                         job.skills.some(skill => 
                           skill.toLowerCase().includes(this.filters.skills.toLowerCase()));

      return locationMatch && experienceMatch && jobTypeMatch && 
             workModeMatch && salaryMatch && skillsMatch;
    });
  }

  resetFilters(): void {
    this.filters = {
      location: '',
      experience: '',
      jobType: '',
      workMode: '',
      salaryRange: '',
      skills: ''
    };
    this.applyFilters();
  }

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  openDropdown(id: string): void {
    this.openDropdownId = id;
  }

  closeDropdown(id: string): void {
    if (this.openDropdownId === id) {
      this.openDropdownId = null;
    }
  }
}