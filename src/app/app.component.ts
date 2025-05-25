import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoggerService } from './services/logger.service'; // Import LoggerService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Job Portal';

  searchQuery = '';
  skillset = '';
  city = '';
  experience = '';

  experienceLevels = ['0-1 years', '1-3 years', '3-5 years', '5+ years'];
  isExpanded = false;

  constructor(
    private router: Router,
    private logger: LoggerService  // Inject LoggerService
  ) {}

  toggleFilters(): void {
    this.isExpanded = !this.isExpanded;
    this.logger.log(`Filters section toggled: ${this.isExpanded ? 'Expanded' : 'Collapsed'}`);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      const queryParams = {
        q: this.searchQuery,
        skillset: this.skillset || undefined,
        city: this.city || undefined,
        experience: this.experience || undefined
      };

      this.logger.log(`Search performed with query: ${JSON.stringify(queryParams)}`);
      this.router.navigate(['/search'], { queryParams });
    } else {
      this.logger.log('Search attempted with empty query', 'ERROR');
      alert('Please enter a search query!');
    }
  }
}
