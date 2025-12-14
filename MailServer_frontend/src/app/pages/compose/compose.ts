import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {FolderStateService} from '../../Dtos/FolderStateService';

export interface att{
  id:string;
  filetype:string;
  mailId:string;
  name:string;
  sizeMB:string;
  fileData:File;
  uploadedid?:string;
}

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink,HttpClientModule],
  template: `
    <!-- Global resource loading added for robustness -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    <!-- Main Container: Centered on screen. Removed bg-[#f6f7f8] and min-h-screen here. -->
    <div
      class="relative flex h-full w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8"
    >
      <!-- Main Compose Modal Card -->
      <div
        class="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10 dark:bg-[#101922] dark:ring-white/10"
      >
        <!-- Header -->
        <header
          class="flex items-center justify-between border-b border-gray-200  bg-gray-100  px-4 py-3"
        >
          <h3 class="text-lg font-semibold text-gray-800 ">New Message</h3>
          <button
            class="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
          (click)="close()">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </header>
        <!-- Form Content -->
        <div class="flex flex-col p-4 sm:p-6 space-y-4 bg-white">
          <!-- To Field -->
          <div class="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
            <label class="w-16 text-sm font-medium text-gray-600 dark:text-gray-400" for="to"
            >To</label
            >
            <div class="flex-1 flex items-center space-x-2">
              @for(email of recipients;track email){
              <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {{email}}
                <button (click)="removeRecipient(email)" class="ml-2 text-red-600 hover:text-red-900 cursor-pointer">&times;
                </button>
              </span>
              }
              <input
                class="form-input w-full flex-1 resize-none border-none bg-transparent p-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-0 focus:ring-0"
                id="to"
                placeholder="Recipients"
                type="email"
                name="current_receiver"
                [(ngModel)]="currentEmailInput"
                (keydown.enter)="addRecipient($event)"
                (keydown.tab)="addRecipient($event)"
              />
              <div class="flex items-center space-x-2">
                <!-- FIX: Use hex code for primary color -->
                <button class="text-sm font-medium text-[#0D6EFD] hover:underline">Cc</button>
                <button class="text-sm font-medium text-[#0D6EFD] hover:underline">Bcc</button>
              </div>
            </div>
          </div>
          <!-- Subject Field -->
          <div class="flex items-center border-b border-gray-200 dark:border-gray-700">
            <label class="w-16 text-sm font-medium text-gray-600 dark:text-gray-400" for="subject"
            >Subject</label
            >
            <input
              class="form-input w-full flex-1 resize-none border-none bg-transparent p-2   placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-0 focus:ring-0"
              id="subject"
              placeholder="Subject"
              type="text"
              name="subject"
              [(ngModel)]="subject"
            />
          </div>
          <!-- Rich Text Editor -->
          <div>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <!-- <div
                class="flex items-center p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 "
              > -->
                <!-- <button
                  class="p-2 text-gray-600  rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <span class="material-symbols-outlined text-xl">format_bold</span>
                </button>
                <button
                  class="p-2 text-gray-600 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <span class="material-symbols-outlined text-xl">format_italic</span>
                </button>
                <button
                  class="p-2 text-gray-600 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <span class="material-symbols-outlined text-xl">format_underlined</span>
                </button>
                <div class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <button
                  class="p-2 text-gray-600 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <span class="material-symbols-outlined text-xl">format_list_bulleted</span>
                </button> -->
                <!-- <button
                  class="p-2 text-gray-600 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <span class="material-symbols-outlined text-xl">format_list_numbered</span>
                </button> -->
                <!-- <div class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <button
                  class="p-2 text-gray-600 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <span class="material-symbols-outlined text-xl">link</span>
                </button> -->
              <!-- </div> -->
              <textarea
                class="form-textarea w-full h-48 p-3 border-none resize-y focus:ring-0 text-black bg-white  placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Compose your message..."
               [(ngModel)]="body"></textarea>
            </div>
          </div>
          <!-- Attachment Area -->
          <div (click)="openFileUpload()"
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">
              click to upload.
            </p>
          </div>
          <input #fileInput type="file" (change)="handleFileupload($event)" hidden name="upload_file_input" />
          <!-- Attached Files List -->
          @for(item of attachments;track item){
          <div class="space-y-2">
            <div
              class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div class="flex items-center space-x-2">
                <span class="material-symbols-outlined text-gray-500">{{item.name}}</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >{{item.name}}.{{item.filetype}}</span
                >
                <span class="text-xs text-gray-500 dark:text-gray-400">{{item.sizeMB}}</span>
              </div>
              <button (click)="removeAttachment(item.id)"
                class="p-1 inline-flex items-center rounded-full align-middle text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-red-700"
              >
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>
          }
        </div>
        <!-- Footer / Action Bar -->
        <footer
          class="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200  bg-gray-50 "
        >
          <div class="flex items-center space-x-2 mb-4 sm:mb-0">
            <!-- Send Button -->
            <!-- FIX: Use hex code for primary color -->
            <button (click)="sendCompose()"
              class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0D6EFD] rounded-lg shadow-sm hover:bg-[#0D6EFD]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D6EFD]"
            >
              <span>Send</span>
            </button>
            <button (click)="SaveDraft()"
              class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D6EFD] dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Save Draft
            </button>
            <button
              class="p-2 text-gray-600 rounded-full hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <span class="material-symbols-outlined">attach_file</span>
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <div class="flex items-center gap-1">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Priority:</span>
              <!-- Priority Buttons -->
              <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button (click)="priority=4"
                  [class]="priority === 4 ? 'px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-l-md border-r border-gray-300 dark:border-gray-600' : 'px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 border-r border-gray-300 dark:border-gray-600'"
                >
                  4
                </button>
                <button (click)="priority=3" 
                  [class]="priority === 3 ? 'px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-600'"
                >
                  3
                </button>
                <button (click)="priority=2"
                  [class]="priority === 2 ? 'px-2 py-1 text-sm bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' : 'px-2 py-1 text-sm text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'"
                >
                  2
                </button>
                <button (click)="priority=1"
                  [class]="priority === 1 ? 'px-2 py-1 text-sm bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-r-md border-l border-gray-300 dark:border-gray-600' : 'px-2 py-1 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-r-md border-l border-gray-300 dark:border-gray-600'"
                >
                  1
                </button>
              </div>
            </div>
            <button
              class="p-2 text-gray-600 rounded-full hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    /* 1. We define the font-family globally here, assuming the font files can be reached */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    /* 2. Base styles */
    /* This block ensures Tailwind's custom colors are available as CSS variables */
    :root,
    :host {
      --border: #dee2e6;
      --input: #dee2e6;
      --ring: #0d6efd;
      --background: #ffffff;
      --foreground: #212529;
      --primary: #0d6efd; /* Blue */
      --primary-foreground: #ffffff;
      --secondary: #6c757d;
      --secondary-foreground: #ffffff;
      --destructive: #dc3545;
      --destructive-foreground: #ffffff;
      --muted: #f8f9fa;
      --muted-foreground: #6c757d;
      --accent: #f8f9fa;
      --accent-foreground: #212529;
      --popover: #ffffff;
      --popover-foreground: #212529;
      --card: #ffffff;
      --card-foreground: #212529;
      --radius: 0.5rem;
    }

    .material-symbols-outlined {
      /* Ensure icons are correctly rendered */
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      line-height: 1;
    }

    /* Apply Inter font */
    :host {
      font-family: 'Inter', sans-serif;
      /* Set background color and minimum height on the host element */
      background-color: #f6f7f8; /* background-light hex from original config */
      min-height: 100vh; /* Ensure the component covers the whole viewport */
      display: block; /* Important for min-height to work */
    }

    /* FIX: Disable blue focus ring/border on the textarea */
    .form-textarea:focus {
      box-shadow: none !important;
      border-color: transparent !important;
      outline: none !important;
      --tw-ring-color: transparent !important;
    }
  `],
})
export class Compose {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private route: Router, private http: HttpClient) {
    this.folderStateService = inject(FolderStateService);
    this.sender = this.folderStateService.userData().email;
  }

  recipients: string[] = [];
  folderStateService;
  currentEmailInput: string = '';
  sender: string;
  subject: string = "";
  body: string = "";
  priority: number = 4;
  attachments: att[] = [];
  mailId: string = '';

  isVaildEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  close() {
    this.route.navigate(['/inbox']);
  }

  private formatFileSize(bytes: number) {
    const KB = bytes / 1024;
    if (KB < 1024) {
      return `${KB.toFixed(1)} KB`
    }
    const MB = KB / 1024;
    return `${MB.toFixed(2)} MB`;
  }

  openFileUpload() {
    this.fileInput.nativeElement.click();
  }

  handleFileupload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      const newAtt: att = {
        id: crypto.randomUUID(),
        name: file.name,
        filetype: file.type,
        fileData: file,
        sizeMB: this.formatFileSize(file.size),
        mailId: this.mailId
      };
      this.attachments.push(newAtt);
      target.value = '';
    }
  }

  removeAttachment(attId: string) {
    this.attachments = this.attachments.filter(att => att.id !== attId);
  }

  sendCompose(){
    if(this.recipients.length === 0){
      alert('Please add at least one recipient');
      return;
    }
    // Validate subject and body
    if(!this.subject.trim() && !this.body.trim()){
      alert('Please provide either a subject or message body');
      return;
    }
    if(this.attachments.length > 0){
      this.uploadAndSend();
      this.route.navigate(['/inbox']);
    } else {
      this.createMailBase();
      this.route.navigate(['/inbox']);
    }

  }

  private async uploadAndSend() {
    try {
      const mailIds: string[] = await this.createMailBase();
      console.log(mailIds);
      await this.delay(500);
      await this.uploadAttachments(mailIds);
      this.sendFinalMail();
    } catch (error) {
      console.log(error);
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createMailBase(): Promise<string[]> {
    const payload = {
      subject: this.subject,
      body: this.body,
      priority: this.priority,
      receivers: this.recipients,
      sender: this.sender,
    };
    return lastValueFrom(
      this.http.post<string[]>("http://localhost:8080/api/mails", payload)
    );
  }

  private uploadAttachments(mailId: string[]) {

    const uploadPromises = this.attachments.map(att => {
      const formData = new FormData();
      formData.append('file', att.fileData, att.name);
      mailId.forEach(id => formData.append('mailIds', id));
      console.log(formData);
      return this.http.post("http://localhost:8080/api/attachments", formData,{responseType:'text'}).toPromise();
    });
    return Promise.all(uploadPromises);
  }

  private sendFinalMail() {
    alert('mail Sent');
  }

  addRecipient(event: Event | null): void {
    if (event) {
      event.preventDefault();
    }
    const email = this.currentEmailInput;
    if (email && this.isVaildEmail(email)) {
      if (!this.recipients.includes(email)) {
        this.recipients.push(email);
      }
      this.currentEmailInput = '';
    }
  }

  removeRecipient(toremoveemail: string): void {
    this.recipients = this.recipients.filter(email => email !== toremoveemail);
  }

  SaveDraft() {
    if (this.attachments.length > 0) {
      this.uploadAndSaveDraft();
      this.route.navigate(['/drafts']);
    } else {
      this.createDraftBase();
      this.route.navigate(['/drafts']);
    }
  }
  private createDraftBase(): Promise<string> {
    const payload = {
      subject: this.subject,
      body: this.body,
      priority: this.priority,
      receivers: this.recipients,
      sender: this.sender,
    };
    return lastValueFrom(
      this.http.post("http://localhost:8080/api/drafts", payload,{responseType:"text"})
    );
  }
  private async uploadAndSaveDraft() {
    try {
      const mailIds: string = await this.createDraftBase();
      console.log(mailIds);
      await this.delay(500);
      await this.DraftUploadAtt(mailIds);
    } catch (error) {
      console.log(error);
    }
  }
  private DraftUploadAtt(mailId: string) {

    const uploadPromises = this.attachments.map(att => {
      const formData = new FormData();
      formData.append('file', att.fileData, att.name);
      formData.append('Ids', mailId);
      console.log(formData);
      return this.http.post("http://localhost:8080/api/attachments", formData).toPromise();
    });
    return Promise.all(uploadPromises);
  }
}
