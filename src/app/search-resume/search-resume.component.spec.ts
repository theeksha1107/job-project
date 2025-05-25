import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResumeComponent } from './search-resume.component';

describe('SearchResumeComponent', () => {
  let component: SearchResumeComponent;
  let fixture: ComponentFixture<SearchResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
