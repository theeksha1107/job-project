import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResumeModel } from './resume.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'api/resumes'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  searchResumes(params: any): Observable<{data: ResumeModel[], total: number}> {
    let httpParams = new HttpParams();
    
    // Add search parameters to request
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        if (Array.isArray(params[key])) {
          params[key].forEach((value: string) => {
            httpParams = httpParams.append(key, value);
          });
        } else {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    });

    return this.http.get<{data: ResumeModel[], total: number}>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(error => {
          console.error('Error in search service:', error);
          return of({data: [], total: 0});
        })
      );
  }

  getSavedSearches(): Observable<any[]> {
    return this.http.get<any[]>('api/saved-searches')
      .pipe(
        catchError(error => {
          console.error('Error getting saved searches:', error);
          return of([]);
        })
      );
  }

  saveSearch(search: any): Observable<any> {
    return this.http.post<any>('api/saved-searches', search)
      .pipe(
        catchError(error => {
          console.error('Error saving search:', error);
          throw error;
        })
      );
  }
}