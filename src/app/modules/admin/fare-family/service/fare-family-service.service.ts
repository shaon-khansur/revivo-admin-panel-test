import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FareFamilyServiceService {
    constructor(private http: HttpClient) {}

    addFareFamily(data: any): Observable<any> {
        return this.http.post<any>(`${environment.baseUrl}alpFareFamily`, data);
    }
    getFareFamily(): Observable<any> {
        return this.http.get<any[]>(`${environment.baseUrl}alpFareFamily`);
    }
    updateFareFamily(data: any): Observable<any> {
        console.log('service data', data);
        return this.http.put<any>(
            `${environment.baseUrl}alpFareFamily/${data.id}`,
            data
        );
    }
    deleteFareFamily(data: any): Observable<string> {
        console.log('deleted data', data);
        return this.http.delete(
            `${environment.baseUrl}alpFareFamily/${data.id}`,
            { responseType: 'text' }
        );
    }
}
