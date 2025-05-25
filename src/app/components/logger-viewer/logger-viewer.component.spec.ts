import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerViewerComponent } from './logger-viewer.component';

describe('LoggerViewerComponent', () => {
  let component: LoggerViewerComponent;
  let fixture: ComponentFixture<LoggerViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggerViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggerViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
