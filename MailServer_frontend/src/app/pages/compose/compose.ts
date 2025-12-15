import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { FolderStateService } from '../../Dtos/FolderStateService';
import { Datafile } from '../../Dtos/datafile';
import { MailShuttleService } from '../../Dtos/MailDetails';

export interface att {
  id: string;
  filetype: string;
  mailId: string;
  name: string;
  sizeMB: string;
  fileData: File;
  uploadedid?: string;
}

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      rel="stylesheet"
    />

    <div
      class="relative flex h-full w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-white"
    >
      <div
        class="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl shadow-2xl ring-1 ring-gray-900/10 bg-white"
      >
        <!-- Header -->
        <header
          class="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3"
        >
          <h3 class="text-lg font-semibold text-gray-800">New Message</h3>
          <button
            class="p-2 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
            (click)="close()"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </header>

        <!-- Form -->
        <div class="flex flex-col p-4 sm:p-6 space-y-4 bg-white">
          <!-- Recipients -->
          <div class="flex items-center border-b border-gray-200 pb-2">
            <label class="w-16 text-sm font-medium text-gray-600" for="to">To</label>
            <div class="flex-1 flex items-center space-x-2">
              @for(email of recipients; track email){
              <span
                class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {{ email }}
                <button
                  (click)="removeRecipient(email)"
                  class="ml-2 text-red-600 hover:text-red-900 cursor-pointer"
                >
                  &times;
                </button>
              </span>
              }
              <input
                class="form-input w-full flex-1 border-none bg-transparent p-2 placeholder:text-gray-400 focus:outline-0"
                id="to"
                placeholder="Recipients"
                type="email"
                [(ngModel)]="currentEmailInput"
                (keydown.enter)="addRecipient($event)"
                (keydown.tab)="addRecipient($event)"
              />
            </div>
          </div>

          <!-- Subject -->
          <div class="flex items-center border-b border-gray-200">
            <label class="w-16 text-sm font-medium text-gray-600" for="subject">Subject</label>
            <input
              class="form-input w-full flex-1 border-none bg-transparent p-2 placeholder:text-gray-400 focus:outline-0"
              id="subject"
              placeholder="Subject"
              type="text"
              [(ngModel)]="subject"
            />
          </div>

          <!-- Rich Text Editor -->
          <div>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div
                #bodyEditor
                contenteditable="true"
                class="p-3 h-48 overflow-auto border-none outline-none text-black bg-white"
              ></div>
            </div>
          </div>

          <!-- Attachment Area -->
          <div
            (click)="openFileUpload()"
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          >
            <p class="text-sm text-gray-500">Click to upload.</p>
          </div>
          <input #fileInput type="file" (change)="handleFileupload($event)" hidden />

          <!-- Attached Files List -->
          @for(item of attachments; track item){
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
              <div class="flex items-center space-x-2">
                <span class="material-symbols-outlined text-gray-500">{{ item.name }}</span>
                <span class="text-sm font-medium text-gray-700"
                  >{{ item.name }}.{{ item.filetype }}</span
                >
                <span class="text-xs text-gray-500">{{ item.sizeMB }}</span>
              </div>
              <button
                (click)="removeAttachment(item.id)"
                class="p-1 rounded-full text-gray-500 hover:bg-gray-200"
              >
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>
          }
        </div>

        <!-- Footer / Toolbar / Actions -->
        <footer
          class="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-gray-50"
        >
          <div class="flex items-center space-x-2 mb-4 sm:mb-0">
            <button
              (click)="sendCompose()"
              class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0D6EFD] rounded-lg shadow-sm hover:bg-[#0D6EFD]/90"
            >
              <span>Send</span>
            </button>
            <button
              (click)="SaveDraft()"
              class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
            >
              Save Draft
            </button>
            <button
              type="button"
              class="p-2 text-gray-600 rounded hover:bg-gray-200"
              (click)="insertLink()"
            >
              <span class="material-symbols-outlined text-xl">link</span>
            </button>
            <button
              type="button"
              class="p-2 text-gray-600 rounded hover:bg-gray-200"
              (click)="format('bold')"
            >
              <b>B</b>
            </button>
            <button
              type="button"
              class="p-2 text-gray-600 rounded hover:bg-gray-200"
              (click)="format('italic')"
            >
              <i>I</i>
            </button>
            <button
              type="button"
              class="p-2 text-gray-600 rounded hover:bg-gray-200"
              (click)="format('underline')"
            >
              <u>U</u>
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <div class="flex items-center gap-1">
              <span class="text-sm font-medium text-gray-600">Priority:</span>
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  (click)="priority = 4"
                  [class]="
                    priority === 4 ? 'px-2 py-1 bg-gray-200 rounded-l-md border-r' : 'px-2 py-1'
                  "
                >
                  4
                </button>
                <button
                  (click)="priority = 3"
                  [class]="priority === 3 ? 'px-2 py-1 bg-gray-200' : 'px-2 py-1'"
                >
                  3
                </button>
                <button
                  (click)="priority = 2"
                  [class]="priority === 2 ? 'px-2 py-1 bg-yellow-200' : 'px-2 py-1'"
                >
                  2
                </button>
                <button
                  (click)="priority = 1"
                  [class]="
                    priority === 1 ? 'px-2 py-1 bg-red-200 rounded-r-md border-l' : 'px-2 py-1'
                  "
                >
                  1
                </button>
              </div>
            </div>
            <button
              class="p-2 text-gray-600 rounded-full hover:bg-gray-200"
              (click)="clearCompose()"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        font-family: 'Inter', sans-serif;
        display: block;
        min-height: 100vh;
        background-color: white;
      }
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        line-height: 1;
      }
      [contenteditable]:focus {
        outline: none;
      }
      [contenteditable] a {
        cursor: pointer !important;
        color: #0d6efd !important; /* Gmail-style blue */
        text-decoration: underline !important;
        pointer-events: auto !important;
      }

      [contenteditable] a:hover {
        text-decoration: underline;
      }

      [contenteditable] {
        cursor: text;
        user-select: text;
      }

      button {
        cursor: pointer;
      }
    `,
  ],
})
export class Compose {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bodyEditor') bodyEditor!: ElementRef<HTMLDivElement>;
  dataFile?: Datafile;
  isRead! : boolean;

  constructor(private route: Router, private http: HttpClient, private mailShuttle: MailShuttleService,) {
    this.folderStateService = inject(FolderStateService);
    this.sender = this.folderStateService.userData().email;
    const mail = this.mailShuttle.getMailData();

    if (!mail) {
      console.error('No mail data found');
      return;
    }
    this.dataFile = mail;
    this.isRead = mail.isRead ;
  }
  // isRead: boolean = this.dataFile.isRead ;

  recipients: string[] = [];
  folderStateService;
  currentEmailInput: string = '';
  sender: string;
  subject: string = '';
  priority: number = 4;
  attachments: att[] = [];
  mailId: string = '';

  isVaildEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  close() {
    this.route.navigate(['/inbox']);
  }

  openFileUpload() {
    this.fileInput.nativeElement.click();
  }

  handleFileupload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) {
      const file = files[0];
      this.attachments.push({
        id: crypto.randomUUID(),
        name: file.name,
        filetype: file.type,
        fileData: file,
        sizeMB: this.formatFileSize(file.size),
        mailId: this.mailId,
      });
      (event.target as HTMLInputElement).value = '';
    }
  }

  removeAttachment(attId: string) {
    this.attachments = this.attachments.filter((a) => a.id !== attId);
  }

  formatFileSize(bytes: number) {
    const KB = bytes / 1024;
    if (KB < 1024) return `${KB.toFixed(1)} KB`;
    const MB = KB / 1024;
    return `${MB.toFixed(2)} MB`;
  }

  sendCompose() {
    if (!this.recipients.length) {
      alert('Add at least one recipient');
      return;
    }
    const bodyContent = this.getBodyContent().trim();
    if (!this.subject.trim() && !bodyContent) {
      alert('Provide subject or body');
      return;
    }
    if (this.attachments.length) {
      this.uploadAndSend();
    } else {
      this.createMailBase();
      this.route.navigate(['/inbox']);
    }
  }

  private createMailBase(): Promise<string[]> {
    const payload = {
      subject: this.subject,
      body: this.getBodyContent(),
      priority: this.priority,
      receivers: this.recipients,
      sender: this.sender,
    };
    return lastValueFrom(this.http.post<string[]>('http://localhost:8080/api/mails', payload));
  }

  private async uploadAndSend() {
    try {
      const mailIds: string[] = await this.createMailBase();
      await this.delay(500);
      await this.uploadAttachments(mailIds);
      this.sendFinalMail();
    } catch (e) {
      console.log(e);
    }
  }

  private delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private uploadAttachments(mailIds: string[]) {
    return Promise.all(
      this.attachments.map((att) => {
        const fd = new FormData();
        fd.append('file', att.fileData, att.name);
        mailIds.forEach((id) => fd.append('mailIds', id));
        return this.http
          .post('http://localhost:8080/api/attachments', fd, { responseType: 'text' })
          .toPromise();
      })
    );
  }

  private sendFinalMail() {
    alert('Mail sent');
    this.route.navigate(['/inbox']);
  }

  addRecipient(e: Event | null) {
    if (e) e.preventDefault();
    const em = this.currentEmailInput;
    if (em && this.isVaildEmail(em) && !this.recipients.includes(em)) {
      this.recipients.push(em);
    }
    this.currentEmailInput = '';
  }
  removeRecipient(email: string) {
    this.recipients = this.recipients.filter((e) => e !== email);
  }

  SaveDraft() {
    if (this.attachments.length) {
      this.uploadAndSaveDraft();
      this.route.navigate(['/drafts']);
    } else {
      this.createDraftBase();
      this.route.navigate(['/drafts']);
    }
  }

  private createDraftBase(): Promise<string> {
    return lastValueFrom(
      this.http.post(
        'http://localhost:8080/api/drafts',
        {
          subject: this.subject,
          body: this.getBodyContent(),
          priority: this.priority,
          receivers: this.recipients,
          sender: this.sender,
        },
        { responseType: 'text' }
      )
    );
  }

  private async uploadAndSaveDraft() {
    try {
      const mailIds = await this.createDraftBase();
      await this.delay(500);
      await this.DraftUploadAtt(mailIds);
    } catch (e) {
      console.log(e);
    }
  }

  private DraftUploadAtt(mailId: string) {
    return Promise.all(
      this.attachments.map((att) => {
        const fd = new FormData();
        fd.append('file', att.fileData, att.name);
        fd.append('mailIds', mailId);
        return this.http.post('http://localhost:8080/api/attachments', fd).toPromise();
      })
    );
  }

  clearCompose() {
    if (!confirm('Discard this draft?')) return;
    this.recipients = [];
    this.currentEmailInput = '';
    this.subject = '';
    this.attachments = [];
    this.priority = 4;
    this.setBodyContent('');
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    this.route.navigate(['/inbox']);
  }

  format(command: string) {
    document.execCommand(command, false);
  }

  insertLink() {
    const url = prompt('Enter URL:');
    if (!url) return;

    const text = prompt('Text to display:') || url;

    // Use proper anchor element with style
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = text;
    a.style.color = '#0D6EFD'; // Gmail-like blue
    a.style.textDecoration = 'underline';

    // Insert the link at the current cursor position
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents(); // remove selected text if any
    range.insertNode(a);

    // Move cursor after inserted link
    range.setStartAfter(a);
    range.setEndAfter(a);
    selection.removeAllRanges();
    selection.addRange(range);

    // Focus back to editor
    this.bodyEditor.nativeElement.focus();
  }

  ngAfterViewInit() {
    const editor = this.bodyEditor.nativeElement;

    editor.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        e.stopPropagation(); // stop contenteditable handling
        e.preventDefault(); // prevent text selection
        window.open((target as HTMLAnchorElement).href, '_blank');
      }
    });

    // Optional: change cursor dynamically when hovering links
    editor.addEventListener('mousemove', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        editor.style.cursor = 'pointer';
      } else {
        editor.style.cursor = 'text';
      }
    });
  }

  getBodyContent(): string {
    return this.bodyEditor.nativeElement.innerHTML;
  }
  setBodyContent(content: string) {
    this.bodyEditor.nativeElement.innerHTML = content;
  }
}
