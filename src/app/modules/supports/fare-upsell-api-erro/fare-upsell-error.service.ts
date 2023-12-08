import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, concatMap, from, map, toArray } from 'rxjs';

export interface FareUpsellErrorsData {
    id: string;
    timeStamp: number;
    apiError: string | any;
    payload: string | any;
}

@Injectable({
    providedIn: 'root',
})
export class FareUpsellErrorService {
    constructor(private http: HttpClient) {}

    getFareUpsellErrorsData(): Observable<FareUpsellErrorsData[]> {
        return this.http
            .get<FareUpsellErrorsData[]>(
                `${environment.baseUrl}fare-upsell-errors`
            )
            .pipe(
                map((res:any) => res.data),
                concatMap((res: FareUpsellErrorsData[]) => from(res)),
                map((data) => {
                    return {
                        id: data.id,
                        timeStamp: data.timeStamp,
                        apiError: JSON.parse(data.apiError),
                        payload: JSON.parse(data.payload)
                    }
                }),
                toArray()
            );
    }
}
