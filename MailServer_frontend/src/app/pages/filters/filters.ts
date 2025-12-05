import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Use RouterLink for Angular navigation

@Component({
  selector: 'app-filters',
  standalone: true,
  // We need CommonModule for basic Angular directives and RouterLink for navigation
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Global resource loading added for robustness -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root font-display bg-[#f6f7f8]">
      <div class="layout-container flex h-full grow flex-row">
        <!-- SideNavBar -->
        <aside
          class="flex flex-col w-64 bg-white/50 border-r border-slate-200 p-4"
        >
          <div class="flex flex-col gap-4 mb-8">
            <div class="flex gap-3 items-center">
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="User profile picture"
                style="
                  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA447_wklMZd-2VV8sVchqiaOvNZ366KOK3KCNoeO8Dw3O7RB_88wov-EQ4FWOyq_UvPnkGUqkzXiKt65reunl6W_qiH2y4HpJTSgfB6EC6OwKLQMFyAfqIuNrhnzbi7Zz4Er-S75Zpt7N-D8D4duySP0OA9ITIMnDyl4aM7zOrlOYQPXgSyHxq9LLH9NsYw');
                "
              ></div>
              <div class="flex flex-col">
                <h1 class="text-slate-800 text-sm font-medium leading-normal">
                  Alex Morgan
                </h1>
                <p class="text-slate-500 text-xs font-normal leading-normal">
                  alex.morgan@example.com
                </p>
              </div>
            </div>
          </div>
          <nav class="flex-1 flex flex-col gap-2">
            <a [routerLink]="['/inbox']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              <span class="material-symbols-outlined text-lg">inbox</span>
              <p class="text-sm font-medium leading-normal">Inbox</p>
            </a>
            <a [routerLink]="['/mail']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              <span class="material-symbols-outlined text-lg">send</span>
              <p class="text-sm font-medium leading-normal">Sent</p>
            </a>
            <a [routerLink]="['/drafts']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              <span class="material-symbols-outlined text-lg">draft</span>
              <p class="text-sm font-medium leading-normal">Drafts</p>
            </a>
            <a [routerLink]="['/spam']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              <span class="material-symbols-outlined text-lg">report</span>
              <p class="text-sm font-medium leading-normal">Spam</p>
            </a>
            <a [routerLink]="['/trash']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
              <p class="text-sm font-medium leading-normal">Trash</p>
            </a>
            <a [routerLink]="['/archive']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              <span class="material-symbols-outlined text-lg">archive</span>
              <p class="text-sm font-medium leading-normal">Archive</p>
            </a>
          </nav>
          <div class="flex flex-col gap-1 mt-auto">
            <a [routerLink]="['/filters']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#137fec]/20 text-[#137fec]"
            >
              <span class="material-symbols-outlined text-lg">tune</span>
              <p class="text-sm font-medium leading-normal">Filters</p>
            </a>
            <a [routerLink]="['/settings']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              <span class="material-symbols-outlined text-lg">settings</span>
              <p class="text-sm font-medium leading-normal">Settings</p>
            </a>
            <a [routerLink]="['/login']"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              <span class="material-symbols-outlined text-lg">logout</span>
              <p class="text-sm font-medium leading-normal">Logout</p>
            </a>
          </div>
        </aside>
        <!-- Main Content -->
        <main class="flex-1 p-8">
          <div class="w-full max-w-5xl mx-auto">
            <!-- Page Heading -->
            <header class="mb-8">
              <p
                class="text-slate-800 text-4xl font-black leading-tight tracking-[-0.033em]"
              >
                Manage Filters
              </p>
            </header>
            <!-- Create Filter Form -->
            <section
              class="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <h2
                class="text-slate-800 text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6"
              >
                Create a new filter
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <label class="flex flex-col w-full">
                  <p
                    class="text-slate-700 text-sm font-medium leading-normal pb-2"
                  >
                    If the message...
                  </p>
                  <select
                    class="form-select w-full rounded-lg text-slate-800 border-slate-300 bg-[#f6f7f8] focus:border-[#137fec] focus:ring-[#137fec] h-12"
                  >
                    <option>Subject</option>
                    <option>From</option>
                    <option>Body</option>
                    <option>Priority</option>
                  </select>
                </label>
                <label class="flex flex-col w-full">
                  <p
                    class="text-slate-700 text-sm font-medium leading-normal pb-2"
                  >
                    Operator
                  </p>
                  <select
                    class="form-select w-full rounded-lg text-slate-800 border-slate-300 bg-[#f6f7f8] focus:border-[#137fec] focus:ring-[#137fec] h-12"
                  >
                    <option>Contains</option>
                    <option>Equals</option>
                    <option>Does not contain</option>
                  </select>
                </label>
                <label class="flex flex-col w-full">
                  <p
                    class="text-slate-700 text-sm font-medium leading-normal pb-2"
                  >
                    Value
                  </p>
                  <input
                    class="form-input w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-0 focus:ring-[#137fec] border border-slate-300 bg-[#f6f7f8] focus:border-[#137fec] h-12 placeholder:text-slate-400 text-base font-normal leading-normal"
                    placeholder="Enter keyword or email"
                    value=""
                  />
                </label>
                <label class="flex flex-col w-full">
                  <p
                    class="text-slate-700 text-sm font-medium leading-normal pb-2"
                  >
                    Then move it to...
                  </p>
                  <select
                    class="form-select w-full rounded-lg text-slate-800 border-slate-300 bg-[#f6f7f8] focus:border-[#137fec] focus:ring-[#137fec] h-12"
                  >
                    <option>Receipts</option>
                    <option>Work</option>
                    <option>Family</option>
                    <option>Archive</option>
                  </select>
                </label>
              </div>
              <div class="mt-6 flex justify-end">
                <button
                  class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#137fec] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#137fec]/90 transition-colors"
                >
                  <span class="truncate">Create Filter</span>
                </button>
              </div>
            </section>
            <!-- Existing Filters List -->
            <section class="mt-10">
              <h2
                class="text-slate-800 text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4"
              >
                Your Filters
              </h2>
              <div
                class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead class="bg-slate-50">
                    <tr>
                      <th class="p-4 text-sm font-semibold text-slate-600">
                        Rule
                      </th>
                      <th class="p-4 text-sm font-semibold text-slate-600">
                        Action
                      </th>
                      <th
                        class="p-4 text-sm font-semibold text-slate-600 text-right"
                      >
                        Manage
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <!-- Static Filter Rows (Angular loop needed here later) -->
                    <tr class="border-t border-slate-200">
                      <td class="p-4 text-slate-700 text-sm">
                        Subject contains "Invoice"
                      </td>
                      <td class="p-4 text-slate-700 text-sm">
                        Move to "Receipts"
                      </td>
                      <td class="p-4">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200/60 text-slate-600 transition-colors"
                            data-alt="Edit filter button"
                          >
                            <span class="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            class="flex items-center justify-center size-9 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                            data-alt="Delete filter button"
                          >
                            <span class="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr class="border-t border-slate-200">
                      <td class="p-4 text-slate-700 text-sm">
                        From equals "newsletter@example.com"
                      </td>
                      <td class="p-4 text-slate-700 text-sm">
                        Move to "Archive"
                      </td>
                      <td class="p-4">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200/60 text-slate-600 transition-colors"
                            data-alt="Edit filter button"
                          >
                            <span class="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            class="flex items-center justify-center size-9 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                            data-alt="Delete filter button"
                          >
                            <span class="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr class="border-t border-slate-200">
                      <td class="p-4 text-slate-700 text-sm">
                        Body contains "unsubscribe"
                      </td>
                      <td class="p-4 text-slate-700 text-sm">
                        Move to "Spam"
                      </td>
                      <td class="p-4">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            class="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200/60 text-slate-600 transition-colors"
                            data-alt="Edit filter button"
                          >
                            <span class="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            class="flex items-center justify-center size-9 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                            data-alt="Delete filter button"
                          >
                            <span class="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* 1. We define the font-family globally here, assuming the font files can be reached */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    /* 2. Base styles */
    :host {
      /* Apply font to the host element */
      font-family: 'Inter', sans-serif;
    }

    .material-symbols-outlined {
      /* Ensure icons are correctly rendered */
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }

    /* FIX: Re-enforcing colors for non-tailwind elements like buttons/links if needed */
    .bg-primary {
      background-color: #137fec;
    }
    .text-primary {
      color: #137fec;
    }
    .focus\\:border-primary, .focus\\:ring-primary {
      --tw-ring-color: #137fec;
      border-color: #137fec;
    }

    /* CRITICAL FIX: Target the form input explicitly with high specificity */
    /* THIS IS THE NEW RULE THAT COMBINES THE TAG AND THE CLASS */
    :host input.form-input {
      /* Set to h-12 equivalent (48px) and use !important to be absolutely sure */
      height: 48px !important;
      /* Added box sizing fix as height issues often stem from padding/border */
      box-sizing: border-box !important;
    }
  `],
})
export class Filters {}
