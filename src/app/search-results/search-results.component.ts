import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule,RouterModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  results: any[] = [];
  pages: { title: string, route: string }[] = [
    { title: 'Home', route: '/home' },
    { title: 'Sign-up', route: '/signup' },
    { title: 'Employee Login', route: '/employee-login' },
    { title: 'Employer Login', route: '/employer-login' },
    { title: 'Jobseeker Login', route: '/job-seeker-login' },
    { title: 'Job Category Search', route: '/job-category-serch' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.performSearch();
    });
  }

  performSearch() {
    if (this.searchQuery.trim()) {
      this.results = this.pages.filter(page =>
        page.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}
