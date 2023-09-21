import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../../../environments/environment';
const headerOption = {
  headers: new HttpHeaders(
    { 
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      'Content-Type': 'application/json' 
    }
  )
};

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  constructor(private http: HttpClient) { }

  url: string = environment.baseUrl;

  getAllDeals() {
    return this.http.get(this.url + 'admin-destination');
  }

  insertDeals(requestBody: any) {
    return this.http.post(this.url + 'admin-destination', requestBody);
  }
  updateDeals(requestBody: any) {
    return this.http.put(this.url + 'admin-destination', requestBody);
  }

  bulkUpdateDeals(requestBody: any) {
    return this.http.post(this.url + 'admin-destination/bulk-update', requestBody);
  }
}
