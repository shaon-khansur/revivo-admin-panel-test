import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SubscriberService {
    constructor(private http: HttpClient) {}

    getAllSubscriber(data: {
        page: number;
        name: string;
        pageSize: number;
    }): Observable<{
        allData: any[];
        metadata: {
            totalItems: number;
            totalPages: number;
            currentPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }> {
        // Construct query parameters with encoding
        const params = new URLSearchParams({
            page: data.page.toString(),
            name: encodeURIComponent(data.name || ''),
            pageSize: data.pageSize.toString(),
        });

        // Build the complete URL
        const url = `${environment.baseUrl}subscriber?${params.toString()}`;

        // Perform the HTTP GET request
        return this.http
            .get<{
                allData: any[];
                metadata: {
                    totalItems: number;
                    totalPages: number;
                    currentPage: number;
                    hasNextPage: boolean;
                    hasPrevPage: boolean;
                };
            }>(url)
            .pipe(
                catchError((error) => {
                    console.error('Error fetching data:', error);
                    return throwError(
                        () =>
                            new Error(
                                'Error fetching data. Please try again later.'
                            )
                    );
                })
            );
    }

    updateStatus(id: string): Observable<any> {
        return this.http.patch(`${environment.baseUrl}subscriber/${id}`, {
            Read: true,
        });
    }

    deleteSubscriber(id): Observable<any> {
        return this.http.delete(`${environment.baseUrl}subscriber/${id}`);
    }
}
