import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface Job {
  title: string;
  description: string;
  type: string;
  experience: string;
  level: string;
  department: string;
  location: string;
  company: string;
  salary: string;
  logoBg: string;
  logoViewBox: string;
  logoPath: string;
  logoFill: string;
  overview: string;
  jobDescription: string[];
  benefits: string[];
  applications: number;
  postedDate: Date;
}

interface FilterOption {
  name: string;
  checked: boolean;
  count: number;
}

interface Category {
  name: string;
  count: number;
}

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isDetailPage = false;
  jobDetailTitle = '';
  jobDetailCompany = '';
  jobDetailLocation = '';
  jobDetailType = '';
  jobDetailExperience = '';
  jobDetailLevel = '';
  jobDetailSalary = '';
  jobDetailOverview = '';
  jobDetailDescription: string[] = [];
  jobDetailBenefits: string[] = [];
  jobDetailApplications = 0;
  jobLogo = '';
  jobBgStyle = '';
  jobDetailLogoBg = '';
  jobDetailLogoViewBox = '';
  jobDetailLogoPath = '';
  jobDetailLogoFill = '';
  isMenuOpen = false;
  isLoginMenuOpen = false;
  isModalOpen = false;
  isScrolledToBottom = false;
  selectedJob: Job | null = null;
  sortOption = 'newest';
  applicationForm: ApplicationForm = {
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  };

  searchQuery = '';
  locationFilter = '';
  searchTags: string[] = [];
  jobCategories: Category[] = [
    { name: 'Technology', count: 120 },
    { name: 'Design', count: 85 },
    { name: 'Marketing', count: 65 },
    { name: 'Sales', count: 50 },
    { name: 'Human Resources', count: 30 }
  ];
  employmentTypes: FilterOption[] = [
    { name: 'Full Time Jobs', checked: false, count: 56 },
    { name: 'Part Time Jobs', checked: false, count: 43 },
    { name: 'Remote Jobs', checked: false, count: 24 },
    { name: 'Internship Jobs', checked: false, count: 27 },
    { name: 'Contract', checked: false, count: 76 },
    { name: 'Training Jobs', checked: false, count: 28 }
  ];
  departments: FilterOption[] = [
    { name: 'Engineering', checked: false, count: 45 },
    { name: 'Design', checked: false, count: 30 },
    { name: 'Marketing', checked: false, count: 25 },
    { name: 'Sales', checked: false, count: 20 },
    { name: 'Human Resources', checked: false, count: 15 }
  ];
  seniorityLevels: FilterOption[] = [
    { name: 'Student Level', checked: false, count: 98 },
    { name: 'Entry Level', checked: false, count: 44 },
    { name: 'Mid Level', checked: false, count: 35 },
    { name: 'Senior Level', checked: false, count: 29 },
    { name: 'Directors', checked: false, count: 26 },
    { name: 'VP or Above', checked: false, count: 56 }
  ];
  salaryRanges: FilterOption[] = [
    { name: '₹20,000 - ₹30,000', checked: false, count: 49 },
    { name: '₹30,000 - ₹50,000', checked: false, count: 67 },
    { name: '₹50,000 - ₹80,000', checked: false, count: 24 },
    { name: '₹80,000 - ₹1,20,000', checked: false, count: 27 },
    { name: '₹1,20,000 - ₹2,00,000', checked: false, count: 76 },
    { name: '₹2,00,000+', checked: false, count: 18 }
  ];

  jobs: Job[] = [
    // Job data remains unchanged for brevity
    {
      title: 'UI / UX Designer',
      description: 'Create compelling digital user experiences for Tamil Nadu startups.',
      type: 'Full Time',
      experience: 'Min. 1 Year',
      level: 'Senior Level',
      department: 'Design',
      location: 'Chennai, Tamil Nadu',
      company: 'Zoho Corporation',
      salary: '₹80,000 / Month',
      logoBg: '#2e2882',
      logoViewBox: '0 -13 512 512',
      logoPath: 'M256 92.5l127.7 91.6L512 92 383.7 0 256 91.5 128.3 0 0 92l128.3 92zm0 0M256 275.9l-127.7-91.5L0 276.4l128.3 92L256 277l127.7 91.5 128.3-92-128.3-92zm0 0M127.7 394.1l128.4 92 128.3-92-128.3-92zm0 0M512 92L383.7 0 256 91.5v1l127.7 91.6zm0 0M512 276.4l-128.3-92L256 275.9v1l127.7 91.5zm0 0M256 486.1l128.4-92-128.3-92zm0 0',
      logoFill: '#feb0a5',
      overview: 'Work with innovative startups in Chennai to design user-friendly interfaces.',
      jobDescription: [
        '1+ years as a UI/UX designer.',
        'Portfolio showcasing user-centric designs.',
        'Proficiency in Figma and Sketch.',
        'Strong communication skills.',
        'Experience with Tamil Nadu-based clients is a plus.'
      ],
      benefits: [
        'Health insurance',
        'Flexible working hours',
        'Professional development stipend'
      ],
      applications: 98,
      postedDate: new Date('2025-05-09')
    },
    // ... other jobs ...
  ];

  filteredJobs: Job[] = [...this.jobs];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const searchBox = document.querySelector('.search-box') as HTMLInputElement;
      if (searchBox) {
        searchBox.focus();
      }
      this.updateScrollButtonVisibility();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      const wrapper = document.querySelector('.wrapper') as HTMLElement;
      if (wrapper) {
        if (wrapper.scrollTop > 30) {
          wrapper.classList.add('header-shadow');
        } else {
          wrapper.classList.remove('header-shadow');
        }
        this.updateScrollButtonVisibility();
      }
    }
  }

  updateScrollButtonVisibility(): void {
    if (isPlatformBrowser(this.platformId)) {
      const wrapper = document.querySelector('.wrapper') as HTMLElement;
      if (wrapper) {
        const scrollPosition = wrapper.scrollTop + wrapper.clientHeight;
        const scrollHeight = wrapper.scrollHeight;
        this.isScrolledToBottom = scrollPosition >= scrollHeight - 10;
      }
    }
  }

  toggleDarkMode(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-mode');
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.isLoginMenuOpen = false;
  }

  toggleLoginMenu(): void {
    this.isLoginMenuOpen = !this.isLoginMenuOpen;
  }

  selectCategory(category: Category): void {
    this.searchQuery = category.name;
    this.filterJobs();
  }

  filterJobs(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const location = this.locationFilter.toLowerCase().trim();
    const selectedTypes = this.employmentTypes.filter(type => type.checked).map(type => type.name);
    const selectedDepts = this.departments.filter(dept => dept.checked).map(dept => dept.name);
    const selectedLevels = this.seniorityLevels.filter(level => level.checked).map(level => level.name);
    const selectedSalaries = this.salaryRanges.filter(range => range.checked).map(range => range.name);

    this.filteredJobs = this.jobs.filter(job => {
      const matchesQuery = query ? (
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query)
      ) : true;

      const matchesLocation = location ? job.location.toLowerCase().includes(location) : true;
      const matchesType = selectedTypes.length ? selectedTypes.includes(job.type) : true;
      const matchesDept = selectedDepts.length ? selectedDepts.includes(job.department) : true;
      const matchesLevel = selectedLevels.length ? selectedLevels.includes(job.level) : true;
      const matchesSalary = selectedSalaries.length ? selectedSalaries.some(salary => job.salary.includes(salary)) : true;

      return matchesQuery && matchesLocation && matchesType && matchesDept && matchesLevel && matchesSalary;
    });

    if (query && !this.searchTags.includes(query) && query.length > 2) {
      this.searchTags.push(query);
      this.searchQuery = '';
    }

    this.sortJobs();
  }

  sortJobs(): void {
    this.filteredJobs = [...this.filteredJobs].sort((a, b) => {
      switch (this.sortOption) {
        case 'newest':
          return b.postedDate.getTime() - a.postedDate.getTime();
        case 'oldest':
          return a.postedDate.getTime() - b.postedDate.getTime();
        case 'salary-desc':
          return this.parseSalary(b.salary) - this.parseSalary(a.salary);
        case 'salary-asc':
          return this.parseSalary(a.salary) - this.parseSalary(b.salary);
        default:
          return 0;
      }
    });
  }

  parseSalary(salary: string): number {
    const match = salary.match(/₹([\d,]+).*\/ Month/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
  }

  removeTag(tag: string): void {
    this.searchTags = this.searchTags.filter(t => t !== tag);
    this.filterJobs();
  }

  onJobCardClick(target: EventTarget | null): void {
    if (isPlatformBrowser(this.platformId) && target instanceof HTMLElement) {
      const title = target.querySelector('.job-card-title')?.textContent || '';
      const job = this.jobs.find(j => j.title === title);
      if (!job) return;

      const number = Math.floor(Math.random() * 10);
      const url = `https://unsplash.it/640/425?image=${number}`;

      this.jobBgStyle = `background: ${job.logoBg}; background-image: url(${url}); background-size: cover;`;
      this.jobDetailTitle = job.title;
      this.jobDetailCompany = job.company;
      this.jobDetailLocation = job.location;
      this.jobDetailType = job.type;
      this.jobDetailExperience = job.experience;
      this.jobDetailLevel = job.level;
      this.jobDetailSalary = job.salary;
      this.jobDetailOverview = job.overview;
      this.jobDetailDescription = job.jobDescription;
      this.jobDetailBenefits = job.benefits;
      this.jobDetailApplications = job.applications;
      this.jobLogo = `<svg viewBox="${job.logoViewBox}" xmlns="http://www.w3.org/2000/svg"><path d="${job.logoPath}" fill="${job.logoFill}"/></svg>`;
      this.jobDetailLogoBg = job.logoBg;
      this.jobDetailLogoViewBox = job.logoViewBox;
      this.jobDetailLogoPath = job.logoPath;
      this.jobDetailLogoFill = job.logoFill;
      this.isDetailPage = true;

      const wrapper = document.querySelector('.wrapper') as HTMLElement;
      if (wrapper) {
        wrapper.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  onLogoClick(): void {
    this.isDetailPage = false;
    this.jobBgStyle = '';
    if (isPlatformBrowser(this.platformId)) {
      const wrapper = document.querySelector('.wrapper') as HTMLElement;
      if (wrapper) {
        wrapper.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  openModal(job: Job): void {
    this.selectedJob = job;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedJob = null;
    this.applicationForm = {
      name: '',
      email: '',
      phone: '',
      coverLetter: '',
      resume: null
    };
  }

  onFileChange(event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.applicationForm.resume = input.files[0];
      }
    }
  }

  submitApplication(): void {
    if (this.applicationForm.name && this.applicationForm.email) {
      console.log('Application submitted:', this.applicationForm);
      if (isPlatformBrowser(this.platformId)) {
        alert('Application submitted successfully!');
      }
      this.closeModal();
    } else {
      if (isPlatformBrowser(this.platformId)) {
        alert('Please fill in all required fields.');
      }
    }
  }

  toggleScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const wrapper = document.querySelector('.wrapper') as HTMLElement;
      if (wrapper) {
        if (this.isScrolledToBottom) {
          wrapper.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          wrapper.scrollTo({ top: wrapper.scrollHeight, behavior: 'smooth' });
        }
      }
    }
  }
}