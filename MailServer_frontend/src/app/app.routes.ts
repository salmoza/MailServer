import { Routes } from '@angular/router';
import {Compose} from './pages/compose/compose';
import {Contacts} from './pages/contacts/contacts';
import {Drafts} from './pages/drafts/drafts';
import {Filters} from './pages/filters/filters';
import {Inbox} from './pages/inbox/inbox';
import {Login} from './pages/login/login';
import {MailDetail} from './pages/mail-detail/mail-detail';
export const routes: Routes = [
  {path:'', redirectTo:'login',pathMatch:'full'},
  {path:'login',component:Login},
  {path:'compose',component:Compose},
  {path:'contacts',component:Contacts},
  {path:'drafts',component:Drafts},
  {path:'inbox',component:Inbox},
  {path:'Filters',component:Filters},
  {path:'mail',component:MailDetail},
];
