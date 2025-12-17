import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomFolderData } from '../../Dtos/datafile';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <aside class="flex h-full w-[260px] flex-col border-r border-slate-200 bg-white p-4 sticky top-0">
      <div class="flex h-full flex-col justify-between">
        <div class="flex flex-col gap-6">
          <!-- User Info -->
          <div class="flex items-center gap-3 px-2">
            <div class="flex flex-col">
              <h1 class="text-gray-900 text-base font-medium leading-normal">
                {{ username }}
              </h1>
              <p class="text-gray-500 text-sm font-normal leading-normal">
                {{ userEmail }}
              </p>
            </div>
          </div>

          <!-- Compose Button -->
          <button [routerLink]="['/compose']"
            class="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold">
            Compose
          </button>

          <!-- Default Folders -->
          <div class="flex flex-col gap-1">
            <a [routerLink]="['/inbox']" routerLinkActive="bg-primary/20" 
               class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-800">inbox</span>
              <p class="text-slate-800 text-sm font-medium">Inbox</p>
            </a>

            <a [routerLink]="['/sent']" routerLinkActive="bg-primary/20"
               class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">send</span>
              <p class="text-slate-600 text-sm font-medium">Sent</p>
            </a>

            <a [routerLink]="['/drafts']" routerLinkActive="bg-primary/20"
               class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">draft</span>
              <p class="text-slate-600 text-sm font-medium">Drafts</p>
            </a>

            <a [routerLink]="['/trash']" routerLinkActive="bg-primary/20"
               class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">delete</span>
              <p class="text-slate-600 text-sm font-medium">Trash</p>
            </a>

            <a [routerLink]="['/contacts']" routerLinkActive="bg-primary/20"
               class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">contacts</span>
              <p class="text-slate-600 text-sm font-medium">Contacts</p>
            </a>

            <a [routerLink]="['/filters']" routerLinkActive="bg-primary/20"
               class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
              <span class="material-symbols-outlined text-slate-600">filter_alt</span>
              <p class="text-slate-600 text-sm font-medium">Filters</p>
            </a>
          </div>

          <!-- Custom Folders -->
          <div class="flex flex-col gap-1 mt-4">
            <div class="flex items-center justify-between px-3 py-2">
              <h2 class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Custom Folders
              </h2>
              <button class="text-slate-500 hover:text-primary" (click)="onCreateFolder()">
                <span class="material-symbols-outlined text-base">add</span>
              </button>
            </div>

            <div *ngFor="let custom of customFolders" 
                 class="group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100"
                 [class.bg-primary/20]="custom.folderId === activeCustomFolderId"
                 (click)="onFolderClick(custom.folderId)">
              
              <span class="material-symbols-outlined text-slate-600">folder</span>
              
              <p class="text-slate-600 text-sm font-medium flex-1 truncate">
                {{ custom.folderName }}
              </p>

              <!-- Action Icons (shown on hover) -->
              <div class="hidden group-hover:flex items-center gap-1">
                <button (click)="onRenameFolder(custom, $event)"
                        class="p-1 hover:bg-slate-200 rounded transition-colors"
                        title="Rename folder">
                  <span class="material-symbols-outlined text-base text-slate-600">edit</span>
                </button>
                <button (click)="onDeleteFolder(custom.folderId, $event)"
                        class="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Delete folder">
                  <span class="material-symbols-outlined text-base text-red-600">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Rename Modal -->
    <div class="move-conatiner bg-black/50" [class.active]="showRenameModal">
      <div class="content-container bg-white" style="min-height: 200px; gap: 20px; padding: 30px;">
        <h3 class="text-lg font-bold text-slate-800">Rename Folder</h3>
        
        <input type="text" 
               [(ngModel)]="newFolderName"
               placeholder="New folder name..."
               class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-primary focus:outline-none"
               (keyup.enter)="confirmRename()">
        
        <div class="flex gap-3 w-full">
          <button (click)="confirmRename()"
                  class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
            Rename
          </button>
          <button (click)="cancelRename()"
                  class="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="move-conatiner bg-black/50" [class.active]="showDeleteConfirm">
      <div class="content-container bg-white" style="min-height: 200px; gap: 20px; padding: 30px;">
        <span class="material-symbols-outlined text-red-600" style="font-size: 48px;">warning</span>
        <h3 class="text-lg font-bold text-slate-800">Delete Folder?</h3>
        <p class="text-slate-600 text-center">
          Are you sure you want to delete this folder?
          Emails will be moved to their original folder.
        </p>
        
        <div class="flex gap-3 w-full">
          <button (click)="confirmDelete()"
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
          <button (click)="cancelDelete()"
                  class="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }
    
    .bg-primary {
      background-color: #137fec !important;
    }
    
    .bg-primary\\/20 {
      background-color: rgba(19, 127, 236, 0.2) !important;
    }

    .move-conatiner {
      visibility: hidden;
      opacity: 0;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: all 0.2s ease-in;
    }

    .move-conatiner.active {
      visibility: visible;
      opacity: 1;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 400px;
      border-radius: 20px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() username: string = '';
  @Input() userEmail: string = '';
  @Input() customFolders: CustomFolderData[] = [];
  @Input() activeCustomFolderId: string = '';
  
  @Output() folderClick = new EventEmitter<string>();
  @Output() createFolder = new EventEmitter<void>();
  @Output() renameFolder = new EventEmitter<{folderId: string, newName: string}>();
  @Output() deleteFolder = new EventEmitter<string>();

  showRenameModal = false;
  showDeleteConfirm = false;
  newFolderName = '';
  folderToRename: CustomFolderData | null = null;
  folderToDelete: string = '';

  ngOnInit() {}

  onFolderClick(folderId: string) {
    this.folderClick.emit(folderId);
  }

  onCreateFolder() {
    this.createFolder.emit();
  }

  onRenameFolder(folder: CustomFolderData, event: Event) {
    event.stopPropagation();
    this.folderToRename = folder;
    this.newFolderName = folder.folderName;
    this.showRenameModal = true;
  }

  confirmRename() {
    if (this.folderToRename && this.newFolderName.trim()) {
      this.renameFolder.emit({
        folderId: this.folderToRename.folderId,
        newName: this.newFolderName.trim()
      });
      this.cancelRename();
    }
  }

  cancelRename() {
    this.showRenameModal = false;
    this.folderToRename = null;
    this.newFolderName = '';
  }

  onDeleteFolder(folderId: string, event: Event) {
    event.stopPropagation();
    this.folderToDelete = folderId;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.folderToDelete) {
      this.deleteFolder.emit(this.folderToDelete);
      this.cancelDelete();
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.folderToDelete = '';
  }

  
}