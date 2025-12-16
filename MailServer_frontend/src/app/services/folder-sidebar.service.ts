import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MailShuttleService } from '../Dtos/MailDetails';
import { FolderStateService } from '../Dtos/FolderStateService';

interface FolderMessages {
  success?: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class FolderSidebarService {
  constructor(
    private router: Router,
    private mailDetails: MailShuttleService,
    private http: HttpClient,
    private folderStateService: FolderStateService,
  ) {}

  getActiveCustomFolderId(): string {
    return this.router.url.includes('/Custom') ? this.mailDetails.getCustomId() : '';
  }

  navigateToCustomFolder(folderId: string): boolean {
    this.mailDetails.setCustom(folderId);
    const alreadyOnCustom = this.router.url.includes('/Custom');

    if (!alreadyOnCustom) {
      this.router.navigate(['/Custom']);
    }

    return alreadyOnCustom;
  }

  openCreateFolderModal(): boolean {
    return true;
  }

  renameFolder(folderId: string, newName: string, refresh: () => void, messages?: FolderMessages): void {
    const url = `http://localhost:8080/api/folders/${folderId}`;
    const params = new HttpParams().set('newName', newName);

    this.http.put(url, null, { params }).subscribe({
      next: () => {
        refresh();
        // alert(messages?.success ?? 'Folder renamed successfully');
      },
      error: () => {
        alert(messages?.error ?? 'Failed to rename folder');
      },
    });
  }

  deleteFolder(folderId: string, refresh: () => void, messages?: FolderMessages): void {
    const userId = this.folderStateService.userData().userId;
    if (!userId) {
      console.error('deleteFolder called without a user id');
      alert(messages?.error ?? 'Failed to delete folder');
      return;
    }

    const url = `http://localhost:8080/api/folders/${folderId}/${userId}`;

    this.http.delete(url, { responseType: 'text' }).subscribe({
      next: () => {
        refresh();
        // alert(messages?.success ?? 'Folder deleted successfully');
      },
      error: () => {
        alert(messages?.error ?? 'Failed to delete folder');
      },
    });
  }
}
