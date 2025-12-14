import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactDto } from '../Dtos/ContactDto'; 
import { FolderStateService } from '../Dtos/FolderStateService';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  private apiUrl = 'http://localhost:8080/api/contacts'; 

  constructor(
    private http: HttpClient,
    private folderStateService: FolderStateService
  ) {}

  private getUserId(): string {
    const id = this.folderStateService.userData()?.userId; 
    if (!id) throw new Error("User ID not found in state");
    return id;
  }

  getContacts(query: string = '', sortBy: string = 'name', order: string = 'asc'): Observable<ContactDto[]> {
    const userId = this.getUserId();
    let params = new HttpParams();
    
    if (query) params = params.set('query', query);
    if (sortBy) params = params.set('sortBy', sortBy);
    if (order)  params = params.set('order', order);

    return this.http.get<ContactDto[]>(`${this.apiUrl}/${userId}`, { params });
  }

  createContact(contact: ContactDto): Observable<ContactDto> {
    const userId = this.getUserId();
    return this.http.post<ContactDto>(`${this.apiUrl}/${userId}`, contact);
  }

  editContact(contactId: string, contact: ContactDto): Observable<ContactDto> {
    return this.http.put<ContactDto>(`${this.apiUrl}/${contactId}`, contact);
  }

  deleteContact(contactId: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${contactId}`, { responseType: 'text' });
  }

  deleteMultipleContacts(contactIds: string[]): Observable<string> {
    return this.http.delete(`${this.apiUrl}`, { 
      body: contactIds, 
      responseType: 'text' 
    });
  }

  toggleStar(contactId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${contactId}`, {});
  }
}