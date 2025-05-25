import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostHotJobComponent } from './post-hot-job.component';

describe('PostHotJobComponent', () => {
  let component: PostHotJobComponent;
  let fixture: ComponentFixture<PostHotJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostHotJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostHotJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
