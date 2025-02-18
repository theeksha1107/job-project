import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerLoginComponent } from './job-seeker-login.component';

describe('JobSeekerLoginComponent', () => {
  let component: JobSeekerLoginComponent;
  let fixture: ComponentFixture<JobSeekerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekerLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSeekerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
