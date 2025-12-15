import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Auth/AuthService'; 
import { FolderStateService } from '../Dtos/FolderStateService'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const folderService = inject(FolderStateService);
  const router = inject(Router);

  
  const isAuthenticated = authService.isAuthernticated();
  
  
  const hasStateLoaded = folderService.userData().inboxFolderId !== '';

  if (isAuthenticated && hasStateLoaded) {
    return true;
  } else {
    
    console.log("State lost or not authenticated. Redirecting to /login.");
    router.navigate(['/login']);
    return false;
  }
};