import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true, // ✅ Standalone component (no NgModule needed)
  imports: [CommonModule, ReactiveFormsModule], // ✅ Import necessary modules here
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  step: number = 1; // Step 1: Request OTP, Step 2: Enter OTP & Reset Password
  email: string = '';

  private fb = inject(FormBuilder); // ✅ Angular 19 inject syntax
  private http = inject(HttpClient);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  requestOTP() {
    if (this.forgotPasswordForm.invalid) return;
    this.email = this.forgotPasswordForm.value.email;

    this.http.post('http://localhost:8000/forgot-password', { email: this.email }).subscribe(
      () => {
        alert('OTP sent to your email!');
        this.step = 2;
      },
      (err) => alert('Error: ' + err.error.detail)
    );
  }

  resetPassword() {
    if (this.otpForm.invalid) return;
    const data = {
      email: this.email,
      otp: this.otpForm.value.otp,
      new_password: this.otpForm.value.newPassword
    };

    this.http.post('http://localhost:8000/reset-password', data).subscribe(
      () => {
        alert('Password reset successful!');
        this.step = 1;
        this.forgotPasswordForm.reset();
        this.otpForm.reset();
      },
      (err) => alert('Error: ' + err.error.detail)
    );
  }
}
