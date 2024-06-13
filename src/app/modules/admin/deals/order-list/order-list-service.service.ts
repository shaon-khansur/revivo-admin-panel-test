import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderListServiceService {

  constructor( private http: HttpClient ) { }

  getDealOrderData(): Observable<any> {
    const url = `${environment.baseUrl}createDealOrderSave`;
    return this.http.get(url);
  }
}
