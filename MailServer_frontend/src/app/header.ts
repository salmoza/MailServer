import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderStateService } from './Dtos/FolderStateService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative" #dropdownWrapper>
      <!-- Avatar circle -->
      <div
        class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 cursor-pointer overflow-hidden"
        (click)="toggleDropdown()"
      >
        <img
          class="w-full h-full object-cover"
          [src]="avatarUrl"
          alt="avatar"
        />
      </div>

      <!-- Dropdown -->
      <div
        class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        *ngIf="dropdownOpen"
      >
        <div class="px-4 py-3 border-b border-gray-200">
          <p class="text-sm font-semibold text-gray-800">
            {{ folderStateService.userData()?.username?.trim() || folderStateService.userData()?.email }}
          </p>
          <p
            class="text-xs text-gray-500 truncate"
            *ngIf="folderStateService.userData()?.username?.trim()"
          >
            {{ folderStateService.userData()?.email }}
          </p>
        </div>
        <div class="flex flex-col p-1">
        <button
          class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer text-red-600"
          (click)="signOut()"
        >
          Sign out
        </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      img {
        object-fit: cover;
      }
    `,
  ],
})
export class HeaderComponent {
  dropdownOpen = false;
  avatarUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Placeholder avatar image
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;

  constructor(public folderStateService: FolderStateService, private router: Router) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  signOut() {
    this.dropdownOpen = false;
    this.router.navigate(['/login']);
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.dropdownWrapper && !this.dropdownWrapper.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
