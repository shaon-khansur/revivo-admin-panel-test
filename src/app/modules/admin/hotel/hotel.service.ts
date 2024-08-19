import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private baseUrl = `${environment.baseUrl}`; // Base URL from environment

  constructor(private http: HttpClient) {}

  // Method to get all hotels
  getAllHotels(): Observable<any> {
    const url = `${this.baseUrl}hotelData`;
    return this.http.get(url);
  }

  // Method to get a hotel by ID
  getHotelById(id: any): Observable<any> {
    const url = `${this.baseUrl}hotelData/${id}`; // URL with ID appended
    return this.http.get(url);
  }
}
