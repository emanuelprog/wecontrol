import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { MoaiResponse } from '../../models/moai-response.model';

@Injectable({
  providedIn: 'root'
})
export class MoaiService {

  private baseUrl = 'api/moai';

  constructor(private httpClient: HttpClient) { }

  findAll(id: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });

    return this.httpClient.get<any>(this.baseUrl + `/${id}`, { headers: headers, observe: 'response' });
  }

  create(createJson: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    return this.httpClient.post<any>(this.baseUrl + '/create', createJson, { headers: headers, observe: 'response'});
  }

  edit(editJson: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    return this.httpClient.put<any>(this.baseUrl + `/${editJson.id}`, editJson, { headers: headers, observe: 'response'});
  }

  delete(id: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    return this.httpClient.delete<any>(this.baseUrl + `/${id}`, { headers: headers, observe: 'response'});
  }

  addParticipant(moai: MoaiResponse): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });

    return this.httpClient.post<any>(this.baseUrl + '/add-participant', moai, { headers: headers, observe: 'response' });
  }

  bidMonthly(moai: MoaiResponse): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });

    return this.httpClient.post<any>(this.baseUrl + '/bid-monthly', moai, { headers: headers, observe: 'response' });
  }

  deleteBid(moai: MoaiResponse): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });

    return this.httpClient.post<any>(this.baseUrl + '/delete-bid', moai, { headers: headers, observe: 'response' });
  }

}
