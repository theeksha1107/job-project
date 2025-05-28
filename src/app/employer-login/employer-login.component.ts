import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router,RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-employer-login',
  standalone: true, // Mark this as a standalone component
  imports: [FormsModule,RouterModule,CommonModule], // Import FormsModule
  templateUrl: './employer-login.component.html',
  styleUrls: ['./employer-login.component.css'], // Corrected the property
})
export class EmployerLoginComponent implements OnInit  {
  isMenuOpen = false;
    email: string = '';
    password: string = '';
  
    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.email = params['email'] || '';
        this.password = params['password'] || '';
      });
    }
  
    onLogin() {
      if (!this.email.trim() || !this.password.trim()) {
        alert('Please enter both email and password');
        return;
      }
  
      const loginData = { email: this.email, password: this.password };
  
      this.http.post(`${environment.apiUrl}login`, loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          alert('Login successful');
          this.router.navigate(['/employer-p1']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login failed:', error);
          const errorMessage =
            error.status === 401
              ? 'Invalid email or password'
              : 'An error occurred. Please try again later.';
          alert(errorMessage);
        },
      });
    }
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
    
    closeMenu() {
      this.isMenuOpen = false;
    }
    
  }
  
