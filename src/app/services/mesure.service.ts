import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Mesure } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MesureService {
  private endpoint = 'mesures';

  constructor(private apiService: ApiService) { }

  /**
   * Get all measurements for a specific hive
   * @param rucheId Hive ID
   * @returns Observable of array of Mesure
   */
  getMesuresByRuche(rucheId: number): Observable<Mesure[]> {
    return this.apiService.get<Mesure[]>(this.endpoint, { rucheId });
  }

  /**
   * Get all weight measurements for a specific hive
   * @param rucheId Hive ID
   * @returns Observable of array of Mesure
   */
  getPoidsByRuche(rucheId: number): Observable<Mesure[]> {
    return this.apiService.get<Mesure[]>(this.endpoint, { rucheId, type: 'POIDS' });
  }

  /**
   * Create a new measurement
   * @param mesure Measurement data
   * @returns Observable of created Mesure
   */
  createMesure(mesure: Mesure): Observable<Mesure> {
    return this.apiService.post<Mesure>(this.endpoint, mesure);
  }
}