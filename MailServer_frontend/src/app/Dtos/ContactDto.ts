import { DatePipe } from '@angular/common';
export interface ContactDto {
    contactId?: string;
    ownerId?: string;
    name: string;
    emailAddresses: string[];
    starred: boolean;
    phoneNumber?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface MailSnapshot {
    snapshotId: string;
    userId: string;
    senderEmail: string;
    priority: number;
    subject: string;
    body: string;
    receiverEmails: string[];
    savedAt: string; 
    attachments?: any[]; 
  }