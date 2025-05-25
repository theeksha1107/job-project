import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Candidate {
  id: number;
  name: string;
  role: string;
  company: string;
  experience: string;
  location: string;
  ctc: string;
  noticePeriod: string;
  degree: string;
  university: string;
  passingYear: string;
  skills: string[];
  gender: string;
  category: string;
  resumeUpdated: string;
  physicallyChallenged: string;
}

@Component({
  selector: 'app-search-resume',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './search-resume.component.html',
  styleUrls: ['./search-resume.component.css'],
})
export class SearchResumeComponent implements OnInit {
  searchForm: FormGroup;
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  viewMode: 'grid' | 'list' = 'grid';
  searchPerformed: boolean = false;
  noPgQualification: boolean = false;
  isNavbarOpen: boolean = false;
  openDropdownId: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.searchForm = this.fb.group({
      keywords: [''],
      itSkills: [''],
      minSkillExperience: [''],
      maxSkillExperience: [''],
      minExperience: [''],
      maxExperience: [''],
      location: [''],
      minSalary: [''],
      maxSalary: [''],
      departmentRole: [''],
      industry: [''],
      company: [''],
      noticePeriod: [''],
      ugQualification: [''],
      ugEducationType: [''],
      ugFromYear: [''],
      ugToYear: [''],
      pgQualification: [''],
      pgEducationType: [''],
      pgFromYear: [''],
      pgToYear: [''],
      gender: [''],
      disability: [''],
      category: [''],
      minAge: [''],
      maxAge: [''],
      resumeFreshness: [''],
      jobType: [''],
      employmentType: [''],
    });
  }

  ngOnInit(): void {
    this.fetchCandidates().subscribe((data) => {
      this.candidates = data;
      this.filteredCandidates = data;
    });
  }

  fetchCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>('http://localhost:8000/profiles');
  }

  search(): void {
    this.searchPerformed = true;
    const formValue = this.searchForm.value;
    this.filteredCandidates = this.candidates.filter((candidate) => {
      const keywords = formValue.keywords
        ? formValue.keywords.toLowerCase().split(',').map((k: string) => k.trim())
        : [];
      const itSkills = formValue.itSkills
        ? formValue.itSkills.toLowerCase().split(',').map((s: string) => s.trim())
        : [];
      const matchesKeywords =
        keywords.length === 0 ||
        keywords.some(
          (k: string) =>
            candidate.name.toLowerCase().includes(k) ||
            candidate.role.toLowerCase().includes(k) ||
            candidate.company.toLowerCase().includes(k)
        );
      const matchesSkills =
        itSkills.length === 0 ||
        itSkills.every((s: string) =>
          candidate.skills.map((skill) => skill.toLowerCase()).includes(s)
        );
      const matchesExperience =
        (!formValue.minExperience ||
          parseFloat(candidate.experience) >= parseFloat(formValue.minExperience)) &&
        (!formValue.maxExperience ||
          parseFloat(candidate.experience) <= parseFloat(formValue.maxExperience));
      const matchesLocation =
        !formValue.location ||
        candidate.location.toLowerCase().includes(formValue.location.toLowerCase());
      const matchesSalary =
        (!formValue.minSalary ||
          parseFloat(candidate.ctc) >= parseFloat(formValue.minSalary)) &&
        (!formValue.maxSalary ||
          parseFloat(candidate.ctc) <= parseFloat(formValue.maxSalary));
      const matchesNoticePeriod =
        !formValue.noticePeriod ||
        candidate.noticePeriod.toLowerCase().includes(formValue.noticePeriod.toLowerCase());
      const matchesGender =
        !formValue.gender ||
        candidate.gender.toLowerCase() === formValue.gender.toLowerCase();
      const matchesDisability =
        !formValue.disability ||
        candidate.physicallyChallenged.toLowerCase() === formValue.disability.toLowerCase();
      const matchesCategory =
        !formValue.category ||
        candidate.category.toLowerCase() === formValue.category.toLowerCase();

      return (
        matchesKeywords &&
        matchesSkills &&
        matchesExperience &&
        matchesLocation &&
        matchesSalary &&
        matchesNoticePeriod &&
        matchesGender &&
        matchesDisability &&
        matchesCategory
      );
    });
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchForm.reset();
    this.noPgQualification = false;
    this.filteredCandidates = this.candidates;
    this.searchPerformed = false;
    this.currentPage = 1;
  }

  saveSearch(): void {
    console.log('Search saved:', this.searchForm.value);
  }

  togglePgQualification(): void {
    this.noPgQualification = !this.noPgQualification;
    if (this.noPgQualification) {
      this.searchForm.patchValue({
        pgQualification: '',
        pgEducationType: '',
        pgFromYear: '',
        pgToYear: '',
      });
    }
  }

  updateEmploymentType(): void {
    const jobType = this.searchForm.get('jobType')?.value;
    if (jobType === 'Permanent') {
      this.searchForm.patchValue({ employmentType: 'Full Time' });
    } else if (jobType === 'Temporary') {
      this.searchForm.patchValue({ employmentType: 'Part Time' });
    } else {
      this.searchForm.patchValue({ employmentType: '' });
    }
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  sortResults(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value;
    this.filteredCandidates = [...this.filteredCandidates].sort((a, b) => {
      if (sortBy === 'experience_high') {
        return parseFloat(b.experience) - parseFloat(a.experience);
      } else if (sortBy === 'experience_low') {
        return parseFloat(a.experience) - parseFloat(b.experience);
      } else if (sortBy === 'recent') {
        return new Date(b.resumeUpdated).getTime() - new Date(a.resumeUpdated).getTime();
      }
      return 0;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCandidates.length / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
    if (!this.isNavbarOpen) {
      this.openDropdownId = null; // Close any open dropdowns when navbar closes
    }
  }

  openDropdown(id: string): void {
    this.openDropdownId = id;
  }

  closeDropdown(id: string): void {
    if (this.openDropdownId === id) {
      this.openDropdownId = null;
    }
  }

  toggleDropdown(id: string): void {
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }
}