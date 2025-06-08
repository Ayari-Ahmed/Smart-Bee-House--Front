
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  standalone: false,
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  userType: string = 'agent';
  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';

  onUserTypeChange() {
    // Phone field is handled by *ngIf in the template
    if (this.userType !== 'fermier') {
      this.phone = ''; // Clear phone when not Fermier
    }
  }

  onSubmit() {
    const formData = {
      userType: this.userType,
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      ...(this.userType === 'fermier' && { phone: this.phone })
    };

    console.log('Données du formulaire:', formData);
    alert(`Inscription réussie pour ${this.userType === 'fermier' ? 'Fermier' : 'Agent'}`);

    // Reset form
    this.userType = 'agent';
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.password = '';
    this.phone = '';
  }
}
