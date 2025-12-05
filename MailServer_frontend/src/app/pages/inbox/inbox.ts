import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Global resource loading added for robustness -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    <!-- Main Container: Enforced light background -->
    <div class="flex h-screen w-full">
      <!-- SideNavBar -->
      <aside
        class="flex h-full w-[260px] flex-col border-r border-slate-200 bg-white p-4 sticky top-0"
      >
        <div class="flex h-full flex-col justify-between">
          <div class="flex flex-col gap-6">
            <div class="flex items-center gap-3 px-3">
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="Company Logo"
                style="
                  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhHSriJgc-UumFnkoqSXN4J6aJwW9cXi28BcUxqcDMNpzEFKQzz2I35gH4VFhoz3g4b52-NgAmRlAY2e53od4IGEX1EfMua_aW-puEy430OsbYibhoWcVIWtu_j-kZWgDNYtxjL_5bP2GAjgu4vf91W-kCd03dZdC-oAsbvmQwm9u-9V8bQQo8tVNsSSPs3jlk1U4CZS01CZScj4psc69zFuTTNLgRFKDGwc_NAuc5lI1JWlCb-hvpuZyJnT9kVF_-PgRxjo_S3uY');
                "
              ></div>
              <h1 class="text-slate-800 text-base font-medium leading-normal">
                emailclient.com
              </h1>
            </div>
            <button [routerLink]="['/compose']"
              class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span class="truncate">Compose</span>
            </button>
            <div class="flex flex-col gap-1">
              <!-- Active Inbox Link -->
              <a [routerLink]="['/inbox']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20"
              >
                <!-- Removed dark:text-slate-200 -->
                <span class="material-symbols-outlined text-slate-800 fill"
                  >inbox</span
                >
                <p class="text-slate-800 text-sm font-medium leading-normal">
                  Inbox
                </p>
                <span
                  class="ml-auto text-xs font-semibold text-slate-600 bg-slate-200 rounded-full px-2 py-0.5"
                  >3</span
                >
              </a>
              <a [routerLink]="['/compose']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <!-- Removed dark:text-slate-400 -->
                <span class="material-symbols-outlined text-slate-600"
                  >send</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Sent
                </p>
              </a>
              <a [routerLink]="['/drafts']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600"
                  >draft</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Drafts
                </p>
              </a>
              <a [routerLink]="['/trash']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600"
                  >delete</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Trash
                </p>
              </a>
            </div>
            <!-- Custom Folders -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between px-3 py-2">
                <h2
                  class="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  Custom Folders
                </h2>
                <button class="text-slate-500 hover:text-primary">
                  <span class="material-symbols-outlined text-base">add</span>
                </button>
              </div>
              <a [routerLink]="['/folder/alpha']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600"
                  >folder</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Project Alpha
                </p>
              </a>
              <a [routerLink]="['/folder/marketing']"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <span class="material-symbols-outlined text-slate-600"
                  >folder</span
                >
                <p class="text-slate-600 text-sm font-medium leading-normal">
                  Marketing
                </p>
                <span
                  class="ml-auto text-xs font-semibold text-slate-600 bg-slate-200 rounded-full px-2 py-0.5"
                  >1</span
                >
              </a>
            </div>
          </div>
        </div>
      </aside>
      <!-- Main Content -->
      <main class="flex-1 flex flex-col h-screen overflow-y-auto">
        <!-- Toolbar -->
        <div
          class="flex justify-between items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-10"
        >
          <div class="flex gap-2">
            <button
              class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled=""
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
            <button
              class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled=""
            >
              <span class="material-symbols-outlined">folder_open</span>
            </button>
            <button
              class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled=""
            >
              <span class="material-symbols-outlined">mark_email_unread</span>
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-600"
              >Priority Mode</span
            >
            <label class="relative inline-flex items-center cursor-pointer">
              <input class="sr-only peer" type="checkbox" value="" />
              <div
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
              ></div>
            </label>
          </div>
        </div>
        <!-- Email List Table -->
        <div class="flex-1 px-6 py-4 overflow-x-hidden">
          <div
            class="flex overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            <table class="w-full text-left">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 w-12">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </th>
                  <th
                    class="px-4 py-3 text-slate-800 w-1/4 text-sm font-medium"
                  >
                    Sender
                  </th>
                  <th
                    class="px-4 py-3 text-slate-800 w-1/2 text-sm font-medium"
                  >
                    Subject
                  </th>
                  <th
                    class="px-4 py-3 text-slate-800 w-auto text-sm font-medium"
                  ></th>
                  <th
                    class="px-4 py-3 text-slate-800 w-1/6 text-sm font-medium text-right"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <td class="px-4 py-2">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-4 py-2 text-slate-800 text-sm font-semibold">
                    Figma
                  </td>
                  <td class="px-4 py-2">
                    <span class="text-slate-800 text-sm font-semibold"
                      >You have 3 new comments</span
                    >
                    <span class="text-slate-500 text-sm ml-2 truncate"
                      >Hey, I've left some feedback on the latest designs for the homepage...</span
                    >
                  </td>
                  <td class="px-4 py-2 text-right">
                    <span class="material-symbols-outlined text-slate-400 text-lg">attachment</span>
                  </td>
                  <td class="px-4 py-2 text-slate-500 text-sm text-right">
                    3:45 PM
                  </td>
                </tr>
                <tr
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <td class="px-4 py-2">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-4 py-2 text-slate-600 text-sm">
                    John Appleseed
                  </td>
                  <td class="px-4 py-2">
                    <span class="text-slate-600 text-sm"
                      >Re: Project Alpha Kickoff</span
                    >
                    <span class="text-slate-500 text-sm ml-2 truncate"
                      >Thanks for setting this up. Looking forward to it!</span
                    >
                  </td>
                  <td class="px-4 py-2 text-right"></td>
                  <td class="px-4 py-2 text-slate-500 text-sm text-right">
                    11:20 AM
                  </td>
                </tr>
                <tr
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer bg-primary/10"
                >
                  <td class="px-4 py-2">
                    <input
                      checked=""
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-4 py-2 text-slate-800 text-sm font-semibold">
                    Slack
                  </td>
                  <td class="px-4 py-2">
                    <span class="text-slate-800 text-sm font-semibold"
                      >Your password has been changed</span
                    >
                    <span class="text-slate-500 text-sm ml-2 truncate"
                      >Your password for the Acme Inc workspace was changed on...</span
                    >
                  </td>
                  <td class="px-4 py-2 text-right"></td>
                  <td class="px-4 py-2 text-slate-500 text-sm text-right">
                    Yesterday
                  </td>
                </tr>
                <tr
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <td class="px-4 py-2">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-4 py-2 text-slate-600 text-sm">GitHub</td>
                  <td class="px-4 py-2">
                    <span class="text-slate-600 text-sm"
                      >[ui-kit] A new version has been released</span
                    >
                    <span class="text-slate-500 text-sm ml-2 truncate"
                      >Version 3.2.1 of our UI kit is now available with new components...</span
                    >
                  </td>
                  <td class="px-4 py-2 text-right"></td>
                  <td class="px-4 py-2 text-slate-500 text-sm text-right">
                    Yesterday
                  </td>
                </tr>
                <tr
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <td class="px-4 py-2">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-4 py-2 text-slate-600 text-sm">Jane Doe</td>
                  <td class="px-4 py-2">
                    <span class="text-slate-600 text-sm"
                      >Meeting Follow-up</span
                    >
                    <span class="text-slate-500 text-sm ml-2 truncate"
                      >Hi team, here are the notes from our meeting this morning.</span
                    >
                  </td>
                  <td class="px-4 py-2 text-right">
                    <span class="material-symbols-outlined text-slate-400 text-lg">attachment</span>
                  </td>
                  <td class="px-4 py-2 text-slate-500 text-sm text-right">
                    Oct 28
                  </td>
                </tr>
                <tr
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <td class="px-4 py-2">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-4 py-2 text-slate-600 text-sm">Linear</td>
                  <td class="px-4 py-2">
                    <span class="text-slate-600 text-sm"
                      >New issues assigned to you</span
                    >
                    <span class="text-slate-500 text-sm ml-2 truncate"
                      >2 new issues in the "Website Redesign" project have been assigned...</span
                    >
                  </td>
                  <td class="px-4 py-2 text-right"></td>
                  <td class="px-4 py-2 text-slate-500 text-sm text-right">
                    Oct 27
                  </td>
                </tr>
                <tr
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <td class="px-4 py-2">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-4 py-2 text-slate-600 text-sm">
                    Marketing Team
                  </td>
                  <td class="px-4 py-2">
                    <span class="text-slate-600 text-sm"
                      >Weekly Newsletter</span
                    >
                    <span class="text-slate-500 text-sm ml-2 truncate"
                      >Check out our latest product updates and company news!</span
                    >
                  </td>
                  <td class="px-4 py-2 text-right"></td>
                  <td class="px-4 py-2 text-slate-500 text-sm text-right">
                    Oct 26
                  </td>
                </tr>
                <tr
                  class="border-t border-t-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <td class="px-4 py-2">
                    <input
                      class="h-5 w-5 rounded border-slate-300 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-4 py-2 text-slate-600 text-sm">Alex Smith</td>
                  <td class="px-4 py-2">
                    <span class="text-slate-600 text-sm">Lunch plans?</span>
                    <span class="text-slate-500 text-sm ml-2 truncate"
                      >Hey, are you free for lunch tomorrow?</span
                    >
                  </td>
                  <td class="px-4 py-2 text-right"></td>
                  <td class="px-4 py-2 text-slate-500 text-sm text-right">
                    Oct 25
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Pagination -->
        <div
          class="flex items-center justify-center p-4 border-t border-gray-200 bg-white mt-auto"
        >
          <a [routerLink]="['/previous']"
            class="flex size-10 items-center justify-center text-slate-500 hover:text-primary"
          >
            <span class="material-symbols-outlined text-lg">chevron_left</span>
          </a>
          <a [routerLink]="['/inbox/1']"
            class="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white rounded-lg bg-primary"
            >1</a
          >
          <a [routerLink]="['/inbox/2']"
            class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100"
            >2</a
          >
          <a [routerLink]="['/inbox/3']"
            class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100"
            >3</a
          >
          <span
            class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-slate-600 rounded-lg"
            >...</span
          >
          <a [routerLink]="['/inbox/10']"
            class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100"
            >10</a
          >
          <a [routerLink]="['/next']"
            class="flex size-10 items-center justify-center text-slate-500 hover:text-primary"
          >
            <span class="material-symbols-outlined text-lg">chevron_right</span>
          </a>
        </div>
      </main>
    </div>
  `,
  styles: [`
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
  `],
})
export class Inbox {}
