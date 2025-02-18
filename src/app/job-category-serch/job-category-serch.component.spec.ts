import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCategorySerchComponent } from './job-category-serch.component';

describe('JobCategorySerchComponent', () => {
  let component: JobCategorySerchComponent;
  let fixture: ComponentFixture<JobCategorySerchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCategorySerchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCategorySerchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
