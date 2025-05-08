import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';

interface KosherAdminInfo {
    title: string;
    subtitle: string;
    description: string;
    options: string[];
    information: string;
}

interface HotelData {
    id: string;
    value: {
        HotelRate: number;
        HotelName: string;
        thumbnail?: string;
        Website?: string;
        file?: any; // Adjust this type based on your file structure
        Description?: string;
        AboutHotel?: string;
        HotelFacilities?: string[];
    };
}

@Injectable({
    providedIn: 'root',
})
export class HotelService {
    constructor(private http: HttpClient) {}
    temporaryUrl = 'https://app-x6i4pjdvfq-uc.a.run.app/api/';

    getAllHotels(data: {
        page: number;
        hotelName: string;
        pageSize: number;
        kosherStatus?: string | boolean;
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
        // Start with the basic query parameters
        let queryParams = `hotelName=${data.hotelName}&page=${data.page}&pageSize=${data.pageSize}`;

        // Add the kosherStatus filter if it is defined
        if (data.kosherStatus !== undefined && data.kosherStatus !== '') {
            queryParams += `&status=${data.kosherStatus}`;
        }

        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(`${this.temporaryUrl}hotelData?${queryParams}`);
    }
    getHotelById(id: string): Observable<any> {
        return this.http.get(`${this.temporaryUrl}hotelData/${id}`);
    }
    getAllKosherHotels(data: {
        page: number;
        hotelName: string;
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
        // console.log('data', data);
        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(
            `${this.temporaryUrl}kosherHotelData?hotelName=${data.hotelName}&page=${data.page}&pageSize=${data.pageSize}`
        );
    }

    updateKosherHotel(data: HotelData): Observable<any> {
        const url = `${this.temporaryUrl}kosherHotelData/${data.id}`;
        console.log(data);

        return this.http.put(url, data).pipe(
            catchError((error) => {
                // Handle the error here
                console.error('Error updating hotel data:', error);
                return throwError(() => new Error('Error updating hotel data'));
            })
        );
    }
    getKosherHotelById(id: any): Observable<any> {
        return this.http.get(`${this.temporaryUrl}kosherHotelData/${id}`);
    }
    getHotelImage(file: any): Observable<any> {
        return this.http.post(`${this.temporaryUrl}UploadImage`, file);
    }
    toggleKosherStatus(hotelId: string, isKosher: boolean): Observable<any> {
        const url = `${this.temporaryUrl}hotelData/toggleKosherStatus`;
        const body = { hotelId, isKosher };

        return this.http.post(url, body);
    }

    // tbo hotels
    getAllTBOHotels(data: {
        page: number;
        hotelName: string;
        pageSize: number;
        kosherStatus?: string | boolean;
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
        // Start with the basic query parameters
        let queryParams = `hotelName=${data.hotelName}&page=${data.page}&pageSize=${data.pageSize}`;

        console.log('data', data);

        // Add the kosherStatus filter if it is defined
        if (data.kosherStatus !== undefined && data.kosherStatus !== '') {
            queryParams += `&status=${data.kosherStatus}`;
        }

        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(`${this.temporaryUrl}hotelData/hotels/tbo-hotels?${queryParams}`);
    }
    getTBOHotelById(id: string, isKosher: any): Observable<any> {
        return this.http.get(
            `${this.temporaryUrl}hotelData/hotels/tbo-hotels/${id}/${isKosher}`
        );
    }
    addHotel(data: any): Observable<any> {
        return this.http.post<any>(
            `${this.temporaryUrl}hotelData/hotels/tbo-hotels`,
            data
        );
    }
    updateHotel(data: HotelData, id: string): Observable<any> {
        const url = `${this.temporaryUrl}hotelData/hotels/tbo-hotels/${id}`;
        console.log(data);

        return this.http.put(url, data).pipe(
            catchError((error) => {
                // Handle the error here
                console.error('Error updating hotel data:', error);
                return throwError(() => new Error('Error updating hotel data'));
            })
        );
    }

    // room data
    getRoomData(data: {
        page: number;
        roomNameSearch: string;
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
        // Start with the basic query parameters
        let queryParams = `roomNameSearch=${data.roomNameSearch}&page=${data.page}&pageSize=${data.pageSize}`;
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
        }>(`${this.temporaryUrl}roomMap?${queryParams}`);
    }
    updateRoom(data: any): Observable<any> {
        const url = `${this.temporaryUrl}roomMap/${data.id}`;
        console.log(data);

        return this.http.put(url, data).pipe(
            catchError((error) => {
                // Handle the error here
                console.error('Error updating hotel data:', error);
                return throwError(() => new Error('Error updating hotel data'));
            })
        );
    }

    getCitySearch(value: string): Observable<any> {
        const url = `${this.temporaryUrl}tboHotelDetails/citySearchList?value=${value}`;
        const httpContext = new HttpContext();
        return this.http.get(url, { context: httpContext });
    }

    // tbo city list
    getCityData(data: {
        page: number;
        cityName: string;
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
        // Start with the basic query parameters
        let queryParams = `cityName=${data.cityName}&page=${data.page}&pageSize=${data.pageSize}`;
        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(`${this.temporaryUrl}tboCityListAdmin?${queryParams}`);
    }
    updateCity(data: any): Observable<any> {
        const url = `${this.temporaryUrl}tboCityListAdmin/${data.id}`;
        return this.http.put(url, data).pipe(
            catchError((error) => {
                console.error('Error updating hotel data:', error);
                return throwError(() => new Error('Error updating hotel data'));
            })
        );
    }
    // facility
    getFacilityData(data: {
        page: number;
        facilityName: string;
        perPage: number;
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
        // Start with the basic query parameters
        let queryParams = `facilityName=${data.facilityName}&page=${data.page}&perPage=${data.perPage}`;
        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(
            `${this.temporaryUrl}getHotelFacility/getAllFacilityList?${queryParams}`
        );
    }
    updateFacility(data: any): Observable<any> {
        const url = `${this.temporaryUrl}getHotelFacility/updateIconName/${data.id}`;
        return this.http.put(url, data).pipe(
            catchError((error) => {
                console.error('Error updating hotel facility data:', error);
                return throwError(
                    () => new Error('Error updating facility data')
                );
            })
        );
    }
    getAdminInfo(): Observable<KosherAdminInfo> {
        return this.http.get<KosherAdminInfo>(
            `${this.temporaryUrl}kosherAdminInfo`
        );
    }

    // PUT update admin info
    updateAdminInfo(data: Partial<KosherAdminInfo>): Observable<any> {
        return this.http.put(`${this.temporaryUrl}kosherAdminInfo`, data);
    }
}
