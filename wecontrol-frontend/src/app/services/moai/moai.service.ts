import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MoaiResponse } from '../../models/moai.model';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MoaiService {

  private baseUrl = 'api/moai';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    
    return this.httpClient.get<any>(this.baseUrl, { headers: headers, observe: 'response' });
  }

  create(createJson: Object): Observable<HttpResponse<MoaiResponse>> {
    return this.httpClient.post<MoaiResponse>(this.baseUrl + '/create', createJson, { observe: 'response'});
  }
  
}
