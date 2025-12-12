import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactDto } from '../../Dtos/ContactDto';
import { ContactService } from '../../services/contact.services';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    <div class="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f7f8] group/design-root overflow-x-hidden font-display">
      <div class="layout-container flex h-full grow flex-col">
        <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-10 py-3 bg-white sticky top-0 z-10">
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-4 text-slate-800">
              <div class="size-6 text-[#137fec]">
                <svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fill-rule="evenodd"></path>
                </svg>
              </div>
              <h2 class="text-slate-800 text-lg font-bold leading-tight tracking-[-0.015em]">EmailApp</h2>
            </div>
            <label class="flex flex-col min-w-40 !h-10 max-w-64">
              <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div class="text-slate-500 flex border-none bg-slate-100 items-center justify-center pl-3 rounded-l-lg border-r-0">
                  <span class="material-symbols-outlined text-xl">search</span>
                </div>
                <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-0 focus:ring-0 border-none bg-slate-100 focus:border-none h-full placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search" value="" />
              </div>
            </label>
          </div>
          <div class="flex flex-1 justify-end gap-8">
            <div class="flex items-center gap-9">
              <a [routerLink]="['/inbox']" class="text-slate-600 hover:text-[#137fec] text-sm font-medium leading-normal">Inbox</a>
              <a [routerLink]="['/mail']" class="text-slate-600 hover:text-[#137fec] text-sm font-medium leading-normal">Sent</a>
              <a [routerLink]="['/drafts']" class="text-slate-600 hover:text-[#137fec] text-sm font-medium leading-normal">Drafts</a>
              <a [routerLink]="['/contacts']" class="text-[#137fec] text-sm font-bold leading-normal border-b-2 border-[#137fec] pb-1">Contacts</a>
            </div>
            <div class="flex items-center gap-2">
              <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBD2dWIjLAK5z9aWigdaxpvgDTpZLPVmlcJnObO0VakIA4WXTTMCBJWEp2p9glx2iuDLjZlUmjnzxPtovnYD4fp0SrL174Dj-95rozBw79_G66TYAIug52lWSHl-JhvPqHi0NLXoPQTVbXf6cKA_loxnjls-ba-wft_v0bJylLfF317Rjwi0_Pl3WD7L7NaXCRuAsYqbeMb54X1Q4FKaaoKa13v9HLbhbgMO3vjfYyZlOV6nckhtgwfaCuJvK_kQnCPAT9aeyoNPCk');"></div>
            </div>
          </div>
        </header>
        
        <main class="px-10 flex flex-1 justify-center py-8">
          <div class="layout-content-container flex flex-col w-full">
            <div class="flex flex-wrap justify-between gap-4 p-4 items-center">
              <h1 class="text-slate-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Contacts</h1>
              
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
                      <th class="px-4 py-3 text-left text-slate-600 w-[40%] text-sm font-medium leading-normal">Name</th>
                      <th class="px-4 py-3 text-left text-slate-600 w-[40%] text-sm font-medium leading-normal">Emails</th>
                      <th class="px-4 py-3 text-left text-slate-600 w-[20%] text-sm font-medium leading-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    <tr *ngFor="let contact of contacts" class="border-t border-t-slate-200 hover:bg-slate-50">
                      
                      <td class="h-[72px] px-4 py-2 w-[40%] text-slate-800 text-sm font-normal leading-normal">
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

                      <td class="h-[72px] px-4 py-2 w-[40%] text-slate-500 text-sm font-normal leading-normal">
                        {{ contact.emailAddresses ? contact.emailAddresses[0] : 'No Email' }}
                        <span *ngIf="contact.emailAddresses && contact.emailAddresses.length > 1" class="text-xs bg-slate-100 rounded px-1">
                            +{{ contact.emailAddresses.length - 1 }}
                        </span>
                      </td>

                      <td class="h-[72px] px-4 py-2 w-[20%] text-sm font-bold leading-normal tracking-[0.015em]">
                        <div class="flex items-center gap-2">
                          
                          <button 
                            [routerLink]="['/contacts/edit', contact.contactId]"
                            class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#137fec]"
                          >
                            <span class="material-symbols-outlined text-xl">edit</span>
                          </button>

                          <button 
                            (click)="onDelete(contact)"
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
        </main>
      </div>
    </div>
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
