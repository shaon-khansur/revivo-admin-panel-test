import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


export interface CommissionData {
    id: string;
    airline: string;
    outboundAirport: string;
    outboundCommission: number;
    inboundAirport: string;
    inboundCommission: number;
    provider: string;
    default: boolean;
}


@Injectable({
    providedIn: 'root',
})
export class FlightCommissionService {
    constructor(private http: HttpClient) {}

    getFlightsCommissions(): Observable<CommissionData[]> {
        return this.http.get<CommissionData[]>(`${environment.baseUrl}flight-commission`);
    }

    addCommission(data): Observable<CommissionData> {
        return this.http.post<CommissionData>(`${environment.baseUrl}flight-commission`, data);
    }

    updateCommssion(data: CommissionData): Observable<CommissionData> {
        return this.http.put<CommissionData>(`${environment.baseUrl}flight-commission/${data.id}`, data);
    }

    deleteCommission(data: CommissionData): Observable<CommissionData> {
        return this.http.delete<CommissionData>(`${environment.baseUrl}flight-commission/${data.id}`);
    }
}
