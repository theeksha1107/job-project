import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router,RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-seeker-login',
  imports: [FormsModule,RouterModule],
  templateUrl: './job-seeker-login.component.html',
  styleUrl: './job-seeker-login.component.css' 
})
export class JobSeekerLoginComponent {
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

    this.http.post('http://127.0.0.1:8000/login', loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        alert('Login successful');
        this.router.navigate(['/jobseeker-p1']);
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
}


