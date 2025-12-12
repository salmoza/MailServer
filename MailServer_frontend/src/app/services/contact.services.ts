import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactDto } from '../Dtos/ContactDto'; 
import { FolderStateService } from '../Dtos/FolderStateService';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  private apiUrl = 'http://localhost:8080/contact'; 

  constructor(
    private http: HttpClient,
    private folderStateService: FolderStateService
  ) {}

  
  private getUserId(): string {
    
    const id = this.folderStateService.userData()?.userId; 
    if (!id) throw new Error("User ID not found in state");
    return id;
  }

  
  createContact(contact: ContactDto): Observable<ContactDto> {
    const userId = this.getUserId();
    return this.http.post<ContactDto>(`${this.apiUrl}/create/${userId}`, contact);
  }

  
  editContact(contactId: string, contact: ContactDto): Observable<ContactDto> {
    return this.http.put<ContactDto>(`${this.apiUrl}/edit/${contactId}`, contact);
  }

  
  getContacts(query?: string, sortBy?: string, order: string = 'asc'): Observable<ContactDto[]> {
    const userId = this.getUserId();
    let params = new HttpParams();
    if (query) params = params.set('query', query);
    if (sortBy) params = params.set('sortBy', sortBy);
    if (order) params = params.set('order', order);

    return this.http.get<ContactDto[]>(`${this.apiUrl}/${userId}`, { params });
  }

  //  @DeleteMapping("/delete/{contactId}")
  deleteContact(contactId: string): Observable<string> {
    
    return this.http.delete(`${this.apiUrl}/delete/${contactId}`, { responseType: 'text' });
  }

  // @PutMapping("/{contactId}/star")
  toggleStar(contactId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${contactId}/star`, {});
  }
}