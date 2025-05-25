// src/app/components/logger-viewer/logger-viewer.component.ts
import { Component } from '@angular/core';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-logger-viewer',
  templateUrl: './logger-viewer.component.html',
  styleUrls: ['./logger-viewer.component.css']
})
export class LoggerViewerComponent {
  constructor(public logger: LoggerService) {}

  downloadLogs() {
    const logs = this.logger.getLogs().join('\n');
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  clearLogs() {
    this.logger.clearLogs();
  }
}
