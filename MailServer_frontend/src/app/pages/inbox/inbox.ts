import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FolderStateService } from '../../Dtos/FolderStateService';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { CustomFolderData, Datafile } from '../../Dtos/datafile';
import { MailShuttleService } from '../../Dtos/MailDetails';
import { FolderSidebarService } from '../../services/folder-sidebar.service';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { HeaderComponent } from '../../header';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SidebarComponent } from '../../components/side-bar/side-bar';
import { PaginationFooterComponent } from '../../components/pagination-footer/pagination-footer';
import { PaginationService } from '../../services/pagination.service';
import { forkJoin } from 'rxjs';
interface MailSearchRequestDto {
  sender?: string;
  receiver?: string;
  subject?: string;
  body?: string;
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule,
    FormsModule,
    SearchBarComponent,
    HeaderComponent,
    SidebarComponent,
    PaginationFooterComponent,
  ],
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      rel="stylesheet"
    />

    <div class="flex h-screen w-full font-inter">
      <app-sidebar
        [username]="folderStateService.userData().username"
        [userEmail]="folderStateService.userData().email"
        [customFolders]="CustomFolders"
        [activeCustomFolderId]="getCurrentFolderId()"
        (folderClick)="handleFolderClick($event)"
        (createFolder)="handleCreateFolder()"
        (renameFolder)="handleRenameFolder($event)"
        (deleteFolder)="handleDeleteFolder($event)"
      >
      </app-sidebar>

      <main class="flex-1 flex flex-col h-screen overflow-y-auto bg-[#f6f7f8]">
        <div
          class="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-50"
        >
          <div class="flex-1 mr-4">
            <app-search-bar (onSearch)="handleSearch($event)" (onClear)="handleClearSearch()">
            </app-search-bar>
          </div>

          <app-header></app-header>
        </div>

        <div
          class="flex justify-between items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-10"
        >
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-slate-700 font-semibold">
              <span class="material-symbols-outlined text-primary">inbox</span>
              <span>Inbox</span>
              <span
                *ngIf="unreadCount > 0"
                class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
              >
                {{ unreadCount }}
              </span>
            </div>

            <div class="h-6 w-px bg-slate-300 mx-2"></div>

            <div class="flex gap-2">
              <button
                (click)="askDelete()"
                class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                [disabled]="Emails.length === 0"
                title="Delete"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>

              <button
                (click)="tomove = true"
                class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                [disabled]="Emails.length === 0"
                title="Move to Folder"
              >
                <span class="material-symbols-outlined">folder_open</span>
              </button>
              <button
                (click)="refreshData()"
                class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Reload Emails"
              >
                <span class="material-symbols-outlined">refresh</span>
              </button>
              <button
                  (click)="markAllAsRead()"
  class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
  [disabled]="unreadCount === 0"
  title="Mark all as read">
  <span class="material-symbols-outlined">done_all</span>
</button>
            </div>
          </div>

          <div class="relative inline-block">
            <button
              (click)="toggleSortMenu()"
              class="flex items-center gap-2 px-3 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg"
            >
              Sort by: <span [textContent]="currentSort"></span>
              <span class="material-symbols-outlined text-lg">expand_more</span>
            </button>
            <div
              *ngIf="showSortMenu"
              class="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
            >
              <div class="py-1">
                <button
                  (click)="setSortAndClose('Date (Newest first)')"
                  [ngClass]="{ 'bg-blue-50': currentSort === 'Date (Newest first)' }"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Date (Newest first)
                </button>
                <button
                  (click)="setSortAndClose('Date (Oldest first)')"
                  [ngClass]="{ 'bg-blue-50': currentSort === 'Date (Oldest first)' }"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Date (Oldest first)
                </button>
                <button
                  (click)="setSortAndClose('Sender (A → Z)')"
                  [ngClass]="{ 'bg-blue-50': currentSort === 'Sender (A → Z)' }"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Sender (A → Z)
                </button>
                <button
                  (click)="setSortAndClose('Subject (A → Z)')"
                  [ngClass]="{ 'bg-blue-50': currentSort === 'Subject (A → Z)' }"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Subject (A → Z)
                </button>
                <button
                  (click)="setSortAndClose('Priority')"
                  [ngClass]="{ 'bg-blue-50': currentSort === 'Priority' }"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Priority
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 px-6 py-4 overflow-x-hidden">
          <div class="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table class="w-full text-left">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3 w-12">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                      #checkbox
                      (click)="addallemails(checkbox.checked)"
                    />
                  </th>
                  <th class="py-3 pl-0 pr-4" colspan="5">
                    <div class="flex items-center w-full">
                      <div
                        class="px-4 text-slate-600 w-1/6 text-xs uppercase tracking-wider font-semibold"
                      >
                        Sender
                      </div>
                      <div
                        class="px-4 text-slate-600 w-1/6 text-xs uppercase tracking-wider font-semibold"
                      >
                        Receiver
                      </div>
                      <div
                        class="px-4 text-slate-600 w-1/3 text-xs uppercase tracking-wider font-semibold"
                      >
                        Subject
                      </div>
                      <div
                        class="px-4 text-slate-600 w-1/12 text-xs uppercase tracking-wider font-semibold"
                      >
                        Priority
                      </div>
                      <div
                        class="px-4 text-slate-600 w-1/6 text-xs uppercase tracking-wider font-semibold text-right"
                      >
                        Date
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                @for(item of InboxData; track $index){
                <tr
                  class="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                  [ngClass]="{ 'bg-white': item.isRead, 'bg-slate-50/50': !item.isRead }"
                >
                  <td class="px-4 py-2">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                      #checkbox
                      (change)="toggleEmailsSelected(item, checkbox.checked)"
                      [checked]="checked(item.mailId)"
                      (click)="$event.stopPropagation()"
                    />
                  </td>
                  <td class="py-0 pl-0 pr-4" colspan="5">
                    <div class="flex items-center w-full py-3" (click)="goToMailDetails(item)">
                      <div
                        class="px-4 w-1/6 text-sm truncate"
                        [ngClass]="{
                          'font-bold text-black': !item.isRead,
                          'font-medium text-slate-800': item.isRead
                        }"
                      >
                        {{ item.senderDisplayName || item.sender }}
                      </div>

                      <div class="px-4 text-slate-500 w-1/6 text-sm truncate">me</div>

                      <div class="px-4 w-1/3 flex items-center">
                        <span
                          class="text-sm truncate"
                          [ngClass]="{
                            'font-bold text-black': !item.isRead,
                            'font-medium text-slate-800': item.isRead
                          }"
                        >
                          {{ item.subject || '(No Subject)' }}
                        </span>
                        <span
                          class="text-sm text-slate-500 ml-2 truncate hidden sm:inline"
                          [innerHTML]="getSanitizedPreview(item.body)"
                        >
                        </span>
                      </div>

                      <div class="px-4 w-1/12">
                        <span
                          class="text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm"
                          [ngClass]="{
                            'bg-red-100 text-red-700': item.priority === 1,
                            'bg-orange-100 text-orange-700': item.priority === 2,
                            'bg-yellow-100 text-yellow-700': item.priority === 3,
                            'bg-blue-100 text-blue-700': item.priority === 4
                          }"
                        >
                          {{ getPriorityLabel(item.priority) }}
                        </span>
                      </div>

                      <div
                        class="px-4 text-sm text-right w-1/6"
                        [ngClass]="{
                          'font-bold text-black': !item.isRead,
                          'font-medium text-slate-500': item.isRead
                        }"
                      >
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

      <div class="move-conatiner bg-black/50" [class.active]="tomove">
        <div class="content-container">
          <span class="text-lg font-bold mt-5">Move {{ Emails.length }} Email(s) To</span>
          <div class="buttons-folders">
            @for(folder of CustomFolders; track $index){
            <button (click)="move(folder.folderId)">{{ folder.folderName }}</button>
            }
          </div>
          <div class="bottom-btn">
            <button (click)="tomove = false">Back</button>
            <button (click)="CustomFolderPopUp = true">Make new custom Folder</button>
          </div>
        </div>
      </div>

      <div class="move-conatiner bg-black/50" [class.active]="showDeleteOptions">
        <div class="content-container" style="min-height: 250px; gap: 20px;">
          <span class="text-lg font-bold mt-5 text-red-600"
            >Delete {{ Emails.length }} Email(s)</span
          >
          <p class="text-slate-600 text-center px-4">
            Do you want to move these emails to Trash or delete them forever?
          </p>
          <div class="flex flex-col gap-3 w-3/4">
            <button
              (click)="moveToTrash()"
              class="bg-amber-100 text-amber-800 hover:bg-amber-200"
              style="border: 1px solid #d97706;"
            >
              <span class="material-symbols-outlined align-middle mr-1 text-sm">delete</span>
              Move to Trash
            </button>
            <button
              (click)="deleteForever()"
              class="bg-red-100 text-red-800 hover:bg-red-200"
              style="border: 1px solid #dc2626;"
            >
              <span class="material-symbols-outlined align-middle mr-1 text-sm"
                >delete_forever</span
              >
              Delete Forever
            </button>
          </div>
          <div class="bottom-btn">
            <button (click)="showDeleteOptions = false">Cancel</button>
          </div>
        </div>
      </div>

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
      .content-container button {
        display: flex;
        padding: 15px;
        border-radius: 30px;
        background-color: #f9f9f9;
        cursor: pointer;
        border: 3px solid transparent;
        transition: all 0.1s ease-in-out;
      }

      .content-container button:hover,
      content-container2 button:hover {
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
export class Inbox implements OnInit, OnDestroy {
  dataFile!: Datafile;
  isRead!: boolean;
  readonly paginationKey = 'inbox';
  readonly pageSize = 10;
  paginationPages: number[] = [0];
  canGoNext = true;
  constructor(
    private MailDetails: MailShuttleService,
    protected folderStateService: FolderStateService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private folderSidebarService: FolderSidebarService,
    private paginationService: PaginationService,
  ) {
    const mail = this.MailDetails.getMailData();

    if (!mail) {
      console.error('No mail data found');
      return;
    }
    this.dataFile = mail;
    this.isRead = mail.isRead;
  }
  get unreadCount(): number {
    return this.InboxData.filter((mail) => !mail.isRead).length;
  } //count
  togglePriority: boolean = false;
  showDeleteOptions: boolean = false;
  CustomFolderPopUp: boolean = false;
  foldername: string = '';
  Emails: Datafile[] = [];
  InboxData: Datafile[] = [];
  CustomFolders: CustomFolderData[] = [];
  page: number = 0;
  tomove: boolean = false;
  isSearchActive = false;
  isAdvancedSearch = false;
  currentSearchKeyword = '';
  currentAdvancedFilters: MailSearchRequestDto = {};
  showSortMenu = false;
  currentSort = 'Date (Newest first)';

  ngOnInit() {
    this.paginationService.registerContext(this.paginationKey, 0, (page) => this.updatePage(page));
    this.getCustomFolders();
    this.getCustomFolders();

    this.route.queryParams.subscribe(params => {
      const keyword = params['q'];
      const advancedFlag = params['advanced'] === 'true';
      const filters = params['filters'] ? JSON.parse(params['filters']) : {};

      if (keyword || advancedFlag) {
        this.page = 0;
        this.isSearchActive = true;

        if (advancedFlag) {
          this.isAdvancedSearch = true;
          this.currentAdvancedFilters = filters;
          this.performAdvancedSearch(0);
        } else {
          this.isAdvancedSearch = false;
          this.currentSearchKeyword = keyword;
          this.performQuickSearch(0);
        }
      } else {
        this.getInbox(0);
      }
    });
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

    if (this.currentSort !== 'Date (Newest first)') {
      const sortByMap: { [key: string]: string } = {
        'Date (Newest first)': 'date_desc',
        'Date (Oldest first)': 'date_asc',
        'Sender (A → Z)': 'sender',
        'Subject (A → Z)': 'subject',
        Priority: 'priority',
      };
      this.applySorting(sortByMap[this.currentSort], this.page);
    } else if (this.isSearchActive) {
      if (this.isAdvancedSearch) {
        this.performAdvancedSearch(this.page);
      } else {
        this.performQuickSearch(this.page);
      }
    } else {
      this.getInbox(this.page);
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
  getInbox(page: number) {
    const userData: UserData = this.folderStateService.userData();
    const inboxId = userData.inboxFolderId;
    if (!inboxId) {
      console.error('inboxId is missing');
      return;
    }
    let param = new HttpParams();
    param = param.set('page', page);
    param = param.set('folderId', this.folderStateService.userData().inboxFolderId);
    console.log(param);
    this.http.get<Datafile[]>(`http://localhost:8080/api/mails`, { params: param }).subscribe({
      next: (response) => {
        const canDisplay = this.syncPagination(page, response.length);
        if (!canDisplay) {
          return;
        }

        this.InboxData = response;
        console.log(response);
      },
      error: (respones) => {
        console.log(respones);
        alert('failed to fetch mails');
      },
    });
  }
  goToMailDetails(details: Datafile) {
    if (!details.isRead) {
      const index = this.InboxData.findIndex((e) => e.mailId === details.mailId);
      if (index !== -1) {
        this.InboxData[index].isRead = true;
      }

      this.markMailAsRead(details.mailId);
      details.isRead = true;
    }

    this.MailDetails.setMailData(details);
    this.MailDetails.setFromId(this.folderStateService.userData().inboxFolderId);
    this.router.navigate(['/mail']);
  }

  markMailAsRead(mailId: string) {
    const url = `http://localhost:8080/api/mails/${mailId}/read-status`;

    this.http.patch(url, {}, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Mail marked as read:', response);
      },
      error: (err) => {
        console.error('Failed to mark mail as read', err);
      },
    });
  }

  goToCustomFolder(Id: string) {
    this.MailDetails.setCustom(Id);
    this.router.navigate([`/Custom`]);
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

      this.Emails = [...this.InboxData];
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
    const userData: UserData = this.folderStateService.userData();
    const inboxId = userData.inboxFolderId;
    const url = `http://localhost:8080/api/mails/${inboxId}`;
    if (this.Emails.length == 0) {
      return;
    }
    let ids: string[] = [];
    for (let i: number = 0; i < this.Emails.length; i++) {
      ids.push(this.Emails[i].mailId);

      const emailIndex = this.InboxData.findIndex((e) => e.mailId === this.Emails[i].mailId);
      this.toggleEmailsSelected(this.InboxData[emailIndex], false);
    }
    let params = new HttpParams();
    ids.forEach((id) => (params = params.append('ids', id)));

    this.http.delete(url, { params: params, responseType: 'text' }).subscribe({
      next: () => {
        this.InboxData = this.InboxData.filter((e) => !ids.includes(e.mailId));
        this.Emails = [];
      },
      error: (respones) => {
        console.log(respones);
      },
    });
  }
  CreateCustomFolder() {
    const url = 'http://localhost:8080/api/folders';
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
        alert('failed to create custom folder');
        // Remove folder from UI if creation failed
        this.CustomFolders = this.CustomFolders.filter(f => f.folderName !== this.foldername);
      },
    });
  }

  move(targetFolderId: string) {
    if (this.Emails.length === 0) return;

    const currentFolderId = this.folderStateService.userData().inboxFolderId;
    if (!currentFolderId || !targetFolderId) {
      alert('Error: Folder ID is missing. Please try logging in again.');
      return;
    }

    const mailIds = this.Emails.map((email) => email.mailId);

    const url = `http://localhost:8080/api/mails/${targetFolderId}/${currentFolderId}`;
    const payload = { ids: mailIds };

    this.http.patch(url, payload, { responseType: 'text' }).subscribe({
      next: (response) => {
        const movedIdsSet = new Set(mailIds);
        this.InboxData = this.InboxData.filter((email) => !movedIdsSet.has(email.mailId));
        this.Emails = [];
        this.tomove = false;
      },
      error: (err) => {
        console.error('Failed to move', err);
        alert('Failed to move emails. Check console for details.');
      },
    });
  }
  // isSearchActive = false;
  // currentSearchKeyword = '';

  handleSearch(criteria: any) {
    console.log('Search criteria:', criteria);

    if (criteria.keywords) {
      this.isSearchActive = true;
      this.isAdvancedSearch = false;
      this.currentSearchKeyword = criteria.keywords;
      this.currentAdvancedFilters = {};
      this.currentSort = 'Date (Newest first)';
    } else if (criteria.advancedSearch) {
      this.isSearchActive = true;
      this.isAdvancedSearch = true;
      this.currentAdvancedFilters = criteria.advancedSearch;
      this.currentSearchKeyword = '';
      this.currentSort = 'Date (Newest first)';
    }

    this.resetPaginationState();
    this.paginationService.setPage(this.paginationKey, 0);
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
        const canDisplay = this.syncPagination(page, response.length);
        if (!canDisplay) {
          return;
        }

        this.InboxData = response;
        console.log('Search results:', response);
      },
      error: (error) => {
        console.error('Search failed:', error);
        alert('Failed to search emails');
      },
    });
  }

  handleClearSearch() {
    this.isSearchActive = false;
    this.isAdvancedSearch = false;
    this.currentSearchKeyword = '';
    this.currentAdvancedFilters = {};
    this.currentSort = 'Date (Newest first)';
    this.resetPaginationState();
    this.paginationService.setPage(this.paginationKey, 0);
  }

  getSanitizedPreview(body: string | undefined): SafeHtml {
    if (!body) return '';
    let truncated = body.length > 50 ? body.substring(0, 50) + '...' : body;
    return this.sanitizer.bypassSecurityTrustHtml(truncated);
  }

  getPriorityLabel(priority: number | undefined): string {
    switch (priority) {
      case 1:
        return 'Urgent';
      case 2:
        return 'High';
      case 3:
        return 'Normal';
      case 4:
        return 'Low';
      default:
        return 'Normal';
    }
  }

  refreshData() {
    console.log('Refreshing Inbox Data...');
    this.Emails = [];
    this.paginationService.setPage(this.paginationKey, this.page);
  }

  performAdvancedSearch(page: number) {
    const userData: UserData = this.folderStateService.userData();
    const folderId = userData.inboxFolderId;

    if (!folderId) {
      console.error('folderId is missing');
      return;
    }

    let params = new HttpParams().set('folderId', folderId).set('page', page);

    this.http
      .post<Datafile[]>('http://localhost:8080/api/mails/filter', this.currentAdvancedFilters, {
        params,
      })
      .subscribe({
        next: (response) => {
          const canDisplay = this.syncPagination(page, response.length);
          if (!canDisplay) {
            return;
          }

          this.InboxData = response;
          console.log('Filter results:', response);
        },
        error: (error) => {
          console.error('Filter failed:', error);
          alert('Failed to filter emails');
        },
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

    const ids = this.Emails.map((e) => e.mailId);

    let params = new HttpParams();
    ids.forEach((id) => (params = params.append('ids', id)));

    this.http.delete(url, { params: params, responseType: 'text' }).subscribe({
      next: () => {
        this.InboxData = this.InboxData.filter((e) => !ids.includes(e.mailId));

        this.Emails = [];
        this.showDeleteOptions = false;
      },
      error: (res) => {
        console.log(res);
        alert('Failed to move to Trash');
      },
    });
  }


  // Sort menu
  toggleSortMenu() {
    this.showSortMenu = !this.showSortMenu;
  }

  setSortAndClose(sortOption: string) {
    this.currentSort = sortOption;
    this.showSortMenu = false;
    this.resetPaginationState();
    this.paginationService.setPage(this.paginationKey, 0);
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
        const canDisplay = this.syncPagination(page, response.length);
        if (!canDisplay) {
          return;
        }

        this.InboxData = response;
        console.log('Sorted results:', response);
      },
      error: (error) => {
        console.error('Sort failed:', error);
        alert('Failed to sort emails');
      },
    });
  }


  deleteForever() {
    if (this.Emails.length === 0) return;

    const ids = this.Emails.map((e) => e.mailId);

    const url = `http://localhost:8080/api/mails`;

    this.http.request('delete', url, { body: ids, responseType: 'text' }).subscribe({
      next: () => {
        const deletedIdsSet = new Set(ids);
        this.InboxData = this.InboxData.filter((email) => !deletedIdsSet.has(email.mailId));
        this.Emails = [];
        this.showDeleteOptions = false;
        console.log('Deleted Forever successfully');
      },
      error: (err) => {
        console.error('Delete Forever failed', err);
        alert('Failed to delete emails forever');
      },
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
      // Show month, day, year, hour, minute
      const dateStr = date.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${dateStr} ${timeStr}`;
    }
  }

  handleFolderClick(folderId: string) {
    this.folderSidebarService.navigateToCustomFolder(folderId);
  }

  handleCreateFolder() {
    this.CustomFolderPopUp = this.folderSidebarService.openCreateFolderModal();
  }

  handleRenameFolder(data: { folderId: string; newName: string }) {
    this.folderSidebarService.renameFolder(data.folderId, data.newName, () =>
      this.getCustomFolders()
    );
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



  markAllAsRead() {
    const unreadMails = this.InboxData.filter(mail => !mail.isRead);
    if (unreadMails.length === 0) return;

    const requests = unreadMails.map(mail => {
      mail.isRead = true;
      const url = `http://localhost:8080/api/mails/${mail.mailId}/read-status`;
      return this.http.patch(url, {}, { responseType: 'text' });
    });

    forkJoin(requests).subscribe({
      next: () => console.log('All requests completed'),
      error: (err) => alert('Some emails failed to update')
    });
  }

}
