import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import Chart from 'chart.js/auto'; // Correct import

@Component({
  selector: 'app-dashboard-fermier',
  standalone: false,
  templateUrl: './dashboard-fermier.component.html',
  
  styleUrls: ['./dashboard-fermier.component.css'],
})
export class DashboardFermierComponent implements AfterViewInit {
  filterForm: FormGroup;
  sidebarCollapsed = true;
  periods = ['Ce mois', 'Cette saison', 'Cette année', 'Personnalisée'];
  sites = ['Tous les sites', 'Verger Pommier', 'Champ Lavande', 'Forêt Acacia'];
  hives = ['Toutes les ruches', 'R-001', 'R-002', 'R-003', 'R-101', 'R-102'];
  sitesData = [
    {
      name: 'Verger Pommier',
      totalProduction: 124,
      coordinates: '45.1234, 4.5678',
      totalHives: 10,
      hives: [
        {
          id: 'R-001',
          production: 28,
          lastMeasurement: '15/06/2023',
          needsAction: true,
          alerts: { collecte: true, extension: true },
          site: 'Verger Pommier',
          type: 'Dadant',
          queenMarked: 'Oui (2022)',
          avgProduction: '18 kg/mois',
          interventions: [
            { date: '10/06/2023', type: 'Inspection', technician: 'J. Dupont', notes: 'Reine en bonne santé, couvain abondant' },
            { date: '25/05/2023', type: 'Nourrissement', technician: 'M. Martin', notes: 'Apport de sirop 1:1' },
            { date: '15/04/2023', type: 'Traitement', technician: 'J. Dupont', notes: 'Traitement varroa - acide oxalique' }
          ],
          recommendations: [
            'Prévoir la collecte de miel dans les 7 jours',
            'Ajouter une hausse avant la fin du mois',
            'Surveiller l\'activité de butinage (forte activité)'
          ]
        },
        { id: 'R-002', production: 25, lastMeasurement: '14/06/2023', needsAction: false, alerts: { collecte: true, extension: false }, site: 'Verger Pommier', type: 'Dadant', queenMarked: 'Non', avgProduction: '15 kg/mois', interventions: [], recommendations: [] },
        { id: 'R-003', production: 22, lastMeasurement: '16/06/2023', needsAction: false, alerts: { collecte: false, extension: true }, site: 'Verger Pommier', type: 'Dadant', queenMarked: 'Oui (2023)', avgProduction: '17 kg/mois', interventions: [], recommendations: [] }
      ]
    },
    {
      name: 'Champ Lavande',
      totalProduction: 98,
      coordinates: '45.2234, 4.6678',
      totalHives: 8,
      hives: [
        { id: 'R-101', production: 32, lastMeasurement: '12/06/2023', needsAction: true, alerts: { collecte: true, extension: true }, site: 'Champ Lavande', type: 'Langstroth', queenMarked: 'Oui (2022)', avgProduction: '20 kg/mois', interventions: [], recommendations: [] },
        { id: 'R-102', production: 21, lastMeasurement: '13/06/2023', needsAction: false, alerts: { collecte: false, extension: true }, site: 'Champ Lavande', type: 'Langstroth', queenMarked: 'Non', avgProduction: '14 kg/mois', interventions: [], recommendations: [] }
      ]
    }
  ];

  filteredSites = [...this.sitesData];
  selectedHive: any = null;
  selectedSite: any = null;
  private map: L.Map | undefined;

  constructor(private fb: FormBuilder, private router: Router) {
    this.filterForm = this.fb.group({
      productionThreshold: [20],
      period: ['Ce mois'],
      site: ['Tous les sites'],
      hive: ['Toutes les ruches']
    });
  }

  ngAfterViewInit() {
    this.initMap();
    this.initChart();
  }

  initMap() {
    this.map = L.map('map').setView([45.1234, 4.5678], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.sitesData.forEach(site => {
      const [lat, lon] = site.coordinates.split(', ').map(Number);
      L.marker([lat, lon])
        .addTo(this.map!)
        .bindPopup(`<b>${site.name}</b><br>Production: ${site.totalProduction} kg`);
    });
  }

  initChart() {
    const ctx = document.getElementById('productionChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Production (kg)',
          data: [50, 60, 80, 90, 110, 124],
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  applyFilters() {
    const { productionThreshold, site, hive } = this.filterForm.value;
    this.filteredSites = this.sitesData.filter(s => {
      const matchesSite = site === 'Tous les sites' || s.name === site;
      const matchesHives = hive === 'Toutes les ruches' || s.hives.some(h => h.id === hive);
      const matchesThreshold = s.hives.some(h => h.production >= (productionThreshold || 0));
      return matchesSite && matchesHives && matchesThreshold;
    });
  }

  openHiveModal(hive: any) {
    this.selectedHive = hive;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('hiveDetailsModal'));
    modal.show();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    this.router.navigate(['/signin']);
  }

  editSite(site: any) {
    this.selectedSite = site;
  }

  deleteSite(site: any) {
    console.log('Delete site:', site);
  }

  onSaveSite(site: any) {
    console.log('Save site:', site);
    this.selectedSite = null;
  }

  onCloseModal() {
    this.selectedSite = null;
  }
}
