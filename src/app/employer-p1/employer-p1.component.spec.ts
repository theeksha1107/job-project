import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerP1Component } from './employer-p1.component';

describe('EmployerP1Component', () => {
  let component: EmployerP1Component;
  let fixture: ComponentFixture<EmployerP1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerP1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerP1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
