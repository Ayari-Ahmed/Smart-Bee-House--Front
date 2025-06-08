import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-production-collecte',
  templateUrl: './production-collecte.component.html',
  styleUrls: ['./production-collecte.component.css']
})
export class ProductionCollecteComponent implements OnInit {
  filterForm: FormGroup;
  selectedHarvest: any = null;
  newHarvestMode = false;
  showPlanningModal = false;

  periods = ['Cette année', 'Cette saison', '6 derniers mois', '30 derniers jours'];
  sites = ['Tous les sites', 'Verger Pommier', 'Champ Lavande', 'Forêt Acacia'];
  honeyTypes = ['Toutes fleurs', 'Acacia', 'Lavande', 'Châtaignier', 'Tilleul', 'Tournesol'];

  // Sample data
  productionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Production (kg)',
        data: [42, 38, 65, 85, 120, 152, 170, 168, 145, 110, 75, 58],
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderColor: '#ffc107',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      },
      {
        label: 'Prévisions (kg)',
        data: [42, 38, 65, 85, 120, 152, 170, 168, 145, 110, 75, 58].map(val => val * 1.15),
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderColor: '#2196f3',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        tension: 0.3
      }
    ]
  };

  productionBySite = [
    { name: 'Verger Pommier', production: 624, percentage: 45, color: '#4caf50' },
    { name: 'Champ Lavande', production: 426, percentage: 31, color: '#9c27b0' },
    { name: 'Forêt Acacia', production: 328, percentage: 24, color: '#ff9800' }
  ];

  productionByType = [
    { name: 'Toutes fleurs', production: 512, percentage: 37, color: '#ffeb3b' },
    { name: 'Acacia', production: 328, percentage: 24, color: '#f5f5f5' },
    { name: 'Lavande', production: 246, percentage: 18, color: '#9c27b0' },
    { name: 'Châtaignier', production: 138, percentage: 10, color: '#795548' },
    { name: 'Tilleul', production: 92, percentage: 7, color: '#cddc39' },
    { name: 'Tournesol', production: 62, percentage: 4, color: '#ffc107' }
  ];

  harvestHistory = [
    {
      id: 'H-2023-06',
      date: '15/06/2023',
      site: 'Verger Pommier',
      ruches: ['R-001', 'R-002', 'R-003'],
      type: 'Toutes fleurs',
      quantity: 72,
      quality: 'Premium',
      notes: 'Excellente récolte de printemps. Miel clair avec notes florales prononcées.'
    },
    {
      id: 'H-2023-05',
      date: '22/05/2023',
      site: 'Champ Lavande',
      ruches: ['R-101', 'R-102'],
      type: 'Lavande',
      quantity: 58,
      quality: 'Premium',
      notes: 'Récolte de lavande précoce. Couleur ambrée et arôme caractéristique.'
    },
    {
      id: 'H-2023-04',
      date: '10/05/2023',
      site: 'Forêt Acacia',
      ruches: ['R-201', 'R-202', 'R-203'],
      type: 'Acacia',
      quantity: 65,
      quality: 'Standard',
      notes: 'Miel très clair et très liquide. Floraison d\'acacia légèrement retardée cette année.'
    },
    {
      id: 'H-2023-03',
      date: '18/04/2023',
      site: 'Verger Pommier',
      ruches: ['R-001', 'R-002'],
      type: 'Toutes fleurs',
      quantity: 45,
      quality: 'Premium',
      notes: 'Première récolte de printemps. Notes fruitées des arbres du verger.'
    },
    {
      id: 'H-2022-08',
      date: '12/09/2022',
      site: 'Champ Lavande',
      ruches: ['R-101', 'R-102'],
      type: 'Tournesol',
      quantity: 62,
      quality: 'Standard',
      notes: 'Dernière récolte de la saison. Cristallisation rapide observée.'
    }
  ];

  plannedHarvests = [
    {
      id: 'P-2023-01',
      plannedDate: '05/07/2023',
      site: 'Verger Pommier',
      ruches: ['R-001', 'R-002', 'R-003'],
      estimatedQuantity: 68,
      notified: true,
      status: 'Programmée'
    },
    {
      id: 'P-2023-02',
      plannedDate: '15/07/2023',
      site: 'Champ Lavande',
      ruches: ['R-101', 'R-102'],
      estimatedQuantity: 52,
      notified: true,
      status: 'Programmée'
    },
    {
      id: 'P-2023-03',
      plannedDate: '28/07/2023',
      site: 'Forêt Acacia',
      ruches: ['R-201', 'R-202', 'R-203'],
      estimatedQuantity: 45,
      notified: false,
      status: 'À confirmer'
    }
  ];

  productionChart: any;
  donutChart: any;
  newHarvest = {
    id: '',
    date: new Date().toLocaleDateString('fr-FR'),
    site: 'Verger Pommier',
    ruches: [],
    type: 'Toutes fleurs',
    quantity: 0,
    quality: 'Standard',
    notes: ''
  };

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      period: ['Cette année'],
      site: ['Tous les sites'],
      honeyType: ['']
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.initProductionChart();
      this.initDonutChart();
    }, 100);
  }

  initProductionChart(): void {
    const ctx = document.getElementById('productionChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.productionChart) {
      this.productionChart.destroy();
    }

    this.productionChart = new Chart(ctx, {
      type: 'line',
      data: this.productionData,
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

  initDonutChart(): void {
    const ctx = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.donutChart) {
      this.donutChart.destroy();
    }

    // Use the site data by default, can be toggled to type data
    const displayData = this.productionBySite;

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: displayData.map(item => item.name),
        datasets: [{
          data: displayData.map(item => item.production),
          backgroundColor: displayData.map(item => item.color),
          borderColor: '#ffffff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  toggleChartData(type: 'site' | 'type'): void {
    if (!this.donutChart) return;

    const displayData = type === 'site' ? this.productionBySite : this.productionByType;

    this.donutChart.data.labels = displayData.map(item => item.name);
    this.donutChart.data.datasets[0].data = displayData.map(item => item.production);
    this.donutChart.data.datasets[0].backgroundColor = displayData.map(item => item.color);
    this.donutChart.update();
  }

  selectHarvest(harvest: any): void {
    this.selectedHarvest = harvest;
    this.newHarvestMode = false;
  }

  startNewHarvest(): void {
    this.newHarvestMode = true;
    this.selectedHarvest = null;
    this.newHarvest = {
      id: `H-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      date: new Date().toLocaleDateString('fr-FR'),
      site: 'Verger Pommier',
      ruches: [],
      type: 'Toutes fleurs',
      quantity: 0,
      quality: 'Standard',
      notes: ''
    };
  }

  cancelNewHarvest(): void {
    this.newHarvestMode = false;
  }

  saveNewHarvest(): void {
    if (this.newHarvest.quantity <= 0) {
      alert('La quantité doit être supérieure à zéro.');
      return;
    }

    if (this.newHarvest.ruches.length === 0) {
      alert('Veuillez sélectionner au moins une ruche.');
      return;
    }

    this.harvestHistory.unshift({...this.newHarvest});
    this.selectedHarvest = this.harvestHistory[0];
    this.newHarvestMode = false;
  }

  applyFilters(): void {
    // In a real app, this would filter the production data based on the form values
    console.log('Applying filters:', this.filterForm.value);
    
    // For the demo, we'll just update the chart randomly
    const randomFactor = Math.random() * 0.4 + 0.8; // between 0.8 and 1.2
    this.productionData.datasets[0].data = this.productionData.datasets[0].data.map(val => 
      Math.round(val * randomFactor)
    );
    this.productionData.datasets[1].data = this.productionData.datasets[0].data.map(val => 
      Math.round(val * 1.15)
    );

    this.initProductionChart();
  }

  toggleSitePlanningModal(): void {
    this.showPlanningModal = !this.showPlanningModal;
  }

  getAvailableRuchesBySelectedSite(): string[] {
    // This would normally fetch ruches from a service based on the selected site
    switch (this.newHarvest.site) {
      case 'Verger Pommier':
        return ['R-001', 'R-002', 'R-003'];
      case 'Champ Lavande':
        return ['R-101', 'R-102'];
      case 'Forêt Acacia':
        return ['R-201', 'R-202', 'R-203'];
      default:
        return [];
    }
  }
  
  toggleRucheSelection(ruche: string): void {
    const index = this.newHarvest.ruches.indexOf(ruche);
    if (index === -1) {
      this.newHarvest.ruches.push(ruche);
    } else {
      this.newHarvest.ruches.splice(index, 1);
    }
  }
  
  isRucheSelected(ruche: string): boolean {
    return this.newHarvest.ruches.includes(ruche);
  }
  
  getTotalYearlyProduction(): number {
    return this.productionData.datasets[0].data.reduce((sum, value) => sum + value, 0);
  }
  
  getTotalHarvestedThisYear(): number {
    const currentYear = new Date().getFullYear();
    return this.harvestHistory
      .filter(harvest => harvest.id.startsWith(`H-${currentYear}`))
      .reduce((sum, harvest) => sum + harvest.quantity, 0);
  }
  
  getEstimatedRemainingProduction(): number {
    return this.plannedHarvests.reduce((sum, harvest) => sum + harvest.estimatedQuantity, 0);
  }
}