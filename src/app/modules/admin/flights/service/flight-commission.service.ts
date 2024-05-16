import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { FareFamilyCommissionData } from '../fare-family-commission/fare-family-commission.component';


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
        delete data.id
        return this.http.post<CommissionData>(`${environment.baseUrl}flight-commission`, data);
    }

    updateCommssion(data: CommissionData): Observable<CommissionData> {
        const id = data.id;
        delete data.id
        return this.http.put<CommissionData>(`${environment.baseUrl}flight-commission/${id}`, data);
    }

    deleteCommission(data: CommissionData): Observable<CommissionData> {
        return this.http.delete<CommissionData>(`${environment.baseUrl}flight-commission/${data.id}`);
    }


    //Fare family Commission
    getFareFamilyCommissions(): Observable<FareFamilyCommissionData[]> {
        return this.http.get<FareFamilyCommissionData[]>(`${environment.baseUrl}admin-fare-family-commission`);
    }

    addFareFamilyCommission(data): Observable<FareFamilyCommissionData> {
        delete data.id
        return this.http.post<FareFamilyCommissionData>(`${environment.baseUrl}admin-fare-family-commission`, data);
    }

    updateFareFamilyCommssion(data: FareFamilyCommissionData): Observable<FareFamilyCommissionData> {
        const id = data.id;
        delete data.id
        return this.http.put<FareFamilyCommissionData>(`${environment.baseUrl}admin-fare-family-commission/${id}`, data);
    }

    deleteFareFamilyCommission(data: FareFamilyCommissionData): Observable<FareFamilyCommissionData> {
        return this.http.delete<FareFamilyCommissionData>(`${environment.baseUrl}admin-fare-family-commission/${data.id}`);
    }
}
