import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FolderStateService } from '../../Dtos/FolderStateService';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { CustomFolderData, Datafile } from '../../Dtos/datafile';
import { MailShuttleService } from '../../Dtos/MailDetails';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { HeaderComponent } from '../../header';
import { SidebarComponent } from '../../components/side-bar/side-bar';
import { FolderSidebarService } from '../../services/folder-sidebar.service';
import { PaginationFooterComponent } from '../../components/pagination-footer/pagination-footer';
import { PaginationService } from '../../services/pagination.service';

interface MailSearchRequestDto {
  sender?: string;
  receiver?: string;
  subject?: string;
  body?: string;
}

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SearchBarComponent,
    HeaderComponent,
    SidebarComponent,
    PaginationFooterComponent,
  ],
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

<div class="flex h-screen w-full font-inter">
  <app-sidebar
    [username]="folderStateService.userData().username"
    [userEmail]="folderStateService.userData().email"
    [customFolders]="CustomFolders"
    [activeCustomFolderId]="getCurrentFolderId()"
    (folderClick)="handleFolderClick($event)"
    (createFolder)="handleCreateFolder()"
    (renameFolder)="handleRenameFolder($event)"
    (deleteFolder)="handleDeleteFolder($event)">
  </app-sidebar>

  <main class="flex-1 flex flex-col h-screen overflow-y-auto bg-[#f6f7f8]">
    <div class="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="flex-1 mr-4">
        <app-search-bar (onSearch)="handleSearch($event)" (onClear)="handleClearSearch()"></app-search-bar>
      </div>
      <app-header></app-header>
    </div>

    <div class="flex justify-between items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">
      <div class="flex gap-2">
        <button (click)="delete()"
                class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                [disabled]="Emails.length === 0"
                title="Delete Forever">
          <span class="material-symbols-outlined">delete_forever</span>
        </button>
        <button (click)="undo()"
                class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                [disabled]="Emails.length === 0"
                title="Restore to previous folder">
          <span class="material-symbols-outlined">undo</span>
        </button>
        <button (click)="refreshData()"
                      class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Reload Emails">
                <span class="material-symbols-outlined">refresh</span>
              </button>
      </div>
    </div>

    <div class="flex-1 px-6 py-4 overflow-x-hidden">
      <div class="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 w-12">
              <input class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                     type="checkbox"
                     #checkbox
                     (click)="addallemails(checkbox.checked)"
              />
            </th>
            <th class="py-3 pl-0 pr-4" colspan="5">
              <div class="flex items-center w-full">
                <div class="px-4 text-slate-600 w-1/4 text-xs uppercase tracking-wider font-semibold">Sender</div>
                <div class="px-4 text-slate-600 w-1/4 text-xs uppercase tracking-wider font-semibold">Receiver</div>
                <div class="px-4 text-slate-600 w-2/5 text-xs uppercase tracking-wider font-semibold">Subject</div>
                <div class="px-4 text-slate-600 w-1/6 text-xs uppercase tracking-wider font-semibold text-center">Date</div>
              </div>
            </th>
          </tr>
          </thead>

          <tbody>
          @for(item of TrashData; track $index){
            <tr class="border-t border-t-slate-200 hover:bg-slate-50 transition-colors">
              <td class="px-4 py-2">
                <input class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                       type="checkbox"
                       #checkbox
                       (change)="toggleEmailsSelected(item, checkbox.checked)"
                       [checked]="checked(item.mailId)"
                />
              </td>

              <td class="py-0 pl-0 pr-4" colspan="5">
                <div class="flex items-center w-full py-2 cursor-pointer" (click)="goToMailDetails(item)">
                  
                  <div class="px-4 text-slate-800 w-1/4 text-sm font-semibold truncate">
                    {{item.senderDisplayName || item.sender}}
                  </div>

                  <div class="px-4 text-slate-800 w-1/4 text-sm font-semibold truncate">
                    {{ item.receiverDisplayNames && item.receiverDisplayNames.length > 0
                    ? item.receiverDisplayNames[0]
                    : (item.receiverEmails && item.receiverEmails.length > 0
                      ? item.receiverEmails[0]
                      : '-') }}
                    <span *ngIf="item.receiverDisplayNames && item.receiverDisplayNames.length > 1"
                          class="text-slate-500 text-xs ml-1">
                        +{{ item.receiverDisplayNames.length - 1 }}
                      </span>
                  </div>

                  <div class="px-4 w-2/5">
                    <span class="text-slate-800 text-sm font-semibold">{{item.subject || '(No Subject)'}}</span>
                    <span class="text-slate-500 text-sm ml-2 truncate">{{ item.body }}</span>
                  </div>

                        <div class="px-4 text-slate-500 text-sm text-center w-1/6 whitespace-nowrap">
                          {{ formatDate(item.date) }}
                        </div>
                      </div>
                    </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <app-pagination-footer
          [contextKey]="paginationKey"
          [pages]="paginationPages"
          [canGoNext]="canGoNext"
        ></app-pagination-footer>
      </main>

  <div class="move-conatiner bg-black/50" [class.active]="CustomFolderPopUp">
    <div id="Custom-container" class="content-container bg-amber-50 h-3/12">
      <input type="text" placeholder="Folders Name.." name="Name" [(ngModel)]="foldername" />
      <button (click)="CreateCustomFolder(); CustomFolderPopUp = false">Create</button>
      <button id="trash-btn" (click)="CustomFolderPopUp = false">Back</button>
    </div>
  </div>
</div>
  `,
  styles: [
    `
      /* 1. We define the font-family globally here, assuming the font files can be reached */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

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
        gap: 60px;
        height: 300px;
      }
      .content-container input {
        border-radius: 15px;
        padding: 10px;
        border: 2px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.1s ease-in;
      }
      .content-container input:focus {
        border: 3px solid #3e8cf4;
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
      .text-primary,
      .hover\\:text-primary {
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
    `,
  ],
})
export class Trash implements OnInit, OnDestroy {
  constructor(
    private MailDetails: MailShuttleService,
    protected folderStateService: FolderStateService,
    private http: HttpClient,
    private router: Router,
    private folderSidebarService: FolderSidebarService,
    private paginationService: PaginationService,
  ) {}
  foldername: string = '';
  CustomFolderPopUp: boolean = false;
  Emails: Datafile[] = [];
  TrashData: Datafile[] = [];
  page: number = 0;
  readonly paginationKey = 'trash';
  readonly pageSize = 10;
  paginationPages: number[] = [0];
  canGoNext = true;
  CustomFolders:CustomFolderData[]=[];



  isSearchActive = false;
  isAdvancedSearch = false;
  currentSearchKeyword = '';
  currentAdvancedFilters: MailSearchRequestDto = {};

  ngOnInit() {
    this.paginationService.registerContext(this.paginationKey, 0, (page) => this.updatePage(page));
    this.getCustomFolders();
  }
  ngOnDestroy(): void {
    this.paginationService.unregisterContext(this.paginationKey);
  }

  private resetPaginationState(): void {
    this.paginationPages = [0];
    this.canGoNext = true;
    this.paginationService.resetState(this.paginationKey, 0);
  }

  private syncPagination(page: number, itemsCount: number): boolean {
    const state = this.paginationService.updateAfterDataLoad(
      this.paginationKey,
      page,
      itemsCount,
      this.pageSize,
    );

    this.paginationPages = state.pages;
    this.canGoNext = state.canGoNext;

    return true;
  }

  updatePage(page: number) {
    if (page < 0) {
      return;
    }
    this.page = page;

    if (this.isSearchActive) {
      if (this.isAdvancedSearch) {
        this.performAdvancedSearch(this.page);
      } else {
        this.performQuickSearch(this.page);
      }
    } else {
      this.getTrash(this.page);
    }
  }
  getCustomFolders() {
    const url = 'http://localhost:8080/api/folders';
    let param = new HttpParams();
    param = param.set('userId', this.folderStateService.userData().userId).set('type', 'custom');
    this.http.get<CustomFolderData[]>(url, { params: param }).subscribe({
      next: (data) => {
        this.CustomFolders = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
        alert('failed to fetch custom folders');
      },
    });
  }
  getTrash(page: number) {
    const userData: UserData = this.folderStateService.userData();
    const TrashId = userData.trashFolderId;
    if (!TrashId) {
      console.error('SendId is missing');
      return;
    }
    let param = new HttpParams();
    param = param.set('page', page);
    param = param.set('folderId', this.folderStateService.userData().trashFolderId);
    this.http.get<Datafile[]>(`http://localhost:8080/api/mails`, { params: param }).subscribe({
      next: (respones) => {
        const canDisplay = this.syncPagination(page, respones.length);
        if (!canDisplay) {
          return;
        }

        this.TrashData = this.transformMailData(respones);
        console.log(respones);
      },
      error: (respones) => {
        console.log(respones);
        alert('failed to fetch mails');
      },
    });
  }
  goToMailDetails(details: Datafile) {
    this.MailDetails.setMailData(details);
    this.MailDetails.setFromId(this.folderStateService.userData().trashFolderId);
    console.log(details);
    this.router.navigate([`/mail`]);
  }
  toggleEmailsSelected(email: Datafile, ischecked: boolean) {
    if (ischecked) {
      if (!this.Emails.includes(email)) {
        this.Emails.push(email);
      }
    } else {
      const emailIndex = this.Emails.findIndex((e) => e.mailId === email.mailId);
      if (emailIndex != -1) {
        this.Emails.splice(emailIndex, 1);
      }
    }
  }
  addallemails(check: boolean) {
    if (check) {
      console.log('added');
      this.Emails = this.TrashData;
    } else {
      console.log('removed');
      this.Emails = [];
    }
  }
  checked(id: string) {
    const emailIndex = this.Emails.findIndex((e) => e.mailId === id);
    if (emailIndex != -1) {
      return true;
    } else {
      return false;
    }
  }
  delete() {
    if (this.Emails.length == 0) return;


    const ids = this.Emails.map(email => email.mailId);


    const url = `http://localhost:8080/api/mails`;

    ids.forEach((id) => {
      const emailIndex = this.TrashData.findIndex((e) => e.mailId === id);
      if (emailIndex > -1) this.toggleEmailsSelected(this.TrashData[emailIndex], false);
    });


    this.http.request('delete', url, { body: ids, responseType: 'text' }).subscribe({
      next: (response) => {
        const deletedIdsSet = new Set(ids);
        this.TrashData = this.TrashData.filter((email) => !deletedIdsSet.has(email.mailId));
        this.Emails = [];
        console.log("Deleted Forever from Trash");
      },
      error: (err) => {
        console.error(err);
        alert("Failed to delete forever");
      }
    })
  }


  undo() {
    if (this.Emails.length === 0) {
      return;
    }


    const url = `http://localhost:8080/api/mails`;

    const ids = this.Emails.map(email => email.mailId);

    this.http.patch(url, ids , {responseType : "text"} ).subscribe({
      next: (response) => {
        console.log("Undo successful", response);

        const restoredIdsSet = new Set(ids);
        this.TrashData = this.TrashData.filter(email => !restoredIdsSet.has(email.mailId));

        this.Emails = [];
      },
      error: (error) => {
        console.error("Undo failed", error);
        alert("Failed to restore emails");
      }
    });
  }



  goToCustomFolder(Id:string){
    this.MailDetails.setCustom(Id);
    this.router.navigate([`/Custom`]);
  }

  CreateCustomFolder(){
    const url = "http://localhost:8080/api/folders";
    const payload = {
      folderName: this.foldername,

      folderId: this.folderStateService.userData().inboxFolderId,

      userId: this.folderStateService.userData().userId,
    };

    // Add new folder to CustomFolders array immediately for instant UI feedback
    const newFolder: CustomFolderData = {
      folderId: payload.folderId,
      folderName: this.foldername,
      User: this.folderStateService.userData().userId,
      mails: []
    };
    this.CustomFolders = [...this.CustomFolders, newFolder];
    this.foldername = '';
    this.CustomFolderPopUp = false;

    this.http.post(url, payload).subscribe({
      next: (respones) => {
        console.log(respones);
        // Sync with server in background
        this.getCustomFolders();
      },
      error: (respones) => {
        alert("failed to create custom folder");
      }
    })
  }

  handleSearch(criteria: any) {
    console.log('Search criteria:', criteria);
    if (criteria?.keywords) {
      // Quick keyword search
      this.isSearchActive = true;
      this.isAdvancedSearch = false;
      this.currentSearchKeyword = criteria.keywords;
      this.currentAdvancedFilters = {};
      this.page = 0;
    } else if (criteria?.advancedSearch) {
      // Advanced filter search
      this.isSearchActive = true;
      this.isAdvancedSearch = true;
      this.currentAdvancedFilters = criteria.advancedSearch;
      this.currentSearchKeyword = '';
      this.page = 0;
    } else {
      this.handleClearSearch();
      return;
    }

    this.resetPaginationState();
    this.paginationService.setPage(this.paginationKey, 0);
  }

  performQuickSearch(page: number) {
    const userData = this.folderStateService.userData();
    const folderId = userData.trashFolderId;

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
        const canDisplay = this.syncPagination(page, response.length);
        if (!canDisplay) {
          return;
        }

        this.TrashData = this.transformMailData(response);
        console.log('Search results:', response);
      },
      error: (error) => {
        console.error('Search failed:', error);
        alert('Failed to search emails');
      },
    });
  }

  performAdvancedSearch(page: number) {
    const userData: UserData = this.folderStateService.userData();
    const folderId = userData.trashFolderId;

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
        const canDisplay = this.syncPagination(page, response.length);
        if (!canDisplay) {
          return;
        }

        this.TrashData = this.transformMailData(response);
        console.log('Filter results:', response);
      },
      error: (error) => {
        console.error('Filter failed:', error);
        alert('Failed to filter emails');
      }
    });
  }

  handleClearSearch() {
    this.isSearchActive = false;
    this.isAdvancedSearch = false;
    this.currentSearchKeyword = '';
    this.currentAdvancedFilters = {};
    this.page = 0;
    this.resetPaginationState();
    this.paginationService.setPage(this.paginationKey, 0);
  }

  transformMailData(mails: Datafile[]): Datafile[] {
    const currentUserEmail = this.folderStateService.userData().email;
    return mails.map(mail => {
      const isSender = mail.sender === currentUserEmail;
      return {
        ...mail,
        senderDisplayName: isSender ? 'me' : mail.senderDisplayName,
        receiverDisplayNames: mail.receiverDisplayNames,
      };
    });
  }

  isToday(date: string | Date): boolean {
    const givenDate = new Date(date);
    const today = new Date();
    return givenDate.toDateString() === today.toDateString();
  }

  formatDate(itemDate: string | Date): string {
    const date = new Date(itemDate);
    if (this.isToday(date)) {
      // Show only time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Show day and month
      
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });

    }
  }

  refreshData() {
    console.log("Refreshing Trash Data...");
    this.Emails = [];
    if (this.isSearchActive) {
      if (this.isAdvancedSearch) {
        this.performAdvancedSearch(this.page);
      } else {
        this.performQuickSearch(this.page);
      }
    } else {
      this.getTrash(this.page);
    }
  }

  handleFolderClick(folderId: string) {
    this.folderSidebarService.navigateToCustomFolder(folderId);
  }

  handleCreateFolder() {
    this.CustomFolderPopUp = this.folderSidebarService.openCreateFolderModal();
  }

  handleRenameFolder(data: { folderId: string; newName: string }) {
    this.folderSidebarService.renameFolder(data.folderId, data.newName, () => this.getCustomFolders());
  }

  handleDeleteFolder(folderId: string) {
    this.CustomFolders = this.CustomFolders.filter(f => f.folderId !== folderId);
    this.folderSidebarService.deleteFolder(folderId, () => {
      this.router.navigate(['/inbox']);
    });
  }

  getCurrentFolderId(): string {
    return this.folderSidebarService.getActiveCustomFolderId();
  }
}
