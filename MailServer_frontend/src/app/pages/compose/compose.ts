import { Component, ElementRef, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom, Subscription, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FolderStateService } from '../../Dtos/FolderStateService';
import { Datafile } from '../../Dtos/datafile';
import { MailShuttleService } from '../../Dtos/MailDetails';
import { ContactService } from '../../services/contact.services';
import { ContactDto } from '../../Dtos/ContactDto';
import { aiService } from '../../services/ai.Service';
import { SnackbarService } from '../../services/snackbar.service';

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
            class="p-2 flex items-center text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
            (click)="close()"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </header>

        <!-- Form -->
        <div class="flex flex-col p-4 sm:p-6 space-y-4 bg-white">
          <!-- Recipients -->
          <div class="relative flex items-center border-b border-gray-200 pb-2">
            <label class="w-16 text-sm font-medium text-gray-600" for="to">To</label>
            <div class="flex-1 flex flex-wrap items-center gap-2 min-h-[44px]">
              @for(email of recipients; track email){
              <span
                class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {{ getDisplayName(email) || email }}
                <button
                  (click)="removeRecipient(email)"
                  class="ml-2 text-red-600 hover:text-red-900 cursor-pointer"
                >
                  &times;
                </button>
              </span>
              }
              <div class="relative flex-1 min-w-[200px]">
                <input
                  class="form-input w-full border-none bg-transparent p-2 placeholder:text-gray-400 focus:outline-0"
                  id="to"
                  placeholder="Recipients"
                  type="text"
                  [(ngModel)]="currentEmailInput"
                  (keydown.enter)="addRecipientFromInput($event)"
                  (keydown.tab)="addRecipientFromInput($event)"
                  (keydown)="handleKeydown($event)"
                  (input)="onSearchInput()"
                  (focus)="onInputFocus()"
                  (blur)="onInputBlur()"
                />

                <!-- Contact Suggestions Dropdown -->
                @if(showSuggestions && filteredContacts.length > 0){
                <div
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto"
                >
                  @for(contact of filteredContacts; track contact.contactId; let i = $index){
                  <div
                    [class.bg-blue-50]="selectedSuggestionIndex === i"
                    class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    (click)="selectContact(contact)"
                    (mouseenter)="selectedSuggestionIndex = i"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-gray-900">{{ contact.name }}</div>
                        <div class="text-sm text-gray-600">{{ contact.emailAddresses[0] }}</div>
                        @if(contact.emailAddresses.length > 1){
                        <div class="text-xs text-gray-500 mt-1">
                          Also: {{ contact.emailAddresses.slice(1).join(', ') }}
                        </div>
                        }
                      </div>
                      @if(contact.starred){
                      <span class="material-symbols-outlined text-yellow-500">star</span>
                      }
                    </div>
                  </div>
                  }
                </div>
                }
              </div>
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
          <button
            (click)="showAiModel = true"
            type="button"
            class=" absolute flex  right-110 top-60 flex-col items-center gap-1 p-3
                   bg-white text-purple-600 rounded-4xl shadow-sm border border-gray-100
                   hover:shadow-md hover:scale-110 hover:text-purple-700 hover:border-purple-200
                   transition-all duration-200 group-hover:opacity-100 opacity-60"
            title="Generate with AI"
          >
            <span class="material-symbols-outlined text-2xl">auto_awesome</span>
          </button>
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
            <div class="flex items-center justify-between p-5 bg-gray-100 rounded-2xl ">
              <div class="flex items-center space-x-2">
                <span class="font-bold text-black">{{ item.name }}</span>
                <span class="text-xs text-gray-500">{{ item.sizeMB }}</span>
              </div>
              <button
                (click)="removeAttachment(item.id)"
                class="flex items-center p-1 rounded-full text-gray-500 hover:bg-gray-200"
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
                <button class="  hover:bg-gray-200 hover:rounded-l-md hover:border-r"
                  (click)="priority = 4"
                  [class]="priority === 4 ? 'px-2 py-1 bg-gray-200 rounded-l-md border-r' : 'px-2 py-1'"
                >
                  4
                </button>
                <button class="  hover:bg-gray-400 "
                  (click)="priority = 3"
                  [class]="priority === 3 ? 'px-2 py-1 bg-gray-400' : 'px-2 py-1'"
                >
                  3
                </button>
                <button class="  hover:bg-yellow-200 "
                  (click)="priority = 2"
                  [class]="priority === 2 ? 'px-2 py-1 bg-yellow-200' : 'px-2 py-1'"
                >
                  2
                </button>
                <button  class="  hover:bg-red-200  hover:border-l"
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
              class="p-3 flex items-center text-gray-600 rounded-full hover:bg-gray-200"
              (click)="clearCompose()"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </footer>
      </div>
      <div class="ai-popup " [class.active] = 'showAiModel'>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

            <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white flex justify-between items-center">
              <h3 class="font-bold flex items-center gap-2">
                <span class="material-symbols-outlined">auto_awesome</span>
                Smart Body Generater
              </h3>
              <button (click)="showAiModel = false" class=" flex items-center hover:bg-white/20 rounded-full p-1">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div class="p-6 space-y-4" [class.cursor-wait]="isLoading">

              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-700">What should this email be about?</label>
                <textarea
                  [(ngModel)]="prompt"
                  placeholder="e.g. Ask for a sick leave for tomorrow..."
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] resize-none text-sm outline-none transition-all "
                ></textarea>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-700">Tone</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    (click)="selectedtone = 'Professional'"
                    [class]="selectedtone === 'Professional' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
                    class="border rounded-lg p-2 text-sm font-medium transition-all duration-20 active:scale-95 hover:scale-[1.02] "
                  >
                    Professional
                  </button>
                  <button
                    type="button"
                    (click)="selectedtone = 'Friendly'"
                    [class]="selectedtone === 'Friendly' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
                    class="border rounded-lg p-2 text-sm font-medium transition-all duration-20 active:scale-95 hover:scale-[1.02] "
                  >
                    Friendly
                  </button>
                  <button
                    type="button"
                    (click)="selectedtone = 'Urgent'"
                    [class]="selectedtone === 'Urgent' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
                    class="border rounded-lg p-2 text-sm font-medium transition-all duration-20 active:scale-95 hover:scale-[1.02] "
                  >
                    Urgent
                  </button>
                  <button
                    type="button"
                    (click)="selectedtone = 'Concise'"
                    [class]="selectedtone === 'Concise' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
                    class="border rounded-lg p-2 text-sm font-medium transition-all duration-20 active:scale-95 hover:scale-[1.02] "
                  >
                    Concise
                  </button>
                </div>
              </div>

              <button
                (click)="generateBody()"
                [disabled]="isLoading || !prompt || !selectedtone"
                class="w-full py-3 transition-all duration-100 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-purple-200"
              >
                @if(isLoading) {
                  <span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  Generating...
                } @else {
                  <span class="material-symbols-outlined text-xl">smart_toy</span>
                  Generate Draft
                }
              </button>
            </div>
          </div>
        </div>
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
        color: #0d6efd !important;
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
        .ai-popup{
          opacity: 0;
          visibility: hidden;
          position: absolute;
          cursor: none;
          transition: all 0.2s ease-in-out;
        }
        .ai-popup.active {
          visibility: visible;
          opacity: 1;
          cursor: auto;
        }
      button {
        cursor: pointer;
      }
    `,
  ],
})
export class Compose implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bodyEditor') bodyEditor!: ElementRef<HTMLDivElement>;
  dataFile?: Datafile;
  isRead!: boolean;

  inputHasFocus = false;
  hasUserTyped = false;

  // New properties for contacts
  allContacts: ContactDto[] = [];
  filteredContacts: ContactDto[] = [];
  showSuggestions = false;
  selectedSuggestionIndex = -1;
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  // Map for quick email to name lookup
  emailToNameMap: Map<string, string> = new Map();
  ai = inject(aiService);
  constructor(
    private route: Router,
    private http: HttpClient,
    private mailShuttle: MailShuttleService,
    private contactService: ContactService,
    private snackbar: SnackbarService
  ) {
    this.folderStateService = inject(FolderStateService);
    this.sender = this.folderStateService.userData().email;
    const mail = this.mailShuttle.getMailData();

    if (mail) {
      this.dataFile = mail;
      this.isRead = mail.isRead;
      // Pre-populate recipients if replying/forwarding
      if (mail.receiverEmails?.length) {
        this.recipients = [...mail.receiverEmails];
      }
    }
  }
  showAiModel: boolean = false;
  prompt: string = '';
  selectedtone: string = '';
  isLoading: boolean = false;
  recipients: string[] = [];
  folderStateService: FolderStateService;
  currentEmailInput: string = '';
  sender: string;
  subject: string = '';
  priority: number = 4;
  attachments: att[] = [];
  mailId: string = '';
  generateBody() {
    if (!this.prompt) {
      this.snackbar.showError('Please enter a prompt');
      return;
    }
    this.isLoading = true;
    this.isRead = true;
    const name = this.folderStateService.userData().username;
    this.ai.Generate(name, this.prompt, this.selectedtone).subscribe({
      next: (result) => {
        if (this.bodyEditor && this.bodyEditor.nativeElement) {
          this.bodyEditor.nativeElement.innerText = result.result;
        }
        this.isRead = false;
        this.showSuggestions = false;
        this.showAiModel = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.snackbar.showError('AI generation failed');
        this.isLoading = false;
      }
    });
  }
  ngOnInit() {
    // Load all contacts on init
    this.loadAllContacts();

    // Setup debounced search
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => this.searchContacts(query));
  }

  onInputFocus() {
    this.inputHasFocus = true;
    // Only show suggestions if user has already typed something
    if (this.currentEmailInput.trim().length > 0) {
      this.searchContacts(this.currentEmailInput);
    } else {
      this.showSuggestions = false;
    }
  }

  onInputBlur() {
    this.inputHasFocus = false;
    // Hide suggestions with a slight delay to allow click events
    setTimeout(() => {
      if (!this.inputHasFocus) {
        this.showSuggestions = false;
      }
    }, 200);
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  private loadAllContacts() {
    this.contactService.getContacts('', 'name', 'asc').subscribe({
      next: (contacts) => {
        this.allContacts = contacts;
        this.buildEmailNameMap();
        // Initial filtering
        this.searchContacts('');
      },
      error: (err) => console.error('Failed to load contacts:', err),
    });
  }

  private buildEmailNameMap() {
    this.emailToNameMap.clear();
    this.allContacts.forEach((contact) => {
      contact.emailAddresses.forEach((email) => {
        this.emailToNameMap.set(email, contact.name);
      });
    });
  }

  getDisplayName(email: string): string {
    return this.emailToNameMap.get(email) || '';
  }

  onSearchInput() {
    const query = this.currentEmailInput.trim();
    this.hasUserTyped = query.length > 0;

    // Only search if user has typed something
    if (query.length > 0) {
      this.searchSubject.next(query);
    } else {
      this.showSuggestions = false;
      this.selectedSuggestionIndex = -1;
    }
  }

  searchContacts(query: string = '') {
    const searchTerm = query.toLowerCase().trim();

    // Don't show suggestions for empty query
    if (searchTerm.length === 0) {
      this.showSuggestions = false;
      this.filteredContacts = [];
      this.selectedSuggestionIndex = -1;
      return;
    }

    this.filteredContacts = this.allContacts.filter((contact) => {
      const nameStartsWith = contact.name.toLowerCase().startsWith(searchTerm);

      const emailStartsWith = contact.emailAddresses.some(
        (email) => email.toLowerCase().startsWith(searchTerm) && !this.recipients.includes(email)
      );

      const nameContains = contact.name.toLowerCase().includes(searchTerm);

      const emailContains = contact.emailAddresses.some(
        (email) => email.toLowerCase().includes(searchTerm) && !this.recipients.includes(email)
      );

      return (
        (nameStartsWith || emailStartsWith || nameContains || emailContains) &&
        contact.emailAddresses.some((email) => !this.recipients.includes(email))
      );
    });

    this.filteredContacts.sort((a, b) => {
      const aNameStarts = a.name.toLowerCase().startsWith(searchTerm);
      const bNameStarts = b.name.toLowerCase().startsWith(searchTerm);

      const aEmailStarts = a.emailAddresses.some((email) =>
        email.toLowerCase().startsWith(searchTerm)
      );
      const bEmailStarts = b.emailAddresses.some((email) =>
        email.toLowerCase().startsWith(searchTerm)
      );

      if (aNameStarts && !bNameStarts) return -1;
      if (!aNameStarts && bNameStarts) return 1;

      if (aEmailStarts && !bEmailStarts) return -1;
      if (!aEmailStarts && bEmailStarts) return 1;

      return a.name.localeCompare(b.name);
    });

    this.showSuggestions = this.filteredContacts.length > 0;
    this.selectedSuggestionIndex = this.filteredContacts.length > 0 ? 0 : -1;
  }

  selectContact(contact: ContactDto) {
    contact.emailAddresses.forEach((email) => {
      if (!this.recipients.includes(email)) {
        this.addRecipient(email);
      }
    });

    this.currentEmailInput = '';
    this.showSuggestions = false;
    this.selectedSuggestionIndex = -1;
    this.hasUserTyped = false;

    setTimeout(() => {
      const input = document.getElementById('to') as HTMLInputElement;
      if (input) input.focus();
    });
  }

  addRecipientFromInput(e: Event) {
    e.preventDefault();

    if (
      this.showSuggestions &&
      this.selectedSuggestionIndex >= 0 &&
      this.selectedSuggestionIndex < this.filteredContacts.length
    ) {
      this.selectContact(this.filteredContacts[this.selectedSuggestionIndex]);
      return;
    }

    const input = this.currentEmailInput.trim();

    if (!input) return;

    const matchedContact = this.allContacts.find((contact) =>
      contact.emailAddresses.some(
        (email) =>
          email.toLowerCase() === input.toLowerCase() ||
          contact.name.toLowerCase() === input.toLowerCase()
      )
    );

    if (matchedContact) {
      this.selectContact(matchedContact);
    } else {
      this.addRecipient(input);
    }

    this.currentEmailInput = '';
    this.showSuggestions = false;
    this.hasUserTyped = false;
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      this.navigateSuggestions(event);
    }
  }

  navigateSuggestions(event: KeyboardEvent) {
    if (!this.showSuggestions || this.filteredContacts.length === 0) return;

    event.preventDefault();

    switch (event.key) {
      case 'ArrowDown':
        this.selectedSuggestionIndex =
          (this.selectedSuggestionIndex + 1) % this.filteredContacts.length;
        break;
      case 'ArrowUp':
        this.selectedSuggestionIndex =
          this.selectedSuggestionIndex <= 0
            ? this.filteredContacts.length - 1
            : this.selectedSuggestionIndex - 1;
        break;
    }

    setTimeout(() => {
      const selectedElement = document.querySelector('[class*="bg-blue-50"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  isVaildEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  addRecipient(email: string) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || this.recipients.includes(trimmedEmail)) return;

    if (!this.isVaildEmail(trimmedEmail)) {
      this.snackbar.showError(`Invalid email format: ${trimmedEmail}`);
      return;
    }

    if (!this.emailToNameMap.has(trimmedEmail)) {
      this.http.get<boolean>(`http://localhost:8080/api/mails/valid/${trimmedEmail}`).subscribe({
        next: (r: boolean) => {
          if (r) {
            this.recipients.push(trimmedEmail);
          } else {
            this.snackbar.showError(`Email doesn't exist: ${trimmedEmail}`);
          }
        },
        error: (e) => {
          this.snackbar.showError(e.error?.error || 'Error validating email');
        },
      });
    } else {
      this.recipients.push(trimmedEmail);
    }

    this.currentEmailInput = '';
    this.showSuggestions = false;
    this.hasUserTyped = false;
  }

  removeRecipient(email: string) {
    this.recipients = this.recipients.filter((e) => e !== email);

    if (this.currentEmailInput.trim().length > 0) {
      this.searchContacts(this.currentEmailInput);
    }
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
      this.snackbar.showError('Add at least one recipient');
      return;
    }
    const bodyContent = this.getBodyContent().trim();
    if (!this.subject.trim() && !bodyContent) {
      this.snackbar.showError('Provide subject or body');
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
    this.snackbar.showSuccess('Mail sent');
    this.route.navigate(['/inbox']);
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

    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = text;
    a.style.color = '#0D6EFD';
    a.style.textDecoration = 'underline';

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(a);

    range.setStartAfter(a);
    range.setEndAfter(a);
    selection.removeAllRanges();
    selection.addRange(range);

    this.bodyEditor.nativeElement.focus();
  }

  ngAfterViewInit() {
    const editor = this.bodyEditor.nativeElement;

    editor.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        e.stopPropagation();
        e.preventDefault();
        window.open((target as HTMLAnchorElement).href, '_blank');
      }
    });

    editor.addEventListener('mousemove', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        editor.style.cursor = 'pointer';
      } else {
        editor.style.cursor = 'text';
      }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.id === 'to' || target.closest('#to');
      const isSuggestion =
        target.closest('[class*="bg-blue-50"]') || target.closest('.absolute.top-full');

      if (!isInput && !isSuggestion) {
        this.showSuggestions = false;
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
