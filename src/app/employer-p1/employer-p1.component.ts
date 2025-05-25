import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employer-p1',
  imports: [CommonModule,RouterModule],
  templateUrl: './employer-p1.component.html',
  styleUrl: './employer-p1.component.css'
})
export class EmployerP1Component {
  isNavbarOpen = false;
  openDropdownId: string | null = null;

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  openDropdown(id: string) {
    this.openDropdownId = id;
  }

  closeDropdown(id: string) {
    if (this.openDropdownId === id) {
      this.openDropdownId = null;
    }
  }
}
