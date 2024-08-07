import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private confirmEmailUrl = 'api/auth/confirm-email';

  private serviceID = 'service_bdnsp4r';
  private templateID = 'template_5osv4un';

  constructor(private httpClient: HttpClient) { }

  confirmEmail(email: string): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.confirmEmailUrl, encodeURI(email), { observe: 'response'});
  }

  sendEmail(to: string, subject: string, resetLink: string): Promise<EmailJSResponseStatus> {
    emailjs.init("3uYAFRE_bkzXqlraO");

    const templateParams = {
      subject: subject,
      to: to,
      replyto: to,
      reset_link: resetLink
    };

    return emailjs.send(this.serviceID, this.templateID, templateParams);
  }
}
