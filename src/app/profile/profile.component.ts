import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    HttpClientModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isMenuOpen = false;
  profileForm: FormGroup;
  profile = {
    avatar: 'https://via.placeholder.com/150',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    currentLocation: '',
    highestQualification: '',
    university: '',
    primarySkills: [] as string[],
    projectDetails: '',
    noticePeriod: '',
    preferredSalary: '',
    resumeFileName: '',
    address: '',
    physicallyChallenged: '',
    preferredLocation: '',
    currentCTC: '',
    visa: '',
  };
 
  cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
  noticePeriods = ['Immediate', '15 Days', '30 Days', '60 Days', '90 Days'];
  genders = ['Male', 'Female', 'Other'];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isEditing = false;
 
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AuthService:', this.authService);
    console.log('Logout method:', this.authService.logout);
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required],
      currentLocation: ['', Validators.required],
      address: [''],
      highestQualification: [''],
      university: [''],
      primarySkills: [[]],
      projectDetails: [''],
      noticePeriod: [''],
      preferredSalary: [''],
      currentCTC: [''],
      preferredLocation: [''],
      visa: [''],
      physicallyChallenged: [''],
    });
  }
 
  ngOnInit() {
    this.authService.getUserDetails().subscribe({
      next: (user: { name: string; university?: string; phoneNumber?: string } | null) => {
        if (user && user.name) {
          this.profile.firstName = user.name.split(' ')[0] || '';
          this.profile.lastName = user.name.split(' ')[1] || '';
          this.profile.university = user.university || '';
          this.profile.mobileNumber = user.phoneNumber || '';
          this.loadProfile();
        } else {
          this.snackBar.open('Please log in to view your profile.', 'Close', { duration: 3000 });
          this.isEditing = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching user details:', err);
        this.snackBar.open('Error fetching user details. Please try again.', 'Close', { duration: 3000 });
        this.isEditing = true;
      },
    });
  }
 
  loadProfile() {
    const queryParams = this.profile.firstName
      ? `name=${encodeURIComponent(this.profile.firstName + ' ' + this.profile.lastName)}`
      : this.profile.university
      ? `university=${encodeURIComponent(this.profile.university)}`
      : `phone_number=${encodeURIComponent(this.profile.mobileNumber)}`;
 
    this.http.get(`${environment.apiUrl}get-profile?${queryParams}`).subscribe({
      next: (data: any) => {
        if (data) {
          this.profile = { ...this.profile, ...data };
          this.profile.primarySkills = Array.isArray(data.primarySkills) ? data.primarySkills : [];
          this.profileForm.patchValue(this.profile);
          this.isEditing = false;
          this.snackBar.open('Profile loaded successfully!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('No profile found. Please create one.', 'Close', { duration: 3000 });
          this.isEditing = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading profile:', err);
        this.snackBar.open('Error loading profile. Please try again.', 'Close', { duration: 3000 });
        this.isEditing = true;
      },
    });
  }
 
  openProfileEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.patchValue(this.profile);
      this.snackBar.open('Edit mode enabled.', 'Close', { duration: 2000 });
    }
  }
 
  saveProfile() {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }
 
    this.profile = { ...this.profile, ...this.profileForm.value };
    const profileToSave = { ...this.profile, name: `${this.profile.firstName} ${this.profile.lastName}` };
 
    this.http.post(`${environment.apiUrl}save-profile`, profileToSave).subscribe({
      next: (response: any) => {
        this.snackBar.open('Profile saved successfully!', 'Close', { duration: 3000 });
        this.isEditing = false;
        this.loadProfile();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error saving profile:', err);
        this.snackBar.open(`Error saving profile: ${err.error?.detail || 'Please try again.'}`, 'Close', { duration: 3000 });
      },
    });
  }
 
  uploadResume(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size exceeds 5MB limit.', 'Close', { duration: 3000 });
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
 
      this.http.post(`${environment.apiUrl}upload-resume`, formData).subscribe({
        next: (response: any) => {
          this.profile.resumeFileName = response.fileName;
          this.snackBar.open(`Resume uploaded: ${response.fileName}`, 'Close', { duration: 3000 });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error uploading resume:', err);
          this.snackBar.open(`Error uploading resume: ${err.error?.detail || 'Please try again.'}`, 'Close', { duration: 3000 });
        },
      });
    }
  }
 
  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.profile.primarySkills.includes(value)) {
      this.profile.primarySkills.push(value);
      this.profileForm.get('primarySkills')?.setValue(this.profile.primarySkills);
    }
    event.chipInput!.clear();
  }
 
  removeSkill(skill: string): void {
    const index = this.profile.primarySkills.indexOf(skill);
    if (index >= 0) {
      this.profile.primarySkills.splice(index, 1);
      this.profileForm.get('primarySkills')?.setValue(this.profile.primarySkills);
    }
  }
 
  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('Image size exceeds 2MB limit.', 'Close', { duration: 3000 });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.profile.avatar = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
 
  replaceAvatar() {
    const fileInput = document.getElementById('avatarInput') as HTMLInputElement;
    fileInput.click();
    this.snackBar.open('Click to upload a new avatar', 'Close', { duration: 2000 });
  }
 
  downloadResume() {
    this.http.get(`${environment.apiUrl}download-resume?fileName=${this.profile.resumeFileName}`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.profile.resumeFileName;
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Resume downloaded successfully!', 'Close', { duration: 3000 });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error downloading resume:', err);
        this.snackBar.open('Error downloading resume. Please try again.', 'Close', { duration: 3000 });
      },
    });
  }
 
  logout() {
    (this.authService.logout() as unknown as Observable<any>).subscribe({
      next: () => {
        this.snackBar.open('Logged out successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/job-seeker-login']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error logging out:', err);
        this.snackBar.open('Error logging out. Please try again.', 'Close', { duration: 3000 });
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