import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerP1Component } from './jobseeker-p1.component';

describe('JobseekerP1Component', () => {
  let component: JobseekerP1Component;
  let fixture: ComponentFixture<JobseekerP1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobseekerP1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobseekerP1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
