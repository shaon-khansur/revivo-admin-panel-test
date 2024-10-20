import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OfficeService {
    private apiUrl = `${environment.baseUrl}officeData`; // Adjust this URL if necessary

    constructor(private http: HttpClient) {}

    // Method to post office data
    postOfficeData(data: any): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }
    getOfficeData(): Observable<any> {
      return this.http.get(this.apiUrl);
  }
}
