import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OptionalEntity} from "../interfaces/optionals";
import {Modelli} from "../interfaces/modelli";

@Injectable({
  providedIn: 'root'
})
export class DbConnectionsService {
  constructor(private httpclient: HttpClient) {  }
  list(): Observable<OptionalEntity[]> {
    return this.httpclient.get<OptionalEntity[]>(
      'https://maseraticonfigurator.azurewebsites.net/api/cars/getOptional'
    );
  }

  listModelli(): Observable<Modelli[]> {
    return this.httpclient.get<Modelli[]>(
      'https://maseraticonfigurator.azurewebsites.net/api/cars/getModelli'
    );
  }
}
