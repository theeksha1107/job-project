import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule, RouterOutlet, CommonModule], // Add CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'job-portal';
  searchQuery: string = '';
  skillset: string = '';
  city: string = '';
  experience: string = '';
  experienceLevels: string[] = ['0-1 years', '1-3 years', '3-5 years', '5+ years'];
  isExpanded: boolean = false;

  constructor(private router: Router) {}

  toggleFilters() {
    this.isExpanded = !this.isExpanded;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      const queryParams = {
        q: this.searchQuery,
        skillset: this.skillset,
        city: this.city,
        experience: this.experience
      };

      this.router.navigate(['/search'], { queryParams });
    } else {
      alert('Please enter a search query!');
    }
  }
}
