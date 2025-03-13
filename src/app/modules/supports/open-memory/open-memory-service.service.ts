import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OpenMemoryServiceService {
    constructor(private http: HttpClient) {}

    getMemoryData(data: { page: number; pageSize: number }): Observable<{
        allData: any[];
        metadata: {
            totalItems: number;
            totalPages: number;
            currentPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }> {
        let queryParams = `page=${data.page}&pageSize=${data.pageSize}`;
        console.log('data', data);

        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(`${environment.baseUrl}openai/getmemory?${queryParams}`);
    }

    getMemoryById(id: string): Observable<any> {
        const url = `${environment.baseUrl}openai/getmemory/${id}`;
        console.log(`Fetching memory data for ID: ${id}`);

        return this.http.get(url).pipe(
            catchError((error) => {
                console.error('Error fetching memory data:', error);
                return throwError(
                    () => new Error('Error fetching memory data')
                );
            })
        );
    }

    updateMemory(data: any): Observable<any> {
        const url = `${environment.baseUrl}openai/updatememory/${data.id}`;
        console.log(data);

        return this.http.put(url, data).pipe(
            catchError((error) => {
                console.error('Error updating memory data:', error);
                return throwError(
                    () => new Error('Error updating memory data')
                );
            })
        );
    }

    deleteMemory(id: string): Observable<any> {
        const url = `${environment.baseUrl}openai/deletememory/${id}`;
        console.log(`Deleting memory with ID: ${id}`);

        return this.http.delete(url).pipe(
            catchError((error) => {
                console.error('Error deleting memory data:', error);
                return throwError(
                    () => new Error('Error deleting memory data')
                );
            })
        );
    }
}
