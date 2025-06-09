import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Chart, { registerables } from 'chart.js/auto';

interface Ruche {
  id: string;
  name: string;
  siteId: string;
  status: string;
  estimatedProduction: number;
  lastHarvest: Date;
}

@Component({
  selector: 'app-production-collecte',
  templateUrl: './production-collecte.component.html',
  styleUrls: ['./production-collecte.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class ProductionCollecteComponent implements OnInit {
  filterForm: FormGroup;
  selectedHarvest: any = null;
  newHarvestMode = false;
  showPlanningModal = false;
  selectedDate: Date | null = null;
  selectedSite: any = null;
  selectedRuches: Ruche[] = [];
  currentMonth = new Date();
  calendarDays: any[] = [];
  weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

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

  plannedHarvests: {
    id: string;
    plannedDate: Date;
    site: string;
    ruches: string[];
    estimatedQuantity: number;
    notified: boolean;
    status: string;
  }[] = [
    {
      id: 'P-2023-01',
      plannedDate: new Date('2023-07-05'),
      site: 'Verger Pommier',
      ruches: ['R-001', 'R-002', 'R-003'],
      estimatedQuantity: 68,
      notified: true,
      status: 'Programmée'
    },
    {
      id: 'P-2023-02',
      plannedDate: new Date('2023-07-15'),
      site: 'Champ Lavande',
      ruches: ['R-101', 'R-102'],
      estimatedQuantity: 52,
      notified: true,
      status: 'Programmée'
    },
    {
      id: 'P-2023-03',
      plannedDate: new Date('2023-07-28'),
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
    ruches: [] as Ruche[],
    type: 'Toutes fleurs',
    quantity: 0,
    quality: 'Standard',
    notes: ''
  };

  // Update sitesData to match the actual site names
  sitesData = [
    {
      id: '1',
      name: 'Verger Pommier',
      location: 'Nord de la ferme',
      ruches: 12,
      status: 'available',
      lastHarvest: '2024-02-15'
    },
    {
      id: '2',
      name: 'Champ Lavande',
      location: 'Sud de la ferme',
      ruches: 8,
      status: 'available',
      lastHarvest: '2024-02-20'
    },
    {
      id: '3',
      name: 'Forêt Acacia',
      location: 'Est de la ferme',
      ruches: 10,
      status: 'available',
      lastHarvest: '2024-02-18'
    }
  ];

  // Update ruchesData with more ruches for each site
  ruchesData: Ruche[] = [
    // Verger Pommier ruches
    {
      id: 'R-001',
      name: 'Ruche A1',
      siteId: '1',
      status: 'ready',
      lastHarvest: new Date('2024-02-15'),
      estimatedProduction: 15
    },
    {
      id: 'R-002',
      name: 'Ruche A2',
      siteId: '1',
      status: 'ready',
      lastHarvest: new Date('2024-02-15'),
      estimatedProduction: 18
    },
    {
      id: 'R-003',
      name: 'Ruche A3',
      siteId: '1',
      status: 'ready',
      lastHarvest: new Date('2024-02-15'),
      estimatedProduction: 20
    },
    // Champ Lavande ruches
    {
      id: 'R-101',
      name: 'Ruche B1',
      siteId: '2',
      status: 'ready',
      lastHarvest: new Date('2024-02-20'),
      estimatedProduction: 16
    },
    {
      id: 'R-102',
      name: 'Ruche B2',
      siteId: '2',
      status: 'ready',
      lastHarvest: new Date('2024-02-20'),
      estimatedProduction: 17
    },
    // Forêt Acacia ruches
    {
      id: 'R-201',
      name: 'Ruche C1',
      siteId: '3',
      status: 'ready',
      lastHarvest: new Date('2024-02-18'),
      estimatedProduction: 19
    },
    {
      id: 'R-202',
      name: 'Ruche C2',
      siteId: '3',
      status: 'ready',
      lastHarvest: new Date('2024-02-18'),
      estimatedProduction: 21
    },
    {
      id: 'R-203',
      name: 'Ruche C3',
      siteId: '3',
      status: 'ready',
      lastHarvest: new Date('2024-02-18'),
      estimatedProduction: 22
    }
  ];

  // Add debounce for site selection
  private siteSelectionTimeout: any;

  // Add filteredRuches property
  private filteredRuches: Ruche[] = [];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      period: ['Cette année'],
      site: ['Tous les sites'],
      honeyType: ['']
    });
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.initProductionChart();
      this.initDonutChart();
    }, 100);
    this.generateCalendarDays();
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

    // Convert Ruche objects to ruche IDs for storage
    const rucheIds = this.newHarvest.ruches.map(ruche => ruche.id);

    const newHarvestEntry = {
      ...this.newHarvest,
      ruches: rucheIds,  // Store ruche IDs instead of Ruche objects
      id: `H-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    };

    this.harvestHistory.unshift(newHarvestEntry);
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

  getAvailableRuchesBySelectedSite(): Ruche[] {
    if (!this.newHarvest.site) return [];
    
    // Find the site ID based on the site name
    const selectedSite = this.sitesData.find(site => site.name === this.newHarvest.site);
    if (!selectedSite) return [];

    // Filter ruches based on the selected site ID
    return this.ruchesData.filter(ruche => 
      ruche.siteId === selectedSite.id && 
      ruche.status === 'ready'
    );
  }
  
  selectSite(site: any) {
    // Clear any pending selection
    if (this.siteSelectionTimeout) {
      clearTimeout(this.siteSelectionTimeout);
    }

    // Debounce the selection to prevent rapid re-renders
    this.siteSelectionTimeout = setTimeout(() => {
      this.selectedSite = site;
      this.selectedRuches = []; // Clear ruche selection when site changes
      
      // Use requestAnimationFrame for smooth UI updates
      requestAnimationFrame(() => {
        // Update filtered ruches after the UI has updated
        this.updateFilteredRuches();
      });
    }, 50);
  }

  // Optimize ruche filtering
  private updateFilteredRuches() {
    if (!this.selectedSite) {
      this.filteredRuches = [];
      return;
    }

    // Filter and ensure type safety
    this.filteredRuches = this.ruchesData
      .filter(ruche => 
        ruche.siteId === this.selectedSite.id && 
        ruche.status === 'ready'
      )
      .map(ruche => ({
        ...ruche,
        lastHarvest: ruche.lastHarvest instanceof Date ? ruche.lastHarvest : new Date(ruche.lastHarvest)
      }));
  }

  getFilteredRuches() {
    return this.filteredRuches;
  }

  // Optimize ruche selection
  toggleRucheSelection(ruche: Ruche) {
    const index = this.selectedRuches.findIndex(r => r.id === ruche.id);
    
    if (index === -1) {
      // Add ruche if not already selected
      this.selectedRuches = [...this.selectedRuches, ruche];
    } else {
      // Remove ruche if already selected
      this.selectedRuches = this.selectedRuches.filter(r => r.id !== ruche.id);
    }

    // Use requestAnimationFrame for smooth UI updates
    requestAnimationFrame(() => {
      this.calculateEstimatedProduction();
    });
  }

  // Optimize production calculation
  calculateEstimatedProduction(): number {
    return this.selectedRuches.reduce((total, ruche) => 
      total + ruche.estimatedProduction, 0
    );
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

  // Planning Modal Methods
  openPlanningModal() {
    this.showPlanningModal = true;
    this.selectedDate = null;
    this.selectedSite = null;
    this.selectedRuches = [];
    this.generateCalendarDays();
  }

  closePlanningModal() {
    this.showPlanningModal = false;
  }

  generateCalendarDays() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: any[] = [];
    
    // Add days from previous month
    const firstDayIndex = firstDay.getDay();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        number: date.getDate(),
        isCurrentMonth: false,
        isAvailable: this.isDateAvailable(date)
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        number: i,
        isCurrentMonth: true,
        isAvailable: this.isDateAvailable(date)
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        number: date.getDate(),
        isCurrentMonth: false,
        isAvailable: this.isDateAvailable(date)
      });
    }
    
    this.calendarDays = days;
  }

  isDateAvailable(date: Date): boolean {
    // Add your logic to check if a date is available for harvest
    // For example, check if there are any planned harvests on that date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow dates in the past
    if (date < today) return false;
    
    // Add more complex availability logic here
    // For now, we'll just make weekends unavailable
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
  }

  selectDate(day: any) {
    if (!day.isCurrentMonth || !day.isAvailable) return;
    this.selectedDate = day.date;
    this.selectedRuches = []; // Reset selected ruches when date changes
  }

  getEstimatedProduction(): number {
    return this.selectedRuches.reduce((total, ruche) => 
      total + ruche.estimatedProduction, 0
    );
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.generateCalendarDays();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.generateCalendarDays();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  confirmPlanning(): void {
    if (!this.canSavePlanning() || !this.selectedDate) return;

    const rucheIds = this.selectedRuches.map(ruche => ruche.id);

    const newPlan = {
      id: `P-${new Date().getFullYear()}-${String(this.plannedHarvests.length + 1).padStart(2, '0')}`,
      plannedDate: this.selectedDate,
      site: this.selectedSite?.name || '',
      ruches: rucheIds,
      estimatedQuantity: this.calculateEstimatedProduction(),
      status: 'Programmée',
      notified: false
    };

    this.plannedHarvests.push(newPlan);
    this.closePlanningModal();
  }

  canSavePlanning(): boolean {
    return !!this.selectedDate && !!this.selectedSite && this.selectedRuches.length > 0;
  }

  // Add missing methods
  getSiteProduction(site: string): number {
    // In a real app, this would fetch actual production data
    const siteData = this.productionBySite.find(s => s.name === site);
    return siteData ? siteData.production : 0;
  }

  isSiteAvailable(site: string): boolean {
    // In a real app, this would check actual site availability
    const siteData = this.sitesData.find(s => s.name === site);
    return siteData ? siteData.status === 'available' : false;
  }

  getRucheStatus(ruche: string): string {
    // In a real app, this would fetch actual ruche status
    const rucheData = this.ruchesData.find(r => r.name === ruche);
    return rucheData ? rucheData.status : 'unknown';
  }

  getRucheProduction(ruche: string): number {
    // In a real app, this would fetch actual ruche production
    const rucheData = this.ruchesData.find(r => r.name === ruche);
    return rucheData ? rucheData.estimatedProduction : 0;
  }

  // Add isRucheSelected method
  isRucheSelected(ruche: Ruche): boolean {
    return this.selectedRuches.some(r => r.id === ruche.id);
  }

  // Add method to handle ruche selection in new harvest form
  toggleNewHarvestRuche(ruche: Ruche) {
    const index = this.newHarvest.ruches.findIndex(r => r.id === ruche.id);
    if (index === -1) {
      this.newHarvest.ruches = [...this.newHarvest.ruches, ruche];
    } else {
      this.newHarvest.ruches = this.newHarvest.ruches.filter(r => r.id !== ruche.id);
    }
  }

  // Add method to check if a ruche is selected in new harvest form
  isNewHarvestRucheSelected(ruche: Ruche): boolean {
    return this.newHarvest.ruches.some(r => r.id === ruche.id);
  }
}
