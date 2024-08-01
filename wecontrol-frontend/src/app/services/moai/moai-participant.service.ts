import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MoaiParticipantService {

  private baseUrl = 'api/moai-participant';

  constructor(private httpClient: HttpClient) { }

  create(participantJson: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${StorageService.getUser(sessionStorage.getItem('currentUser')!).accessToken}`
    });
    
    return this.httpClient.post<any>(this.baseUrl + '/create', participantJson, { headers: headers, observe: 'response' });
  }
  
}
