import { Injectable } from '@angular/core';
import { Datafile } from './datafile';  // Import the main data interface

@Injectable({
  providedIn: 'root' // Singleton service
})
export class MailShuttleService {

  private currentMail: Datafile | null = null;

  /**
   * Called by the Inbox component immediately upon row click.
   * @param mailData The full data object for the selected email.
   */
  setMailData(mailData: Datafile): void {
    this.currentMail = mailData;
  }

  /**
   * Called by the MailDetail component in ngOnInit.
   * @returns The stored MailData object, or null.
   */
  getMailData(): Datafile | null {
    // We clear the data immediately after retrieval to ensure the state isn't reused accidentally
    const data = this.currentMail;
    this.currentMail = null;
    return data;
  }
}
