import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Datafile} from '../../Dtos/datafile';
import {FolderStateService} from '../../Dtos/FolderStateService';
import {take} from 'rxjs';
import {MailShuttleService} from '../../Dtos/MailDetails';

// @ts-ignore
// @ts-ignore
// @ts-ignore
@Component({
  selector: 'app-mail-detail',
  standalone: true,
  imports: [CommonModule, RouterLink,HttpClientModule],
  template: `
    <!-- Global resource loading added for robustness -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"/>

    <div class="flex h-screen w-full flex-col bg-[#f6f7f8] font-display">
      <!-- TopNavBar -->
      <header
        class="flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white px-6 py-2 shrink-0"
      >
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-3 text-gray-900">
            <div class="size-6 text-[#137fec]">
              <span class="material-symbols-outlined !text-3xl">all_inclusive</span>
            </div>
            <h2 class="text-xl font-bold tracking-[-0.015em]">MailClient</h2>
          </div>
          <label class="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
            <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div
                class="text-gray-500 flex bg-gray-100 items-center justify-center pl-3 rounded-l-lg border-r-0"
              >
                <span class="material-symbols-outlined">search</span>
              </div>
              <input
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 focus:outline-0 focus:ring-0 border-none bg-gray-100 h-full placeholder:text-gray-500 px-2 text-base font-normal leading-normal"
                placeholder="Search"
                value=""
              />
            </div>
          </label>
        </div>
        <div class="flex flex-1 justify-end gap-2 sm:gap-4">
          <div class="flex gap-1 sm:gap-2">
            <button
              class="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-transparent text-gray-700 hover:bg-gray-100 gap-2 text-sm font-bold min-w-0 px-2.5"
            >
              <span class="material-symbols-outlined">help</span>
            </button>
            <button
              class="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-transparent text-gray-700 hover:bg-gray-100 gap-2 text-sm font-bold min-w-0 px-2.5"
            >
              <span class="material-symbols-outlined">settings</span>
            </button>
            <button
              class="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-transparent text-gray-700 hover:bg-gray-100 gap-2 text-sm font-bold min-w-0 px-2.5"
            >
              <span class="material-symbols-outlined">apps</span>
            </button>
          </div>
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt="User avatar image"
            style="
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdfKKGz5yrnxyYagz1tKKwt0jvcnkV7OQEOptlf274lpHltWTfOzNidkMsYHSKMxSeACXmF9nL-1bnHiHDOq6i50wbRrbggkzBI2h4oQmhacVwMqv5Fn9rLV9aZwexW9XL1whzm8Z4NAaM3KEA3n9Y0BKz2l60iIULZSpTT0WU5BnD2Og58TwqFEoOvmyk8Fo6XEze78UHNrI3PuFJe8u3YfX8TXwXdMowAl7-65dEhpnPhLoVPzbnvfk5BiBCfPdpPX0Pwwvc4mE');
            "
          ></div>
        </div>
      </header>
      <div class="flex flex-1 overflow-hidden">
        <!-- SideNavBar -->
        <aside
          class="hidden md:flex w-64 flex-col justify-between bg-white p-4 border-r border-gray-200 shrink-0"
        >
          <div class="flex flex-col gap-6">
            <button [routerLink]="['/compose']"
                    class="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-[#137fec] text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 shadow-sm hover:opacity-90"
            >
              <span class="material-symbols-outlined">edit</span>
              <span class="truncate">Compose</span>
            </button>
            <div class="flex flex-col gap-1">
              <a [routerLink]="['/inbox']"
                 class="flex items-center gap-4 px-3 py-2 rounded-lg bg-[#137fec]/10 text-[#137fec]"
              >
                <span class="material-symbols-outlined">inbox</span>
                <p class="text-sm font-medium leading-normal">Inbox</p>
              </a>
              <a [routerLink]="['/mail']"
                 class="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span class="material-symbols-outlined">send</span>
                <p class="text-sm font-medium leading-normal">Sent</p>
              </a>
              <a [routerLink]="['/drafts']"
                 class="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span class="material-symbols-outlined">draft</span>
                <p class="text-sm font-medium leading-normal">Drafts</p>
              </a>
              <a [routerLink]="['/trash']"
                 class="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span class="material-symbols-outlined">delete</span>
                <p class="text-sm font-medium leading-normal">Trash</p>
              </a>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-[#137fec] h-2 rounded-full" style="width: 70%"></div>
            </div>
            <p class="text-xs text-gray-500">10.5 GB of 15 GB used</p>
          </div>
        </aside>
        <!-- Main Content Area -->
        <main
          class="flex-1 flex flex-col bg-[#f6f7f8] overflow-y-auto"
        >
          <div class="p-4 sm:p-6 flex-1 flex flex-col">
            <!-- PageHeading and Toolbar -->
            <div
              class="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200"
            >
              <div class="flex min-w-72 flex-col gap-2">
                <p
                  class="text-gray-900 text-2xl lg:text-3xl font-bold leading-tight tracking-[-0.03em]"
                >
                  {{ mail?.subject }}
                </p>
                <p class="text-gray-500 text-sm font-normal leading-normal">
                  Inbox
                </p>
              </div>
              <div class="flex gap-1 sm:gap-2">
                <button
                  class="p-2 rounded-lg text-gray-700 hover:bg-gray-200"
                  title="Reply"
                >
                  <span class="material-symbols-outlined">reply</span>
                </button>
                <button
                  class="p-2 rounded-lg text-gray-700 hover:bg-gray-200"
                  title="Forward"
                >
                  <span class="material-symbols-outlined">forward</span>
                </button>
                <button
                  class="p-2 rounded-lg text-gray-700 hover:bg-gray-200"
                  title="Move to"
                >
                  <span class="material-symbols-outlined">drive_file_move</span>
                </button>
                <button
                  class="p-2 rounded-lg text-gray-700 hover:bg-gray-200"
                  title="Mark as unread"
                >
                  <span class="material-symbols-outlined">mark_email_unread</span>
                </button>
                <button
                  class="p-2 rounded-lg text-gray-700 hover:bg-gray-200"
                  title="Delete"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <!-- Metadata Panel (ListItem modified) -->
            <div class="flex items-start gap-4 py-6">
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shrink-0"
                data-alt="Sender Alejandro Vargas's avatar"
                style="
                  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCsv0IdT0BP-Y_THxlaT2iGOHBRXuo7RJ1WvJAKdtAD8phpiPGZdQqH4F5V07fBTgTfMEWtaixkgZlFJ4XboEyFfictht7JMnb1qja6MUnlGP4gjMbfl7mkLKZExIPLs6uvrbz96l-EEDNShTLIxseIzBSWU8iPKzmnFNyDoj7Zjm8zn0hVgxkau2jVqEsoJIEf7TPMOlAnW29x8olUyWB7_czjfK3W1Sa7gi9kAHNwMRFRbC9RHbGBviEaRL7pZ28B6qSe8hCO00Y');
                "
              ></div>
              <div class="flex flex-col justify-center flex-1">
                <p class="text-gray-900 text-base font-medium leading-normal">
                  Alejandro Vargas
                </p>
                <p class="text-gray-500 text-sm font-normal leading-normal">
                  <span class="font-medium">From:</span> {{ mail?.senderEmail }}
                </p>
                <p class="text-gray-500 text-sm font-normal leading-normal">
                  <span class="font-medium">To:</span>
                  @for (mail of mail?.receiverEmails; track $index){
                  <span>
                  {{mail}}
                    </span>
                }
                </p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-gray-500 text-sm font-normal leading-normal">
                  {{ mail?.date }}
                </p>
              </div>
            </div>
            <!-- Email Body -->
            <div
              class="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed flex-1"
            >
              <p>
                {{ mail?.body }}
              </p>
              <br/>
            </div>
            <!-- Attachments -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ mail?.attachmentMetadata?.length }}
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Attachment Card 1 -->
                @for (item of mail?.attachmentMetadata; track $index) {
                  <div
                    class="flex items-center gap-4 p-3 border border-gray-200 rounded-xl bg-white"
                  >
                    <div
                      class="flex items-center justify-center size-10 bg-[#137fec]/10 rounded-lg text-[#137fec]"
                    >
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ item.fileName }}{{ item.fileType }}
                      </p>
                      <p class="text-xs text-gray-500">{{ item.fileSize }}</p>
                    </div>
                    <button (click)="getDownloadUrl(item.attachmentId)"
                            class="p-2 text-gray-500 hover:text-[#137fec]"
                            title="Download"
                    >
                      <span class="material-symbols-outlined">download</span>
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* 1. We define the font-family globally here, assuming the font files can be reached */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
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

    .material-symbols-outlined {
      /* Ensure icons are correctly rendered */
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }

    /* FIX: Re-enforcing primary color styles */
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

    /* FIX: Neutralize text colors to ensure they are dark in light mode */
    :host .dark\\:text-gray-200,
    :host .dark\\:text-white,
    :host .dark\\:text-gray-300,
    :host .dark\\:text-gray-400 {
        color: #1f2937 !important; /* Default dark text color */
    }

    /* FIX: Neutralize dark mode backgrounds */
    :host .dark\\:bg-background-dark,
    :host .dark\\:bg-gray-800,
    :host .dark\\:bg-gray-700 {
        background-color: transparent !important;
    }

    /* FIX: Ensure the link backgrounds are neutral in light mode */
    .dark\\:hover\\:bg-gray-800 {
        background-color: transparent !important;
    }

  `],
})
export class MailDetail {

  // Data structures
  constructor(
    private folderStateService: FolderStateService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private MailDetails:MailShuttleService,// Used to read URL parameters
  ) {}
  MailDetails2 = inject(MailShuttleService);
  mail: Datafile | null = this.MailDetails2.getMailData();
  mailId: string | undefined;
  isLoading: boolean = true;

  error: string | null = null;
  // --- Inject Dependencies via Constructor Parameters ---
  // Note: The 'private' keyword automatically declares these as instance fields.
  // --- Utility Methods (Using the correct 'router' reference) ---

  deleteMail(): void {
    if (!this.mailId) return;
    console.log(`Deleting mail ID: ${this.mailId}`);
    // NOTE: After deletion, redirect: this.router.navigate(['/inbox']);
  }

  reply(): void {
    this.router.navigate(['/compose'], { queryParams: { replyTo: this.mailId } });
  }

  // Generates the correct download link (as previously implemented)
  getDownloadUrl(attachmentId: string): string {
    const attachmentApiUrl = 'http://localhost:8080/api/attachments';
    return `${attachmentApiUrl}/${attachmentId}/download`;
  }
}
