import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

interface SupplierData {
    name: string;
    code: string;
}

@Injectable({
    providedIn: 'root',
})
export class SupplierService {
    constructor(private http: HttpClient) {}

    getAllSupplier(data: {
        page: number;
        name: string;
        pageSize: number;
    }): Observable<{
        allData: any[];
        metadata: {
            totalItems: number;
            totalPages: number;
            currentPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }> {
        // Start with the basic query parameters
        let queryParams = `name=${data.name}&page=${data.page}&pageSize=${data.pageSize}`;

        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(`${environment.baseUrl}supplierList?${queryParams}`);
    }
    getSupplierById(id): Observable<any> {
        return this.http.get(`${environment.baseUrl}supplierList/${id}`);
    }
    deleteSupplierById(id): Observable<any> {
        return this.http.delete(`${environment.baseUrl}supplierList/${id}`);
    }
    updateSupplier(data: SupplierData, id:string): Observable<any> {
        const url = `${environment.baseUrl}supplierList/${id}`;
        console.log(data);

        return this.http.put(url, data).pipe(
            catchError((error) => {
                // Handle the error here
                console.error('Error updating hotel data:', error);
                return throwError(() => new Error('Error updating hotel data'));
            })
        );
    }
}
