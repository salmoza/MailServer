import { Component, OnInit } from '@angular/core';
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

interface MailSearchRequestDto {
  sender?: string;
  receiver?: string;
  subject?: string;
  body?: string;
}

@Component({
  selector: 'app-sent',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, ReactiveFormsModule, FormsModule, SearchBarComponent, HeaderComponent, SidebarComponent],
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

<div class="flex h-screen w-full font-inter">
  <app-sidebar
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
        <button (click)="askDelete()"
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
      <div class="relative inline-block">
        <button (click)="toggleSortMenu()"
                class="flex items-center gap-2 px-3 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg">
          Sort by: <span [textContent]="currentSort"></span>
          <span class="material-symbols-outlined text-lg">expand_more</span>
        </button>
        <div *ngIf="showSortMenu" class="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div class="py-1">
            <button (click)="setSortAndClose('Date (Newest first)')"
                    [ngClass]="{ 'bg-blue-50': currentSort === 'Date (Newest first)' }"
                    class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Date (Newest first)
            </button>
            <button (click)="setSortAndClose('Date (Oldest first)')"
                    [ngClass]="{ 'bg-blue-50': currentSort === 'Date (Oldest first)' }"
                    class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Date (Oldest first)
            </button>
            <button (click)="setSortAndClose('Subject (A → Z)')"
                    [ngClass]="{ 'bg-blue-50': currentSort === 'Subject (A → Z)' }"
                    class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Subject (A → Z)
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
              <input type="checkbox"
                     class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-0"
                     (change)="addallemails($any($event.target).checked)"
                     [checked]="Emails.length > 0 && Emails.length === SentData.length"
              />
            </th>
            <th class="py-3 pl-0 pr-4" colspan="4">
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
          <tr *ngFor="let item of SentData" class="border-t border-t-slate-200 hover:bg-slate-50 transition-colors">
            <td class="px-4 py-2">
              <input type="checkbox"
                     class="h-5 w-5 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]"
                     (change)="toggleEmailsSelected(item, $any($event.target).checked)"
                     [checked]="checked(item.mailId)"
              />
            </td>

            <td class="py-0 pl-0 pr-4" colspan="4">
              <div class="flex items-center w-full py-3 cursor-pointer" (click)="goToMailDetails(item)">
                
                <div class="px-4 text-slate-800 w-1/4 text-sm font-semibold truncate">me</div>

                <div class="px-4 text-slate-800 w-1/4 text-sm font-semibold truncate">
                  {{ (item.receiverDisplayNames?.[0]?.trim() || '') !== '' ? item.receiverDisplayNames[0] : item.receiverEmails[0] }}
                  <span *ngIf="item.receiverDisplayNames && item.receiverDisplayNames.length > 1" class="text-slate-500 text-xs ml-1">
                    +{{ item.receiverDisplayNames.length - 1 }}
                  </span>
                </div>

                <div class="px-4 w-2/5 flex items-center overflow-hidden">
                  <span class="text-slate-800 text-sm font-semibold truncate mr-2">
                    {{ item.subject || '(No Subject)' }}
                  </span>
                  <span class="text-slate-500 text-sm truncate flex-1 block">
                    {{ getSanitizedPreview(item.body) }}
                  </span>
                </div>

                <div class="px-4 text-slate-500 text-sm text-center w-1/6 whitespace-nowrap">
                  {{ formatDate(item.date) }}
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center justify-center p-4 border-t border-gray-200 bg-white mt-auto gap-2">
      <button (click)="updatePage(page - 1)" class="flex items-center justify-center text-slate-500 hover:text-primary">
        <span class="material-symbols-outlined text-lg">chevron_left</span>
      </button>
      <button *ngFor="let p of [0, 1, 2]; let i = index" (click)="updatePage(p)"
              [ngClass]="{ 'bg-primary text-white font-bold': page === p, 'bg-slate-100 text-slate-600': page !== p }"
              class="px-3 py-1 rounded-lg text-sm cursor-pointer">
        {{ i + 1 }}
      </button>
      <button (click)="updatePage(page + 1)" class="flex items-center justify-center text-slate-500 hover:text-primary">
        <span class="material-symbols-outlined text-lg">chevron_right</span>
      </button>
    </div>
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
      <span class="text-lg font-bold mt-5 text-red-600">Delete {{ Emails.length }} Email(s)</span>
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
        <button (click)="showDeleteOptions = false">Cancel</button>
      </div>
    </div>
  </div>

  <div class="move-conatiner bg-black/50" [class.active]="CustomFolderPopUp">
    <div id="Custom-container" class="content-container bg-amber-50 h-3/12">
      <input type="text" placeholder="Folder Name.." [(ngModel)]="foldername" />
      <button (click)="CreateCustomFolder(); CustomFolderPopUp = false">Create</button>
      <button (click)="CustomFolderPopUp = false">Back</button>
    </div>
  </div>
</div>
  `,
  styles: [
    `
      :host {
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        display: block;
        background-color: #f6f7f8;
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
      }
      .content-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        min-height: 300px;
        min-width: 400px;
        border-radius: 20px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        background-color: #e8e8e8;
        padding: 20px;
      }
      .buttons-folders {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .content-container button {
        padding: 10px 15px;
        border-radius: 15px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.1s ease-in-out;
      }
      .content-container button:hover {
        transform: scale(1.05);
        background-color: #3e8cf4;
        color: white;
        border: 2px solid rgba(62, 140, 244, 0.88);
      }
      #trash-btn:hover {
        border: 2px solid rgba(243, 53, 53, 0.87);
        background-color: #f6f7f8;
        color: black;
      }
      .bottom-btn {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
      }
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        line-height: 1;
      }
      .bg-primary {
        background-color: #137fec !important;
      }
      .text-primary {
        color: #137fec !important;
      }
      .bg-primary\\/20 {
        background-color: rgba(19, 127, 236, 0.2) !important;
      }
    `,
  ],
})
export class Sent implements OnInit {
  foldername: string = '';
  CustomFolderPopUp: boolean = false;
  Emails: Datafile[] = [];
  SentData: Datafile[] = [];
  CustomFolders: CustomFolderData[] = [];
  page: number = 0;
  tomove: boolean = false;
  showDeleteOptions: boolean = false;

  isSearchActive = false;
  isAdvancedSearch = false;
  currentSearchKeyword = '';
  currentAdvancedFilters: MailSearchRequestDto = {};
  showSortMenu = false;
  currentSort = 'Date (Newest first)';

  constructor(private MailDetails:MailShuttleService, protected folderStateService: FolderStateService, private http : HttpClient, private router : Router, private folderSidebarService: FolderSidebarService) {}

  ngOnInit() {
    this.getSent(this.page);
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
        'Subject (A → Z)': 'subject',
      };
      this.applySorting(sortByMap[this.currentSort], this.page);
    } else if (this.isSearchActive) {
      if (this.isAdvancedSearch) {
        this.performAdvancedSearch(this.page);
      } else {
        this.performQuickSearch(this.page);
      }
    } else {
      this.getSent(this.page);
    }
  }

  getCustomFolders() {
    let params = new HttpParams()
      .set('userId', this.folderStateService.userData().userId)
      .set('type', 'custom');
    this.http.get<CustomFolderData[]>(`http://localhost:8080/api/folders`, { params }).subscribe({
      next: (data) => (this.CustomFolders = data),
      error: (err) => alert('Failed to fetch custom folders'),
    });
  }

  getSent(page: number) {
    let params = new HttpParams()
      .set('page', page)
      .set('folderId', this.folderStateService.userData().sentFolderId!);
    this.http.get<Datafile[]>(`http://localhost:8080/api/mails`, { params }).subscribe({
      next: (res) => {
        console.log('Sent mails data:', res);
        this.SentData = res;
      },
      error: (err) => alert('Failed to fetch mails'),
    });
  }

  goToMailDetails(details: Datafile) {
    this.MailDetails.setMailData(details);
    this.MailDetails.setFromId(this.folderStateService.userData().sentFolderId!);
    this.router.navigate(['/mail']);
  }

  toggleEmailsSelected(email: Datafile, ischecked: boolean) {
    if (ischecked && !this.Emails.includes(email)) this.Emails.push(email);
    else this.Emails = this.Emails.filter((e) => e.mailId !== email.mailId);
  }

  addallemails(check: boolean) {
    this.Emails = check ? [...this.SentData] : [];
  }

  checked(id: string) {
    return this.Emails.some((e) => e.mailId === id);
  }

  delete() {
    if (!this.Emails.length) return;
    const ids = this.Emails.map((e) => e.mailId);
    const url = `http://localhost:8080/api/mails/${
      this.folderStateService.userData().sentFolderId
    }`;
    let params = new HttpParams();
    ids.forEach((id) => (params = params.append('ids', id)));

    this.http.delete(url, { params: params, responseType: 'text' }).subscribe({
      next: () => {
        this.SentData = this.SentData.filter((e) => !ids.includes(e.mailId));
        this.Emails = [];
      },
      error: () => alert('Failed to delete emails'),
    });
  }

  move(targetFolderId: string) {
    if (this.Emails.length === 0) return;

    const currentFolderId = this.folderStateService.userData().sentFolderId;

    if (!currentFolderId || !targetFolderId) {
      alert('Error: Folder ID missing.');
      return;
    }

    const mailIds = this.Emails.map((email) => email.mailId);
    const url = `http://localhost:8080/api/mails/${targetFolderId}/${currentFolderId}`;
    const payload = { ids: mailIds };

    this.http.patch(url, payload, { responseType: 'text' }).subscribe({
      next: () => {
        const movedIdsSet = new Set(mailIds);
        this.SentData = this.SentData.filter((email) => !movedIdsSet.has(email.mailId));
        this.Emails = [];
        this.tomove = false;
      },
      error: (err) => alert('Failed to move emails'),
    });
  }

  goToCustomFolder(Id: string) {
    this.MailDetails.setCustom(Id);
    this.router.navigate(['/Custom']);
  }

  CreateCustomFolder() {
    const url = 'http://localhost:8080/api/folders';
    const payload = {
      folderName: this.foldername,

      folderId: this.folderStateService.userData().inboxFolderId,

      userId: this.folderStateService.userData().userId,
    };

    this.http.post(url, payload).subscribe({
      next: () => {
        this.CustomFolderPopUp = false;
        this.getCustomFolders();
      },
      error: () => alert('Failed to create custom folder'),
    });
  }
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
    const userData = this.folderStateService.userData();
    const folderId = userData.sentFolderId;

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
        this.SentData = response;
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
    const folderId = userData.sentFolderId;

    if (!folderId) {
      console.error('folderId is missing');
      return;
    }

    let params = new HttpParams().set('folderId', folderId).set('page', page);

    // POST request with body for advanced filters
    this.http
      .post<Datafile[]>('http://localhost:8080/api/mails/filter', this.currentAdvancedFilters, {
        params,
      })
      .subscribe({
        next: (response) => {
          this.SentData = response;
          console.log('Filter results:', response);
        },
        error: (error) => {
          console.error('Filter failed:', error);
          alert('Failed to filter emails');
        },
      });
  }

  handleClearSearch() {
    this.isSearchActive = false;
    this.isAdvancedSearch = false;
    this.currentSearchKeyword = '';
    this.currentAdvancedFilters = {};
    this.page = 0;
    this.currentSort = 'Date (Newest first)';
    this.getSent(0);
  }

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
      'Subject (A → Z)': 'subject',
    };

    const sortBy = sortByMap[sortOption];

    // Call the sort endpoint
    this.applySorting(sortBy, 0);
  }

  applySorting(sortBy: string, page: number) {
    const userData = this.folderStateService.userData();
    const folderId = userData.sentFolderId;
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
        this.SentData = response;
        console.log('Sorted results:', response);
      },
      error: (error) => {
        console.error('Sort failed:', error);
        alert('Failed to sort emails');
      },
    });
  }

  getSanitizedPreview(body: string | undefined): string {
    if (!body) return '';
    return body.length > 50 ? body.substring(0, 50) + '...' : body;
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
  askDelete() {
    if (this.Emails.length > 0) {
      this.showDeleteOptions = true;
    }
  }

  moveToTrash() {
    if (!this.Emails.length) return;
    const ids = this.Emails.map((e) => e.mailId);
    const url = `http://localhost:8080/api/mails/${
      this.folderStateService.userData().sentFolderId
    }`;
    let params = new HttpParams();
    ids.forEach((id) => (params = params.append('ids', id)));

    this.http.delete(url, { params: params, responseType: 'text' }).subscribe({
      next: () => {
        this.SentData = this.SentData.filter((e) => !ids.includes(e.mailId));
        this.Emails = [];
        this.showDeleteOptions = false;
      },
      error: () => alert('Failed to move emails to Trash'),
    });
  }

  deleteForever() {
    if (this.Emails.length === 0) return;
    const ids = this.Emails.map((e) => e.mailId);

    const url = `http://localhost:8080/api/mails`;

    this.http.request('delete', url, { body: ids, responseType: 'text' }).subscribe({
      next: () => {
        const deletedIdsSet = new Set(ids);
        this.SentData = this.SentData.filter((email) => !deletedIdsSet.has(email.mailId));
        this.Emails = [];
        this.showDeleteOptions = false;
        console.log('Deleted Forever');
      },
      error: (err) => alert('Failed to delete emails forever'),
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

  handleFolderClick(folderId: string) {
    this.folderSidebarService.navigateToCustomFolder(folderId);
  }

  handleCreateFolder() {
    this.CustomFolderPopUp = this.folderSidebarService.openCreateFolderModal();
  }

  handleRenameFolder(data: {folderId: string, newName: string}) {
    this.folderSidebarService.renameFolder(data.folderId, data.newName, () => this.getCustomFolders());
  }

  handleDeleteFolder(folderId: string) {
    this.folderSidebarService.deleteFolder(folderId, () => this.getCustomFolders());
  }

  getCurrentFolderId(): string {
    return this.folderSidebarService.getActiveCustomFolderId();
  }


}
