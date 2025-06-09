import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RapportVisite } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RapportVisiteService {
  private endpoint = 'rapports-visite';

  constructor(private apiService: ApiService) { }

  /**
   * Get a visit report by ID
   * @param id Report ID
   * @returns Observable of RapportVisite
   */
  getRapportById(id: number): Observable<RapportVisite> {
    return this.apiService.get<RapportVisite>(this.endpoint, { id });
  }

  /**
   * Get all visit reports for a hive
   * @param rucheId Hive ID
   * @returns Observable of array of RapportVisite
   */
  getRapportsByRuche(rucheId: number): Observable<RapportVisite[]> {
    return this.apiService.get<RapportVisite[]>(this.endpoint, { rucheId });
  }

  /**
   * Get all visit reports by an agent
   * @param agentId Agent ID
   * @returns Observable of array of RapportVisite
   */
  getRapportsByAgent(agentId: number): Observable<RapportVisite[]> {
    return this.apiService.get<RapportVisite[]>(this.endpoint, { agentId });
  }

  /**
   * Create a new visit report
   * @param rapport Report data
   * @returns Observable of created RapportVisite
   */
  createRapport(rapport: RapportVisite): Observable<RapportVisite> {
    return this.apiService.post<RapportVisite>(this.endpoint, rapport);
  }
}