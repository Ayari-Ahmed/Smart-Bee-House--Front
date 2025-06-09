import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Ferme } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FermeService {
  private endpoint = 'fermes';

  constructor(private apiService: ApiService) { }

  /**
   * Get a farm by ID
   * @param id Farm ID
   * @returns Observable of Ferme
   */
  getFermeById(id: number): Observable<Ferme> {
    return this.apiService.get<Ferme>(this.endpoint, { id });
  }

  /**
   * Get all farms by farmer ID
   * @param fermierId Farmer ID
   * @returns Observable of array of Ferme
   */
  getFermesByFermier(fermierId: number): Observable<Ferme[]> {
    return this.apiService.get<Ferme[]>(this.endpoint, { fermierId });
  }

  /**
   * Create a new farm
   * @param ferme Farm data
   * @returns Observable of created Ferme
   */
  createFerme(ferme: Ferme): Observable<Ferme> {
    return this.apiService.post<Ferme>(this.endpoint, ferme);
  }

  /**
   * Update an existing farm
   * @param ferme Farm data with ID
   * @returns Observable of updated Ferme
   */
  updateFerme(ferme: Ferme): Observable<Ferme> {
    return this.apiService.put<Ferme>(this.endpoint, ferme);
  }

  /**
   * Delete a farm by ID
   * @param id Farm ID
   * @returns Observable of delete confirmation
   */
  deleteFerme(id: number): Observable<any> {
    return this.apiService.delete<any>(this.endpoint, { id });
  }
}