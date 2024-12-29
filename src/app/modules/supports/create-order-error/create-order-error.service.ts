import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, concatMap, from, map, of, switchMap, toArray } from 'rxjs';

export interface CreateOrderErrorApiResponse {
    data: {
        id: string;
        timeStamp: string;
        apiError: string | any;
        payload: string | any;
        success: boolean;
        response: string | any | null;
    }[];
    totalItems: number;
    limit: number;
    page: number;
}
export interface CreateOrderErrorData {
    id: string;
    timeStamp: string;
    apiError: string | any;
    payload: string | any;
    success: boolean;
    response: string | any | null;
}

@Injectable({
    providedIn: 'root',
})
export class CreateOrderErrorService {
    constructor(private http: HttpClient) {}

    getFareUpsellErrorsData(data: {
        page: number;
        limit: number;
    }): Observable<CreateOrderErrorApiResponse> {
        return this.http
            .get<CreateOrderErrorApiResponse>(
                `${environment.baseUrl}create-order-errors?page=${data.page}&limit=${data.limit}`
            )
            .pipe(
                switchMap((res: any) => {
                    const data = res.data.map((data) => {
                        return {
                            id: data.id,
                            timeStamp: new Date(data.timeStamp).toISOString(),
                            apiError: data.apiError
                                ? JSON.parse(data.apiError)
                                : data.apiError,
                            payload: JSON.parse(data.payload),
                            success: data.success,
                            response: data.response
                                ? JSON.parse(data.response)
                                : data.response,
                        };
                    });

                    return of({data, totalItems: res.totalItems, limit: res.limit, page: res.page});
                })
                // map((res:any) => res.data),
                // concatMap((res: CreateOrderErrorData[]) => from(res)),
                // map((data) => {
                //     return {
                //         id: data.id,
                //         timeStamp: new Date(data.timeStamp).toISOString(),
                //         apiError: data.apiError ? JSON.parse(data.apiError) : data.apiError,
                //         payload: JSON.parse(data.payload),
                //         success: data.success,
                //         response: data.response ?  JSON.parse(data.response) : data.response
                //     }
                // }),
                // toArray()
            );
    }
}
