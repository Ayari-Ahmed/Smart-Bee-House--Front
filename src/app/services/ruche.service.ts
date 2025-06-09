import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Ruche } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RucheService {
  private endpoint = 'ruches';

  constructor(private apiService: ApiService) { }

  /**
   * Get a hive by ID
   * @param id Hive ID
   * @returns Observable of Ruche
   */
  getRucheById(id: number): Observable<Ruche> {
    return this.apiService.get<Ruche>(this.endpoint, { id });
  }

  /**
   * Get all hives by site ID
   * @param siteId Site ID
   * @returns Observable of array of Ruche
   */
  getRuchesBySite(siteId: number): Observable<Ruche[]> {
    return this.apiService.get<Ruche[]>(this.endpoint, { siteId });
  }

  /**
   * Get all hives by agent ID
   * @param agentId Agent ID
   * @returns Observable of array of Ruche
   */
  getRuchesByAgent(agentId: number): Observable<Ruche[]> {
    return this.apiService.get<Ruche[]>(this.endpoint, { agentId });
  }

  /**
   * Create a new hive
   * @param ruche Hive data
   * @returns Observable of created Ruche
   */
  createRuche(ruche: Ruche): Observable<Ruche> {
    return this.apiService.post<Ruche>(this.endpoint, ruche);
  }

  /**
   * Update an existing hive
   * @param ruche Hive data with ID
   * @returns Observable of updated Ruche
   */
  updateRuche(ruche: Ruche): Observable<Ruche> {
    return this.apiService.put<Ruche>(this.endpoint, ruche);
  }

  /**
   * Delete a hive by ID
   * @param id Hive ID
   * @returns Observable of delete confirmation
   */
  deleteRuche(id: number): Observable<any> {
    return this.apiService.delete<any>(this.endpoint, { id });
  }
}