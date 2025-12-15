import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {FolderStateService} from '../../Dtos/FolderStateService';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {CustomFolderData, Datafile} from '../../Dtos/datafile';
import {MailShuttleService} from '../../Dtos/MailDetails';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchBarComponent} from '../../components/search-bar/search-bar';
import { HeaderComponent } from '../../header';

@Component({
  selector: 'app-sent',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, ReactiveFormsModule, FormsModule, SearchBarComponent, HeaderComponent],
  template: `
  <div class="flex h-screen w-full font-inter">
    <!-- Sidebar -->
    <aside class="flex h-full w-[260px] flex-col border-r border-slate-200 bg-white p-4 sticky top-0">
      <div class="flex h-full flex-col justify-between">
        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-3 px-3">
            <h1 class="text-slate-800 text-base font-medium leading-normal">
              {{folderStateService.userData().username}}
            </h1>
          </div>

          <button [routerLink]="['/compose']"
                  class="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold">
            Compose
          </button>

          <!-- Default folders -->
          <div class="flex flex-col gap-1">
            <a [routerLink]="['/inbox']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-800">inbox</span>
              <p class="text-slate-800 text-sm font-medium">Inbox</p>
              <span class="ml-auto text-xs font-semibold text-slate-600 bg-slate-200 rounded-full px-2 py-0.5">3</span>
            </a>

            <a [routerLink]="['/sent']" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20">
              <span class="material-symbols-outlined text-slate-600">send</span>
              <p class="text-slate-600 text-sm font-medium">Sent</p>
            </a>

            <a [routerLink]="['/drafts']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">draft</span>
              <p class="text-slate-600 text-sm font-medium">Drafts</p>
            </a>

            <a [routerLink]="['/trash']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">delete</span>
              <p class="text-slate-600 text-sm font-medium">Trash</p>
            </a>

            <a [routerLink]="['/contacts']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">contacts</span>
              <p class="text-slate-600 text-sm font-medium">Contacts</p>
            </a>

            <a [routerLink]="['/filters']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">filter_alt</span>
              <p class="text-slate-600 text-sm font-medium">Filters</p>
            </a>
          </div>

          <!-- Custom folders -->
          <div class="flex flex-col gap-1 mt-4">
            <div class="flex items-center justify-between px-3 py-2">
              <h2 class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom Folders</h2>
              <button class="text-slate-500 hover:text-primary" (click)="CustomFolderPopUp=true">
                <span class="material-symbols-outlined text-base">add</span>
              </button>
            </div>
            <ng-container *ngFor="let custom of CustomFolders">
              <a (click)="goToCustomFolder(custom.folderId)"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                <span class="material-symbols-outlined text-slate-600">folder</span>
                <p class="text-slate-600 text-sm font-medium">{{custom.folderName}}</p>
              </a>
            </ng-container>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-y-auto">
      <!-- Top bar -->
      <div class="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="flex-1 mr-4">
          <app-search-bar (onSearch)="handleSearch($event)"></app-search-bar>
        </div>
        <app-header></app-header>
      </div>

      <!-- Toolbar -->
      <div class="flex justify-between items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white sticky top-[60px] z-10">
        <div class="flex gap-2">
          <button (click)="delete()"
                  class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                  [disabled]="Emails.length === 0">
            <span class="material-symbols-outlined">delete</span>
          </button>
          <button (click)="tomove = true"
                  class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                  [disabled]="Emails.length === 0">
            <span class="material-symbols-outlined">folder_open</span>
          </button>
        </div>
      </div>

     <!-- Email List Table -->
<div class="flex-1 px-6 py-4 overflow-x-hidden">
  <div class="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
    <table class="w-full text-left">
      <thead class="bg-slate-50">
        <tr>
          <th class="px-4 py-3 w-12">
            <input type="checkbox"
                   class="h-5 w-5 rounded border-slate-300 text-primary"
                   (change)="addallemails($event.target.checked)"
                   [checked]="Emails.length===SentData.length"/>
          </th>
          <th class="py-3 pl-0 pr-4" colspan="3">
            <div class="flex items-center w-full">
              <div class="px-4 text-slate-800 w-1/4 text-sm font-medium">Sender</div>
              <div class="px-4 text-slate-800 w-1/2 text-sm font-medium">Subject</div>
              <div class="px-4 text-slate-800 w-1/6 text-sm font-medium text-right">Date</div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let item of SentData" class="border-t border-t-slate-200 hover:bg-slate-50">
          <td class="px-4 py-2">
            <input type="checkbox"
                   class="h-5 w-5 rounded border-slate-300 text-primary"
                   (change)="toggleEmailsSelected(item, $event.target.checked)"
                   [checked]="checked(item.mailId)"/>
          </td>

          <td class="py-0 pl-0 pr-4" colspan="3">
            <div class="flex items-center w-full py-2 cursor-pointer" (click)="goToMailDetails(item)">
              <div class="px-4 text-slate-800 w-1/4 text-sm font-semibold">{{item.sender}}</div>
              <div class="px-4 w-1/2">
                <span class="text-slate-800 text-sm font-semibold truncate">{{item.subject}}</span>
                <span class="text-slate-500 text-sm ml-2 truncate">{{item.body}}</span>
              </div>
              <div class="px-4 text-slate-500 text-sm text-right w-1/6">
                {{ item.date | date:'mediumDate' }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

      <!-- Pagination -->
      <div class="flex items-center justify-center p-4 border-t border-gray-200 bg-white mt-auto gap-2">
        <button (click)="updatePage(page-1)" class="flex items-center justify-center text-slate-500 hover:text-primary">
          <span class="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <button *ngFor="let p of [0,1,2]; let i = index"
                (click)="updatePage(p)"
                [ngClass]="{'bg-primary text-white font-bold': page===p,'bg-slate-100 text-slate-600': page!==p}"
                class="px-3 py-1 rounded-lg text-sm cursor-pointer">{{i+1}}</button>
        <button (click)="updatePage(page+1)" class="flex items-center justify-center text-slate-500 hover:text-primary">
          <span class="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </main>

    <!-- Move Emails Modal -->
    <div class="move-conatiner bg-black/50" [class.active]="tomove">
      <div class="content-container">
        <span class="text-lg font-bold mt-5">Move email To</span>
        <div class="buttons-folders">
          <button *ngFor="let folder of CustomFolders" (click)="move(folder.folderId)">{{folder.folderName}}</button>
        </div>
        <div class="bottom-btn">
          <button (click)="tomove=false">Back</button>
          <button (click)="CustomFolderPopUp=true">Make new custom Folder</button>
        </div>
      </div>
    </div>

    <!-- Custom Folder Modal -->
    <div class="move-conatiner bg-black/50" [class.active]="CustomFolderPopUp">
      <div id="Custom-container" class="content-container bg-amber-50 h-3/12">
        <input type="text" placeholder="Folder Name.." [(ngModel)]="foldername">
        <button (click)="CreateCustomFolder();CustomFolderPopUp=false">Create</button>
        <button (click)="CustomFolderPopUp=false">Back</button>
      </div>
    </div>
  </div>
  `,
  styles: [`
    :host { font-family: 'Inter', sans-serif; min-height:100vh; display:block; background-color:#f6f7f8;}
    .move-conatiner { visibility:hidden; top:0; left:0; width:100%; height:100%; opacity:0; position:fixed; transition:all .2s ease-in; display:flex; align-items:center; justify-content:center; z-index:1000; }
    .move-conatiner.active { visibility:visible; opacity:1; }
    .content-container { display:flex; flex-direction:column; justify-content:space-between; align-items:center; min-height:300px; min-width:400px; border-radius:20px; box-shadow:0 0 20px rgba(0,0,0,.3); background-color:#e8e8e8; padding:20px; }
    .buttons-folders { display:flex; flex-direction:column; gap:1rem; }
    .content-container button { padding:10px 15px; border-radius:15px; cursor:pointer; border:2px solid transparent; transition:all .1s ease-in-out; }
    .content-container button:hover { transform:scale(1.05); background-color:#3e8cf4; color:white; border:2px solid rgba(62,140,244,.88); }
    #trash-btn:hover { border:2px solid rgba(243,53,53,.87); background-color:#f6f7f8; color:black; }
    .bottom-btn { width:100%; display:flex; justify-content:space-around; margin-top:10px; }
    .material-symbols-outlined { font-variation-settings:'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; line-height:1; }
    .bg-primary { background-color:#137fec !important; }
    .text-primary { color:#137fec !important; }
    .bg-primary\\/20 { background-color: rgba(19,127,236,.2) !important; }
  `],
})
export class Sent implements OnInit {
  foldername:string='';
  CustomFolderPopUp:boolean=false;
  Emails:Datafile[]=[];
  SentData:Datafile[]=[];
  CustomFolders:CustomFolderData[]=[];
  page:number=0;
  tomove:boolean=false;

  constructor(private MailDetails:MailShuttleService, protected folderStateService: FolderStateService, private http : HttpClient, private router : Router) {}

  ngOnInit() {
    this.getSent(this.page);
    this.getCustomFolders();
  }

  updatePage(page:number){
    if(page<0) return;
    this.page = page;
    this.getSent(page);
  }

  getCustomFolders(){
    let params = new HttpParams().set("userId", this.folderStateService.userData().userId).set("type","custom");
    this.http.get<CustomFolderData[]>(`http://localhost:8080/api/folders`, {params}).subscribe({
      next:data => this.CustomFolders = data,
      error:err => alert("Failed to fetch custom folders")
    });
  }

  getSent(page:number){
    let params = new HttpParams().set("page", page).set("folderId", this.folderStateService.userData().sentFolderId!);
    this.http.get<Datafile[]>(`http://localhost:8080/api/mails`,{params}).subscribe({
      next:res => this.SentData=res,
      error:err => alert("Failed to fetch mails")
    });
  }

  goToMailDetails(details:Datafile){
    this.MailDetails.setMailData(details);
    this.MailDetails.setFromId(this.folderStateService.userData().sentFolderId!);
    this.router.navigate(['/mail']);
  }

  toggleEmailsSelected(email:Datafile,ischecked:boolean){
    if(ischecked && !this.Emails.includes(email)) this.Emails.push(email);
    else this.Emails = this.Emails.filter(e => e.mailId !== email.mailId);
  }

  addallemails(check:boolean){
    this.Emails = check ? [...this.SentData] : [];
  }

  checked(id:string){
    return this.Emails.some(e => e.mailId===id);
  }

  delete(){
    if(!this.Emails.length) return;
    const ids = this.Emails.map(e => e.mailId);
    const url = `http://localhost:8080/api/mails/${this.folderStateService.userData().sentFolderId}`;
    let params = new HttpParams();
    ids.forEach(id => params = params.append('ids', id));
    this.http.delete(url,{params}).subscribe({
      next:()=>{ this.SentData = this.SentData.filter(e => !ids.includes(e.mailId)); this.Emails=[]; },
      error:()=>alert("Failed to delete emails")
    });
  }

  move(moveMailToFolderId:string){
    const mailids = this.Emails.map(e => e.mailId);
    const url = `http://localhost:8080/api/mails/${moveMailToFolderId}/${this.folderStateService.userData().sentFolderId}`;
    this.http.patch(url, {ids:mailids}).subscribe({
      next:()=>{ this.SentData = this.SentData.filter(e => !mailids.includes(e.mailId)); this.Emails=[]; this.tomove=false; },
      error:()=>alert("Failed to move emails")
    });
  }

  goToCustomFolder(Id:string){
    this.MailDetails.setCustom(Id);
    this.router.navigate(['/Custom']);
  }

  CreateCustomFolder(){
    const payload = {
      folderName:this.foldername,
      folderId:this.folderStateService.userData().userId,
      type:'custom'
    };
    this.http.post(`http://localhost:8080/api/folders`,payload).subscribe({
      next:()=>this.getCustomFolders(),
      error:()=>alert("Failed to create custom folder")
    });
  }

  handleSearch(criteria:any){
    if(!criteria) { this.getSent(this.page); return; }
    this.SentData = this.SentData.filter(e => e.subject.toLowerCase().includes(criteria.toLowerCase()) || e.body.toLowerCase().includes(criteria.toLowerCase()));
  }
}
