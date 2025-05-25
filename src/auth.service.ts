import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<{ name: string; university?: string; phoneNumber?: string } | null> {
    return this.http.get<{ name: string; university?: string; phoneNumber?: string }>('http://127.0.0.1:8000/user-details').pipe(
      catchError(() => of(null))
    );
  }

  logout(): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/logout', {});
  }
}