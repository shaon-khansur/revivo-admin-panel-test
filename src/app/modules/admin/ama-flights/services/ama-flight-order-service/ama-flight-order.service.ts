import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, concatMap, tap } from 'rxjs';

export interface OrderIDS {
    id: string;
    amadeusOrderId: string;
}

@Injectable({
    providedIn: 'root',
})
export class AmaFlightOrderService {
    constructor(private http: HttpClient) {}

    getAllOrders(data: any): Observable<any> {
        console.log('calling... http params');
        return this.http.get(`${environment.baseUrl}flights-order?page=${data.page}&limit=${data.limit}`);
    }

    deleteAmadeusFlightOrder(data: OrderIDS): Observable<any> {
        return this.http
            .delete(
                `${environment.baseUrl}ama-flight-orders/${data.amadeusOrderId}`
            )
            .pipe(
                tap({
                    next: (res) => console.log('tap succ', res),
                    error: (err) => console.log('tap err', err),
                }),
                concatMap((response) => {
                    return this.http.delete(
                        `${environment.baseUrl}flights-order/${data.id}`
                    );
                })
            );
    }
}
