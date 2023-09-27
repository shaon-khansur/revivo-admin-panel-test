import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../../../environments/environment';
import { Destination } from 'app/modules/admin/deals/destination/destination';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
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

  url: string = environment.baseUrl;

  private _user: BehaviorSubject<Destination | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<Destination[] | null> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}

  getAllDestination(): Observable<Destination[]> {
    return this.http.get<any>(`${environment.baseUrl}admin-destination`).pipe(
        map((response) => {
            if (Array.isArray(response.data)) {
                return response.data; // Return the array if it exists
            } else {
                return []; // Return an empty array or handle the error as needed
            }
        }),
        tap((users) => {
            this._users.next(users);
        })
    );
}

  get destinations$(): Observable<Destination[]> {
      return this._users.asObservable();
  }
  get destination$(): Observable<Destination> {
      return this._user.asObservable();
  }

  getUserById(id: string): Observable<Destination> {
    return this._users.pipe(
      take(1),
      tap((users: any) => {
        this._users.next(users);
      }),
      switchMap((users) => {
        if (!Array.isArray(users)) {
          return throwError('Users is not an array');
        }
  
        // Find the contact
        const user = users.find((item) => item.id === id) || null;
  
        // Update the contact
        this._user.next(user);
  
        if (!user) {
          return throwError('Could not find contact with id of ' + id + '!');
        }
  
        return of(user);
      })
    );
  }  

  updateDestination(id, data): Observable<any> {
      return this.http.put(`${environment.baseUrl}admin-destination/${id}`, data);
  }

  deleteDestination(id): Observable<any> {
      return this.http.delete(`${environment.baseUrl}admin-destination/${id}`);
  }

  getAllDeals() {
    return this.http.get(this.url + 'admin-destination');
  }

  insertDeals(requestBody: any) {
    return this.http.post(this.url + 'admin-destination', requestBody);
  }

  bulkUpdateDeals(requestBody: any) {
    return this.http.post(this.url + 'admin-destination/bulk-update', requestBody);
  }
}
