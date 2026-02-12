import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FolderStateService} from '../Dtos/FolderStateService';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class aiService {
  constructor(private http: HttpClient) {}
  Generate(name: string, prompt: string, type: string): Observable<any> {
    const url = "http://localhost:8080/ai/body";
    const payload = {
      sender: name,
      prompt: prompt,
      type: type
    };
    return this.http.post(url, payload);
  }
}
