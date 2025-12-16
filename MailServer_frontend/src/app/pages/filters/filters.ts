import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FolderStateService } from '../../Dtos/FolderStateService';
import { CustomFolderData } from '../../Dtos/datafile';
import {MailShuttleService} from '../../Dtos/MailDetails';
import {SearchBarComponent} from '../../components/search-bar/search-bar';

interface MailFilter {
  filterId?: string;
  userId: string;
  field: string;
  operator: string;
  filterValue: string;
  targetFolder: string;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    <div class="flex h-screen w-full">
      <!-- SideNavBar -->
      <!-- <aside class="flex h-full w-[260px] flex-col border-r border-slate-200 bg-white p-4 sticky top-0">
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
              <a [routerLink]="['/inbox']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600">inbox</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Inbox</p>
              </a>
              <a [routerLink]="['/sent']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600">send</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Sent</p>
              </a>
              <a [routerLink]="['/drafts']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600">draft</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Drafts</p>
              </a>
              <a [routerLink]="['/trash']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600">delete</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Trash</p>
              </a>
              <a [routerLink]="['/contacts']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600">contacts</span>
                <p class="text-slate-600 text-sm font-medium leading-normal">Contacts</p>
              </a>
              <a [routerLink]="['/filters']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20"
              >
                <span class="material-symbols-outlined text-slate-800 fill">filter_alt</span>
                <p class="text-slate-800 text-sm font-medium leading-normal">Filters</p>
              </a>
            </div>
            Custom Folders
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between px-3 py-2">
                <h2
                  class="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  Custom Folders
                </h2>
                <button class="text-slate-500 hover:text-primary cursor-pointer" (click)="CustomFolderPopUp=true">
                  <span class="material-symbols-outlined text-base">add</span>
                </button>
              </div>
              @for(custom of customFolders; track custom.folderId) {
                <a (click)="goToCustomFolder(custom.folderId)"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-slate-600">folder</span>
                  <p class="text-slate-600 text-sm font-medium leading-normal">
                    {{custom.folderName}}
                  </p>
                </a>
              }
            </div>
          </div>
        </div>
      </aside> -->

      <!-- Main Content -->
      <main class="flex-1 flex flex-col h-screen overflow-y-auto">
        <div class="flex-1 px-6 py-8">
          <div class="w-full max-w-5xl mx-auto">
            <!-- Page Heading -->
            <header class="mb-8 flex items-center gap-4">
              <button (click)="goBack()" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <p class="text-slate-800 text-4xl font-black leading-tight tracking-[-0.033em]">
                Manage Filters
              </p>
            </header>

            <!-- Create Filter Form -->
            <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 class="text-slate-800 text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                {{editingFilter ? 'Edit Filter' : 'Create a new filter'}}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <label class="flex flex-col w-full">
                  <p class="text-slate-700 text-sm font-medium leading-normal pb-2">
                    If the message...
                  </p>
                  <select
                    [(ngModel)]="newFilter.field"
                    class="form-select w-full rounded-lg text-slate-800 border-slate-300 bg-[#f6f7f8] focus:border-[#137fec] focus:ring-[#137fec] h-12">
                    <option value="subject">Subject</option>
                    <option value="sender">Sender</option>
                    <option value="body">Body</option>
                  </select>
                </label>
                <label class="flex flex-col w-full">
                  <p class="text-slate-700 text-sm font-medium leading-normal pb-2">
                    Value
                  </p>
                  <input
                    [(ngModel)]="newFilter.filterValue"
                    class="form-input w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-0 focus:ring-[#137fec] border border-slate-300 bg-[#f6f7f8] focus:border-[#137fec] h-12 placeholder:text-slate-400 text-base font-normal leading-normal"
                    placeholder="Enter keyword or email"
                  />
                </label>
                <label class="flex flex-col w-full">
                  <p class="text-slate-700 text-sm font-medium leading-normal pb-2">
                    Then move it to...
                  </p>
                  <select
                    [(ngModel)]="newFilter.targetFolder"
                    class="form-select w-full rounded-lg text-slate-800 border-slate-300 bg-[#f6f7f8] focus:border-[#137fec] focus:ring-[#137fec] h-12">
                    @if (customFolders.length === 0) {
                      <option value="" disabled>No folders available</option>
                    }
                    @for(folder of customFolders; track folder.folderId) {
                      <option [value]="folder.folderId">{{folder.folderName}}</option>
                    }
                  </select>
                </label>
              </div>
              <div class="mt-6 flex justify-end gap-3">
                @if (editingFilter) {
                  <button
                    (click)="cancelEdit()"
                    class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-slate-200 text-slate-700 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 transition-colors">
                    <span class="truncate">Cancel</span>
                  </button>
                }
                <button
                  (click)="editingFilter ? updateFilter() : createFilter()"
                  class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#137fec] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#137fec]/90 transition-colors">
                  <span class="truncate">{{editingFilter ? 'Update Filter' : 'Create Filter'}}</span>
                </button>
              </div>
            </section>

            <!-- Existing Filters List -->
            <section class="mt-10">
              <h2 class="text-slate-800 text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                Your Filters
              </h2>
              <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                @if (filters.length === 0) {
                  <div class="p-8 text-center text-slate-500">
                    <span class="material-symbols-outlined text-4xl mb-2">filter_alt_off</span>
                    <p>No filters created yet. Create your first filter above!</p>
                  </div>
                } @else {
                  <div class="overflow-x-auto">
                    <table class="w-full text-left">
                      <thead class="bg-slate-50">
                        <tr>
                          <th class="p-4 text-sm font-semibold text-slate-600">Rule</th>
                          <th class="p-4 text-sm font-semibold text-slate-600">Action</th>
                          <th class="p-4 text-sm font-semibold text-slate-600 text-right">Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for(filter of filters; track filter.filterId) {
                          <tr class="border-t border-slate-200">
                            <td class="p-4 text-slate-700 text-sm">
                              {{filter.field | titlecase}} {{filter.operator}} "{{filter.filterValue}}"
                            </td>
                            <td class="p-4 text-slate-700 text-sm">
                              Move to "{{getFolderName(filter.targetFolder)}}"
                            </td>
                            <td class="p-4">
                              <div class="flex items-center justify-end gap-2">
                                <button
                                  (click)="editFilter(filter)"
                                  class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200/60 text-slate-600 transition-colors">
                                  <span class="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                  (click)="deleteFilter(filter.filterId!)"
                                  class="flex items-center justify-center size-9 rounded-lg hover:bg-red-100 text-red-500 transition-colors">
                                  <span class="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    :host {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: block;
      background-color: #f6f7f8;
    }

    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }

    .text-primary, .hover\\:text-primary {
      color: #137fec !important;
    }

    .bg-primary {
      background-color: #137fec !important;
    }

    .border-primary {
      border-color: #137fec !important;
    }

    .bg-primary\\/20 {
      background-color: rgba(19, 127, 236, 0.2) !important;
    }

    :host input.form-input {
      height: 48px !important;
      box-sizing: border-box !important;
    }
  `],
})
export class Filters implements OnInit {

  filters: MailFilter[] = [];
  customFolders: CustomFolderData[] = [];
  newFilter: MailFilter = {
    userId: '',
    field: 'subject',
    operator: 'contains',
    filterValue: '',
    targetFolder: ''
  };
  editingFilter: MailFilter | null = null;

  private apiUrl = 'http://localhost:8080/api/filters/by-user';

  constructor(private MailDetails:MailShuttleService, private router : Router,
    private http: HttpClient,
    protected folderStateService: FolderStateService
  ) {}
  CustomFolderPopUp:boolean = false;

  ngOnInit() {
    this.newFilter.userId = this.folderStateService.userData().userId;
    this.loadFilters();
    this.loadCustomFolders();
  }

  loadCustomFolders() {
    const url = "http://localhost:8080/api/folders";
    let params = new HttpParams();
    params = params.set("type", "custom");
    params = params.set("userId", this.folderStateService.userData().userId);

    this.http.get<CustomFolderData[]>(url, { params }).subscribe({
      next: (data) => {
        this.customFolders = data;
        // Set default target folder to first custom folder if available
        if (this.customFolders.length > 0 && !this.newFilter.targetFolder) {
          this.newFilter.targetFolder = this.customFolders[0].folderId;
        }
        console.log('Custom folders loaded:', data);
      },
      error: (err) => {
        console.error('Failed to fetch custom folders:', err);
      }
    });
  }

  loadFilters() {
    const userId = this.folderStateService.userData().userId;
    this.http.get<MailFilter[]>(`${this.apiUrl}/${userId}`).subscribe({
      next: (data) => {
        this.filters = data;
        console.log('Filters loaded:', data);
      },
      error: (err) => {
        console.error('Failed to load filters:', err);
        alert('Failed to load filters');
      }
    });
  }

  createFilter() {
    if (!this.newFilter.filterValue.trim()) {
      alert('Please enter a value for the filter');
      return;
    }

    console.log('Creating filter with data:', this.newFilter);

    this.http.post<MailFilter>(this.apiUrl, this.newFilter).subscribe({
      next: (data) => {
        console.log('Filter created successfully:', data);
        this.filters.push(data);
        this.resetForm();
        alert('Filter created successfully!');
      },
      error: (err) => {
        console.error('Failed to create filter - Full error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error details:', err.error);

        let errorMsg = 'Failed to create filter';
        if (err.error?.message) {
          errorMsg += ': ' + err.error.message;
        } else if (err.message) {
          errorMsg += ': ' + err.message;
        }
        alert(errorMsg);
      }
    });
  }

  goToCustomFolder(Id:string){
    this.MailDetails.setCustom(Id);
    this.router.navigate([`/Custom`]);
  }

  editFilter(filter: MailFilter) {
    this.editingFilter = filter;
    this.newFilter = { ...filter };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateFilter() {
    if (!this.editingFilter?.filterId) return;

    this.http.put<MailFilter>(
      `${this.apiUrl}/${this.editingFilter.filterId}`,
      this.newFilter
    ).subscribe({
      next: (data) => {
        console.log('Filter updated:', data);
        const index = this.filters.findIndex(f => f.filterId === data.filterId);
        if (index !== -1) {
          this.filters[index] = data;
        }
        this.resetForm();
        alert('Filter updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update filter:', err);
        alert('Failed to update filter');
      }
    });
  }

  deleteFilter(filterId: string) {
    if (!confirm('Are you sure you want to delete this filter?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${filterId}`).subscribe({
      next: () => {
        console.log('Filter deleted');
        this.filters = this.filters.filter(f => f.filterId !== filterId);
        alert('Filter deleted successfully!');
      },
      error: (err) => {
        console.error('Failed to delete filter:', err);
        alert('Failed to delete filter');
      }
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.editingFilter = null;
    this.newFilter = {
      userId: this.folderStateService.userData().userId,
      field: 'subject',
      operator: 'contains',
      filterValue: '',
      targetFolder: this.customFolders.length > 0 ? this.customFolders[0].folderId : ''
    };
  }

  getFolderName(folderId: string): string {
    const folder = this.customFolders.find(f => f.folderId === folderId);
    return folder ? folder.folderName : folderId;
  }
  handleSearch(criteria: any) {
    console.log('Search criteria:', criteria);
    // TODO: Implement search functionality
  }

  goBack() {
    this.router.navigate(['/inbox']);
  }
}
