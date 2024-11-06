import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DealsettingsService {
    constructor(private http: HttpClient) {}

    getDealSettings(): Observable<any> {
        const url = `${environment.baseUrl}siteSetting`;
        return this.http.get(url);
    }
    saveDealSettings(formData: any): Observable<any> {
        const url = `${environment.baseUrl}siteSetting?commission1=${formData.commission1}&commission2=${formData.commission2}&dealFee=${formData.dealFee}&infantFee=${formData.infantFee}&extraFee=${formData.extraFee}`;
        return this.http.put(url, formData);
    }
}
