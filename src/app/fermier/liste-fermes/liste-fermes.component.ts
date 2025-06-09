import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Hive {
  id: string;
  production: number;
  lastMeasurement: string;
  type: string;
}

interface Site {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  hives: Hive[];
  production: number;
}

interface Farm {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  description: string;
  honeyTypes: string[];
  sites: Site[];
}

@Component({
  selector: 'app-liste-fermes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './liste-fermes.component.html',
  styleUrls: ['./liste-fermes.component.css']
})
export class ListeFermesComponent implements OnInit {
  farms: Farm[] = [];
  filteredFarms: Farm[] = [];
  searchTerm: string = '';
  sortBy: string = 'name';
  sortOrder: string = 'asc';
  
  // Farm modal
  showFarmModal: boolean = false;
  editMode: boolean = false;
  farmForm: FormGroup;
  currentFarm: Farm | null = null;
  
  // Confirm delete modal
  showConfirmModal: boolean = false;
  farmToDelete: Farm | null = null;
  
  // Honey types
  availableHoneyTypes: string[] = ['Acacia', 'Lavande', 'Châtaignier', 'Thym', 'Tilleul', 'Tournesol', 'Romarin', 'Forêt', 'Montagne', 'Fleurs sauvages'];
  selectedHoneyTypes: string[] = [];

  constructor(private fb: FormBuilder) {
    this.farmForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    // Load mock data for demonstration
    this.loadMockData();
    this.applyFilters();
  }

  loadMockData(): void {
    // Mock data for demonstration purposes
    this.farms = [
      {
        id: 'f1',
        name: 'Ferme des Abeilles d\'Or',
        location: 'Provence-Alpes-Côte d\'Azur',
        createdAt: '15/03/2022',
        description: 'Située en plein cœur de la Provence, notre ferme produit principalement du miel de lavande et d\'acacia.',
        honeyTypes: ['Lavande', 'Acacia', 'Thym'],
        sites: [
          {
            id: 's1',
            name: 'Champ Lavande',
            location: 'Valensole',
            coordinates: '45.2234, 4.6678',
            production: 98,
            hives: [
              { id: 'R-101', production: 32, lastMeasurement: '12/06/2023', type: 'Langstroth' },
              { id: 'R-102', production: 21, lastMeasurement: '13/06/2023', type: 'Langstroth' },
              { id: 'R-103', production: 25, lastMeasurement: '13/06/2023', type: 'Langstroth' },
              { id: 'R-104', production: 20, lastMeasurement: '14/06/2023', type: 'Langstroth' }
            ]
          },
          {
            id: 's2',
            name: 'Forêt d\'Acacia',
            location: 'Luberon',
            coordinates: '45.1111, 4.5555',
            production: 78,
            hives: [
              { id: 'R-201', production: 28, lastMeasurement: '10/06/2023', type: 'Dadant' },
              { id: 'R-202', production: 26, lastMeasurement: '11/06/2023', type: 'Dadant' },
              { id: 'R-203', production: 24, lastMeasurement: '12/06/2023', type: 'Dadant' }
            ]
          }
        ]
      },
      {
        id: 'f2',
        name: 'Rucher de la Vallée',
        location: 'Auvergne-Rhône-Alpes',
        createdAt: '23/04/2021',
        description: 'Un rucher traditionnel dans les montagnes produisant des miels de fleurs sauvages et de châtaignier.',
        honeyTypes: ['Châtaignier', 'Fleurs sauvages', 'Montagne'],
        sites: [
          {
            id: 's3',
            name: 'Verger Pommier',
            location: 'Ardèche',
            coordinates: '45.1234, 4.5678',
            production: 124,
            hives: [
              { id: 'R-001', production: 28, lastMeasurement: '15/06/2023', type: 'Dadant' },
              { id: 'R-002', production: 25, lastMeasurement: '14/06/2023', type: 'Dadant' },
              { id: 'R-003', production: 22, lastMeasurement: '16/06/2023', type: 'Dadant' },
              { id: 'R-004', production: 24, lastMeasurement: '15/06/2023', type: 'Dadant' },
              { id: 'R-005', production: 25, lastMeasurement: '16/06/2023', type: 'Dadant' }
            ]
          }
        ]
      },
      {
        id: 'f3',
        name: 'Miel & Pollen Bio',
        location: 'Occitanie',
        createdAt: '07/06/2022',
        description: 'Ferme apicole biologique spécialisée dans la production de miels rares et de qualité premium.',
        honeyTypes: ['Romarin', 'Thym', 'Lavande'],
        sites: [
          {
            id: 's4',
            name: 'Garrigue',
            location: 'Montpellier',
            coordinates: '43.6108, 3.8767',
            production: 67,
            hives: [
              { id: 'R-301', production: 18, lastMeasurement: '11/06/2023', type: 'Warré' },
              { id: 'R-302', production: 19, lastMeasurement: '12/06/2023', type: 'Warré' },
              { id: 'R-303', production: 17, lastMeasurement: '13/06/2023', type: 'Warré' },
              { id: 'R-304', production: 13, lastMeasurement: '12/06/2023', type: 'Warré' }
            ]
          }
        ]
      }
    ];
  }

  applyFilters(): void {
    // Filter farms based on search term
    let result = this.farms;
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(farm => 
        farm.name.toLowerCase().includes(term) || 
        farm.location.toLowerCase().includes(term) || 
        farm.description.toLowerCase().includes(term) ||
        farm.honeyTypes.some(type => type.toLowerCase().includes(term))
      );
    }
    
    // Sort farms
    result = result.sort((a, b) => {
      let valueA, valueB;
      
      switch (this.sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt.split('/').reverse().join('-'));
          valueB = new Date(b.createdAt.split('/').reverse().join('-'));
          break;
        case 'siteCount':
          valueA = a.sites.length;
          valueB = b.sites.length;
          break;
        case 'hiveCount':
          valueA = this.getTotalHives(a);
          valueB = this.getTotalHives(b);
          break;
        case 'production':
          valueA = this.getTotalProduction(a);
          valueB = this.getTotalProduction(b);
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }
      
      const comparison = valueA > valueB ? 1 : -1;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    this.filteredFarms = result;
  }

  getTotalHives(farm: Farm): number {
    return farm.sites.reduce((total, site) => total + site.hives.length, 0);
  }

  getTotalProduction(farm: Farm): number {
    return farm.sites.reduce((total, site) => total + site.production, 0);
  }

  openCreateFarmModal(): void {
    this.editMode = false;
    this.currentFarm = null;
    this.selectedHoneyTypes = [];
    
    this.farmForm.reset({
      name: '',
      location: '',
      description: ''
    });
    
    this.showFarmModal = true;
  }

  editFarm(farm: Farm): void {
    this.editMode = true;
    this.currentFarm = {...farm};
    this.selectedHoneyTypes = [...farm.honeyTypes];
    
    this.farmForm.patchValue({
      name: farm.name,
      location: farm.location,
      description: farm.description || ''
    });
    
    this.showFarmModal = true;
  }

  deleteFarm(farm: Farm): void {
    this.farmToDelete = farm;
    this.showConfirmModal = true;
  }

  confirmDeleteFarm(): void {
    if (this.farmToDelete) {
      // In a real app, we would call an API to delete the farm
      this.farms = this.farms.filter(farm => farm.id !== this.farmToDelete?.id);
      this.applyFilters();
      this.closeConfirmModal();
    }
  }

  saveFarm(): void {
    if (this.farmForm.valid) {
      const formData = this.farmForm.value;
      
      if (this.editMode && this.currentFarm) {
        // Update existing farm
        const index = this.farms.findIndex(farm => farm.id === this.currentFarm?.id);
        
        if (index !== -1) {
          this.farms[index] = {
            ...this.currentFarm,
            name: formData.name,
            location: formData.location,
            description: formData.description,
            honeyTypes: [...this.selectedHoneyTypes]
          };
        }
      } else {
        // Create new farm
        const newFarm: Farm = {
          id: `f${this.farms.length + 1}`,
          name: formData.name,
          location: formData.location,
          createdAt: new Date().toLocaleDateString('fr-FR'),
          description: formData.description,
          honeyTypes: [...this.selectedHoneyTypes],
          sites: []
        };
        
        this.farms.push(newFarm);
      }
      
      this.applyFilters();
      this.closeFarmModal();
    }
  }

  toggleHoneyType(type: string): void {
    const index = this.selectedHoneyTypes.indexOf(type);
    if (index !== -1) {
      this.selectedHoneyTypes.splice(index, 1);
    } else {
      this.selectedHoneyTypes.push(type);
    }
  }

  closeFarmModal(event?: MouseEvent): void {
    if (!event || event.target === event.currentTarget) {
      this.showFarmModal = false;
      this.currentFarm = null;
      this.selectedHoneyTypes = [];
    }
  }

  closeConfirmModal(event?: MouseEvent): void {
    if (!event || event.target === event.currentTarget) {
      this.showConfirmModal = false;
      this.farmToDelete = null;
    }
  }
}
