import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {FolderStateService} from '../../Dtos/FolderStateService';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {CustomFolderData, Datafile} from '../../Dtos/datafile';
import {MailShuttleService} from '../../Dtos/MailDetails';
import {FormsModule} from '@angular/forms';
import {SearchBarComponent} from '../../components/search-bar/search-bar';
import { HeaderComponent } from '../../header';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
interface MailSearchRequestDto {
  sender?: string;
  receiver?: string;
  subject?: string;
  body?: string;
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule, SearchBarComponent, HeaderComponent],
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    <div class="flex h-screen w-full">
      <aside class="flex h-full w-[260px] flex-col border-r border-slate-200 bg-white p-4 sticky top-0">
        <div class="flex h-full flex-col justify-between">
          <div class="flex flex-col gap-6">
            <div class="flex items-center gap-3 px-3">
              <h1 class="text-slate-800 text-base font-medium leading-normal">{{folderStateService.userData().username}}</h1>
            </div>
            <button [routerLink]="['/compose']" class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span class="truncate">Compose</span>
            </button>
            <div class="flex flex-col gap-1">
              <a [routerLink]="['/inbox']" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20">
                <span class="material-symbols-outlined text-slate-800 fill">inbox</span>
                <p class="text-slate-800 text-sm font-medium leading-normal">Inbox</p>
              </a>
              <a [routerLink]="['/sent']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
                <span class="material-symbols-outlined text-slate-600">send</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Sent</p>
              </a>
              <a [routerLink]="['/drafts']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
                <span class="material-symbols-outlined text-slate-600">draft</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Drafts</p>
              </a>
              <a [routerLink]="['/trash']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
                <span class="material-symbols-outlined text-slate-600">delete</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Trash</p>
              </a>
              <a [routerLink]="['/contacts']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
                <span class="material-symbols-outlined text-slate-600">contacts</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Contacts</p>
              </a>
              <a [routerLink]="['/filters']" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
                <span class="material-symbols-outlined text-slate-600">filter_alt</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Filters</p>
              </a>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between px-3 py-2">
                <h2 class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom Folders</h2>
                <button class="text-slate-500 hover:text-primary cursor-pointer" (click)="CustomFolderPopUp=true">
                  <span class="material-symbols-outlined text-base">add</span>
                </button>
              </div>
              @for(custom of CustomFolders; track $index) {
                <a (click)="goToCustomFolder(custom.folderId)" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
                  <span class="material-symbols-outlined text-slate-600">folder</span>
                  <p class="text-slate-600 text-sm font-medium leading-normal">{{custom.folderName}}</p>
                </a>
              }
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 flex flex-col h-screen overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
          <div class="flex-1 mr-4">
            <app-search-bar (onSearch)="handleSearch($event)" (onClear)="handleClearSearch()"></app-search-bar>
          </div>
          <app-header></app-header>
        </div>

        <div class="flex justify-between items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div class="flex gap-2">
            <button (click)="askDelete()"
              class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              [disabled]="Emails.length === 0">
              <span class="material-symbols-outlined">delete</span>
            </button>

            <button (click)="tomove = true"
              class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              [disabled]="Emails.length === 0">
              <span class="material-symbols-outlined">folder_open</span>
            </button>
            <button (click)="refreshData()" class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 cursor-pointer" title="Reload Emails">
              <span class="material-symbols-outlined">refresh</span>
            </button>
          </div>
          <div class="relative inline-block">
            <button (click)="toggleSortMenu()"
              class="flex items-center gap-2 px-3 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg">
              Sort by: <span [textContent]="currentSort"></span>
              <span class="material-symbols-outlined text-lg">expand_more</span>
            </button>
            <div *ngIf="showSortMenu" class="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
              <div class="py-1">
                <button (click)="setSortAndClose('Date (Newest first)')"
                  [ngClass]="{'bg-blue-50': currentSort === 'Date (Newest first)'}"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Date (Newest first)
                </button>
                <button (click)="setSortAndClose('Date (Oldest first)')"
                  [ngClass]="{'bg-blue-50': currentSort === 'Date (Oldest first)'}"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Date (Oldest first)
                </button>
                <button (click)="setSortAndClose('Sender (A → Z)')"
                  [ngClass]="{'bg-blue-50': currentSort === 'Sender (A → Z)'}"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Sender (A → Z)
                </button>
                <button (click)="setSortAndClose('Subject (A → Z)')"
                  [ngClass]="{'bg-blue-50': currentSort === 'Subject (A → Z)'}"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Subject (A → Z)
                </button>
                <button (click)="setSortAndClose('Priority')"
                  [ngClass]="{'bg-blue-50': currentSort === 'Priority'}"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Priority
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 px-6 py-4 overflow-x-hidden">
          <div class="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table class="w-full text-left">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 w-12">
                    <input class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox" #checkbox (click)="addallemails(checkbox.checked)" />
                  </th>
                  <th class="py-3 pl-0 pr-4" colspan="5">
                    <div class="flex items-center w-full">
                      <div class="px-4 text-slate-800 w-1/6 text-sm font-medium">Sender</div>
                      <div class="px-4 text-slate-800 w-1/6 text-sm font-medium">Receiver</div>
                      <div class="px-4 text-slate-800 w-1/3 text-sm font-medium">Subject</div>
                      <div class="px-4 text-slate-800 w-1/12 text-sm font-medium">Priority</div>
                      <div class="px-4 text-slate-800 w-1/6 text-sm font-medium text-right">Date</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                @for(item of InboxData; track $index){
                  <tr class="border-t border-t-slate-200 hover:bg-slate-50">
                    <td class="px-4 py-2">
                      <input class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                        type="checkbox" #checkbox (change)="toggleEmailsSelected(item,checkbox.checked)" [checked]="checked(item.mailId)" />
                    </td>
                    <td class="py-0 pl-0 pr-4" colspan="5">
                      <div class="flex items-center w-full py-2 cursor-pointer" (click)="goToMailDetails(item)">
                        <div class="px-4 text-slate-800 w-1/6 text-sm font-semibold truncate">{{ item.senderDisplayName }}</div>
                        <div class="px-4 text-slate-800 w-1/6 text-sm font-semibold truncate">me</div>
                        <div class="px-4 w-1/3">
                          <span class="text-sm">{{ item.subject }}</span>
                          <span class="text-sm ml-2" [innerHTML]="getSanitizedPreview(item.body)"></span>
                        </div>
                        <div class="px-4 w-1/12">
                           <span class="text-xs font-semibold px-2 py-1 rounded"
                             [ngClass]="{'bg-red-100 text-red-700': item.priority === 1, 'bg-orange-100 text-orange-700': item.priority === 2, 'bg-yellow-100 text-yellow-700': item.priority === 3, 'bg-blue-100 text-blue-700': item.priority === 4}">
                             {{ getPriorityLabel(item.priority) }}
                           </span>
                        </div>
                        <div class="px-4 text-sm text-right w-1/6">{{ item.date | date:'mediumDate' }}</div>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-center p-4 border-t border-gray-200 bg-white mt-auto">
          <a (click)="updatePage(page-1)" class="flex cursor-pointer size-10 items-center justify-center text-slate-500 hover:text-primary">
            <span class="material-symbols-outlined text-lg">chevron_left</span>
          </a>
          <a (click)="updatePage(0)" class="text-sm cursor-pointer font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white rounded-lg bg-primary">1</a>
          <a (click)="updatePage(1)" class="text-sm cursor-pointer font-normal leading-normal flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100">2</a>
          <a (click)="updatePage(page+1)" class="flex size-10 items-center justify-center text-slate-500 hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-lg">chevron_right</span>
          </a>
        </div>
      </main>

      <div class="move-conatiner bg-black/50" [class.active]="tomove">
        <div class="content-container">
          <span class="text-lg font-bold mt-5">Move {{Emails.length}} Email(s) To</span>
          <div class="buttons-folders">
            <button (click)="move(folderStateService.userData().sentFolderId)">Sent</button>
            @for(folder of CustomFolders; track $index){
              <button (click)="move(folder.folderId)">{{folder.folderName}}</button>
            }
          </div>
          <div class="bottom-btn">
            <button (click)="tomove=false">Back</button>
            <button (click)="CustomFolderPopUp=true">Make new custom Folder</button>
          </div>
        </div>
      </div>

      <div class="move-conatiner bg-black/50" [class.active]="showDeleteOptions">
        <div class="content-container" style="min-height: 250px; gap: 20px;">
          <span class="text-lg font-bold mt-5 text-red-600">Delete {{Emails.length}} Email(s)</span>
          <p class="text-slate-600 text-center px-4">Do you want to move these emails to Trash or delete them forever?</p>

          <div class="flex flex-col gap-3 w-3/4">
            <button (click)="moveToTrash()" class="bg-amber-100 text-amber-800 hover:bg-amber-200" style="border: 1px solid #d97706;">
              <span class="material-symbols-outlined align-middle mr-1 text-sm">delete</span>
              Move to Trash
            </button>
            <button (click)="deleteForever()" class="bg-red-100 text-red-800 hover:bg-red-200" style="border: 1px solid #dc2626;">
              <span class="material-symbols-outlined align-middle mr-1 text-sm">delete_forever</span>
              Delete Forever
            </button>
          </div>

          <div class="bottom-btn">
            <button (click)="showDeleteOptions=false">Cancel</button>
          </div>
        </div>
      </div>

      <div class="move-conatiner bg-black/50" [class.active]="CustomFolderPopUp">
        <div id="Custom-container" class="content-container bg-amber-50 h-3/12">
          <input type="text" placeholder="Folders Name.." name="Name" [(ngModel)]="foldername">
          <button (click)="CreateCustomFolder();CustomFolderPopUp=false">Create</button>
          <button id="trash-btn" (click)="CustomFolderPopUp=false">Back</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* 1. We define the font-family globally here, assuming the font files can be reached */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap](https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    /* 2. Base styles */
    :host {
      /* Apply font to the host element */
      font-family: 'Inter', sans-serif;
      /* FIX: Ensure host takes full height and background */
      min-height: 100vh;
      display: block;
      background-color: #f6f7f8; /* background-light hex */
    }
    .move-conatiner {
      visibility: hidden;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      position: fixed;
      transition: all 0.2s ease-in;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .move-conatiner.active {
      visibility: visible;
      opacity: 1;
      cursor: auto;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      min-height: 500px;
      min-width: 400px;
      border-radius: 20px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      background-color: #e8e8e8;
    }
    .buttons-folders {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    #Custom-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap:60px;
      height: 300px;
    }
    .content-container input{
      border-radius: 15px;
      padding: 10px;
      border:2px solid black;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.1s ease-in;
    }
    .content-container input:focus{
      border:3px solid #3e8cf4;
      outline: none;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
      transform: scale(1.05);
    }
    .content-container button{
      display: flex;
      padding: 15px;
      border-radius: 30px;
      background-color: #f9f9f9;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.1s ease-in-out;
    }

    .content-container button:hover,content-container2 button:hover {
      transform: scale(1.05);
      background-color: #3e8cf4;
      border: 3px solid rgba(62, 140, 244, 0.88);
      color: #fff;
    }

    #trash-btn:hover {
      border: 3px solid rgba(243, 53, 53, 0.87);
      background-color: #f6f7f8;
      color: black;
      /* box-shadow: 5px 5px 5px rgba(255, 0, 0, 0.55);*/
    }

    .content-container button:active {
      transform: scale(0.95);
    }

    .bottom-btn {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 20px;
    }

    .material-symbols-outlined {
      /* Ensure icons are correctly rendered */
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }
    /* FIX: Re-enforcing primary color styles */
    .text-primary, .hover\\:text-primary {
      color: #137fec !important;
    }

    .bg-primary {
      background-color: #137fec !important;
    }

    .border-primary {
      border-color: #137fec !important;
    }

    /* FIX: Corrected selector for bg-primary/20 (20% opacity) */
    .bg-primary\\/20 {
      background-color: rgba(19, 127, 236, 0.2) !important;
    }
  `],
})
export class Inbox implements OnInit{
  dataFile!: Datafile;
  isRead!: boolean;
  constructor(private MailDetails:MailShuttleService, protected folderStateService: FolderStateService, private http : HttpClient, private router : Router, private sanitizer: DomSanitizer) {
    const mail = this.MailDetails.getMailData();

    if (!mail) {
      console.error('No mail data found');
      return;
    }
    this.dataFile = mail;
    this.isRead = mail.isRead;
  }
  showDeleteOptions: boolean = false;
  CustomFolderPopUp:boolean = false;
  foldername:string=''
  Emails:Datafile[]=[];
  InboxData:Datafile[]=[];
  CustomFolders:CustomFolderData[]=[];
  page:number = 0;
  tomove:boolean=false;
  isSearchActive = false;
  isAdvancedSearch = false;
  currentSearchKeyword = '';
  currentAdvancedFilters: MailSearchRequestDto = {};
  showSortMenu = false;
  currentSort = 'Date (Newest first)';
  ngOnInit() {
    this.getInbox(0);
    this.getCustomFolders();
  }
  updatePage(page: number) {
    if (page < 0) {
      return;
    }
    this.page = page;
    
    if (this.currentSort !== 'Date (Newest first)') {
      const sortByMap: { [key: string]: string } = {
        'Date (Newest first)': 'date_desc',
        'Date (Oldest first)': 'date_asc',
        'Sender (A → Z)': 'sender',
        'Subject (A → Z)': 'subject',
        'Priority': 'priority'
      };
      this.applySorting(sortByMap[this.currentSort], this.page);
    }
    else if (this.isSearchActive) {
      if (this.isAdvancedSearch) {
        this.performAdvancedSearch(this.page);
      } else {
        this.performQuickSearch(this.page);
      }
    } else {
      this.getInbox(this.page);
    }
  }
  getCustomFolders(){
    const url = "http://localhost:8080/api/folders";
    let param = new HttpParams;
    param = param.set("userId", this.folderStateService.userData().userId)
    .set("type", "custom");
    this.http.get<CustomFolderData[]>(url,{params:param}).subscribe({
      next: data => {
        this.CustomFolders = data;
        console.log(data);
      },
      error: err => {
        console.log(err);
        alert("failed to fetch custom folders");
      }
    })
  }
  getInbox(page:number){
    const userData: UserData = this.folderStateService.userData();
    const inboxId = userData.inboxFolderId;
    if(!inboxId){
      console.error('inboxId is missing');
      return;
    }
    let param = new HttpParams
    param = param.set('page', page);
    param = param.set("folderId",this.folderStateService.userData().inboxFolderId);
    console.log(param);
    this.http.get<Datafile[]>(`http://localhost:8080/api/mails`,{params:param}).subscribe({
      next:(respones) => {
        this.InboxData=respones;
        console.log(respones);
      },
      error:(respones) => {
        console.log(respones);
        alert("failed to fetch mails");
      }
    })
  }
  goToMailDetails(details:Datafile){
    if (!details.isRead) {
      details.isRead = true;
      this.markMailAsRead(details.mailId);

      const index = this.InboxData.findIndex(e => e.mailId === details.mailId);
      if (index !== -1) {
        this.InboxData[index].isRead = true;
      }
    }
    this.MailDetails.setMailData(details);
    this.MailDetails.setFromId(this.folderStateService.userData().inboxFolderId);
    this.router.navigate(['/mail']);
  }

  markMailAsRead(mailId: string) {
    const url = `http://localhost:8080/api/mails/read/${mailId}`;

    this.http.patch(url, {}, { responseType: 'text' }).subscribe({
      next: () => {
        console.log('Mail marked as read');

        // Update InboxData after confirmation
        const index = this.InboxData.findIndex(e => e.mailId === mailId);
        if (index !== -1) {
          this.InboxData[index].isRead = true;
        }
      },
      error: err => {
        console.error('Failed to mark mail as read', err);
      }
    });
  }


  goToCustomFolder(Id:string){
    this.MailDetails.setCustom(Id);
    this.router.navigate([`/Custom`]);
  }
  toggleEmailsSelected(email:Datafile,ischecked:boolean){
    if(ischecked){
      if(!this.Emails.includes(email)) {
        this.Emails.push(email);
      }
    }
    else {
      const emailIndex = this.Emails.findIndex(e => e.mailId === email.mailId);
      if (emailIndex != -1) {
        this.Emails.splice(emailIndex, 1);
      }
    }
  }
  addallemails(check:boolean){
    if(check){
      console.log("added")
      this.Emails = this.InboxData;
    }
    else{
      console.log("removed");
      this.Emails=[];
    }
}
  checked(id:string){
  const emailIndex = this.Emails.findIndex(e => e.mailId === id);
  if (emailIndex != -1) {
    return true;
  }
  else{
    return false;
  }
}
  delete(){
    const userData: UserData = this.folderStateService.userData();
    const inboxId = userData.inboxFolderId;
    const url = `http://localhost:8080/api/mails/${inboxId}`
    if(this.Emails.length == 0){
      return
    }
    let ids:string[]=[];
    for(let i:number=0; i<this.Emails.length;i++){
      ids.push(this.Emails[i].mailId);

      const emailIndex = this.InboxData.findIndex(e => e.mailId === this.Emails[i].mailId);
      this.toggleEmailsSelected(this.InboxData[emailIndex],false)
    }
    let params = new HttpParams();
    ids.forEach(id => params = params.append('ids', id));

    this.http.delete(url, {params: params, responseType: 'text'}).subscribe({
      next:()=>{
        this.InboxData = this.InboxData.filter(e => !ids.includes(e.mailId));
        this.Emails=[];
      },
      error:(respones) => {
        console.log(respones);
      }
    })
}
  CreateCustomFolder(){
    const url = "http://localhost:8080/api/folders"
    const payload={
      folderName:this.foldername,
      folderId:this.folderStateService.userData().inboxFolderId,
      userId:this.folderStateService.userData().userId,
    }
    this.http.post(url, payload).subscribe({
      next:(respones) => {
        console.log(respones);
      },
      error:(respones) => {
        alert("failed to create custom folder");
      }
    })
  }

  move(targetFolderId: string) {

    if (this.Emails.length === 0) return;

    const currentFolderId = this.folderStateService.userData().inboxFolderId;
    if (!currentFolderId || !targetFolderId) {
      alert("Error: Folder ID is missing. Please try logging in again.");
      return;
    }

    const mailIds = this.Emails.map(email => email.mailId);


    const url = `http://localhost:8080/api/mails/${targetFolderId}/${currentFolderId}`;
    const payload = { ids: mailIds };


    this.http.patch(url, payload, { responseType: 'text' }).subscribe({
      next: (response) => {

        const movedIdsSet = new Set(mailIds);
        this.InboxData = this.InboxData.filter(email => !movedIdsSet.has(email.mailId));
        this.Emails = [];
        this.tomove = false;
      },
      error: (err) => {
        console.error("Failed to move", err);
        alert("Failed to move emails. Check console for details.");
      }
    });
  }
  // isSearchActive = false;
  // currentSearchKeyword = '';

  handleSearch(criteria: any) {
    console.log('Search criteria:', criteria);
    this.page = 0;

    if (criteria.keywords) {
      // Quick keyword search
      this.isSearchActive = true;
      this.isAdvancedSearch = false;
      this.currentSearchKeyword = criteria.keywords;
      this.performQuickSearch(0);
    } else if (criteria.advancedSearch) {
      // Advanced filter search
      this.isSearchActive = true;
      this.isAdvancedSearch = true;
      this.currentAdvancedFilters = criteria.advancedSearch;
      this.performAdvancedSearch(0);
    }
  }

  performQuickSearch(page: number) {
    const userData: UserData = this.folderStateService.userData();
    const folderId = userData.inboxFolderId;

    if (!folderId) {
      console.error('folderId is missing');
      return;
    }

    let params = new HttpParams()
      .set('folderId', folderId)
      .set('keyword', this.currentSearchKeyword)
      .set('page', page);

    this.http.get<Datafile[]>('http://localhost:8080/api/mails/search', { params }).subscribe({
      next: (response) => {
        this.InboxData = response;
        console.log('Search results:', response);
      },
      error: (error) => {
        console.error('Search failed:', error);
        alert('Failed to search emails');
      }
    });
  }

  handleClearSearch() {
    this.isSearchActive = false;
    this.isAdvancedSearch = false;
    this.currentSearchKeyword = '';
    this.currentAdvancedFilters = {};
    this.page = 0;
    this.currentSort = 'Date (Newest first)';
    this.getInbox(0);
  }

    getSanitizedPreview(body: string | undefined): SafeHtml {
      if (!body) return '';
      let truncated = body.length > 50 ? body.substring(0, 50) + '...' : body;
      return this.sanitizer.bypassSecurityTrustHtml(truncated);
    }

    getPriorityLabel(priority: number | undefined): string {
      switch(priority) {
        case 1: return 'Urgent';
        case 2: return 'High';
        case 3: return 'Normal';
        case 4: return 'Low';
        default: return 'Normal';
      }
    }

  refreshData() {
    console.log("Refreshing Inbox Data...");
    this.Emails = []; 
    if (this.isSearchActive) {
      if (this.isAdvancedSearch) {
        this.performAdvancedSearch(this.page);
      } else {
        this.performQuickSearch(this.page);
      }
    } else {
      this.getInbox(this.page);
    }
  }


    performAdvancedSearch(page: number) {
    const userData: UserData = this.folderStateService.userData();
    const folderId = userData.inboxFolderId;

    if (!folderId) {
      console.error('folderId is missing');
      return;
    }

    let params = new HttpParams()
      .set('folderId', folderId)
      .set('page', page);

    this.http.post<Datafile[]>(
      'http://localhost:8080/api/mails/filter',
      this.currentAdvancedFilters,
      { params }
    ).subscribe({
      next: (response) => {
        this.InboxData = response;
        console.log('Filter results:', response);
      },
      error: (error) => {
        console.error('Filter failed:', error);
        alert('Failed to filter emails');
      }
    });
  }

  askDelete() {
    if (this.Emails.length > 0) {
      this.showDeleteOptions = true;
    }
  }


  moveToTrash() {
    const userData = this.folderStateService.userData();
    const inboxId = userData.inboxFolderId;
    const url = `http://localhost:8080/api/mails/${inboxId}`;

    if (this.Emails.length === 0) return;

    let ids: string[] = [];
    for (let i = 0; i < this.Emails.length; i++) {
      ids.push(this.Emails[i].mailId);

      const emailIndex = this.InboxData.findIndex(e => e.mailId === this.Emails[i].mailId);
      if(emailIndex !== -1) this.toggleEmailsSelected(this.InboxData[emailIndex], false);
    }

    let params = new HttpParams();
    ids.forEach(id => params = params.append('ids', id));

    this.http.delete(url, { params: params, responseType: 'text' }).subscribe({
      next: () => {
        this.InboxData = this.InboxData.filter(e => !ids.includes(e.mailId));
        this.Emails = [];
        this.showDeleteOptions = false;
      },
      error: (res) => {
        console.log(res);
        alert("Failed to move to Trash");
      }
    });
  }
  // Sort menu
  toggleSortMenu() {
    this.showSortMenu = !this.showSortMenu;
  }

  setSortAndClose(sortOption: string) {
    this.currentSort = sortOption;
    this.showSortMenu = false;
    this.page = 0; // Reset to first page
    
    // Map the display text to backend sortBy parameter
    const sortByMap: { [key: string]: string } = {
      'Date (Newest first)': 'date_desc',
      'Date (Oldest first)': 'date_asc',
      'Sender (A → Z)': 'sender',
      'Subject (A → Z)': 'subject',
      'Priority': 'priority'
    };
    
    const sortBy = sortByMap[sortOption];
    
    // Call the sort endpoint
    this.applySorting(sortBy, 0);
  }

  applySorting(sortBy: string, page: number) {
    const userData: UserData = this.folderStateService.userData();
    const folderId = userData.inboxFolderId;
    const userId = userData.userId;
    
    if (!folderId || !userId) {
      console.error('folderId or userId is missing');
      return;
    }

    let params = new HttpParams()
      .set('userId', userId)
      .set('folderId', folderId)
      .set('sortBy', sortBy)
      .set('page', page);

    this.http.get<Datafile[]>('http://localhost:8080/api/mails/sort', { params }).subscribe({
      next: (response) => {
        this.InboxData = response;
        console.log('Sorted results:', response);
      },
      error: (error) => {
        console.error('Sort failed:', error);
        alert('Failed to sort emails');
      }
    });
  }


  deleteForever() {
    if (this.Emails.length === 0) return;


    const ids = this.Emails.map(e => e.mailId);


    const url = `http://localhost:8080/api/mails`;

    this.http.request('delete', url, { body: ids, responseType: 'text' }).subscribe({
      next: () => {

        const deletedIdsSet = new Set(ids);
        this.InboxData = this.InboxData.filter(email => !deletedIdsSet.has(email.mailId));
        this.Emails = [];
        this.showDeleteOptions = false;
        console.log("Deleted Forever successfully");
      },
      error: (err) => {
        console.error("Delete Forever failed", err);
        alert("Failed to delete emails forever");
      }
    });
  }
}
