import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router,RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isMenuOpen = false;
  constructor(private http: HttpClient, private router: Router) {}

  onRegister(nameInput: HTMLInputElement, emailInput: HTMLInputElement, passwordInput: HTMLInputElement, confirmPasswordInput: HTMLInputElement) {
    const registerData = {
      full_name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      confirm_password: confirmPasswordInput.value
    };

    this.http.post('http://localhost:8000/register', registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        if (response) {  // Ensure response is valid
          alert('Registration successful. Redirecting to login...');
          console.log('Redirecting now...');
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Error during registration');
      }
    });
  }
  
toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}

closeMenu() {
  this.isMenuOpen = false;
}
}    