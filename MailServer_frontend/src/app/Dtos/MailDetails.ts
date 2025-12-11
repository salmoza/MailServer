import { Injectable } from '@angular/core';
import { Datafile } from './datafile';  // Import the main data interface

@Injectable({
  providedIn: 'root' // Singleton service
})
export class MailShuttleService {
  private FromId:string='';
  private currentMail: Datafile | null = null;
  private CustomId:string='';
  /**
   * Called by the Inbox component immediately upon row click.
   * @param mailData The full data object for the selected email.
   */
  setMailData(mailData: Datafile): void {
    this.currentMail = mailData;
  }
  setCustom(data: string): void {
    this.CustomId = data;
  }
  getCustomId():string {
    return this.CustomId;
  }
  setFromId(id: string): void {
    this.FromId = id;
  }
  getFromId():string {
    return this.FromId;
  }
  /**
   * Called by the MailDetail component in ngOnInit.
   * @returns The stored MailData object, or null.
   */
  getMailData(): Datafile | null {
    return this.currentMail;
  }
}
