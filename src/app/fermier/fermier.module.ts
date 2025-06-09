import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FermierRoutingModule } from './fermier-routing.module';
import { FermierHeaderComponent } from './fermier-header/fermier-header.component';
import { EditSiteModalComponent } from './edit-site-modal/edit-site-modal.component';

@NgModule({
  declarations: [
    FermierHeaderComponent,
    EditSiteModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    FermierRoutingModule
  ],
  exports: [
    FermierHeaderComponent,
    EditSiteModalComponent
  ]
})
export class FermierModule { }
