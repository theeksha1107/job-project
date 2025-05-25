import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsResponsesComponent } from './jobs-responses.component';

describe('JobsResponsesComponent', () => {
  let component: JobsResponsesComponent;
  let fixture: ComponentFixture<JobsResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsResponsesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
