import {inject, Injectable} from '@angular/core';
import {BehaviorSubject,Observable} from 'rxjs';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private initalUserId = localStorage.getItem("userId");
  private currentUserSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthernticated(): boolean {
    return !!this.currentUserSubject.value
  }
  public setAuthenticatedUser(userId:string):void {
    localStorage.setItem('user_id', userId);
    this.currentUserSubject.next(userId);
  }

  public logout(): void {
    localStorage.removeItem('user_id');
    this.currentUserSubject.next(null);
    const router = inject(Router);
    router.navigate(['/login']);
  }
}
