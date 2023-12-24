import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, concatMap, from, map, toArray } from 'rxjs';


export interface CreateOrderErrorData {
    id: string;
    timeStamp: string;
    apiError: string | any;
    payload: string | any;
    success: boolean;
    response: string | any | null;
}

@Injectable({
  providedIn: 'root'
})
export class CreateOrderErrorService {

    constructor(private http: HttpClient) {}

    getFareUpsellErrorsData(): Observable<CreateOrderErrorData[]> {
        return this.http
            .get<CreateOrderErrorData[]>(
                `${environment.baseUrl}create-order-errors`
            )
            .pipe(
                map((res:any) => res.data),
                concatMap((res: CreateOrderErrorData[]) => from(res)),
                map((data) => {
                    return {
                        id: data.id,
                        timeStamp: new Date(data.timeStamp).toISOString(),
                        apiError: data.apiError ? JSON.parse(data.apiError) : data.apiError,
                        payload: JSON.parse(data.payload),
                        success: data.success,
                        response: data.response ?  JSON.parse(data.response) : data.response
                    }
                }),
                toArray()
            );
    }
}
