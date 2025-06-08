import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fermier-header',
  standalone: false,
  templateUrl: './fermier-header.component.html',
  styleUrl: './fermier-header.component.css'
})
export class FermierHeaderComponent {
  constructor(public router: Router) { }

  logout() {
    // Exemple : effacer le token et rediriger vers la page de connexion
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

}
