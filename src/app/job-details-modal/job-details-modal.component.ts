import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

interface Job {
  id: number;
  title: string;
  description: string;
  employmentType: string;
  seniorityLevel: string;
  salaryRange: string;
  location: string;
  postedDate: Date;
  company: string;
  requirements: string[];
}

@Component({
  selector: 'app-job-details-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './job-details-modal.component.html',
  styleUrls: ['./job-details-modal.component.css']
})
export class JobDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<JobDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { job: Job }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}