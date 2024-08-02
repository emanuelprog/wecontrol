import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MoaiMonthlyService {

  private baseUrl = 'api/moai-monthly';

  constructor(private httpClient: HttpClient) { }

  findAllByMoaiId(id: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    
    return this.httpClient.get<any>(this.baseUrl + `/${id}`, { headers: headers, observe: 'response' });
  }

  bid(bidJson: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    return this.httpClient.post<any>(this.baseUrl + `/bid`, bidJson, { headers: headers, observe: 'response'});
  }

  editBid(bidJson: any, id: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    return this.httpClient.put<any>(this.baseUrl + `/bid/${id}`, bidJson, { headers: headers, observe: 'response'});
  }

  deleteBid(id: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    return this.httpClient.delete<any>(this.baseUrl + `/bid/${id}`, { headers: headers, observe: 'response'});
  }
  
}
