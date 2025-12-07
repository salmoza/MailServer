import { Routes } from '@angular/router';
import {Compose} from './pages/compose/compose';
import {Contacts} from './pages/contacts/contacts';
import {Drafts} from './pages/drafts/drafts';
import {Filters} from './pages/filters/filters';
import {Inbox} from './pages/inbox/inbox';
import {Login} from './pages/login/login';
import {MailDetail} from './pages/mail-detail/mail-detail';
import {authGuard} from './Auth/AuthGuard';

export const routes: Routes = [
  {path:'', redirectTo:'login',pathMatch:'full'},
  {path:'login',component:Login},
  {path:'compose',component:Compose, canActivate:[authGuard]},
  {path:'contacts',component:Contacts, canActivate:[authGuard]},
  {path:'drafts',component:Drafts, canActivate:[authGuard]},
  {path:'inbox',component:Inbox, canActivate:[authGuard]},
  {path:'Filters',component:Filters, canActivate:[authGuard]},
  {path:'mail',component:MailDetail, canActivate:[authGuard]},
  {path:'**',redirectTo:'login'},
];
