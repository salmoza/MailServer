import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactDto } from '../../Dtos/ContactDto';
import { ContactService } from '../../services/contact.services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, RouterLink , FormsModule],
  template: `
    <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-10 py-3 bg-white sticky top-0 z-10">
  <div class="flex items-center gap-8">
     <div class="flex items-center gap-4 text-slate-800">
        <h2 class="text-slate-800 text-lg font-bold">EmailApp</h2>
     </div>
     
     <label class="flex flex-col min-w-40 !h-10 max-w-64">
        <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
           <div class="text-slate-500 flex border-none bg-slate-100 items-center justify-center pl-3 rounded-l-lg border-r-0">
              <span class="material-symbols-outlined text-xl">search</span>
           </div>
           <input 
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-0 focus:ring-0 border-none bg-slate-100 focus:border-none h-full placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
              placeholder="Search contacts..." 
           />
        </div>
     </label>
  </div>
  </header>

<main class="px-10 flex flex-1 justify-center py-8">
  <div class="layout-content-container flex flex-col w-full">
     <div class="flex flex-wrap justify-between gap-4 p-4 items-center">
        <div class="flex items-center gap-4">
            <h1 class="text-slate-900 text-4xl font-black min-w-72">Contacts</h1>
            
            <button 
                *ngIf="selectedIds.size > 0" 
                (click)="deleteSelected()"
                class="flex items-center justify-center rounded-lg h-10 px-4 bg-red-100 text-red-600 text-sm font-bold gap-2 hover:bg-red-200 transition"
            >
                <span class="material-symbols-outlined text-xl">delete</span>
                Delete ({{ selectedIds.size }})
            </button>
        </div>

        <button 
           [routerLink]="['/contacts/new']"
           class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2"
        >
           <span class="material-symbols-outlined text-xl">add</span>
           <span class="truncate">Add Contact</span>
        </button>
     </div>

     <div class="px-4 py-3 @container">
        <div class="flex overflow-hidden rounded-xl border border-slate-200 bg-white">
           <table class="flex-1">
              <thead class="border-b border-b-slate-200">
                 <tr class="bg-slate-50">
                    
                    <th class="px-4 py-3 w-[5%]">
                        <input type="checkbox" (change)="toggleAll($event)" class="size-4 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]">
                    </th>

                    <th (click)="onSort('name')" class="cursor-pointer px-4 py-3 text-left text-slate-600 w-[35%] text-sm font-medium hover:bg-slate-100">
                       <div class="flex items-center gap-1">
                          Name
                          <span *ngIf="currentSortBy === 'name'" class="material-symbols-outlined text-sm">
                              {{ currentOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </span>
                       </div>
                    </th>

                    <th (click)="onSort('phoneNumber')" class="cursor-pointer px-4 py-3 text-left text-slate-600 w-[35%] text-sm font-medium hover:bg-slate-100">
                       <div class="flex items-center gap-1">
                          Phone / Emails
                          <span *ngIf="currentSortBy === 'phoneNumber'" class="material-symbols-outlined text-sm">
                              {{ currentOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </span>
                       </div>
                    </th>

                    <th class="px-4 py-3 text-left text-slate-600 w-[25%] text-sm font-medium leading-normal">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 <tr *ngFor="let contact of contacts" class="border-t border-t-slate-200 hover:bg-slate-50">
                    
                    <td class="h-[72px] px-4 py-2">
                        <input 
                            type="checkbox" 
                            [checked]="isSelected(contact.contactId)" 
                            (change)="toggleSelection(contact.contactId)"
                            class="size-4 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]"
                        >
                    </td>

                    <td class="h-[72px] px-4 py-2 w-[35%] text-slate-800 text-sm font-normal leading-normal">
                       <div class="flex items-center gap-3">
                          <div class="flex size-10 items-center justify-center rounded-full bg-[#137fec]/20 text-[#137fec] font-bold">
                             {{ contact.name?.charAt(0) | uppercase }}
                          </div>
                          <div class="flex flex-col">
                             <span class="font-medium">{{ contact.name }}</span>
                             <span *ngIf="contact.starred" class="text-xs text-yellow-500">★ Starred</span>
                          </div>
                       </div>
                    </td>

                    <td class="h-[72px] px-4 py-2 w-[35%] text-slate-500 text-sm font-normal leading-normal">
                       {{ contact.emailAddresses ? contact.emailAddresses[0] : 'No Email' }}
                       <span *ngIf="contact.emailAddresses && contact.emailAddresses.length > 1" class="text-xs bg-slate-100 rounded px-1">
                          +{{ contact.emailAddresses.length - 1 }}
                       </span>
                    </td>

                    <td class="h-[72px] px-4 py-2 w-[25%] text-sm font-bold leading-normal tracking-[0.015em]">
                       <div class="flex items-center gap-2">
                          <button [routerLink]="['/contacts/edit', contact.contactId]" class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#137fec]">
                             <span class="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button (click)="onDelete(contact)" class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-500">
                             <span class="material-symbols-outlined text-xl">delete</span>
                          </button>
                       </div>
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>
     </div>
  </div>
</main>
`,
  styles: [`
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

    .material-symbols-outlined {
      /* Ensure icons are correctly rendered */
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }

    /* FIX: Re-enforcing primary color styles */
    /* These definitions ensure the color classes work by mapping them to hex codes */
    .text-primary, .hover\\:text-primary { color: #137fec !important; }

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

    /* FIX: Re-enforcing dark mode styles using custom colors */
    /* Target dark mode background using the hex code */
    /* The original HTML uses dark:bg-background-dark on the container, which is #101922 */
    :host .dark\\:bg-\\[\\#101922\\] {
      background-color: #101922 !important;
    }
  `],
})

export class Contacts implements OnInit {
  contacts: ContactDto[] = [];

  
  selectedIds: Set<string> = new Set();
  
  
  searchQuery: string = '';

  
  currentSortBy: string = 'name';
  currentOrder: string = 'asc';

  currentPage: number = 0;
  pageSize: number = 20;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    
    this.contactService.getContacts().subscribe({
        next: (data : any ) => this.contacts = data,
        error: (err : any ) => console.error('Error fetching contacts', err)
    });
  }
  
  onSearch() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.loadContacts(); 
      return;
    }

    this.contactService.searchContacts(this.searchQuery, this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.contacts = page.content;
        },
        error: (err) => console.error('Search failed', err)
      });
  }

  onSort(column: string) {
    
    if (this.currentSortBy === column) {
      this.currentOrder = this.currentOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortBy = column;
      this.currentOrder = 'asc';
    }

    this.contactService.sortContacts(this.currentSortBy, this.currentOrder, this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.contacts = page.content;
        },
        error: (err) => console.error('Sort failed', err)
      });
  }

  
  
  
  toggleSelection(id: string | undefined) {
    if(!id) return;
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  
  toggleAll(event: any) {
    if (event.target.checked) {
      this.contacts.forEach(c => {
        if(c.contactId) this.selectedIds.add(c.contactId);
      });
    } else {
      this.selectedIds.clear();
    }
  }

  
  isSelected(id: string | undefined): boolean {
    return !!id && this.selectedIds.has(id);
  }

  
  deleteSelected() {
    if (this.selectedIds.size === 0) return;

    if(confirm(`Delete ${this.selectedIds.size} contacts?`)) {
      const idsToDelete = Array.from(this.selectedIds);
      
      this.contactService.deleteMultipleContacts(idsToDelete).subscribe({
        next: () => {
          
          this.contacts = this.contacts.filter(c => c.contactId && !this.selectedIds.has(c.contactId));
          this.selectedIds.clear();
        },
        error: (err) => alert('Failed to delete contacts')
      });
    }
  }

  onDelete(contact: ContactDto) {
    if (!contact.contactId) return;

    if(confirm('Are you sure you want to delete ' + contact.name + '?')) {
      
      this.contactService.deleteContact(contact.contactId).subscribe({
        next: () => {
            // Remove without refreshing
            this.contacts = this.contacts.filter(c => c.contactId !== contact.contactId);
        },
        error: (err : any ) => alert('Failed to delete contact')
      });
    }
  }
}
