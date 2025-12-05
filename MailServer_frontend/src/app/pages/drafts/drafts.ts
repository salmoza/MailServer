import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Global resource loading added for robustness -->
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
      rel="stylesheet"
    />
    <!-- Main Container: Removed dark:bg classes -->
    <div
      class="relative flex min-h-screen w-full flex-col bg-[#f6f7f8] font-display group/design-root overflow-x-hidden"
    >
      <div class="flex flex-grow">
        <!-- SideNavBar -->
        <aside
          class="flex h-screen min-h-full w-64 flex-col border-r border-gray-200 bg-white p-4 sticky top-0 z-10"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3 px-2">
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="User avatar of Eleanor Vance"
                style="
                  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMSSUljiSO1pCoQxoJ0ElknhRadBUVyD8hDwyi3i5in6Gn5MPe2zf4DRJcRrAvupZq6bqmyr85SRrrH8aI9FsVwJPrEaIZWKOLx_IPf8Xzp0LLAmNnHKRAeFJgmhje4bUa2nKB1HZgDdHeADvBD7KFaoaG5h8CEGoHycBgX41J0mTVfHUy9MImELDputc0Jwk-zIkwO9wSEjI9cFVOtfKZJPMN8dLvbOgrjU396BwGwchfptHrr_jQZcrexrZZj9zTQ1Rklal4upc');
                "
              ></div>
              <div class="flex flex-col">
                <!-- Text Color Fix: Ensure text is dark -->
                <h1 class="text-gray-900 text-base font-medium leading-normal">
                  Eleanor Vance
                </h1>
                <p class="text-gray-500 text-sm font-normal leading-normal">
                  eleanor.v@example.com
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-1 mt-4">
              <!-- Sidebar Navigation (Removed dark: classes) -->
              <a [routerLink]="['/inbox']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined text-gray-800"
                >inbox</span
                >
                <p class="text-sm font-medium leading-normal">Inbox</p>
              </a>
              <a [routerLink]="['/compose']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined text-gray-800">send</span>
                <p class="text-sm font-medium leading-normal">Sent</p>
              </a>
              <!-- Active Drafts Link -->
              <a [routerLink]="['/drafts']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#137fec]/20"
              >
                <span
                  class="material-symbols-outlined text-[#137fec]"
                  style="font-variation-settings: 'FILL' 1"
                >drafts</span
                >
                <p class="text-[#137fec] text-sm font-medium leading-normal">
                  Drafts
                </p>
              </a>
              <a [routerLink]="['/spam']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined text-gray-800"
                >report</span
                >
                <p class="text-sm font-medium leading-normal">Spam</p>
              </a>
              <a [routerLink]="['/trash']"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <span class="material-symbols-outlined text-gray-800"
                >delete</span
                >
                <p class="text-sm font-medium leading-normal">Trash</p>
              </a>
            </div>
          </div>
          <button [routerLink]="['/compose']"
                  class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 mt-auto bg-[#137fec] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#137fec]/90"
          >
            <span class="truncate">New Email</span>
          </button>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-8">
          <div class="w-full max-w-7xl mx-auto">
            <!-- PageHeading -->
            <div class="flex flex-wrap justify-between gap-3 p-4">
              <p
                class="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72"
              >
                Drafts
              </p>
            </div>
            <div
              class="bg-white rounded-lg border border-gray-200 mt-4"
            >
              <!-- ToolBar -->
              <div
                class="flex justify-between items-center gap-2 px-4 py-3 border-b border-gray-200"
              >
                <div class="flex items-center gap-2">
                  <input
                    class="h-5 w-5 rounded border-gray-300 bg-transparent text-[#137fec] checked:bg-[#137fec] checked:border-[#137fec] focus:ring-1 focus:ring-[#137fec]"
                    type="checkbox"
                  />
                  <button
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    disabled=""
                  >
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                  <button
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    <span class="material-symbols-outlined">refresh</span>
                  </button>
                </div>
              </div>
              <!-- Table -->
              <div class="px-4 py-3 @container">
                <div class="flex overflow-hidden">
                  <table class="w-full">
                    <thead>
                    <tr class="border-b border-gray-200">
                      <th class="px-4 py-3 text-left w-12"></th>
                      <th
                        class="px-4 py-3 text-left text-gray-800 text-sm font-medium leading-normal w-1/4"
                      >
                        Recipient
                      </th>
                      <th
                        class="px-4 py-3 text-left text-gray-800 text-sm font-medium leading-normal w-1/2"
                      >
                        Subject
                      </th>
                      <th
                        class="px-4 py-3 text-left text-gray-800 text-sm font-medium leading-normal"
                      >
                        Last Modified
                      </th>
                      <th
                        class="px-4 py-3 text-left text-gray-500 text-sm font-medium leading-normal"
                      >
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <!-- Table Rows (Removed dark: classes) -->
                    <tr
                      class="border-b border-gray-200 hover:bg-gray-50 group"
                    >
                      <td class="h-[72px] px-4 py-2">
                        <input
                          class="h-5 w-5 rounded border-gray-300 bg-transparent text-[#137fec] checked:bg-[#137fec] checked:border-[#137fec] focus:ring-1 focus:ring-[#137fec]"
                          type="checkbox"
                        />
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-normal leading-normal"
                      >
                        Aria Monroe
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-500 text-sm font-normal leading-normal"
                      >
                        Project Phoenix Kick-off
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]"
                      >
                        2 hours ago
                      </td>
                      <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <div
                          class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr
                      class="border-b border-gray-200 hover:bg-gray-50 group"
                    >
                      <td class="h-[72px] px-4 py-2">
                        <input
                          class="h-5 w-5 rounded border-gray-300 bg-transparent text-[#137fec] checked:bg-[#137fec] checked:border-[#137fec] focus:ring-1 focus:ring-[#137fec]"
                          type="checkbox"
                        />
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-normal leading-normal"
                      >
                        Liam Gallagher
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-500 text-sm font-normal leading-normal"
                      >
                        Re: Q2 Financial Report
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]"
                      >
                        Yesterday
                      </td>
                      <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <div
                          class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr
                      class="border-b border-gray-200 hover:bg-gray-50 group"
                    >
                      <td class="h-[72px] px-4 py-2">
                        <input
                          class="h-5 w-5 rounded border-gray-300 bg-transparent text-[#137fec] checked:bg-[#137fec] checked:border-[#137fec] focus:ring-1 focus:ring-[#137fec]"
                          type="checkbox"
                        />
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-normal leading-normal"
                      >
                        s.chen@corp.net
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-500 text-sm font-normal leading-normal italic"
                      >
                        (no subject)
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]"
                      >
                        Mar 15
                      </td>
                      <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <div
                          class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr
                      class="border-b border-gray-200 hover:bg-gray-50 group"
                    >
                      <td class="h-[72px] px-4 py-2">
                        <input
                          class="h-5 w-5 rounded border-gray-300 bg-transparent text-[#137fec] checked:bg-[#137fec] checked:border-[#137fec] focus:ring-1 focus:ring-[#137fec]"
                          type="checkbox"
                        />
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-normal leading-normal"
                      >
                        Marketing Team
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-500 text-sm font-normal leading-normal"
                      >
                        Weekly Newsletter Draft
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]"
                      >
                        Mar 14
                      </td>
                      <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <div
                          class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50 group">
                      <td class="h-[72px] px-4 py-2">
                        <input
                          class="h-5 w-5 rounded border-gray-300 bg-transparent text-[#137fec] checked:bg-[#137fec] checked:border-[#137fec] focus:ring-1 focus:ring-[#137fec]"
                          type="checkbox"
                        />
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-normal leading-normal"
                      >
                        Dr. Evans
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-500 text-sm font-normal leading-normal"
                      >
                        Follow-up on our meeting
                      </td>
                      <td
                        class="h-[72px] px-4 py-2 text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]"
                      >
                        Mar 12
                      </td>
                      <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <div
                          class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
                          >
                            <span class="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            class="p-2 text-gray-600 hover:text-gray-900"
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
              <!-- Pagination -->
              <div
                class="flex items-center justify-end p-4 border-t border-gray-200"
              >
                <a [routerLink]="['/previous']"
                   class="flex size-10 items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  <span class="material-symbols-outlined">chevron_left</span>
                </a>
                <a [routerLink]="['/drafts/1']"
                   class="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white rounded-full bg-primary"
                >
                  1
                </a>
                <a [routerLink]="['/drafts/2']"
                   class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 rounded-full hover:bg-gray-100"
                >2</a
                >
                <a [routerLink]="['/drafts/3']"
                   class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 rounded-full hover:bg-gray-100"
                >3</a
                >
                <span
                  class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 rounded-full"
                >...</span
                >
                <a [routerLink]="['/drafts/10']"
                   class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-gray-700 rounded-full hover:bg-gray-100"
                >10</a
                >
                <a [routerLink]="['/next']"
                   class="flex size-10 items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  <span class="material-symbols-outlined">chevron_right</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* 1. We define the font-family globally here, assuming the font files can be reached */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap)');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap](https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap)');

    /* 2. Base styles */
    :host {
      /* Apply font to the host element */
      font-family: 'Inter', sans-serif;
      /* FIX: Ensure host takes full height and background */
      min-height: 100vh;
      display: block;
      /* FIX: Explicitly enforce light background */
      background-color: #f6f7f8;
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

    /* FIX: Neutralize dark mode effects by setting light mode defaults */
    /* This overrides the global dark: rules that might be leaking through */
    :host * {
      color: inherit !important; /* Ensure text color respects light context */
    }

    /* Target dark background classes and set them to light/transparent */
    .dark\\:bg-\\[\\#101922\\], .dark\\:bg-gray-700, .dark\\:bg-gray-800, .dark\\:bg-gray-900, .dark\\:bg-slate-800 {
      background-color: transparent !important; /* Neutralize dark backgrounds */
      color: inherit !important;
    }

    .dark\\:border-gray-700 {
      border-color: #e5e7eb !important; /* Light border color */
    }

    .dark\\:text-white {
      color: #1f2937 !important; /* Force dark text color */
    }
  `],
})
export class Drafts {}
