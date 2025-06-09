import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Site {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  production: number;
  efficiency: number;
  lastActivity: string;
  hives: Hive[];
  recommendation?: string;
  reason?: string;
  score?: number;
}

interface Hive {
  id: string;
  siteId: string;
  production: number;
  efficiency: number;
  lastActivity: string;
  alerts: string[];
  needsRelocation?: boolean;
  recommendedSiteId?: string;
  reason?: string;
}

@Component({
  selector: 'app-decisions-strategies',
  standalone: true,
  templateUrl: './decisions-strategies.component.html',
  styleUrls: ['./decisions-strategies.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class DecisionsStrategiesComponent implements OnInit {
  sites: Site[] = [];
  hives: Hive[] = [];
  filteredSites: Site[] = [];
  filteredHives: Hive[] = [];
  filterForm: FormGroup;
  activeTab: 'sites' | 'hives' = 'sites';
  showSiteDetailsModal = false;
  showHiveDetailsModal = false;
  selectedSite: Site | null = null;
  selectedHive: Hive | null = null;
  recommendationTypes = ['all', 'closure', 'relocation'];
  sortOptions = ['Highest Score', 'Lowest Score', 'Recent Activity', 'Oldest Activity'];
  closureSitesCount = 0;
  relocationHivesCount = 0;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      recommendationType: ['all'],
      sortBy: ['Highest Score'],
      minProductivity: [0]
    });
  }

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilters();
  }

  updateCounts(): void {
    this.closureSitesCount = this.filteredSites?.filter(s => s.recommendation === 'closure')?.length ?? 0;
    this.relocationHivesCount = this.filteredHives?.filter(h => h.needsRelocation)?.length ?? 0;
  }

  loadMockData(): void {
    this.sites = [
      {
        id: 's1',
        name: 'Site Lavande Est',
        location: 'Valensole',
        coordinates: '43.8368, 5.9834',
        production: 43,
        efficiency: 24,
        lastActivity: '10/06/2023',
        hives: [],
        recommendation: 'closure',
        reason: 'Productivité très faible et en déclin constant sur les 6 derniers mois. Coûts de maintenance non rentables.',
        score: 89
      },
      {
        id: 's2',
        name: 'Forêt de Chênes',
        location: 'Luberon',
        coordinates: '43.7956, 5.2264',
        production: 28,
        efficiency: 18,
        lastActivity: '12/06/2023',
        hives: [],
        recommendation: 'closure',
        reason: 'Taux de butinage bas et conditions météo défavorables prévues. Déménager les ruches vers des sites plus productifs.',
        score: 76
      },
      {
        id: 's3',
        name: 'Champ de Tournesols',
        location: 'Aix-en-Provence',
        coordinates: '43.5293, 5.4474',
        production: 118,
        efficiency: 87,
        lastActivity: '15/06/2023',
        hives: [],
      },
      {
        id: 's4',
        name: 'Verger de Pommiers',
        location: 'Avignon',
        coordinates: '43.9493, 4.8055',
        production: 95,
        efficiency: 72,
        lastActivity: '14/06/2023',
        hives: [],
      },
      {
        id: 's5',
        name: 'Prairie Alpine',
        location: 'Gap',
        coordinates: '44.5590, 6.0788',
        production: 67,
        efficiency: 54,
        lastActivity: '09/06/2023',
        hives: [],
        recommendation: 'surveillance',
        reason: 'Productivité en légère baisse. Prévoir une évaluation détaillée dans 1 mois.',
        score: 45
      }
    ];

    this.hives = [
      {
        id: 'R-001',
        siteId: 's1',
        production: 5.2,
        efficiency: 26,
        lastActivity: '10/06/2023',
        alerts: ['Production faible'],
        needsRelocation: true,
        recommendedSiteId: 's3',
        reason: 'Production sous le seuil minimal depuis 3 mois. Le site s3 offre des conditions plus favorables pour cette espèce.'
      },
      {
        id: 'R-002',
        siteId: 's1',
        production: 4.8,
        efficiency: 24,
        lastActivity: '09/06/2023',
        alerts: ['Production faible', 'Activité réduite'],
        needsRelocation: true,
        recommendedSiteId: 's4',
        reason: 'Activité de butinage réduite et faible productivité. Le verger de pommiers serait plus adapté pour cette ruche.'
      },
      {
        id: 'R-003',
        siteId: 's2',
        production: 6.1,
        efficiency: 30,
        lastActivity: '12/06/2023',
        alerts: ['Production faible'],
        needsRelocation: true,
        recommendedSiteId: 's3',
        reason: 'La ruche produirait mieux dans un environnement avec une plus grande diversité florale.'
      },
      {
        id: 'R-101',
        siteId: 's3',
        production: 22.5,
        efficiency: 88,
        lastActivity: '15/06/2023',
        alerts: []
      },
      {
        id: 'R-102',
        siteId: 's3',
        production: 24.8,
        efficiency: 92,
        lastActivity: '15/06/2023',
        alerts: []
      },
      {
        id: 'R-201',
        siteId: 's4',
        production: 18.7,
        efficiency: 76,
        lastActivity: '14/06/2023',
        alerts: []
      },
      {
        id: 'R-301',
        siteId: 's5',
        production: 12.3,
        efficiency: 58,
        lastActivity: '09/06/2023',
        alerts: ['Efficacité en baisse']
      }
    ];

    this.sites.forEach(site => {
      site.hives = this.hives.filter(hive => hive.siteId === site.id);
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;

    this.filteredSites = this.sites.filter(site => {
      if (filters.recommendationType === 'closure' && site.recommendation !== 'closure') {
        return false;
      }
      if (filters.recommendationType === 'relocation') {
        return false; // Sites don't have relocation recommendations
      }
      if (site.efficiency < filters.minProductivity) {
        return false;
      }
      return true;
    });

    this.filteredHives = this.hives.filter(hive => {
      if (filters.recommendationType === 'closure') {
        return false; // Hives don't have closure recommendations
      }
      if (filters.recommendationType === 'relocation' && !hive.needsRelocation) {
        return false;
      }
      if (hive.efficiency < filters.minProductivity) {
        return false;
      }
      return true;
    });

    this.sortData(filters.sortBy);
    this.updateCounts();
  }

  sortData(sortOption: string): void {
    this.filteredSites.sort((a, b) => {
      switch (sortOption) {
        case 'Highest Score':
          return (b.score || 0) - (a.score || 0);
        case 'Lowest Score':
          return (a.score || 0) - (b.score || 0);
        case 'Recent Activity':
          return this.compareDates(b.lastActivity, a.lastActivity);
        case 'Oldest Activity':
          return this.compareDates(a.lastActivity, b.lastActivity);
        default:
          return 0;
      }
    });

    this.filteredHives.sort((a, b) => {
      switch (sortOption) {
        case 'Highest Score':
          return b.efficiency - a.efficiency;
        case 'Lowest Score':
          return a.efficiency - b.efficiency;
        case 'Recent Activity':
          return this.compareDates(b.lastActivity, a.lastActivity);
        case 'Oldest Activity':
          return this.compareDates(a.lastActivity, b.lastActivity);
        default:
          return 0;
      }
    });
  }

  compareDates(dateA: string, dateB: string): number {
    try {
      const [dayA, monthA, yearA] = dateA.split('/').map(Number);
      const [dayB, monthB, yearB] = dateB.split('/').map(Number);
      const dateObjA = new Date(yearA, monthA - 1, dayA);
      const dateObjB = new Date(yearB, monthB - 1, dayB);
      return dateObjA.getTime() - dateObjB.getTime();
    } catch (e) {
      console.error('Invalid date format:', e);
      return 0;
    }
  }

  switchTab(tab: 'sites' | 'hives'): void {
    this.activeTab = tab;
  }

  openSiteDetails(site: Site): void {
    this.selectedSite = site;
    this.showSiteDetailsModal = true;
  }

  closeSiteDetailsModal(): void {
    this.showSiteDetailsModal = false;
    this.selectedSite = null;
  }

  openHiveDetails(hive: Hive): void {
    this.selectedHive = hive;
    this.showHiveDetailsModal = true;
  }

  closeHiveDetailsModal(): void {
    this.showHiveDetailsModal = false;
    this.selectedHive = null;
  }

  getSiteName(siteId: string): string {
    const site = this.sites.find(s => s.id === siteId);
    return site ? site.name : 'Site inconnu';
  }

  applyRecommendation(type: string, id: string): void {
    console.log(`Applying ${type} recommendation for ${id}`);
    if (type === 'site-closure') {
      alert(`Fermeture du site ${id} planifiée. Les ruches seront relocalisées selon les recommandations.`);
    } else if (type === 'hive-relocation') {
      const hive = this.hives.find(h => h.id === id);
      if (hive && hive.recommendedSiteId) {
        const recommendedSite = this.getSiteName(hive.recommendedSiteId);
        alert(`Relocalisation de la ruche ${id} vers ${recommendedSite} planifiée.`);
      }
    }
  }

  dismissRecommendation(type: string, id: string): void {
    console.log(`Dismissing ${type} recommendation for ${id}`);
    if (type === 'site-closure') {
      const siteIndex = this.sites.findIndex(s => s.id === id);
      if (siteIndex !== -1) {
        this.sites[siteIndex].recommendation = undefined;
        this.sites[siteIndex].reason = undefined;
        this.sites[siteIndex].score = undefined;
        this.applyFilters();
      }
    } else if (type === 'hive-relocation') {
      const hiveIndex = this.hives.findIndex(h => h.id === id);
      if (hiveIndex !== -1) {
        this.hives[hiveIndex].needsRelocation = false;
        this.hives[hiveIndex].recommendedSiteId = undefined;
        this.hives[hiveIndex].reason = undefined;
        this.applyFilters();
      }
    }
  }
}
