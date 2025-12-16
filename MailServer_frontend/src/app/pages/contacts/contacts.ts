import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactDto } from '../../Dtos/ContactDto';
import { ContactService } from '../../services/contact.services';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header';
import { SearchBarComponent } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe, HeaderComponent, SearchBarComponent],
  template: `<header
      class="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-10 py-3 bg-white sticky top-0 z-10"
    >
      <div class="flex items-center gap-8 w-full">
        <a
          [routerLink]="['/inbox']"
          class="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
          title="Back to Inbox"
        >
          <span class="material-symbols-outlined text-xl">arrow_back</span>
        </a>
        <div class="flex items-center gap-4 text-slate-800">
          <h2 class="text-slate-800 text-lg font-bold">EmailApp</h2>
        </div>

        
        <!-- Top bar: Search + Avatar -->
        <div
          class="w-full flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-50"
        >
          <label class="flex flex-col min-w-40 h-10 flex-1 mr-6">
            <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div class=" text-slate-500 flex border-none bg-slate-100 items-center justify-center pl-3 rounded-l-lg border-r-0">
                <span class="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-0 focus:ring-0 border-none bg-slate-100 focus:border-none h-full placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Search Contacts..."
              />
            </div>
          </label>

          <!-- Avatar dropdown -->
          <app-header></app-header>
        </div>



        <!-- Rest of inbox content below -->
        <div class="px-6 py-4">
          <!-- email list / table here -->
        </div>
      </div>
    </header>

    <main class="px-10 flex flex-1 justify-center py-8">
      <div class="layout-content-container flex flex-col w-full">
        <div class="flex flex-wrap justify-between gap-4 p-4 items-center">
          <div class="flex items-center gap-3">
            <h1 class="text-slate-900 text-4xl font-black min-w-44">Contacts</h1>

            <button
              *ngIf="selectedIds.size > 0"
              (click)="deleteSelected()"
              class="flex items-center justify-center rounded-lg h-10 px-4 bg-red-100 text-red-600 text-sm font-bold gap-2 hover:bg-red-200 transition"
            >
              <span class="material-symbols-outlined text-xl">delete</span>
              Delete ({{ selectedIds.size }})
            </button>

            <div class="flex items-center bg-white border border-slate-200 rounded-lg px-2 h-10">
              <span class="text-xs font-bold text-slate-500 mr-2">Sort By:</span>
              <select
                [ngModel]="currentSortBy"
                (ngModelChange)="onSortChange($event)"
                class="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 cursor-pointer h-full outline-none"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phoneNumber">Phone</option>
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Last Updated</option>
                <option value="starred">Starred</option>
                <option value="notes">Notes</option>
              </select>
              <button
                (click)="toggleSortOrder()"
                class="ml-2 p-1 rounded hover:bg-slate-100 text-slate-600 flex items-center"
                title="Toggle Order"
              >
                <span class="material-symbols-outlined text-lg">
                  {{ currentOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                </span>
              </button>
            </div>

            <button
              *ngIf="searchQuery || currentSortBy !== 'name' || currentOrder !== 'asc'"
              (click)="resetView()"
              class="flex items-center justify-center size-10 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              title="Reset View"
            >
              <span class="material-symbols-outlined text-xl">restart_alt</span>
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
          <div
            *ngIf="contacts.length === 0"
            class="flex flex-col items-center justify-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200"
          >
            <span class="material-symbols-outlined text-5xl mb-2">person_off</span>
            <p class="text-lg font-medium">No contacts found</p>
            <button (click)="resetView()" class="mt-4 text-[#137fec] font-bold hover:underline cursor-pointer">
              Return to full list
            </button>
          </div>

          <div
            *ngIf="contacts.length > 0"
            class="flex overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <table class="flex-1">
              <thead class="border-b border-b-slate-200">
                <tr class="bg-slate-50">
                  <th class="px-4 py-3 w-[5%]">
                    <input
                      type="checkbox"
                      (change)="toggleAll($event)"
                      class="size-4 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]"
                    />
                  </th>
                  <th class="px-4 py-3 text-left text-slate-600 w-[35%] text-sm font-medium">
                    Name
                  </th>
                  <th class="px-4 py-3 text-left text-slate-600 w-[35%] text-sm font-medium">
                    Contact Info
                  </th>
                  <th class="px-4 py-3 text-left text-slate-600 w-[15%] text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let contact of contacts"
                  (click)="openContactModal(contact)"
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer transition"
                >
                  <td class="h-[72px] px-4 py-2">
                    <input
                      type="checkbox"
                      [checked]="isSelected(contact.contactId)"
                      (change)="toggleSelection(contact.contactId, $event)"
                      (click)="$event.stopPropagation()"
                      class="size-4 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]"
                    />
                  </td>

                  <td
                    class="h-[72px] px-4 py-2 w-[35%] text-slate-800 text-sm font-normal leading-normal"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="flex size-10 items-center justify-center rounded-full bg-[#137fec]/20 text-[#137fec] font-bold"
                      >
                        {{ contact.name?.charAt(0) | uppercase }}
                      </div>
                      <div class="flex flex-col items-start">
                        <span class="font-medium">{{ contact.name }}</span>
                        <button
                          (click)="toggleStar(contact, $event)"
                          class="text-xs flex items-center gap-1 hover:bg-slate-100 px-1 rounded transition"
                        >
                          <span
                            class="material-symbols-outlined text-[16px]"
                            [ngClass]="{
                              'text-yellow-500': contact.starred,
                              'text-slate-400 unfilled': !contact.starred
                            }"
                            >star</span
                          >
                          <span
                            [class.text-yellow-500]="contact.starred"
                            [class.text-slate-400]="!contact.starred"
                          >
                            {{ contact.starred ? 'Starred' : 'Not Starred' }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </td>

                  <td
                    class="h-[72px] px-4 py-2 w-[35%] text-slate-500 text-sm font-normal leading-normal"
                  >
                    <div>{{ contact.phoneNumber || 'No Phone' }}</div>
                    <div class="text-xs text-slate-400 mt-1">
                      {{ contact.emailAddresses ? contact.emailAddresses[0] : 'No Email' }}
                      <span
                        *ngIf="contact.emailAddresses && contact.emailAddresses.length > 1"
                        class="bg-slate-100 rounded px-1 text-slate-600"
                        >+{{ contact.emailAddresses.length - 1 }}</span
                      >
                    </div>
                  </td>

                  <!-- <td class="h-[72px] px-4 py-2 w-[20%] text-slate-500 text-xs font-normal leading-normal">
                       <div class="flex flex-col gap-1">
                           <span title="Created At">Created: {{ contact.createdAt | date:'shortDate' }}</span>
                           <span *ngIf="contact.updatedAt" title="Updated At" class="text-slate-400">
                               Updated: {{ contact.updatedAt | date:'shortDate' }}
                           </span>
                       </div>
                    </td> -->

                  <td
                    class="h-[72px] px-4 py-2 w-[15%] text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    <div class="flex items-center gap-2" (click)="$event.stopPropagation()">
                      <button
                        [routerLink]="['/contacts/edit', contact.contactId]"
                        class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#137fec]"
                      >
                        <span class="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        (click)="onDelete(contact, $event)"
                        class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-500"
                      >
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

      <div
        *ngIf="selectedContact"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in"
        (click)="closeContactModal()"
      >
        <div
          class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          (click)="$event.stopPropagation()"
        >
          <div
            class="bg-[#f6f7f8] px-6 py-4 flex justify-between items-start border-b border-slate-100"
          >
            <div class="flex gap-4 items-center">
              <div
                class="flex size-14 items-center justify-center rounded-full bg-[#137fec] text-white text-2xl font-bold"
              >
                {{ selectedContact.name.charAt(0) | uppercase }}
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 leading-tight">
                  {{ selectedContact.name }}
                </h3>
                <div
                  class="flex items-center gap-1 text-sm mt-1"
                  [ngClass]="selectedContact.starred ? 'text-yellow-600' : 'text-slate-500'"
                >
                  <span class="material-symbols-outlined text-[18px]">{{
                    selectedContact.starred ? 'star' : 'star_border'
                  }}</span>
                  <span>{{ selectedContact.starred ? 'Starred Contact' : 'Not Starred' }}</span>
                </div>
              </div>
            </div>
            <button (click)="closeContactModal()" class="text-slate-400 hover:text-slate-600">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <div class="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
            <div class="space-y-4">
              <div class="flex gap-3">
                <span class="material-symbols-outlined text-slate-400 mt-0.5">call</span>
                <div>
                  <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Phone Number
                  </p>
                  <p class="text-slate-900 font-medium">
                    {{ selectedContact.phoneNumber || 'Not provided' }}
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <span class="material-symbols-outlined text-slate-400 mt-0.5">mail</span>
                <div class="w-full">
                  <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Email Addresses
                  </p>
                  <div
                    *ngIf="
                      selectedContact.emailAddresses && selectedContact.emailAddresses.length > 0;
                      else noEmail
                    "
                  >
                    <div
                      *ngFor="let email of selectedContact.emailAddresses"
                      class="text-slate-900 font-medium py-0.5 border-b border-slate-50 last:border-0"
                    >
                      {{ email }}
                    </div>
                  </div>
                  <ng-template #noEmail>
                    <p class="text-slate-400 italic">No emails</p>
                  </ng-template>
                </div>
              </div>

              <div class="flex gap-3">
                <span class="material-symbols-outlined text-slate-400 mt-0.5">notes</span>
                <div>
                  <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Notes</p>
                  <p class="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {{ selectedContact.notes || 'No notes added.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 px-6 py-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              [routerLink]="['/contacts/edit', selectedContact.contactId]"
              class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              Edit
            </button>
            <button
              (click)="closeContactModal()"
              class="px-4 py-2 bg-[#137fec] text-white rounded-lg text-sm font-bold hover:bg-[#116dcb] transition shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </main> `,
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

      .material-symbols-outlined {
        /* Ensure icons are correctly rendered */
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        line-height: 1;
      }

      /* FIX: Re-enforcing primary color styles */
      /* These definitions ensure the color classes work by mapping them to hex codes */
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

      /* FIX: Re-enforcing dark mode styles using custom colors */
      /* Target dark mode background using the hex code */
      /* The original HTML uses dark:bg-background-dark on the container, which is #101922 */
      :host .dark\\:bg-\\[\\#101922\\] {
        background-color: #101922 !important;
      }
      .search-container {
        width: 100%; /* Make full width of parent */
      }

      .search-input-wrapper {
        width: 100%; /* Stretch input inside */
        max-width: none; /* Remove limiting max-width */
      }
    `,
  ],
})
export class Contacts implements OnInit {
  contacts: ContactDto[] = [];
  selectedIds: Set<string> = new Set();

  searchQuery: string = '';
  currentSortBy: string = 'name';
  currentOrder: string = 'asc';

  selectedContact: ContactDto | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  openContactModal(contact: ContactDto) {
    this.selectedContact = contact;
  }

  closeContactModal() {
    this.selectedContact = null;
  }

  loadContacts() {
    this.contactService
      .getContacts(this.searchQuery, this.currentSortBy, this.currentOrder)
      .subscribe({
        next: (data) => {
          this.contacts = data;
          this.selectedIds.clear();
        },
        error: (err) => console.error('Error fetching contacts', err),
      });
  }

  onSearch() {
    this.loadContacts();
  }

  resetView() {
    this.searchQuery = '';
    this.currentSortBy = 'name';
    this.currentOrder = 'asc';
    this.loadContacts();
  }

  onSortChange(sortBy: string) {
    this.currentSortBy = sortBy;
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'starred') {
      this.currentOrder = 'desc';
    } else {
      this.currentOrder = 'asc';
    }
    this.loadContacts();
  }

  toggleSortOrder() {
    this.currentOrder = this.currentOrder === 'asc' ? 'desc' : 'asc';
    this.loadContacts();
  }

  toggleStar(contact: ContactDto, event: Event) {
    event.stopPropagation();
    if (!contact.contactId) return;

    contact.starred = !contact.starred;

    this.contactService.toggleStar(contact.contactId).subscribe({
      error: () => {
        contact.starred = !contact.starred;
        alert('Failed to update star');
      },
    });
  }

  toggleSelection(id: string | undefined, event: Event) {
    event.stopPropagation();
    if (!id) return;
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.contacts.forEach((c) => {
        if (c.contactId) this.selectedIds.add(c.contactId);
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
    if (confirm(`Delete ${this.selectedIds.size} contacts?`)) {
      const idsToDelete = Array.from(this.selectedIds);
      this.contactService.deleteMultipleContacts(idsToDelete).subscribe({
        next: () => {
          this.contacts = this.contacts.filter(
            (c) => c.contactId && !this.selectedIds.has(c.contactId)
          );
          this.selectedIds.clear();
        },
        error: () => alert('Failed to delete contacts'),
      });
    }
  }

  handleSearch(criteria: any) {
    console.log('Search criteria:', criteria);
    // TODO: Implement search functionality
  }

  onDelete(contact: ContactDto, event: Event) {
    event.stopPropagation();
    if (!contact.contactId) return;
    if (confirm('Are you sure you want to delete ' + contact.name + '?')) {
      this.contactService.deleteContact(contact.contactId).subscribe({
        next: () => {
          this.contacts = this.contacts.filter((c) => c.contactId !== contact.contactId);

          if (this.selectedContact?.contactId === contact.contactId) {
            this.closeContactModal();
          }
        },
        error: () => alert('Failed to delete contact'),
      });
    }
  }
}
