import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router,RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-signup',
  imports: [FormsModule,RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private http: HttpClient, private router: Router) {}

  onRegister(nameInput: HTMLInputElement, emailInput: HTMLInputElement, passwordInput: HTMLInputElement, confirmPasswordInput: HTMLInputElement) {
    const registerData = {
      full_name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      confirm_password: confirmPasswordInput.value
    };

    this.http.post('http://127.0.0.1:8000/register', registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        if (response) {  // Ensure response is valid
          alert('Registration successful. Redirecting to login...');
          console.log('Redirecting now...');
          this.router.navigate(['/employee-login']);
        }
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Error during registration');
      }
    });
  }
}    