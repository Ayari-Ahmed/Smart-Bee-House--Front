import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) { }

  /**
   * Generic GET request
   * @param endpoint The API endpoint
   * @param params Any query parameters
   * @returns Observable of response
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers: this.headers, params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic POST request
   * @param endpoint The API endpoint
   * @param body The request body
   * @returns Observable of response
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic PUT request
   * @param endpoint The API endpoint
   * @param body The request body
   * @returns Observable of response
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic DELETE request
   * @param endpoint The API endpoint
   * @param params Any query parameters
   * @returns Observable of response
   */
  delete<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key].toString());
      });
    }

    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, { headers: this.headers, params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handler for HTTP requests
   * @param error The error object
   * @returns Thrown error observable
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `${error.status}: ${error.error?.message || error.statusText}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}