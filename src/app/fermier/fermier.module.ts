import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FermierRoutingModule } from './fermier-routing.module';
import { CreerFermeComponent } from './creer-ferme/creer-ferme.component';
import { ListeFermesComponent } from './liste-fermes/liste-fermes.component';
import { DashboardFermierComponent } from './dashboard-fermier/dashboard-fermier.component';
import { FermierHeaderComponent } from './fermier-header/fermier-header.component';
import { EditSiteModalComponent } from './edit-site-modal/edit-site-modal.component';


@NgModule({
  declarations: [
    CreerFermeComponent,
    ListeFermesComponent,
    DashboardFermierComponent,
    FermierHeaderComponent,
    EditSiteModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FermierRoutingModule
  ]
})
export class FermierModule { }
