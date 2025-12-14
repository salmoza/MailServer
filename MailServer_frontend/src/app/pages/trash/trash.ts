import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {FolderStateService} from '../../Dtos/FolderStateService';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {CustomFolderData, Datafile} from '../../Dtos/datafile';
import {MailShuttleService} from '../../Dtos/MailDetails';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchBarComponent} from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, ReactiveFormsModule, FormsModule, SearchBarComponent],
  template: `
    <!-- Global resource loading added for robustness -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    <!-- Main Container: Enforced light background -->
    <div class="flex h-screen w-full">
      <!-- SideNavBar -->
      <aside
        class="flex h-full w-[260px] flex-col border-r border-slate-200 bg-white p-4 sticky top-0"
      >
        <div class="flex h-full flex-col justify-between">
          <div class="flex flex-col gap-6">
            <div class="flex items-center gap-3 px-3">

              <h1 class="text-slate-800 text-base font-medium leading-normal">
                {{folderStateService.userData().username}}
              </h1>
            </div>
            <button [routerLink]="['/compose']"
                    class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span class="truncate">Compose</span>
            </button>
            <div class="flex flex-col gap-1">
              <!-- Active Inbox Link -->
              <a [routerLink]="['/inbox']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <!-- Removed dark:text-slate-200 -->
                <span class="material-symbols-outlined text-slate-800 fill"
                >inbox</span
                >
                <p class="text-slate-800 text-sm font-medium leading-normal">
                  Inbox
                </p>
                <span
                  class="ml-auto text-xs font-semibold text-slate-600 bg-slate-200 rounded-full px-2 py-0.5"
                >3</span
                >
              </a>
              <a [routerLink]="['/sent']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <!-- Removed dark:text-slate-400 -->
                <span class="material-symbols-outlined text-slate-600"
                >send</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Sent
                </p>
              </a>
              <a [routerLink]="['/drafts']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600"
                >draft</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Drafts
                </p>
              </a>
              <a [routerLink]="['/trash']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 "
              >
                <span class="material-symbols-outlined text-slate-600"
                >delete</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Trash
                </p>
              </a>
              <a [routerLink]="['/contacts']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600"
                  >contacts</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Contacts
                </p>
              </a>
              <a [routerLink]="['/filters']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600">filter_alt</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Filters
                </p>
              </a>
            </div>
            <!-- Custom Folders -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between px-3 py-2">
                <h2
                  class="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  Custom Folders
                </h2>
                <button (click)="CustomFolderPopUp=true" class="text-slate-500 hover:text-primary cursor-pointer ">
                  <span class="material-symbols-outlined text-base cursor-pointer">add</span>
                </button>
              </div>
              @for(custom of CustomFolders; track $index) {
              <a (click)="goToCustomFolder(custom.folderId)"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600"
                >folder</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  {{custom.folderName}}
                </p>
              </a>
              }
            </div>
          </div>
        </div>
      </aside>
      <!-- Main Content -->
      <main class="flex-1 flex flex-col h-screen overflow-y-auto">
        <!-- Search Bar -->
        <app-search-bar (onSearch)="handleSearch($event)"></app-search-bar>
        <!-- Toolbar -->
        <div
          class="flex justify-between items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-10"
        >
          <div class="flex gap-2">
            <button (click)="delete()"
                    class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    [disabled]="Emails.length === 0"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
            <button (click)="tomove = true"
                    class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    [disabled]="Emails.length === 0"
            >
              <span class="material-symbols-outlined">folder_open</span>
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-600"
            >Priority Mode</span
            >
            <label class="relative inline-flex items-center cursor-pointer">
              <input class="sr-only peer" type="checkbox" value="" />
              <div
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
              ></div>
            </label>
          </div>
        </div>
        <!-- Email List Table -->
        <div class="flex-1 px-6 py-4 overflow-x-hidden">
          <div
            class="flex overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            <table class="w-full text-left">
              <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 w-12">
                  <input
                    class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                    type="checkbox"
                    #checkbox
                    (click)="addallemails(checkbox.checked)"
                  />
                </th>

                <th class="py-3 pl-0 pr-4" colspan="4">
                  <div class="flex items-center w-full">
                    <div class="px-4 text-slate-800 w-1/4 text-sm font-medium">
                      Sender
                    </div>
                    <div class="px-4 text-slate-800 w-1/2 text-sm font-medium">
                      Subject
                    </div>
                    <div class="px-4 text-slate-800 w-auto text-sm font-medium"></div>
                    <div class="px-4 text-slate-800 w-1/6 text-sm font-medium text-right">
                      Date
                    </div>
                  </div>
                </th>
              </tr>
              </thead>

              <tbody>
                @for(item of TrashData; track $index){
                  <tr
                    class="border-t border-t-slate-200 hover:bg-slate-50"
                  >
                    <td class="px-4 py-2">
                      <input
                        class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                        type="checkbox"
                        #checkbox
                        (change)="toggleEmailsSelected(item,checkbox.checked)"
                        [checked]="checked(item.mailId)"
                      />
                    </td>

                    <td class="py-0 pl-0 pr-4" colspan="4">
                      <div
                        class="flex items-center w-full py-2 cursor-pointer"
                        (click)="goToMailDetails(item)"
                      >
                        <div class="px-4 text-slate-800 w-1/4 text-sm font-semibold">
                          {{item.sender}}
                        </div>

                        <div class="px-4 w-1/2">
                    <span class="text-slate-800 text-sm font-semibold"
                    >{{item.subject}}</span
                    >
                          <span class="text-slate-500 text-sm ml-2 truncate"
                          >{{item.body}}</span
                          >
                        </div>

                        <div class="px-4 text-right w-auto">
                          <span class="material-symbols-outlined text-slate-400 text-lg">attachment</span>
                        </div>

                        <div class="px-4 text-slate-500 text-sm text-right w-1/6">
                          {{item.date}}
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <!-- Pagination -->
        <div
          class="flex items-center justify-center p-4 border-t border-gray-200 bg-white mt-auto"
        >
          <a (click)="updatePage(page-1)"
             class="flex cursor-pointer size-10 items-center justify-center text-slate-500 hover:text-primary"
          >
            <span class="material-symbols-outlined text-lg">chevron_left</span>
          </a>
          <a (click)="updatePage(0)"
             class="text-sm cursor-pointer font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white rounded-lg bg-primary"
          >1</a
          >
          <a (click)="updatePage(1)"
             class="text-sm cursor-pointer font-normal leading-normal flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100"
          >2</a
          >
          <a (click)="updatePage(2)"
             class="text-sm cursor-pointer font-normal leading-normal flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100"
          >3</a
          >
          <a (click)="updatePage(page+1)"
             class="flex  size-10 items-center justify-center text-slate-500 hover:text-primary cursor-pointer"
          >
            <span class="material-symbols-outlined text-lg">chevron_right</span>
          </a>
        </div>
      </main>
      <div class="move-conatiner bg-black/50" [class.active]="tomove">
        <div class="content-container ">
          <span style="font-size: large;font-weight: bold;margin-top: 20px">Move email To</span>
          <div class="buttons-folders">
            <button (click)="move(folderStateService.userData().inboxFolderId)">Inbox</button>
            @for(folder of CustomFolders; track $index){
              <button (click)="move(folder.folderId)">{{folder.folderName}}</button>
            }
          </div>
          <div class="bottom-btn">
            <button (click)="tomove=false">Back</button>
            <button (click)="CustomFolderPopUp=true">make new custom Folder</button>
          </div>
        </div>
      </div>
      <div class="move-conatiner bg-black/50" [class.active]="CustomFolderPopUp">
        <div id="Custom-container" class="content-container bg-amber-50 h-3/12">
          <input type="text" placeholder="Folders Name.." name="Name" [(ngModel)]="foldername">
          <button  (click)="CreateCustomFolder();CustomFolderPopUp=false">Create</button>
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

    .content-container button {
      display: flex;
      padding: 15px;
      border-radius: 30px;
      background-color: #f9f9f9;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.1s ease-in-out;
    }

    .content-container button:hover {
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
export class Trash implements OnInit{
  constructor(private MailDetails:MailShuttleService, protected folderStateService: FolderStateService, private http : HttpClient, private router : Router) {
  }
  foldername:string=''
  CustomFolderPopUp:boolean=false;
  Emails:Datafile[]=[];
  TrashData:Datafile[]=[];
  CustomFolders:CustomFolderData[]=[];
  page:number = 0;
  tomove:boolean=false;
  ngOnInit() {
    this.getTrash(0);
    this.getCustomFolders();
  }
  updatePage(page:number){
    if(page<0){
      return;
    }
    this.page=page;
    this.getTrash(this.page);
  }
  getCustomFolders(){
    const url = "http://localhost:8080/folders/custom";
    let param = new HttpParams;
    param = param.set("userId", this.folderStateService.userData().userId);
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
  getTrash(page:number){
    const userData: UserData = this.folderStateService.userData();
    const TrashId = userData.trashFolderId;
    if(!TrashId){
      console.error('SendId is missing');
      return;
    }
    let param = new HttpParams
    param = param.set('page', page);
    param = param.set("folderId",this.folderStateService.userData().trashFolderId);
    this.http.get<Datafile[]>(`http://localhost:8080/mail/getAllMails`,{params:param}).subscribe({
      next:(respones) => {
        this.TrashData=respones;
        console.log(respones);
      },
      error:(respones) => {
        console.log(respones);
        alert("failed to fetch mails");
      }
    })
  }
  goToMailDetails(details:Datafile){
    this.MailDetails.setMailData(details);
    this.MailDetails.setFromId(this.folderStateService.userData().trashFolderId);
    console.log(details)
    this.router.navigate([`/mail`]);
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
      this.Emails = this.TrashData;
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
    const TrashId = userData.trashFolderId;
    const url = `http://localhost:8080/mail/deleteMails/${TrashId}`
    if(this.Emails.length == 0){
      return
    }
    let ids:string[]=[];
    for(let i:number=0; i<this.Emails.length;i++){
      ids.push(this.Emails[i].mailId);
      /*to remove the email form Sent*/
      const emailIndex = this.TrashData.findIndex(e => e.mailId === this.Emails[i].mailId);
      this.toggleEmailsSelected(this.TrashData[emailIndex],false)
    }
    let params = new HttpParams();
    ids.forEach((id) => {
      params = params.append('ids', id);
    });
    this.http.delete(url, {params:params}).subscribe({
      next:(respones) => {
        console.log(respones);
      },
      error:(respones) => {
        console.log(respones);
      }
    })
  }

  move(moveMailToFolderId:string){
    let mailids:string[]=[];
    const url = `http://localhost:8080/mail/move/${moveMailToFolderId}/${this.folderStateService.userData().trashFolderId}`;
    for(let i:number=0; i<this.Emails.length;i++){
      mailids.push(this.Emails[i].mailId);
      const emailIndex = this.TrashData.findIndex(e => e.mailId === this.Emails[i].mailId);
      this.toggleEmailsSelected(this.TrashData[emailIndex],false)
    }
    const payload={
      ids:mailids
    }
    this.http.post(url, payload).subscribe({
      next:(respones) => {
        const movedIdsSet = new Set(mailids);

        this.TrashData = this.TrashData.filter(email => !movedIdsSet.has(email.mailId));

        this.Emails = [];
      },
      error:(respones) => {
        console.log("failed to move");
      }
    })
  }
  goToCustomFolder(Id:string){
    this.MailDetails.setCustom(Id);
    this.router.navigate([`/Custom`]);
  }
  CreateCustomFolder(){
    const url = "http://localhost:8080/folders/createFolder"
    const payload={
      folderName:this.foldername,
      folderId:this.folderStateService.userData().inboxFolderId,
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
  handleSearch(criteria: any) {
    console.log('Search criteria:', criteria);
    // TODO: Implement search functionality
  }
}
