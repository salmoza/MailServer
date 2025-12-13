import { Routes } from '@angular/router';
import {Compose} from './pages/compose/compose';
import { Contacts } from './pages/contacts/contacts';
import { ContactFormComponent } from './pages/contact-form/contact-form';
import {Drafts} from './pages/drafts/drafts';
import {Filters} from './pages/filters/filters';
import {Inbox} from './pages/inbox/inbox';
import {Login} from './pages/login/login';
import {MailDetail} from './pages/mail-detail/mail-detail';
import {authGuard} from './Auth/AuthGuard';
import {Sent} from './pages/sent/sent';
import {Trash} from './pages/trash/trash';
import{CustomFolderPage} from './pages/custom-folder-page/custom-folder-page';


export const routes: Routes = [
  { path: 'contacts/new', component: ContactFormComponent }, 
  { path: 'contacts/edit/:id', component: ContactFormComponent },
  {path:'', redirectTo:'login',pathMatch:'full'},
  {path:'login',component:Login},
  {path:'compose',component:Compose, canActivate:[authGuard]},
  {path:'contacts',component:Contacts, canActivate:[authGuard]},
  {path:'drafts',component:Drafts, canActivate:[authGuard]},
  {path:'inbox',component:Inbox, canActivate:[authGuard]},
  {path:'filters',component:Filters, canActivate:[authGuard]},
  {path:'mail',component:MailDetail, canActivate:[authGuard]},
  {path:'sent',component:Sent, canActivate:[authGuard]},
  {path:'trash',component:Trash, canActivate:[authGuard]},
  {path:'Custom',component:CustomFolderPage, canActivate:[authGuard]},
  {path:'**',redirectTo:'login'},
];
