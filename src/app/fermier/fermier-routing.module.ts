import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FermierLayoutComponent } from './fermier-layout/fermier-layout.component';

const routes: Routes = [
  {
    path: '',
    component: FermierLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard-fermier/dashboard-fermier.component').then(m => m.DashboardFermierComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard-fermier/dashboard-fermier.component').then(m => m.DashboardFermierComponent)
      },
      {
        path: 'creer',
        loadComponent: () => import('./creer-ferme/creer-ferme.component').then(m => m.CreerFermeComponent)
      },
      {
        path: 'list',
        loadComponent: () => import('./liste-fermes/liste-fermes.component').then(m => m.ListeFermesComponent)
      },
      {
        path: 'ruches',
        loadComponent: () => import('./mes-ruches/mes-ruches.component').then(m => m.MesRuchesComponent)
      },
      {
        path: 'sites',
        loadComponent: () => import('./mes-sites/mes-sites.component').then(m => m.MesSitesComponent)
      },
      {
        path: 'productionCol',
        loadComponent: () => import('./production-collecte/production-collecte.component').then(m => m.ProductionCollecteComponent)
      },
      {
        path: 'desicion',
        loadComponent: () => import('./decisions-strategies/decisions-strategies.component').then(m => m.DecisionsStrategiesComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FermierRoutingModule { }
