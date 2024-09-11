import {
    HttpClient,
    HttpEvent,
    HttpHeaders,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface UpdateStatus {
    pdfStatus?: boolean;
    codeStatus?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    constructor(private http: HttpClient) {}

    uploadPdf(formData: FormData): Observable<HttpEvent<any>> {
        const req = new HttpRequest(
            'POST',
            `${environment.baseUrl}uploadUpdatePdf/downloadpdf`,
            formData
        );
        return this.http.request(req);
    }
    upload(data): Observable<HttpEvent<any>> {
        const req = new HttpRequest(
            'POST',
            `${environment.baseUrl}uploadUpdatePdf`,
            data,
            {
                reportProgress: true,
            }
        );
        return this.http.request(req);
    }
    updateStatus(updateData: UpdateStatus): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        // Sending a PATCH request to the backend
        return this.http.patch(
            `${environment.baseUrl}uploadUpdatePdf`,
            updateData,
            { headers }
        );
    }
    getData(): Observable<any> {
        // Sending a PATCH request to the backend
        return this.http.get(`${environment.baseUrl}uploadUpdatePdf`);
    }
}
