import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, concatMap, from, map, of, switchMap, toArray } from 'rxjs';

export interface FareUpsellErrorsApiResponse {
    data: {
        id: string;
        timeStamp: string;
        apiError: string | any;
        payload: string | any;
        success: boolean;
        response: string | any | null;
        retry: boolean;
    }[];
    totalItems: number;
    limit: number;
    page: number;
}

export interface FareUpsellErrorsData {
    id: string;
    timeStamp: string;
    apiError: string | any;
    payload: string | any;
    success: boolean;
    response: string | any | null;
    retry: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class FareUpsellErrorService {
    constructor(private http: HttpClient) {}

    getFareUpsellErrorsData(data: {
        page: number;
        limit: number;
    }): Observable<FareUpsellErrorsApiResponse> {
        return this.http
            .get<FareUpsellErrorsApiResponse>(
                `${environment.baseUrl}fare-upsell-errors?page=${data.page}&limit=${data.limit}`
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
                            retry: 'retry' in data ? data.retry : false,
                        };
                    });
                    return of({
                        data,
                        totalItems: res.totalItems,
                        limit: data.limit,
                        page: data.page,
                    });
                })

                // map((res:any) => res.data),
                // concatMap((res: FareUpsellErrorsData[]) => from(res)),
                // map((data) => {
                //     return {
                //         id: data.id,
                //         timeStamp: new Date(data.timeStamp).toISOString(),
                //         apiError: data.apiError ? JSON.parse(data.apiError) : data.apiError,
                //         payload: JSON.parse(data.payload),
                //         success: data.success,
                //         response: data.response ?  JSON.parse(data.response) : data.response,
                //         retry: 'retry' in data ? data.retry : false
                //     }
                // }),
                // toArray()
            );
    }
}
