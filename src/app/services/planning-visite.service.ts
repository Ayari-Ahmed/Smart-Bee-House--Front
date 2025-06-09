import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PlanningVisite } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlanningVisiteService {
  private endpoint = 'planning-visites';

  constructor(private apiService: ApiService) { }

  /**
   * Get all visit plans for a hive
   * @param rucheId Hive ID
   * @returns Observable of array of PlanningVisite
   */
  getPlanningsByRuche(rucheId: number): Observable<PlanningVisite[]> {
    return this.apiService.get<PlanningVisite[]>(this.endpoint, { rucheId });
  }

  /**
   * Get all visit plans assigned to an agent
   * @param agentId Agent ID
   * @returns Observable of array of PlanningVisite
   */
  getPlanningsByAgent(agentId: number): Observable<PlanningVisite[]> {
    return this.apiService.get<PlanningVisite[]>(this.endpoint, { agentId });
  }

  /**
   * Create a new visit plan
   * @param planning Planning data
   * @returns Observable of created PlanningVisite
   */
  createPlanning(planning: PlanningVisite): Observable<PlanningVisite> {
    return this.apiService.post<PlanningVisite>(this.endpoint, planning);
  }

  /**
   * Update an existing visit plan
   * @param planning Planning data with ID
   * @returns Observable of updated PlanningVisite
   */
  updatePlanning(planning: PlanningVisite): Observable<PlanningVisite> {
    return this.apiService.put<PlanningVisite>(this.endpoint, planning);
  }
}