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
        console.log('service form', formData);
        const url = `${environment.baseUrl}siteSetting?commission1=${formData.commission1}&commission2=${formData.commission2}&dealFee=${formData.dealFee}`;
        return this.http.put(url, formData);
    }    
}
