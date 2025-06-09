import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-creer-ferme',
  templateUrl: './creer-ferme.component.html',
  standalone: true,
  styleUrls: ['./creer-ferme.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class CreerFermeComponent implements OnInit {
  farmForm: FormGroup;
  showSuccessMessage = false;
  fermier: any = null;
  sites = [
    { id: 1, name: 'Site de Tunis - Zone Nord' },
    { id: 2, name: 'Site de Sfax - Zone Côtière' },
    { id: 3, name: 'Site de Kairouan - Zone Centrale' },
    { id: 4, name: 'Site de Bizerte - Zone Littorale' },
    { id: 5, name: 'Site de Gafsa - Zone Sud' },
    { id: 6, name: 'Site de Sousse - Zone Est' }
  ];

  constructor(private fb: FormBuilder) {
    this.farmForm = this.fb.group({
      nom: ['', Validators.required],
      superficie: [null, [Validators.required, Validators.min(0.1)]],
      siteApiculture: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeFermierData();
    this.loadFermierInfo();
  }

  initializeFermierData(): void {
    if (!localStorage.getItem('fermier')) {
      const defaultFermier = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.com',
        phone: '+216 98 123 456'
      };
      localStorage.setItem('fermier', JSON.stringify(defaultFermier));
    }
  }

  loadFermierInfo(): void {
    const fermierData = localStorage.getItem('fermier');
    if (fermierData) {
      this.fermier = JSON.parse(fermierData);
    }
  }

  onSubmit(): void {
    if (this.farmForm.invalid) {
      this.farmForm.markAllAsTouched();
      return;
    }

    const fermeData = {
      nom: this.farmForm.get('nom')?.value.trim(),
      superficie: parseFloat(this.farmForm.get('superficie')?.value),
      siteApiculture: {
        id: parseInt(this.farmForm.get('siteApiculture')?.value)
      },
      fermier: this.fermier
    };

    console.log('Données de la ferme à envoyer:', fermeData);

    this.showSuccessMessage = true;
    setTimeout(() => {
      this.resetForm();
      this.showSuccessMessage = false;
    }, 2000);

    // Uncomment to integrate with a backend API
    /*
    this.http.post('/api/fermes', fermeData).subscribe({
      next: (response) => {
        console.log('Ferme créée:', response);
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.resetForm();
          this.showSuccessMessage = false;
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
    */
  }

  resetForm(): void {
    this.farmForm.reset();
    this.farmForm.markAsPristine();
    this.farmForm.markAsUntouched();
  }
}