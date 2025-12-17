import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SearchCriteria {
  keywords?: string;
  advancedSearch?: {
    sender?: string;
    receiver?: string;
    subject?: string;
    body?: string;
  };
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-20">
      <!-- Quick Search -->
      <div class="flex gap-2 items-center">
        <div class="flex-1 flex items-center gap-2 rounded-lg border border-slate-300 bg-[#f6f7f8] px-4 h-12">
          <span class="material-symbols-outlined text-slate-400">search</span>
          <input
            [(ngModel)]="quickSearchKeyword"
            (keyup.enter)="performQuickSearch()"
            class="flex-1 bg-transparent border-0 text-slate-800 placeholder:text-slate-400 focus:outline-0 text-sm"
            placeholder="Search emails..."
          />
          @if (quickSearchKeyword) {
            <button (click)="clearQuickSearch()" class="text-slate-400 hover:text-slate-600">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          }
        </div>
        <button
          (click)="performQuickSearch()"
          class="px-4 h-12 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
        >
          Search
        </button>
        <button
          (click)="toggleAdvancedSearch()"
          class="px-4 h-12 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
          [class.bg-primary]="showAdvancedSearch"
          [class.text-white]="showAdvancedSearch"
          [class.bg-slate-100]="!showAdvancedSearch"
          [class.text-slate-700]="!showAdvancedSearch"
          [class.hover:bg-blue-700]="showAdvancedSearch"
          [class.hover:bg-slate-200]="!showAdvancedSearch"
        >
          <span class="material-symbols-outlined text-lg">tune</span>
          Filters
        </button>
        <button
          (click)="clearAllSearch()"
          class="px-4 h-12 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm"
          title="Clear search and show all emails"
        >
          Clear
        </button>
      </div>

      <!-- Advanced Search Panel -->
      @if (showAdvancedSearch) {
        <div class="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 class="text-sm font-semibold text-slate-700 mb-3">Advanced Filters</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Sender</label>
              <input
                [(ngModel)]="advancedFilters.sender"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-0 focus:ring-2 focus:ring-primary placeholder:text-slate-400"
                placeholder="Email | Username | Contact"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Receiver</label>
              <input
                [(ngModel)]="advancedFilters.receiver"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-0 focus:ring-2 focus:ring-primary placeholder:text-slate-400"
                placeholder="Email | Username | Contact"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Subject</label>
              <input
                [(ngModel)]="advancedFilters.subject"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-0 focus:ring-2 focus:ring-primary placeholder:text-slate-400"
                placeholder="Subject Text"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Body</label>
              <input
                [(ngModel)]="advancedFilters.body"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-0 focus:ring-2 focus:ring-primary placeholder:text-slate-400"
                placeholder="Body Text"
              />
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button
              (click)="performAdvancedSearch()"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium text-sm"
            >
              Apply Filters
            </button>
            <button
              (click)="clearAdvancedSearch()"
              class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    
    .bg-primary {
      background-color: #137fec !important;
    }
    
    .text-primary {
      color: #137fec !important;
    }
    
    .focus\\:ring-primary:focus {
      --tw-ring-color: #137fec !important;
    }
    
    .bg-primary\\/90:hover {
      background-color: rgba(19, 127, 236, 0.9) !important;
    }

    button {
      cursor: pointer;
    }

    button:hover {
      transition: background-color 0.2s ease, color 0.2s ease;
    }
  `]
})
export class SearchBarComponent {
  @Output() onSearch = new EventEmitter<SearchCriteria>();
  @Output() onClear = new EventEmitter<void>();

  quickSearchKeyword = '';
  showAdvancedSearch = false;
  advancedFilters = {
    sender: '',
    receiver: '',
    subject: '',
    body: ''
  };

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  performQuickSearch() {
    if (this.quickSearchKeyword.trim()) {
      this.onSearch.emit({ keywords: this.quickSearchKeyword });
    }
  }

  performAdvancedSearch() {
    const hasFilters = Object.values(this.advancedFilters).some(v => v.trim());
    if (hasFilters) {
      this.onSearch.emit({ advancedSearch: this.advancedFilters });
    }
  }

  clearQuickSearch() {
    this.quickSearchKeyword = '';
    this.onClear.emit();
  }

  clearAdvancedSearch() {
    this.advancedFilters = {
      sender: '',
      receiver: '',
      subject: '',
      body: ''
    };
    this.onClear.emit();
  }

  clearAllSearch() {
    this.quickSearchKeyword = '';
    this.advancedFilters = {
      sender: '',
      receiver: '',
      subject: '',
      body: ''
    };
    this.showAdvancedSearch = false;
    this.onClear.emit();
  }
}