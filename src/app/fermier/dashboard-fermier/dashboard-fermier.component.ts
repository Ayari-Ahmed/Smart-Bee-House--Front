import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface Activity {
  type: 'info' | 'success' | 'warning' | 'error';
  description: string;
  time: Date;
}

@Component({
  selector: 'app-dashboard-fermier',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './dashboard-fermier.component.html',
  styleUrls: ['./dashboard-fermier.component.css'],
})
export class DashboardFermierComponent implements AfterViewInit, OnInit {
  @ViewChild('productionChart') productionChartRef!: ElementRef;
  @ViewChild('hiveStatusChart') hiveStatusChartRef!: ElementRef;

  private productionChart: Chart | null = null;
  private hiveStatusChart: Chart | null = null;

  filterForm: FormGroup;
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

  // Dashboard metrics
  totalHives = 25;
  hiveChange = 8;
  activeSites = 3;
  siteChange = 0;
  totalProduction = 289;
  productionChange = 12;
  activeAlerts = 4;
  alertChange = -2;

  recentActivities = [
    {
      type: 'inspection',
      description: 'Inspection de routine - Ruche R-001',
      time: new Date('2024-03-15T10:30:00')
    },
    {
      type: 'production',
      description: 'Collecte de miel - Site Verger Pommier',
      time: new Date('2024-03-14T15:45:00')
    },
    {
      type: 'alert',
      description: 'Alerte - Ruche R-102 nécessite une intervention',
      time: new Date('2024-03-14T09:15:00')
    },
    {
      type: 'maintenance',
      description: 'Ajout de hausse - Ruche R-003',
      time: new Date('2024-03-13T14:20:00')
    }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.filterForm = this.fb.group({
      productionThreshold: [20],
      period: ['Ce mois'],
      site: ['Tous les sites'],
      hive: ['Toutes les ruches']
    });
  }

  ngAfterViewInit() {
    // Initialize map after a small delay to ensure DOM is ready
    setTimeout(() => {
      this.initMap();
      this.initCharts();
    }, 100);
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.warn('Map container not found, skipping map initialization');
      return;
    }

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

  private initCharts() {
    if (this.productionChartRef && this.productionChartRef.nativeElement) {
      const ctx = this.productionChartRef.nativeElement.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (this.productionChart) {
          this.productionChart.destroy();
        }

        this.productionChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [{
              label: 'Production (kg)',
              data: [12, 19, 15, 25, 32, 45, 42, 38, 35, 28, 22, 18],
              borderColor: '#FFB800',
              backgroundColor: 'rgba(255, 184, 0, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  color: 'rgba(0, 0, 0, 0.5)'
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 174, 0, 0.1)'
                },
                ticks: {
                  color: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          }
        });
      }
    }

    if (this.hiveStatusChartRef && this.hiveStatusChartRef.nativeElement) {
      const ctx = this.hiveStatusChartRef.nativeElement.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (this.hiveStatusChart) {
          this.hiveStatusChart.destroy();
        }

        this.hiveStatusChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['En Bon État', 'Attention Requise', 'Alertes'],
            datasets: [{
              data: [65, 25, 10],
              backgroundColor: [
                '#10B981',  // Green for healthy
                '#F59E0B',  // Orange for needs attention
                '#EF4444'   // Red for alerts
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  color: 'rgba(0, 0, 0, 0.5)',
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              }
            },
            cutout: '70%'
          }
        });
      }
    }
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

  loadDashboardData() {
    // Load dashboard data from your service
    // This is where you would typically make API calls
  }

  refreshData() {
    this.loadDashboardData();
    // TODO: Add refresh animation or notification
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'inspection':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z';
      case 'production':
        return 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z';
      case 'alert':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z';
      case 'maintenance':
        return 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z';
      default:
        return '';
    }
  }
}
