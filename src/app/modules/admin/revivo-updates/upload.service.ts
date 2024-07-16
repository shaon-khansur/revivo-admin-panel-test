import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor( private http: HttpClient ) { }
 
  uploadPdf(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${environment.baseUrl}uploadUpdatePdf`, formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
