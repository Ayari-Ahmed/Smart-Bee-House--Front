import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SiteApiculture } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SiteApicultureService {
  private endpoint = 'sites';

  constructor(private apiService: ApiService) { }

  /**
   * Get a site by ID
   * @param id Site ID
   * @returns Observable of SiteApiculture
   */
  getSiteById(id: number): Observable<SiteApiculture> {
    return this.apiService.get<SiteApiculture>(this.endpoint, { id });
  }

  /**
   * Get all sites by farm ID
   * @param fermeId Farm ID
   * @returns Observable of array of SiteApiculture
   */
  getSitesByFerme(fermeId: number): Observable<SiteApiculture[]> {
    return this.apiService.get<SiteApiculture[]>(this.endpoint, { fermeId });
  }

  /**
   * Create a new apiculture site
   * @param site Site data
   * @returns Observable of created SiteApiculture
   */
  createSite(site: SiteApiculture): Observable<SiteApiculture> {
    return this.apiService.post<SiteApiculture>(this.endpoint, site);
  }

  /**
   * Update an existing apiculture site
   * @param site Site data with ID
   * @returns Observable of updated SiteApiculture
   */
  updateSite(site: SiteApiculture): Observable<SiteApiculture> {
    return this.apiService.put<SiteApiculture>(this.endpoint, site);
  }

  /**
   * Delete an apiculture site by ID
   * @param id Site ID
   * @returns Observable of delete confirmation
   */
  deleteSite(id: number): Observable<any> {
    return this.apiService.delete<any>(this.endpoint, { id });
  }
}