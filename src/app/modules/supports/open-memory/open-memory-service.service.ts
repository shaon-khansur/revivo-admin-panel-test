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
        conversations: any[];
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
            conversations: any[];
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

    updateMemory(conversation_id: string, messages: any[]): Observable<any> {
        const url = `${environment.baseUrl}openai/updatememory/${conversation_id}`;

        // Ensure the payload contains messages
        const payload = { messages };

        return this.http.put(url, payload).pipe(
            catchError((error) => {
                console.error('Error updating memory data:', error);
                return throwError(
                    () =>
                        new Error(error.message || 'Error updating memory data')
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
    deleteAllMemory(): Observable<any> {
        const url = `${environment.baseUrl}openai/deleteallmemory`;
        return this.http.delete(url).pipe(
            catchError((error) => {
                console.error('Error deleting all memory:', error);
                return throwError(() => new Error('Error deleting all memory'));
            })
        );
    }
}
