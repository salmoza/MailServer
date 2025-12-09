import { Injectable, signal, Signal } from '@angular/core';

// Define the initial empty state
const DEFAULT_USER_STATE: UserData = {
  userId: '',
  username: '',
  email: '',
  inboxFolderId: '',
  sentFolderId: '',
  draftsFolderId: '',
  trashFolderId: '',
};

@Injectable({
  providedIn: 'root'
})
export class FolderStateService {

  private userState = signal<UserData>(DEFAULT_USER_STATE);

  public userData: Signal<UserData> = this.userState.asReadonly();

  public initializeState(data: UserData): void {
    this.userState.set(data);

    localStorage.setItem('user_id', data.userId);
  }
  public clearState(): void {
    this.userState.set(DEFAULT_USER_STATE);
    localStorage.removeItem('user_id');
  }
}
