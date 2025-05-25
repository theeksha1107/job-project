import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { EmployerLoginComponent } from './employer-login/employer-login.component';
import { JobSeekerLoginComponent } from './job-seeker-login/job-seeker-login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { JobseekerP1Component } from './jobseeker-p1/jobseeker-p1.component';
import { ProfileComponent } from './profile/profile.component';
import { EmployerP1Component } from './employer-p1/employer-p1.component';
import { PostHotJobComponent } from './post-hot-job/post-hot-job.component';
import { SearchResumeComponent } from './search-resume/search-resume.component';
import { JobDetailsModalComponent } from './job-details-modal/job-details-modal.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'employee-login', component: EmployeeLoginComponent },
  { path: 'employer-login', component: EmployerLoginComponent },
  { path: 'job-seeker-login', component: JobSeekerLoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path:'jobseeker-p1',component:JobseekerP1Component},
  { path:'profile',component:ProfileComponent},
  { path:'employer-p1',component:EmployerP1Component},
  { path:'employer-p1',component:EmployerP1Component},
  { path:'employer-p1',component:EmployerP1Component},
  { path:'post_hot_job',component:PostHotJobComponent},
  { path:'search_resume',component:SearchResumeComponent},
  {path:'job-details-modal',component:JobDetailsModalComponent},
];


export const providers = [
  provideRouter(routes),
  provideHttpClient(withFetch()), // Enable fetch API here
];
