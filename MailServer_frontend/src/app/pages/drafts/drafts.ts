import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MailDetail } from '../mail-detail/mail-detail';
import { MailShuttleService } from '../../Dtos/MailDetails';
import { attachment, CustomFolderData, Datafile } from '../../Dtos/datafile';
import { FolderStateService } from '../../Dtos/FolderStateService';
import { HttpClient, HttpClientModule, HttpParams, HttpHeaders } from '@angular/common/http';
import { att } from '../compose/compose';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { HeaderComponent } from '../../header';
import { PaginationFooterComponent } from '../../components/pagination-footer/pagination-footer';
import { PaginationService } from '../../services/pagination.service';
import { SidebarComponent } from '../../components/side-bar/side-bar';
import { FolderSidebarService } from '../../services/folder-sidebar.service';

// Interface for Advanced Search
interface MailSearchRequestDto {
  sender?: string;
  receiver?: string;
  subject?: string;
  body?: string;
}

// Interface for Snapshots
interface MailSnapshot {
  snapshotId: string;
  userId: string;
  senderEmail: string;
  priority: number;
  subject: string;
  body: string;
  receiverEmails: string[];
  savedAt: string;
  attachments?: any[];
}

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, HttpClientModule, FormsModule, SearchBarComponent, HeaderComponent, SidebarComponent, PaginationFooterComponent],
  template: `
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />

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
            <button (click)="delete()" class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" [disabled]="Emails.length === 0" title="Delete Forever">
              <span class="material-symbols-outlined">delete_forever</span>
            </button>
            <button (click)="refreshData()" class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 cursor-pointer" title="Reload Emails">
              <span class="material-symbols-outlined">refresh</span>
            </button>
          </div>
          <div class="relative inline-block">
            <button (click)="toggleSortMenu()" class="flex items-center gap-2 px-3 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg">
              Sort by: <span [textContent]="currentSort"></span>
              <span class="material-symbols-outlined text-lg">expand_more</span>
            </button>
            <div *ngIf="showSortMenu" class="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
              <div class="py-1">
                <button (click)="setSortAndClose('Date (Newest first)')" [ngClass]="{'bg-blue-50': currentSort === 'Date (Newest first)'}" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Date (Newest first)</button>
                <button (click)="setSortAndClose('Date (Oldest first)')" [ngClass]="{'bg-blue-50': currentSort === 'Date (Oldest first)'}" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Date (Oldest first)</button>
                <button (click)="setSortAndClose('Subject (A → Z)')" [ngClass]="{'bg-blue-50': currentSort === 'Subject (A → Z)'}" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Subject (A → Z)</button>
                <button (click)="setSortAndClose('Priority')" [ngClass]="{'bg-blue-50': currentSort === 'Priority'}" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Priority</button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 px-6 py-4 overflow-x-hidden">
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="flex overflow-hidden rounded-lg shadow-sm">
              <table class="w-full text-left table-fixed">
                <thead class="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 w-12">
                      <input class="h-5 w-5 rounded border-gray-300 bg-transparent text-[#137fec] focus:ring-1 focus:ring-[#137fec]" type="checkbox" #checkbox (click)="addallemails(checkbox.checked)" />
                    </th>
                    <th class="px-4 py-3 w-1/4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Receiver</th>
                    <th class="px-4 py-3 w-1/2 text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                    <th class="px-4 py-3 w-1/6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for(item of DraftData ; track $index) {
                    <tr class="border-b bg-blend-color group items-center hover:bg-slate-50 transition-colors">
                      <td class="h-[72px] px-4 py-2 w-12">
                        <input class="h-5 w-5 rounded border-gray-300 bg-transparent text-[#137fec] focus:ring-1 focus:ring-[#137fec]" type="checkbox" #checkbox (change)="toggleEmailsSelected(item,checkbox.checked)" [checked]="checked(item.mailId)" />
                      </td>
                      <td class="h-[72px] px-4 py-2 text-gray-900 text-sm font-normal leading-normal truncate">
                        <div style="display: flex ; flex-direction: column; gap:2px;width: 100%">
                          @for(email of item.receiverEmails; track $index) {
                            <span>{{email}}</span>
                          }
                        </div>
                      </td>
                      <td class="h-[72px] px-4 py-2 text-gray-500 text-sm font-normal leading-normal truncate">
                        {{item.subject || '(No Subject)'}}
                      </td>
                      <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button (click)="openEdit(item.mailId)" class="p-2 flex items-center text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-4xl transition-transform duration-100 hover:scale-105" title="Edit Draft">
                            <span class="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button (click)="openSnapshots(item.mailId)" class="p-2 flex items-center text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-4xl transition-transform duration-100 hover:scale-105" title="Version History">
                             <span class="material-symbols-outlined text-xl">history</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

          <app-pagination-footer
            [contextKey]="paginationKey"
            [pages]="paginationPages"
            [canGoNext]="canGoNext"
          ></app-pagination-footer>
      </main>

      <div class="popup" [class.active]="isopen">
        <div class="relative flex h-full w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          <div class="flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10 dark:bg-[#101922] dark:ring-white/10">

            <header class="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3 shrink-0">
              <h3 class="text-lg font-semibold text-gray-800">Edit Draft</h3>
              <button class="cursor-pointer flex items-center p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 focus:outline-none" (click)="isopen=false"><span class="material-symbols-outlined text-xl">close</span></button>
            </header>

            <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white">
              <div class="flex items-center border-b border-gray-200 pb-2">
                <label class="w-16 text-sm font-medium text-gray-600" for="to">To</label>
                <div class="flex-1 flex items-center space-x-2">
                  @for(email of recipients;track email){
                    <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">{{email}}<button (click)="removeRecipient(email)" class="ml-2 text-red-600 hover:text-red-900 cursor-pointer">&times;</button></span>
                  }
                  <input class="form-input w-full flex-1 resize-none border-none bg-transparent p-2 focus:outline-0 focus:ring-0" id="to" placeholder="Recipients" type="email" name="current_receiver" [(ngModel)]="currentEmailInput" (keydown.enter)="addRecipient($event)" (keydown.tab)="addRecipient($event)" />
                </div>
              </div>
              <div class="flex items-center border-b border-gray-200">
                <label class="w-16 text-sm font-medium text-gray-600" for="subject">Subject</label>
                <input class="form-input w-full flex-1 resize-none border-none bg-transparent p-2 focus:outline-0 focus:ring-0" id="subject" placeholder="Subject" type="text" name="subject" [(ngModel)]="subject" />
              </div>
              <div>
                <div class="bord border-gray-600 border-2 rounded-2xl">
                  <textarea class="form-textarea w-full h-48 p-3 border-none resize-y focus:ring-0 text-black bg-white" placeholder="Compose your message..." [(ngModel)]="body"></textarea>
                </div>
              </div>
              <div (click)="openFileUpload()" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
                <p class="text-sm text-gray-500">click to upload.</p>
              </div>
              <input #fileInput type="file" (change)="handleFileupload($event)" hidden name="upload_file_input" />
              @for(item of attachments;track item){
                <div class="space-y-2"><div class="flex items-center justify-between p-2 bg-gray-100 rounded-lg"><div class="flex items-center space-x-2"><span class="material-symbols-outlined text-gray-500">{{item.name}}</span><span class="text-sm font-medium text-gray-700">{{item.filetype}}</span><span class="text-xs text-gray-500">{{item.sizeMB}}</span></div><button (click)="removeNewAttachment(item.id)" class="cursor-pointer p-1 inline-flex items-center rounded-full align-middle text-gray-500 hover:bg-gray-400"><span class="material-symbols-outlined text-lg">close</span></button></div></div>
              }
              <div class="space-y-2">
                @for(item of oldattachments;track item){
                  <div class="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-300"><div class="flex items-center space-x-2"><span class="material-symbols-outlined text-gray-500">{{item.fileName}}</span><span class="text-sm font-medium text-gray-700">{{item.filetype}}</span><span class="text-xs text-gray-500">{{item.fileSize}}</span></div><button (click)="removeoldAttachment(item.id)" class="cursor-pointer p-1 inline-flex items-center rounded-full align-middle text-gray-500 hover:bg-gray-200"><span class="material-symbols-outlined text-lg">close</span></button></div>
                }
              </div>
            </div>

            <footer class="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-gray-50 shrink-0">
              <div class="flex items-center space-x-2 mb-4 sm:mb-0">
                <button (click)="SentDraft()" class="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0D6EFD] rounded-lg shadow-sm hover:bg-[#0D6EFD]/80 focus:outline-none"><span>Send</span></button>
                <button (click)="SaveDraft();" class="cursor-pointer px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none">Save Draft</button>
              </div>
              <div class="flex items-center space-x-2">
                <div class="flex items-center gap-1"><span class="text-sm font-medium text-gray-600">Priority:</span>
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button (click)="priority=4" class="px-2 py-1 text-sm cursor-pointer rounded-l-md border-r border-gray-300" [class.bg-gray-500]="priority === 4" [class.text-white]="priority === 4">4</button>
                    <button (click)="priority=3" class="px-2 py-1 cursor-pointer text-sm" [class.bg-blue-100]="priority === 3" [class.text-blue-800]="priority === 3">3</button>
                    <button (click)="priority=2" class="px-2 py-1 text-sm text-yellow-600 cursor-pointer" [class.bg-yellow-300]="priority === 2" [class.text-yellow-800]="priority === 2">2</button>
                    <button (click)="priority=1" class="px-2 py-1 text-sm text-red-600 cursor-pointer rounded-r-md border-l border-gray-300" [class.bg-red-100]="priority === 1" [class.text-red-800]="priority === 1">1</button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <div class="popup" [class.active]="isSnapshotPopupOpen">
        <div class="relative flex h-full w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          <div class="flex w-full max-w-5xl h-[80vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10">

            <header class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div>
                <h3 class="text-xl font-bold text-gray-800">Version History</h3>
                <p class="text-sm text-gray-500">Select a previous version to preview or restore.</p>
              </div>
              <button class="cursor-pointer flex items-center p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 focus:outline-none" (click)="closeSnapshotModal()">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </header>

            <div class="flex flex-1 overflow-hidden">

              <div class="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
                @if(snapshots.length === 0) {
                  <div class="p-6 text-center text-gray-500 italic">No history available.</div>
                }
                @for(snap of snapshots; track snap.snapshotId) {
                  <div (click)="viewSnapshotDetails(snap)"
                       class="cursor-pointer p-4 border-b border-gray-200 hover:bg-white transition-colors"
                       [ngClass]="{'bg-white border-l-4 border-l-blue-500': selectedSnapshot?.snapshotId === snap.snapshotId, 'border-l-4 border-l-transparent': selectedSnapshot?.snapshotId !== snap.snapshotId}">
                    <div class="flex justify-between items-start mb-1">
                      <span class="font-medium text-gray-900">{{ snap.savedAt | date:'medium' }}</span>
                    </div>
                    <div class="text-sm text-gray-600 truncate">{{ snap.subject || '(No Subject)' }}</div>
                    <div class="mt-2 flex gap-2">
                       <span class="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">Priority: {{snap.priority}}</span>
                       @if(snap.attachments && snap.attachments.length > 0) {
                         <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                           <span class="material-symbols-outlined text-[10px]">attachment</span> {{snap.attachments.length}}
                         </span>
                       }
                    </div>
                  </div>
                }
              </div>

              <div class="w-2/3 flex flex-col bg-white overflow-hidden">
                @if(selectedSnapshot) {
                  <div class="flex-1 overflow-y-auto p-6">

                    <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6 space-y-3">
                      <div class="flex gap-2">
                        <span class="font-semibold text-gray-600 w-20">Subject:</span>
                        <span class="text-gray-900 font-medium">{{ selectedSnapshot.subject }}</span>
                      </div>
                      <div class="flex gap-2">
                        <span class="font-semibold text-gray-600 w-20">To:</span>
                        <div class="flex flex-wrap gap-1">
                          @for(rec of selectedSnapshot.receiverEmails; track $index) {
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{{ rec }}</span>
                          }
                        </div>
                      </div>
                      @if(selectedSnapshot.attachments && selectedSnapshot.attachments.length > 0) {
                        <div class="flex gap-2">
                          <span class="font-semibold text-gray-600 w-20">Files:</span>
                          <div class="flex flex-col gap-1">
                            @for(att of selectedSnapshot.attachments; track $index) {
                               <span class="text-sm text-gray-700 flex items-center gap-1">
                                  <span class="material-symbols-outlined text-sm">description</span> {{att.filename}}
                               </span>
                            }
                          </div>
                        </div>
                      }
                    </div>

                    <div class="prose max-w-none text-gray-800 whitespace-pre-wrap">
                      {{ selectedSnapshot.body }}
                    </div>
                  </div>

                  <div class="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button (click)="closeSnapshotModal()" class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-medium">Cancel</button>
                    <button (click)="restoreSnapshot(selectedSnapshot.snapshotId)" class="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 shadow-sm font-medium flex items-center gap-2">
                      <span class="material-symbols-outlined text-lg">restore</span>
                      Restore this Version
                    </button>
                  </div>
                } @else {
                  <div class="flex h-full items-center justify-center text-gray-400 flex-col gap-2">
                    <span class="material-symbols-outlined text-5xl">history_edu</span>
                    <p>Select a snapshot to preview</p>
                  </div>
                }
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="popup" [class.active]="CustomFolderPopUp" style="background-color: rgba(0,0,0,0.5);">
        <div class="bg-amber-50 rounded-xl p-8 flex flex-col gap-5 shadow-xl w-96">
          <h2 class="text-xl font-bold text-center text-gray-800">New Folder</h2>
          <input type="text" placeholder="Folder Name..." [(ngModel)]="foldername" class="p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"/>
          <div class="flex justify-between mt-4">
            <button (click)="CustomFolderPopUp = false" class="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100">Cancel</button>
            <button (click)="CreateCustomFolder()" class="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Create</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    :host {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: block;
      background-color: #f6f7f8;
    }
    :host *{
      color: inherit !important;
    }
    .bg-primary span, .bg-primary {
      color: #ffffff !important;
    }
    :host .text-gray-500 {
      color: #6b7280 !important;
    }
    .bord{
      margin:5px;
      padding:5px;
    }
    .bord text{
      border-radius: 20px;
    }
    button{
      transition: all 0.3s ease-in-out;
    }
    button.active {
      transform: scale(0.95);
    }
    .popup{
      opacity: 0;
      width: 100%;
      height: 100%;
      position: fixed;
      background-color: rgba(0,0,0,0.4);
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      visibility: hidden;
      transition: all 0.1s ease-in;
      z-index: 10000;
    }
    .popup.active {
      visibility: visible;
      opacity: 1;
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }
    .form-textarea:focus {
      box-shadow: none !important;
      border-color: transparent !important;
      outline: none !important;
      --tw-ring-color: transparent !important;
      border-radius: 20px;
    }
    .text-primary, .hover\\:text-primary { color: #137fec !important; }
    .bg-primary { background-color: #137fec !important; }
    .border-primary { border-color: #137fec !important; }
    .bg-primary\\/20 { background-color: rgba(19, 127, 236, 0.2) !important; }
  `],
})
export class Drafts implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(
      private http: HttpClient,
      protected folderStateService: FolderStateService,
      private route: Router,
      private Shuffler: MailShuttleService, private paginationService: PaginationService,
      private folderSidebarService: FolderSidebarService
  ) {}

  page=0;
  showSortMenu = false;
  currentSort = 'Date (Newest first)';
  readonly paginationKey = 'drafts';
  readonly pageSize = 10;
  paginationPages: number[] = [0];
  canGoNext = true;
  DraftId:string='';
  currentEmailInput:string='';
  isopen:boolean = false;
  recipients:string[]=[];
  subject:string='';
  body:string='';
  priority:number=4;
  attachments: att[] = [];
  oldattachments:attachment[]=[];
  maildId:string='';
  Emails:Datafile[]=[];
  CustomFolderPopUp:boolean = false;
  CustomFolders:CustomFolderData[]=[];
  DraftData:Datafile[]=[];
  foldername: string = '';


  isSearchActive = false;
  isAdvancedSearch = false;
  currentSearchKeyword = '';
  currentAdvancedFilters: MailSearchRequestDto = {};


  isSnapshotPopupOpen = false;
  currentDraftIdForSnapshots = '';
  snapshots: MailSnapshot[] = [];
  selectedSnapshot: MailSnapshot | null = null;

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
    }
    else {
      this.applySorting('date_desc', this.page);
    }
  }

  refreshData() {
    this.Emails = [];
    this.paginationService.setPage(this.paginationKey, this.page);
  }



  openSnapshots(draftId: string) {
    this.currentDraftIdForSnapshots = draftId;
    this.selectedSnapshot = null;
    this.snapshots = [];


    this.http.get<MailSnapshot[]>(`http://localhost:8080/api/drafts/${draftId}/snapshots`)
      .subscribe({
        next: (data) => {

          this.snapshots = data.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
          this.isSnapshotPopupOpen = true;


          if (this.snapshots.length > 0) {
            this.selectedSnapshot = this.snapshots[0];
          }
        },
        error: (err) => {
          console.error(err);
          alert('Failed to load version history.');
        }
      });
  }

  viewSnapshotDetails(snapshot: MailSnapshot) {
    this.selectedSnapshot = snapshot;
  }

  restoreSnapshot(snapshotId: string) {
    if (!confirm('Are you sure you want to restore this version? The current draft will be overwritten.')) {
      return;
    }

    const url = `http://localhost:8080/api/drafts/${this.currentDraftIdForSnapshots}/${snapshotId}`;

    this.http.put(url, {}, { responseType: 'text' }).subscribe({
      next: (response) => {
        alert('Draft restored successfully!');
        this.isSnapshotPopupOpen = false; // Close modal
        this.refreshData(); // Refresh main list
      },
      error: (err) => {
        console.error(err);
        alert('Failed to restore snapshot.');
      }
    });
  }

  closeSnapshotModal() {
    this.isSnapshotPopupOpen = false;
    this.snapshots = [];
    this.selectedSnapshot = null;
  }



  handleSearch(criteria: any) {
    console.log('Search criteria:', criteria);
    this.page = 0;

    if (criteria?.keywords) {
      this.isSearchActive = true;
      this.isAdvancedSearch = false;
      this.currentSearchKeyword = criteria.keywords;
      this.currentAdvancedFilters = {};
      this.currentSort = 'Date (Newest first)';
      this.page = 0;
    } else if (criteria?.advancedSearch) {
      this.isSearchActive = true;
      this.isAdvancedSearch = true;
      this.currentAdvancedFilters = criteria.advancedSearch;
      this.currentSearchKeyword = '';
      this.currentSort = 'Date (Newest first)';
      this.page = 0;
    } else {
      this.handleClearSearch();
      return;
    }

    this.resetPaginationState();
    this.paginationService.setPage(this.paginationKey, 0);
  }

  performQuickSearch(page: number) {
    const userData: UserData = this.folderStateService.userData();

    const folderId = userData.draftsFolderId;

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

        this.DraftData = response;
        this.Emails = [];
        console.log('Search results:', response);
      },
      error: (error) => {
        console.error('Search failed:', error);
        alert('Failed to search drafts');
      },
    });
  }

  performAdvancedSearch(page: number) {
    const userData: UserData = this.folderStateService.userData();

    const folderId = userData.draftsFolderId;

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

          this.DraftData = response;
          this.Emails = [];
          console.log('Filter results:', response);
        },
        error: (error) => {
          console.error('Filter failed:', error);
          alert('Failed to filter drafts');
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
    this.resetPaginationState();
    this.paginationService.setPage(this.paginationKey, 0);
  }

  applySorting(sortBy: string, page: number) {
    const userData: UserData = this.folderStateService.userData();
    const folderId = userData.draftsFolderId;
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

        this.DraftData = response;
        console.log('Drafts loaded:', response);
      },
      error: (error) => {
        console.error('Failed to load drafts:', error);
        alert('Failed to load drafts');
      }
    });
  }

  toggleSortMenu() {
    this.showSortMenu = !this.showSortMenu;
  }

  setSortAndClose(sortOption: string) {
    this.currentSort = sortOption;
    this.showSortMenu = false;
    this.page = 0;
    this.resetPaginationState();
    this.paginationService.setPage(this.paginationKey, 0);
  }

  getCustomFolders(){
    const url = "http://localhost:8080/api/folders";
    let param = new HttpParams;
    param = param.set("userId", this.folderStateService.userData().userId)
    .set("type", "custom");
    this.http.get<CustomFolderData[]>(url,{params:param}).subscribe({
      next: data => {
        this.CustomFolders = data;
      },
      error: err => {
        alert("failed to fetch custom folders");
      }
    })
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
        // Sync with server in background
        this.getCustomFolders();
      },
      error: (respones) => {
        alert('failed to create custom folder');
      },
    });
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
      this.Emails = [...this.DraftData];
    }
    else{
      this.Emails=[];
    }
  }

  checked(id:string){
    const emailIndex = this.Emails.findIndex(e => e.mailId === id);
    return emailIndex != -1;
  }

  openEdit(id:string){
    this.DraftId = id;
    this.attachments=[];
    this.oldattachments=[];
    this.currentEmailInput='';
    this.http.get<Datafile>(`http://localhost:8080/api/mails/${this.folderStateService.userData().draftsFolderId}/${id}`).subscribe({
      next: (mail) => {
        this.recipients=mail.receivers || mail.receiverEmails;
        this.subject=mail.subject;
        this.body=mail.body;
        this.priority=mail.priority;
        this.oldattachments = mail.attachments;
        this.maildId=mail.mailId;
        this.isopen=true;
        this.attachments=[];
      },
      error: (err) => {
        alert("failed to get data");
      }
    });
  }

  removeRecipient(toremoveemail: string): void {
    this.recipients = this.recipients.filter(email => email !== toremoveemail);
  }

  addRecipient(event: Event | null): void {
    if (event) {
      event.preventDefault();
    }
    const email = this.currentEmailInput;
    if (email && this.isVaildEmail(email)) {
      if (!this.recipients.includes(email)) {
        this.http.get<boolean>(`http://localhost:8080/api/mails/valid/${email}`,).subscribe({
          next: (r:boolean) => {
            if(r){
              this.recipients.push(email);}
            else{
              alert(`Email doesn't exist: ${email}`);
            }
          },
          error: e => {
            alert(e.error.error);
          }
        })
      }
      this.currentEmailInput = '';
    }
  }

  isVaildEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  openFileUpload() {
    this.fileInput.nativeElement.click();
  }

  handleFileupload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      const newAtt: att = {
        id: crypto.randomUUID(),
        name: file.name,
        filetype: file.type,
        fileData: file,
        sizeMB: this.formatFileSize(file.size),
        mailId: this.maildId
      };
      this.attachments.push(newAtt);
      target.value = '';
    }
  }

  private formatFileSize(bytes: number) {
    const KB = bytes / 1024;
    if (KB < 1024) {
      return `${KB.toFixed(1)} KB`
    }
    const MB = KB / 1024;
    return `${MB.toFixed(2)} MB`;
  }

  removeNewAttachment(attId: string) {
    this.attachments = this.attachments.filter(att => att.id !== attId);
  }

  async SentDraft() {
    try {

      await this.UpdateDraftBase();


      if (this.attachments.length > 0) {
        await this.DraftUploadAtt(this.DraftId);
      }


      await this.Sent();

      this.isopen = false;
    } catch (error) {
      console.error("Error sending draft:", error);
      alert("Failed to send draft. Please try again.");
    }
  }
  private async uploadAndSend() {
    try {
      await this.UpdateDraftBase();
      const mailIds = this.DraftId;
      await this.delay(500);
      await this.uploadAttachments(mailIds);
      await this.Sent();
      let emailIndex = this.DraftData.findIndex(e => e.mailId === this.DraftId);
      if(emailIndex > -1) {
      this.DraftData.splice(emailIndex, 1);
      this.DraftData = [...this.DraftData];
      }
    } catch (error) {
      console.log(error);
    }
  }

  private Sent(): Promise<string> {
    const p = lastValueFrom(
      this.http.post(`http://localhost:8080/api/drafts/${this.DraftId}/send` , {} ,
        { responseType: 'text' })
    );

    let emailIndex = this.DraftData.findIndex(e => e.mailId === this.DraftId);
    if(emailIndex > -1) {
      this.DraftData.splice(emailIndex, 1);
      this.DraftData = [...this.DraftData];
    }
    return p;
  }

  private uploadAttachments(mailId: string) {
    const uploadPromises = this.attachments.map(att => {
      const formData = new FormData();
      formData.append('file', att.fileData, att.name);
      formData.append('mailIds', mailId);
      return this.http.post("http://localhost:8080/api/attachments", formData,{responseType:'text'}).toPromise();
    });
    return Promise.all(uploadPromises);
  }

  SaveDraft() {
    if (this.attachments.length > 0) {
      this.uploadAndSaveDraft();
    } else {
      this.UpdateDraftBase();
    }
    this.isopen=false;
  }

  private UpdateDraftBase(): Promise<string> {
    const payload = {
      subject: this.subject,
      body: this.body,
      priority: this.priority,
      receivers: this.recipients,
      sender: this.folderStateService.userData().email,
      attachments:this.oldattachments,
    };
    return lastValueFrom(
      this.http.put(`http://localhost:8080/api/drafts/${this.DraftId}`, payload,{responseType:"text"})
    );
  }

 /* private async uploadAndSaveDraft() {
    try {
      await this.UpdateDraftBase();
      await this.DraftUploadAtt(this.DraftId);
    } catch (error) {
      console.log(error);
    }
  }*/

  private async uploadAndSaveDraft() {
    try {

      await this.DraftUploadAtt(this.DraftId);


      await this.UpdateDraftBase();


      this.attachments = [];

    } catch (error) {
      console.log(error);
    }
  }

  private DraftUploadAtt(mailId: string) {
    const uploadPromises = this.attachments.map(att => {
      const formData = new FormData();
      formData.append('file', att.fileData, att.name);
      formData.append('mailIds', mailId);
      return this.http.post("http://localhost:8080/api/attachments", formData , { responseType: 'text' }).toPromise();
    });
    return Promise.all(uploadPromises);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* removeoldAttachment(id: string) {
    const url = `http://localhost:8080/api/attachments/delete/${id}`;
    const previousAtt = [...this.oldattachments];
    this.oldattachments = this.oldattachments.filter(att => att.id !== id);
    this.http.delete(url, {responseType:'text'}).subscribe({
      next: (response) => {
        this.updateDraftDataCache(this.DraftId,this.oldattachments)
      },
      error: (error) => {
        alert("failed to remove attachment");
        this.oldattachments = previousAtt;
      }
    });
  } */

  removeoldAttachment(id: string) {
    const url = `http://localhost:8080/api/attachments/delete/${id}`;
    const previousAtt = [...this.oldattachments];


    this.oldattachments = this.oldattachments.filter(att => att.id !== id);

    this.http.delete(url, {responseType:'text'}).subscribe({
      next: (response) => {
        this.updateDraftDataCache(this.DraftId, this.oldattachments);


        this.UpdateDraftBase();
      },
      error: (error) => {
        alert("failed to remove attachment");

        this.oldattachments = previousAtt;
      }
    });
  }

  private updateDraftDataCache(mailId: string, updatedAttachments: attachment[]) {
    const draftIndex = this.DraftData.findIndex(d => d.mailId === mailId);
    if (draftIndex > -1) {
      const updatedDraft = { ...this.DraftData[draftIndex] };
      updatedDraft.attachmentMetadata = updatedAttachments;
      this.DraftData[draftIndex] = updatedDraft;
      this.DraftData = [...this.DraftData];
    }
  }

  delete() {
    if (this.Emails.length == 0) return;


    const ids = this.Emails.map(email => email.mailId);


    const url = `http://localhost:8080/api/drafts`;


    ids.forEach((id) => {
      const emailIndex = this.DraftData.findIndex((e) => e.mailId === id);
      if (emailIndex > -1) this.toggleEmailsSelected(this.DraftData[emailIndex], false);
    });


    this.http.request('delete', url, { body: ids, responseType: 'text' }).subscribe({
      next: (response) => {

        const deletedIdsSet = new Set(ids);
        this.DraftData = this.DraftData.filter((email) => !deletedIdsSet.has(email.mailId));
        this.Emails = [];
        console.log("Deleted Drafts Successfully");
      },
      error: (err) => {
        console.error(err);
        alert("Failed to delete drafts");

      }
    })
  }

  protected readonly MailDetail = MailDetail;
  protected readonly MailShuttleService = MailShuttleService;
  protected readonly FolderStateService = FolderStateService;
}
