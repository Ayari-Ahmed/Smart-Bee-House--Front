import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  constructor(private apiService: ApiService) { }

  /**
   * Get a user by ID
   * @param id User ID
   * @returns Observable of User
   */
  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(this.endpoint, { id });
  }

  /**
   * Get all users
   * @returns Observable of array of User
   */
  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.endpoint);
  }

  /**
   * Authenticate a user (mock implementation)
   * In a real application, this would call an auth endpoint
   * @param username Username
   * @param password Password
   * @returns Observable of auth result
   */
  authenticateUser(username: string, password: string): Observable<any> {
    // This is a mock implementation. In a real app, you would call an auth endpoint
    return this.apiService.post<any>('auth/login', { username, password });
  }

  /**
   * Store user authentication token
   * @param token Auth token
   */
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Get stored auth token
   * @returns Auth token or null
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Check if user is logged in
   * @returns Boolean indicating login status
   */
  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Log out the current user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}