import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Product } from './product.model';
import { throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  first:string = '';
  prev:string = '';
  next:string = '';
  last:string = '';

  private SERVER_URL = 'http://localhost:3000';

  constructor( private http: HttpClient ) { }

  getProducts() {
    return this.http.get<Product[]>(`${this.SERVER_URL}/products`,
     { params: new HttpParams({fromString: '_page=1&_limit=5'}), observe: 'response'})
     .pipe(retry(3), catchError(this.handleError), tap(res =>{
      this.parseLinkHeader(res.headers.get('Link'));
     }));
  }

  sendRequestToUrl(url: string) {
    return this.http.get<Product[]>(url, { observe: 'response'})
     .pipe(retry(3), catchError(this.handleError), tap(res =>{
      this.parseLinkHeader(res.headers.get('Link'));
     }));
  }
/**
 * Get first, prev, next and last from headers
 * @param header contains links for first, prev, next and last
 */
  parseLinkHeader(header: any) {
    if(header.length === 0) { return; }
    const parts = header.split(',');
    let links:{first?: string, prev?: string, next?: string, last?: string } = {};
    parts.forEach((part:string) => {
      const section = part.split(';');
      const link: string = section[0].replace(/<(.*)>/, '$1').trim();
      const name: string = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name as keyof typeof links] = link;
    });

    this.first = links.first || '';
    this.prev = links.prev || '';
    this.next = links.next || '';
    this.last = links.last || '';
  }

  handleError(error: HttpErrorResponse){
    let errorMessage = 'Unknown error!';
    if(error.error instanceof ErrorEvent){
      errorMessage = `$Error: ${error.error.message}`;
    }else{
      //Server side error
      errorMessage = `Error Code: ${error.status} \nMessage: ${error.message}`;
    }
    alert(errorMessage);
    return throwError(errorMessage);
  }

}


