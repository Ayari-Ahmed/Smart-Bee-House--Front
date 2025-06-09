import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-mes-sites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mes-sites.component.html',
  styleUrls: ['./mes-sites.component.css']
})
export class MesSitesComponent implements OnInit {
  sites = [
    {
      id: 1,
      name: 'Verger Pommier',
      location: 'Saint-Étienne',
      coordinates: [45.4397, 4.3872],
      ferme: 'Ferme des Abeilles d\'Or',
      totalProduction: 124,
      rucheCount: 10,
      activeRuches: 8,
      creationDate: '15/03/2021',
      lastInspection: '05/06/2023',
      description: 'Site situé dans un verger de pommiers biologiques.',
      ruches: [
        { id: 'R-001', type: 'Dadant', production: 28, status: 'Active' },
        { id: 'R-002', type: 'Dadant', production: 25, status: 'Active' },
        { id: 'R-003', type: 'Dadant', production: 22, status: 'Active' }
      ]
    },
    {
      id: 2,
      name: 'Champ Lavande',
      location: 'Valence',
      coordinates: [44.9334, 4.8920],
      ferme: 'Ferme des Abeilles d\'Or',
      totalProduction: 98,
      rucheCount: 8,
      activeRuches: 6,
      creationDate: '20/04/2021',
      lastInspection: '10/06/2023',
      description: 'Site entouré de champs de lavande en pleine floraison.',
      ruches: [
        { id: 'R-101', type: 'Langstroth', production: 32, status: 'Active' },
        { id: 'R-102', type: 'Langstroth', production: 21, status: 'Active' }
      ]
    },
    {
      id: 3,
      name: 'Forêt Acacia',
      location: 'Grenoble',
      coordinates: [45.1885, 5.7245],
      ferme: 'Rucher du Mont Blanc',
      totalProduction: 86,
      rucheCount: 7,
      activeRuches: 7,
      creationDate: '05/05/2022',
      lastInspection: '01/06/2023',
      description: 'Site forestier avec forte présence d\'acacias mellifères.',
      ruches: [
        { id: 'R-201', type: 'Warré', production: 18, status: 'Active' },
        { id: 'R-202', type: 'Warré', production: 24, status: 'Active' },
        { id: 'R-203', type: 'Warré', production: 22, status: 'Active' }
      ]
    }
  ];

  selectedSite: any = null;
  editMode = false;
  newSite = {
    id: 0,
    name: '',
    location: '',
    coordinates: [45.0, 5.0] as [number, number],
    ferme: '',
    totalProduction: 0,
    rucheCount: 0,
    activeRuches: 0,
    creationDate: '',
    lastInspection: '',
    description: '',
    ruches: []
  };
  private map: L.Map | null = null;
  sitesLayer: L.LayerGroup | null = null;

  ngOnInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();
    }
    
    this.map = L.map('sitesMap').setView([45.7500, 4.8500], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    this.sitesLayer = L.layerGroup().addTo(this.map);
    this.addSiteMarkers();
  }

  addSiteMarkers(): void {
    if (!this.sitesLayer) return;
    
    this.sitesLayer.clearLayers();
    
    this.sites.forEach(site => {
      const marker = L.marker(site.coordinates as L.LatLngExpression)
        .bindPopup(`
          <strong>${site.name}</strong><br>
          Ferme: ${site.ferme}<br>
          Production: ${site.totalProduction} kg<br>
          Ruches: ${site.activeRuches}/${site.rucheCount}
        `, { autoClose: false });
      
      marker.on('click', () => {
        this.selectSite(site);
      });
      
      marker.addTo(this.sitesLayer!);
    });
  }

  selectSite(site: any): void {
    this.selectedSite = site;
    this.editMode = false;
  }

  editSite(): void {
    this.editMode = true;
    this.newSite = {...this.selectedSite};
  }

  deleteSite(): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le site ${this.selectedSite.name} ?`)) {
      this.sites = this.sites.filter(site => site.id !== this.selectedSite.id);
      this.selectedSite = null;
      this.addSiteMarkers();
    }
  }

  saveSite(): void {
    if (this.editMode) {
      const index = this.sites.findIndex(site => site.id === this.newSite.id);
      if (index !== -1) {
        this.sites[index] = {...this.newSite};
      }
      this.selectedSite = {...this.newSite};
    } else {
      this.newSite.id = Math.max(...this.sites.map(site => site.id)) + 1;
      this.sites.push({...this.newSite});
      this.selectedSite = {...this.newSite};
    }
    this.editMode = false;
    this.addSiteMarkers();
  }

  cancelEdit(): void {
    this.editMode = false;
    if (!this.selectedSite) {
      this.newSite = {
        id: 0,
        name: '',
        location: '',
        coordinates: [45.0, 5.0] as [number, number],
        ferme: '',
        totalProduction: 0,
        rucheCount: 0,
        activeRuches: 0,
        creationDate: '',
        lastInspection: '',
        description: '',
        ruches: []
      };
    }
  }

  createNewSite(): void {
    this.selectedSite = null;
    this.editMode = true;
    this.newSite = {
      id: 0,
      name: '',
      location: '',
      coordinates: [45.0, 5.0] as [number, number],
      ferme: '',
      totalProduction: 0,
      rucheCount: 0,
      activeRuches: 0,
      creationDate: new Date().toLocaleDateString('fr-FR'),
      lastInspection: new Date().toLocaleDateString('fr-FR'),
      description: '',
      ruches: []
    };
  }
}
