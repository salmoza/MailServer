import {inject, Injectable} from '@angular/core';
import {BehaviorSubject,Observable} from 'rxjs';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthernticated(): boolean {
    const initalUserId = localStorage.getItem("userId");
    if(initalUserId != null){
      return true;
    }
    return false;
  }
  public setAuthenticatedUser(userId:string):void {
    localStorage.setItem('userId', userId);
  }

  public logout(): void {
    localStorage.removeItem('userId');
    const router = inject(Router);
    router.navigate(['/login']);
  }
}
