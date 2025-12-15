import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {routes} from '../../app.routes';
import {HttpClient, HttpClientModule, provideHttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'; // Use RouterLink for Angular navigation
import {AuthService} from '../../Auth/AuthService';
import {FolderStateService} from '../../Dtos/FolderStateService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule,RouterLink],
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>


    <div
      class="auth-wrapper flex min-h-screen w-full flex-col items-center justify-center
             bg-[#f6f7f8] p-4 font-display"
      [class.active]="!issign_up"
    >
      <div class="w-full max-w-md space-y-8">
        <div class="flex flex-col items-center justify-center space-y-4">
          <!-- Main Icon: Sized directly via class -->
          <span class="material-symbols-outlined text-[#137fec] text-7xl">mark_email_unread</span>
          <h1 class="text-3xl font-bold tracking-tight text-[#0d141b]">
            Sign in to your account
          </h1>
        </div>
        <div
          class="flex w-full flex-col rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <form class="flex flex-col space-y-6">
            <div class="flex flex-col space-y-2">
              <label for="email-address">
                <p class="pb-2 text-base font-medium text-[#0d141b]">
                  Email address
                </p>
                <input
                  autocomplete="email"
                  class="form-input flex h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#cfdbe7] bg-slate-50 p-[15px] text-base font-normal leading-normal text-[#0d141b] placeholder:text-[#4c739a] focus:border-[#137fec] focus:outline-none focus:ring-2 focus:ring-[#137fec]/20"
                  id="email-address"
                  name="email"
                  placeholder="Enter your email"
                  required=""
                  type="email"
                  value=""
                  [(ngModel)]="email"
                />
              </label>
            </div>
            <div class="flex flex-col space-y-2">
              <div class="flex items-center justify-between">
                <label
                  class="text-base font-medium text-[#0d141b]"
                  for="password"
                >Password</label
                >
              </div>
              <div class="relative flex w-full flex-1 items-stretch">
                <input
                  autocomplete="current-password"
                  class="form-input flex h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#cfdbe7] bg-slate-50 p-[15px] text-base font-normal leading-normal text-[#0d141b] placeholder:text-[#4c739a] focus:border-[#137fec] focus:outline-none focus:ring-2 focus:ring-[#137fec]/20"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required=""
                  type="password"
                  value=""
                  [(ngModel)]="password"
                />
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4c739a]"
                >
                  <span class="material-symbols-outlined cursor-pointer" data-icon="Eye"
                  >visibility</span
                  >
                </div>
              </div>
            </div>
            <button
              class="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#137fec] px-5 text-base font-bold leading-normal tracking-[0.015em] text-slate-50 transition-colors hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-[#137fec] focus:ring-offset-2 focus:ring-offset-white"
            (click)="login()">
              <span class="truncate">Login</span>
            </button>
          </form>
        </div>
        <p class="text-center text-sm text-[#4c739a]">
          Don't have an account?
          <!-- Use (click) to toggle the state -->
          <span (click)="issign_up = true" class="font-medium text-[#137fec] underline-offset-4 hover:underline cursor-pointer"
          >Sign Up</span
          >
        </p>
      </div>
    </div>


    <div
      class="auth-wrapper flex min-h-screen w-full flex-col items-center justify-center
             bg-[#f6f7f8] p-4 font-display"
      [class.active]="issign_up" >
      <div class="w-full max-w-md space-y-8">
        <div class="flex flex-col items-center justify-center space-y-4">
          <span class="material-symbols-outlined text-[#137fec] text-7xl">mark_email_unread</span>
          <h1 class="text-3xl font-bold tracking-tight text-[#0d141b]">
            Sign up
          </h1>
        </div>
        <div
          class="flex w-full flex-col rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <form class="flex flex-col space-y-6">
            <div class="flex flex-col space-y-2">
              <label for="email-address-up">
                <p class="pb-2 text-base font-medium text-[#0d141b]">
                  Email address
                </p>
                <input
                  autocomplete="email"
                  class="form-input flex h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#cfdbe7] bg-slate-50 p-[15px] text-base font-normal leading-normal text-[#0d141b] placeholder:text-[#4c739a] focus:border-[#137fec] focus:outline-none focus:ring-2 focus:ring-[#137fec]/20"
                  id="email-address-up"
                  name="email"
                  placeholder="Enter your email"
                  required=""
                  type="email"
                  value=""
                  [(ngModel)]="email"
                />
              </label>
            </div>
            <div class="flex flex-col space-y-2">
              <label for="username-up">
                <p class="pb-2 text-base font-medium text-[#0d141b]">
                  User name
                </p>
                <input
                  class="form-input flex h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#cfdbe7] bg-slate-50 p-[15px] text-base font-normal leading-normal text-[#0d141b] placeholder:text-[#4c739a] focus:border-[#137fec] focus:outline-none focus:ring-2 focus:ring-[#137fec]/20"
                  id="username-up"
                  name="username"
                  placeholder="Enter your username"
                  required=""
                  type="text"
                  value=""
                  [(ngModel)]="username"
                />
              </label>
            </div>
            <div class="flex flex-col space-y-2">
              <div class="flex items-center justify-between">
                <label
                  class="text-base font-medium text-[#0d141b]"
                  for="password-up"
                >Password</label
                >
              </div>
              <div class="relative flex w-full flex-1 items-stretch">
                <input
                  autocomplete="current-password"
                  class="form-input flex h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#cfdbe7] bg-slate-50 p-[15px] text-base font-normal leading-normal text-[#0d141b] placeholder:text-[#4c739a] focus:border-[#137fec] focus:outline-none focus:ring-2 focus:ring-[#137fec]/20"
                  id="password-up"
                  name="password"
                  placeholder="Enter your password"
                  required=""
                  type="password"
                  value=""
                  [(ngModel)]="password"
                />
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4c739a]"
                >
                  <span class="material-symbols-outlined cursor-pointer" data-icon="Eye"
                  >visibility</span
                  >
                </div>
              </div>
            </div>
            <button (click)="sign_up()"
              class="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#137fec] px-5 text-base font-bold leading-normal tracking-[0.015em] text-slate-50 transition-colors hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-[#137fec] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span class="truncate">Sign up</span>
            </button>
          </form>
        </div>
        <p class="text-center text-sm text-[#4c739a]">
          Already have an account?
          <span (click)="issign_up = false" class="font-medium text-[#137fec] underline-offset-4 hover:underline cursor-pointer"
          >Sign In</span
          >
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* 1. We define the font-family globally here, assuming the font files can be reached */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    /* 2. We use plain CSS to set the font on the whole host component */
    :host {
      font-family: 'Inter', sans-serif;
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      font-size: 24px;
      line-height: 1;
    }
    .text-7xl{
      font-size:72px !important;
    }
    .auth-wrapper {
      visibility: hidden;
      position: absolute;
      top:0;
      left:0;
      width:100%;
      z-index:10;
      opacity: 0;
      transition: all 0.1s ease-in-out;
    }
    .auth-wrapper.active {
      visibility: visible;
      opacity: 1;
      z-index: 20;
    }
    /* 3. Material Symbols are crucial and must be defined explicitly */
  `],
})
export class Login {
  constructor(private route:Router,
              private authService:AuthService,
              private http:HttpClient,
              private FolderStates:FolderStateService) {}
private hhtp = inject(HttpClient);
  issign_up: boolean = false;
  url: string = 'http://localhost:8080/api/auth/';
  username: string = '';
  password: string = '';
  email: string = '';
login(){
  const payload={
    password:this.password,
    email:this.email,
  }
  this.hhtp.post(this.url+'signIn',payload).subscribe({
    next:(response:any)=>{
      this.FolderStates.initializeState(response);
      this.authService.setAuthenticatedUser(response.userId);
    this.route.navigate(['/inbox']);
    },
    error:(response:any)=>{
      console.log(response);
      alert(response.error);
    }
  })
}
sign_up(){
  const payload={
    password:this.password,
    email:this.email,
    username:this.username,
  }
  this.hhtp.post(this.url+'signUp',payload,{responseType:"text"}).subscribe({
    next:(response:any)=>{
    this.issign_up=false;
    },
    error:(response:any)=>{
      alert(response.error.error);
    }
  })
}
}
