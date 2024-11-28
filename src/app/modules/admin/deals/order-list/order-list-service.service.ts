import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OrderListServiceService {
    constructor(private http: HttpClient) {}

    getDealOrderData(): Observable<any> {
        const url = `${environment.baseUrl}createOrderSave`;
        return this.http.get(url);
    }
    getDealOrderDataById(id: number): Observable<any> {
        const url = `${environment.baseUrl}createOrderSave/deals/${id}`;
        return this.http.get(url);
    }
    deleteDealOrderDataById(id: number): Observable<any> {
      const url = `${environment.baseUrl}createOrderSave/${id}`;
      return this.http.delete(url, { responseType: 'text' }); // Expect text response
  }
  
}
