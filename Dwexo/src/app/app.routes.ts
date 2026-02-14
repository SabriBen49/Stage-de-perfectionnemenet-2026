import { Routes } from '@angular/router';
import { Accueil } from './components/accueil/accueil';
import { Contact } from './components/contact/contact';
import { Connection } from './components/connection/connection';
import { Inscription } from './components/inscription/inscription';
import { authGuard } from './guards/auth.guard-guard';

export const routes: Routes = [
    {path: 'acceuil', component: Accueil, title: 'Accueil'},
    {path:'contact',component:Contact, title:'Contact',canActivate: [authGuard]},
    {path:'connection',component:Connection, title:'Connection'},
    {path:'inscription',component:Inscription, title:'Inscription'},
    {path: '', redirectTo: 'acceuil', pathMatch: 'full' },
    {path: '**', redirectTo: 'acceuil' }
   
];
