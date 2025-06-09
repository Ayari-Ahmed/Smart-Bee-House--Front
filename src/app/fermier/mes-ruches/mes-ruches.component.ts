import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-mes-ruches',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './mes-ruches.component.html',
  styleUrls: ['./mes-ruches.component.css']
})
export class MesRuchesComponent implements OnInit {
  filterForm: FormGroup;
  selectedHive: any = null;
  editMode = false;

  sites = [
    'Tous les sites', 
    'Verger Pommier', 
    'Champ Lavande', 
    'Forêt Acacia'
  ];
  
  hiveTypes = [
    'Dadant',
    'Langstroth',
    'Warré',
    'Kenyane (KTBH)'
  ];
  
  statuses = [
    'Active',
    'Inactive',
    'En préparation',
    'En traitement'
  ];

  hives = [
    {
      id: 'R-001',
      type: 'Dadant',
      site: 'Verger Pommier',
      status: 'Active',
      queenMarked: 'Oui (2022)',
      installationDate: '15/03/2021',
      lastInspection: '10/06/2023',
      production: 28,
      productionHistory: [15, 18, 20, 22, 25, 28],
      healthScore: 92,
      alerts: { collecte: true, extension: true, traitement: false },
      interventions: [
        { date: '10/06/2023', type: 'Inspection', technician: 'J. Dupont', notes: 'Reine en bonne santé, couvain abondant' },
        { date: '25/05/2023', type: 'Nourrissement', technician: 'M. Martin', notes: 'Apport de sirop 1:1' },
        { date: '15/04/2023', type: 'Traitement', technician: 'J. Dupont', notes: 'Traitement varroa - acide oxalique' }
      ]
    },
    {
      id: 'R-002',
      type: 'Dadant',
      site: 'Verger Pommier',
      status: 'Active',
      queenMarked: 'Non',
      installationDate: '18/03/2021',
      lastInspection: '10/06/2023',
      production: 25,
      productionHistory: [14, 16, 19, 21, 23, 25],
      healthScore: 88,
      alerts: { collecte: true, extension: false, traitement: false },
      interventions: [
        { date: '10/06/2023', type: 'Inspection', technician: 'J. Dupont', notes: 'Colonie forte, présence de cellules royales' },
        { date: '25/05/2023', type: 'Ajout de hausse', technician: 'M. Martin', notes: 'Ajout d\'une hausse supplémentaire' }
      ]
    },
    {
      id: 'R-003',
      type: 'Dadant',
      site: 'Verger Pommier',
      status: 'Active',
      queenMarked: 'Oui (2023)',
      installationDate: '20/03/2021',
      lastInspection: '11/06/2023',
      production: 22,
      productionHistory: [12, 14, 16, 18, 20, 22],
      healthScore: 90,
      alerts: { collecte: false, extension: true, traitement: false },
      interventions: [
        { date: '11/06/2023', type: 'Inspection', technician: 'J. Dupont', notes: 'Reine observée, marquage effectué' },
        { date: '02/05/2023', type: 'Traitement', technician: 'L. Bernard', notes: 'Traitement préventif - acide formique' }
      ]
    },
    {
      id: 'R-101',
      type: 'Langstroth',
      site: 'Champ Lavande',
      status: 'Active',
      queenMarked: 'Oui (2022)',
      installationDate: '10/04/2021',
      lastInspection: '08/06/2023',
      production: 32,
      productionHistory: [18, 20, 23, 26, 29, 32],
      healthScore: 95,
      alerts: { collecte: true, extension: true, traitement: false },
      interventions: [
        { date: '08/06/2023', type: 'Inspection', technician: 'P. Mercier', notes: 'Excellente production, colonie très forte' },
        { date: '15/05/2023', type: 'Ajout de hausse', technician: 'P. Mercier', notes: 'Deuxième hausse ajoutée' }
      ]
    },
    {
      id: 'R-102',
      type: 'Langstroth',
      site: 'Champ Lavande',
      status: 'Active',
      queenMarked: 'Non',
      installationDate: '12/04/2021',
      lastInspection: '08/06/2023',
      production: 21,
      productionHistory: [10, 12, 15, 17, 19, 21],
      healthScore: 87,
      alerts: { collecte: false, extension: true, traitement: false },
      interventions: [
        { date: '08/06/2023', type: 'Inspection', technician: 'P. Mercier', notes: 'Reine non observée mais présence d\'œufs' }
      ]
    },
    {
      id: 'R-201',
      type: 'Warré',
      site: 'Forêt Acacia',
      status: 'Active',
      queenMarked: 'Non',
      installationDate: '05/05/2022',
      lastInspection: '01/06/2023',
      production: 18,
      productionHistory: [8, 10, 12, 14, 16, 18],
      healthScore: 88,
      alerts: { collecte: false, extension: false, traitement: true },
      interventions: [
        { date: '01/06/2023', type: 'Inspection', technician: 'A. Durand', notes: 'Signes de présence de varroa, traitement recommandé' }
      ]
    }
  ];

  filteredHives = [...this.hives];
  hivesChart: any;
  newHive = {
    id: '',
    type: 'Dadant',
    site: 'Verger Pommier',
    status: 'En préparation',
    queenMarked: 'Non',
    installationDate: '',
    lastInspection: '',
    production: 0,
    productionHistory: [0],
    healthScore: 85,
    alerts: { collecte: false, extension: false, traitement: false },
    interventions: []
  };

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      site: ['Tous les sites'],
      type: [''],
      status: [''],
      productionMin: [0]
    });
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  selectHive(hive: any): void {
    this.selectedHive = hive;
    this.editMode = false;
    
    setTimeout(() => {
      this.initHiveChart();
    }, 100);
  }
  
  initHiveChart(): void {
    if (!this.selectedHive) return;
    
    if (this.hivesChart) {
      this.hivesChart.destroy();
    }
    
    const ctx = document.getElementById('hiveProductionChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    this.hivesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
        datasets: [{
          label: 'Production (kg)',
          data: this.selectedHive.productionHistory,
          fill: true,
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Production (kg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mois'
            }
          }
        }
      }
    });
  }
  
  applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredHives = this.hives.filter(hive => {
      const matchesSite = filters.site === 'Tous les sites' || hive.site === filters.site;
      const matchesType = !filters.type || hive.type === filters.type;
      const matchesStatus = !filters.status || hive.status === filters.status;
      const matchesProduction = hive.production >= filters.productionMin;
      
      return matchesSite && matchesType && matchesStatus && matchesProduction;
    });
  }
  
  editHive(): void {
    this.newHive = {...this.selectedHive};
    this.editMode = true;
  }
  
  deleteHive(): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la ruche ${this.selectedHive.id} ?`)) {
      this.hives = this.hives.filter(hive => hive.id !== this.selectedHive.id);
      this.applyFilters();
      this.selectedHive = null;
    }
  }
  
  saveHive(): void {
    if (this.editMode && this.selectedHive) {
      const index = this.hives.findIndex(hive => hive.id === this.selectedHive.id);
      if (index !== -1) {
        this.hives[index] = {...this.newHive};
        this.selectedHive = {...this.newHive};
      }
    } else {
      // Generate ID for new hive based on site
      const sitePrefix = this.newHive.site === 'Verger Pommier' ? 'R-0' :
                         this.newHive.site === 'Champ Lavande' ? 'R-1' : 'R-2';
      const existingIds = this.hives
        .filter(h => h.id.startsWith(sitePrefix))
        .map(h => parseInt(h.id.slice(3)));
      const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
      this.newHive.id = `${sitePrefix}${nextId.toString().padStart(2, '0')}`;
      
      this.hives.push({...this.newHive});
      this.selectedHive = {...this.newHive};
    }
    
    this.editMode = false;
    this.applyFilters();
    
    setTimeout(() => {
      this.initHiveChart();
    }, 100);
  }
  
  cancelEdit(): void {
    this.editMode = false;
  }
  
  createNewHive(): void {
    const today = new Date().toLocaleDateString('fr-FR');
    
    this.newHive = {
      id: '',
      type: 'Dadant',
      site: 'Verger Pommier',
      status: 'En préparation',
      queenMarked: 'Non',
      installationDate: today,
      lastInspection: today,
      production: 0,
      productionHistory: [0],
      healthScore: 85,
      alerts: { collecte: false, extension: false, traitement: false },
      interventions: []
    };
    
    this.selectedHive = null;
    this.editMode = true;
  }
  
  getAlertCount(hive: any): number {
    let count = 0;
    if (hive.alerts.collecte) count++;
    if (hive.alerts.extension) count++;
    if (hive.alerts.traitement) count++;
    return count;
  }
  
  resetFilters(): void {
    this.filterForm.reset({
      site: 'Tous les sites',
      type: '',
      status: '',
      productionMin: 0
    });
    this.applyFilters();
  }
}
