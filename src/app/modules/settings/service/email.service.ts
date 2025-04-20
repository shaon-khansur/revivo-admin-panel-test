import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  getEmails(page): Observable<any[]> {
    return this.http.get<any>(`${environment.baseUrl}getEmails?page=${page}`)
  }
}
