import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { EmployerLoginComponent } from './employer-login/employer-login.component';
import { JobSeekerLoginComponent } from './job-seeker-login/job-seeker-login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { JobCategorySerchComponent } from './job-category-serch/job-category-serch.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { JobseekerP1Component } from './jobseeker-p1/jobseeker-p1.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'employee-login', component: EmployeeLoginComponent },
  { path: 'employer-login', component: EmployerLoginComponent },
  { path: 'job-seeker-login', component: JobSeekerLoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'job-category-serch', component: JobCategorySerchComponent },
  { path:'jobseeker-p1',component:JobseekerP1Component},
];

export const providers = [
  provideRouter(routes),
  provideHttpClient(withFetch()), // Enable fetch API here
];
