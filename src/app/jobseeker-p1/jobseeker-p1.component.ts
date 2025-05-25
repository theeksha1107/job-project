import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-jobseeker-p1',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './jobseeker-p1.component.html',
  styleUrls: ['./jobseeker-p1.component.css']
})
export class JobseekerP1Component implements OnInit {
  isOnline: boolean = true;
  searchText: string = '';
  skillset: string = '';
  city: string = '';
  experience: string = '';
  workMode: string = '';
  applicantPhone: string = '';
  selectedJob: any = null;
  selectedFile: File | null = null;
  applicantName: string = '';
  applicantEmail: string = '';

  jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Google",
      location: "Bangalore, India",
      experience: "2+ years",
      workMode: "Remote",
      skillset: ["JavaScript", "Angular", "TypeScript"],
      salary: "₹10L - ₹12.5L",
      description: "Google is a multinational company focused on AI, cloud computing, and internet services. We're looking for talented software engineers to join our team and work on cutting-edge products that impact millions of users worldwide.",
      responsibilities: [
        "Develop high-quality web applications",
        "Collaborate with cross-functional teams",
        "Maintain and enhance software performance",
        "Write clean, maintainable code",
        "Participate in code reviews and technical discussions"
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "2+ years of experience with JavaScript and frontend frameworks",
        "Strong problem-solving skills",
        "Experience with RESTful APIs"
      ],
      benefits: [
        "Competitive salary and benefits",
        "Remote work flexibility",
        "Professional development opportunities",
        "Health insurance",
        "Annual performance bonus"
      ],
      postedDate: new Date(2025, 2, 10),
      contact: "sivakumarlogesh3@gmail.com",
      website: "https://careers.google.com"
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Meta",
      location: "Mumbai, India",
      experience: "3+ years",
      workMode: "Hybrid",
      skillset: ["Figma", "Adobe XD", "User Research"],
      salary: "₹7.5L - ₹9L",
      description: "Meta is a leader in social networking, metaverse technologies, and digital interactions. We're seeking creative UI/UX designers who can help shape the future of our products and create intuitive experiences for our global user base.",
      responsibilities: [
        "Design engaging user interfaces",
        "Conduct user research and usability tests",
        "Collaborate with developers and product teams",
        "Create wireframes, prototypes, and mockups",
        "Translate business requirements into effective UI solutions"
      ],
      requirements: [
        "Bachelor's degree in Design, HCI, or related field",
        "3+ years of experience in UI/UX design",
        "Proficiency with design tools like Figma and Adobe XD",
        "Portfolio demonstrating strong design skills"
      ],
      benefits: [
        "Competitive compensation",
        "Flexible work arrangements",
        "Healthcare coverage",
        "Professional growth opportunities",
        "Creative and collaborative work environment"
      ],
      postedDate: new Date(2025, 2, 15),
      contact: "jobs@meta.com",
      website: "https://www.metacareers.com"
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "Amazon",
      location: "Hyderabad, India",
      experience: "1+ years",
      workMode: "On-Site",
      skillset: ["Python", "Machine Learning", "SQL"],
      salary: "₹12L - ₹15L",
      description: "Amazon is seeking data scientists to help develop and improve our machine learning models and algorithms. Join our team to work on challenging problems and deliver data-driven insights that enhance customer experiences.",
      responsibilities: [
        "Develop and implement machine learning models",
        "Analyze large datasets to extract valuable insights",
        "Collaborate with product teams to implement data-driven solutions",
        "Monitor and optimize model performance",
        "Present findings to technical and non-technical stakeholders"
      ],
      requirements: [
        "MS or PhD in Computer Science, Statistics, or related field",
        "Experience with Python, ML frameworks, and SQL",
        "Strong analytical and problem-solving skills",
        "Knowledge of statistical analysis and data visualization"
      ],
      benefits: [
        "Industry-leading compensation",
        "Comprehensive benefits package",
        "Career advancement opportunities",
        "Relocation assistance",
        "Employee discount program"
      ],
      postedDate: new Date(2025, 2, 20),
      contact: "ds-hiring@amazon.com",
      website: "https://www.amazon.jobs"
    }
  ];

  skillsets = ["JavaScript", "Angular", "Python", "Machine Learning", "React", "TypeScript", "Figma", "Adobe XD", "User Research", "SQL"];
  cities = ["Bangalore, India", "Mumbai, India", "Hyderabad, India"];
  experiences = ["1+ years", "2+ years", "3+ years", "5+ years"];
  workModes = ["Remote", "Hybrid", "On-Site"];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkOnlineStatus();
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
    this.loadSavedFilters();
  }

  checkOnlineStatus(): void {
    this.isOnline = navigator.onLine;
  }

  updateOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    this.showNotification(
      isOnline ? 'You are back online' : 'You are currently offline. Some features may be limited.',
      isOnline ? 'success' : 'warning'
    );
  }

  showNotification(message: string, type: 'success' | 'warning' | 'error'): void {
    console.log(`${type.toUpperCase()}: ${message}`);
    if (type === 'error') {
      alert(message);
    }
  }

  saveFilters(): void {
    const filters = {
      searchText: this.searchText,
      skillset: this.skillset,
      city: this.city,
      experience: this.experience,
      workMode: this.workMode
    };
    localStorage.setItem('jobFilters', JSON.stringify(filters));
  }

  loadSavedFilters(): void {
    const savedFilters = localStorage.getItem('jobFilters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      this.searchText = filters.searchText || '';
      this.skillset = filters.skillset || '';
      this.city = filters.city || '';
      this.experience = filters.experience || '';
      this.workMode = filters.workMode || '';
    }
  }

  resetFilters(): void {
    this.searchText = '';
    this.skillset = '';
    this.city = '';
    this.experience = '';
    this.workMode = '';
    localStorage.removeItem('jobFilters');
  }

  get filteredJobs() {
    this.saveFilters();
    return this.jobs.filter(job => {
      const searchMatch = !this.searchText ||
        job.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        job.company.toLowerCase().includes(this.searchText.toLowerCase()) ||
        job.description.toLowerCase().includes(this.searchText.toLowerCase());
      const skillMatch = !this.skillset || job.skillset.includes(this.skillset);
      const locationMatch = !this.city || job.location === this.city;
      const experienceMatch = !this.experience || job.experience === this.experience;
      const workModeMatch = !this.workMode || job.workMode === this.workMode;
      return searchMatch && skillMatch && locationMatch && experienceMatch && workModeMatch;
    });
  }

  getJobAge(postedDate: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatJobDate(postedDate: Date): string {
    const days = this.getJobAge(postedDate);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  openJobDetails(job: any) {
    this.selectedJob = job;
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.applicantName = user.name || '';
      this.applicantEmail = user.email || '';
      this.applicantPhone = user.phone || '';
    }
  }

  closeJobDetails() {
    this.selectedJob = null;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (this.selectedFile.type !== 'application/pdf') {
        this.showNotification('Please upload PDF files only', 'error');
        this.selectedFile = null;
        input.value = '';
        return;
      }
      if (this.selectedFile.size > 5 * 1024 * 1024) {
        this.showNotification('File size exceeds 5MB limit', 'error');
        this.selectedFile = null;
        input.value = '';
        return;
      }
    }
  }

  applyForJob() {
    if (!this.selectedFile) {
      this.showNotification('Please upload your resume', 'error');
      return;
    }
    if (!this.applicantName) {
      this.showNotification('Please enter your name', 'error');
      return;
    }
    if (!this.applicantEmail) {
      this.showNotification('Please enter your email', 'error');
      return;
    }
    if (!this.applicantPhone) {
      this.showNotification('Please enter your phone number', 'error');
      return;
    }
    if (!this.selectedJob) {
      this.showNotification('No job selected', 'error');
      return;
    }

    const userData = {
      name: this.applicantName,
      email: this.applicantEmail,
      phone: this.applicantPhone
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    const formData = new FormData();
    formData.append("name", this.applicantName);
    formData.append("email", this.applicantEmail);
    formData.append("phone", this.applicantPhone);
    formData.append("resume", this.selectedFile);
    formData.append("job_id", this.selectedJob.id.toString());
    formData.append("job_title", this.selectedJob.title);
    formData.append("company", this.selectedJob.company);

    setTimeout(() => {
      this.showNotification('Application submitted successfully!', 'success');
      this.closeJobDetails();
    }, 1500);
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }
}