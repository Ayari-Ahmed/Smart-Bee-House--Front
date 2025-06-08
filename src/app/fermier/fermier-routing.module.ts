import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignInComponent} from '../sign-in/sign-in.component';
import {CreerFermeComponent} from './creer-ferme/creer-ferme.component';
import {DashboardFermierComponent} from './dashboard-fermier/dashboard-fermier.component';
import { ListeFermesComponent } from './liste-fermes/liste-fermes.component';
import { MesRuchesComponent } from './mes-ruches/mes-ruches.component';
import { MesSitesComponent } from './mes-sites/mes-sites.component';

const routes: Routes = [
  {path: '', component: DashboardFermierComponent},
  {path: 'dashboard', component: DashboardFermierComponent},
  {path : "creer",component :CreerFermeComponent },
  {path : "list",component :ListeFermesComponent },
  {path : "ruches",component :MesRuchesComponent },
  {path : "sites",component :MesSitesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FermierRoutingModule { }
