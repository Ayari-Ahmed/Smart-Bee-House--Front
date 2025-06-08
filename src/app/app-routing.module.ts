import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {DashboardFermierComponent} from './fermier/dashboard-fermier/dashboard-fermier.component';

const routes: Routes = [
  {path: '', component: SignInComponent},
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent, data: { title: 'Créer un compte' }},
  {path: 'fermier', loadChildren: () => import('./fermier/fermier.module').then(m => m.FermierModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
