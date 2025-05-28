import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-seeker-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './job-seeker-login.component.html',
  styleUrl: './job-seeker-login.component.css'
})
export class JobSeekerLoginComponent {
  isMenuOpen = false;
  email: string = '';
  password: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  // Function to Send OTP
  sendOtp() {
    if (!this.email.trim()) {
      alert('Please enter your email');
      return;
    }

    this.loading = true;

    this.http.post('http://jobbackend-c0dgdyg3ceh0hbbv.eastasia-01.azurewebsites.net/send-otp', { email: this.email }).subscribe({
      next: (response) => {
        console.log('OTP sent:', response);
        alert('OTP sent successfully. Check your email.');
        this.isOtpSent = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('OTP sending failed:', error);
        alert(`Error: ${error.error?.message || 'Failed to send OTP'}`);
        this.loading = false;
      },
    });
  }

  // Function to Verify OTP and Login
  verifyOtp() {
    if (!this.otp.trim() || !this.password.trim()) {
      alert('Please enter OTP and password');
      return;
    }

    this.loading = true;

    this.http.post('http://jobbackend-c0dgdyg3ceh0hbbv.eastasia-01.azurewebsites.net/verify-otp', { email: this.email, otp: this.otp, password: this.password }).subscribe({
      next: (response) => {
        console.log('OTP verified:', response);
        alert('Login successful');
        this.router.navigate(['/jobseeker-p1']);
        this.loading = false;
      },
      error: (error) => {
        console.error('OTP verification failed:', error);
        alert('Invalid OTP or password. Please try again.');
        this.loading = false;
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
