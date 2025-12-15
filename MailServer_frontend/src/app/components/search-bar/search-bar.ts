import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SearchCriteria {
  sender?: string;
  receiver?: string;
  subject?: string;
  keywords?: string;
  hasAttachment?: boolean;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    <!-- Search Bar Container -->
    <div class="search-container">
      <!-- Main Search Input -->
      <div class="search-input-wrapper">
        <span class="material-symbols-outlined search-icon" (click)="performQuickSearch()">search</span>
        <input
          type="text"
          [(ngModel)]="quickSearch"
          (keyup.enter)="performQuickSearch()"
          placeholder="Search mail"
          class="search-input"
        />
        <button 
          (click)="toggleAdvancedSearch()"
          class="filter-button"
          title="Show search options"
        >
          <span class="material-symbols-outlined">tune</span>
        </button>
      </div>
    </div>

    <!-- Advanced Search Modal -->
    <div class="modal-overlay" [class.active]="showAdvancedSearch" (click)="closeModal($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Search mail</h2>
          <button (click)="closeModal($event)" class="close-button">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Sender Field -->
          <div class="form-field">
            <label class="field-label">Sender</label>
            <input
              type="text"
              [(ngModel)]="searchCriteria.sender"
              placeholder="sender@example.com"
              class="field-input"
            />
          </div>

          <!-- Receiver Field -->
          <div class="form-field">
            <label class="field-label">Receiver</label>
            <input
              type="text"
              [(ngModel)]="searchCriteria.receiver"
              placeholder="recipient@example.com"
              class="field-input"
            />
          </div>

          <!-- Subject Field -->
          <div class="form-field">
            <label class="field-label">Subject</label>
            <input
              type="text"
              [(ngModel)]="searchCriteria.subject"
              placeholder="Enter subject"
              class="field-input"
            />
          </div>

          <!-- Keywords Field -->
          <div class="form-field">
            <label class="field-label">Includes the words</label>
            <input
              type="text"
              [(ngModel)]="searchCriteria.keywords"
              placeholder="Enter keywords"
              class="field-input"
            />
          </div>

          <!-- Has Attachment Checkbox -->
          <div class="form-field checkbox-field">
            <label class="checkbox-label">
              <input
                type="checkbox"
                [(ngModel)]="searchCriteria.hasAttachment"
                class="checkbox-input"
              />
              <span>Has attachment</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button (click)="clearSearch()" class="secondary-button">
            Clear
          </button>
          <button (click)="search()" class="primary-button">
            Search
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    :host {
      font-family: 'Inter', sans-serif;
      display: block;
    }

    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }

    /* Search Bar Styles */
    .search-container {
      padding: 12px 24px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      max-width: 720px;
      margin: 0 auto;
      background: #f3f4f6;
      border-radius: 24px;
      padding: 0 16px;
      transition: all 0.2s ease;
    }

    .search-input-wrapper:focus-within {
      background: white;
      box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
    }

    .search-icon {
      color: #5f6368;
      margin-right: 12px;
      font-size: 20px;
      cursor: pointer;
      transition: background 0.2s ease;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -8px;
    }

    .search-icon:hover {
      background: #e8eaed;
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      padding: 12px 0;
      font-size: 16px;
      color: #202124;
    }

    .search-input::placeholder {
      color: #5f6368;
    }

    .filter-button {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5f6368;
      transition: background 0.2s ease;
    }

    .filter-button:hover {
      background: #e8eaed;
    }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 80px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Modal Content */
    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      transform: translateY(-20px);
      transition: transform 0.3s ease;
    }

    .modal-overlay.active .modal-content {
      transform: translateY(0);
    }

    /* Modal Header */
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #202124;
      margin: 0;
    }

    .close-button {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5f6368;
      transition: background 0.2s ease;
    }

    .close-button:hover {
      background: #f3f4f6;
    }

    /* Modal Body */
    .modal-body {
      padding: 24px;
    }

    .form-field {
      margin-bottom: 20px;
    }

    .field-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #5f6368;
      margin-bottom: 8px;
    }

    .field-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #dadce0;
      border-radius: 8px;
      font-size: 14px;
      color: #202124;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .field-input:focus {
      border-color: #137fec;
      box-shadow: 0 0 0 3px rgba(19, 127, 236, 0.1);
    }

    .field-input::placeholder {
      color: #9aa0a6;
    }

    /* Checkbox Field */
    .checkbox-field {
      display: flex;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      color: #202124;
    }

    .checkbox-input {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      cursor: pointer;
      accent-color: #137fec;
    }

    /* Modal Footer */
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
    }

    .secondary-button,
    .primary-button {
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .secondary-button {
      background: transparent;
      color: #137fec;
    }

    .secondary-button:hover {
      background: #f0f7ff;
    }

    .primary-button {
      background: #137fec;
      color: white;
    }

    .primary-button:hover {
      background: #0d6efd;
      box-shadow: 0 2px 8px rgba(19, 127, 236, 0.3);
    }

    .primary-button:active,
    .secondary-button:active {
      transform: scale(0.98);
    }
  `]
})
export class SearchBarComponent {
  @Output() onSearch = new EventEmitter<SearchCriteria>();
  
  showAdvancedSearch = false;
  quickSearch = '';
  searchCriteria: SearchCriteria = {};

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  closeModal(event: Event) {
    this.showAdvancedSearch = false;
  }

  performQuickSearch() {
    if (this.quickSearch.trim()) {
      this.onSearch.emit({ keywords: this.quickSearch });
    }
  }

  search() {
    // Remove empty fields
    const criteria = Object.fromEntries(
      Object.entries(this.searchCriteria).filter(([_, v]) => v !== '' && v !== undefined)
    );
    
    this.onSearch.emit(criteria);
    this.showAdvancedSearch = false;
  }

  clearSearch() {
    this.searchCriteria = {};
    this.quickSearch = '';
  }
}