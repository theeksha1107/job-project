import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userDetailsSubject = new BehaviorSubject<{ name: string; university?: string; phoneNumber?: string } | null>(null);
  userDetails$ = this.userDetailsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user details from localStorage on initialization
    const storedUser = localStorage.getItem('userDetails');
    if (storedUser) {
      this.userDetailsSubject.next(JSON.parse(storedUser));
    }
  }

  // Simulate login by calling a login endpoint (replace with actual endpoint)
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/login', credentials).pipe(
      tap((response: any) => {
        if (response && response.name) {
          const userDetails = {
            name: response.name,
            university: response.university || '',
            phoneNumber: response.phoneNumber || '',
          };
          this.userDetailsSubject.next(userDetails);
          localStorage.setItem('userDetails', JSON.stringify(userDetails)); // Persist to localStorage
        }
      }),
      catchError((err) => {
        console.error('Login error:', err);
        throw err;
      })
    );
  }

  // Get the current user's details
  getUserDetails(): Observable<{ name: string; university?: string; phoneNumber?: string } | null> {
    return this.userDetails$;
  }

  // Clear user details on logout
  logout(): void {
    this.userDetailsSubject.next(null);
    localStorage.removeItem('userDetails');
  }
}