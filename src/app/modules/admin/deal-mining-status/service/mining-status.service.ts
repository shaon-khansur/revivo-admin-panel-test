import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MiningStatusService {
    constructor(private http: HttpClient) {}

    getMiningStatus(): Observable<any> {
        return this.http.get<any[]>(
            `${environment.baseUrl}dealMining/getMiningStatus`
        );
    }
}
