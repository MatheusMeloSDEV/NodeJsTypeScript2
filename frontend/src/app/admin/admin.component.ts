import { Component, Input } from '@angular/core';
import { User } from '../user';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {AppComponent} from '../app.component'
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  apiURL:string;
  emEdicao:boolean = false
  @Input() users: any = []
  constructor(private http: HttpClient, private appComponent: AppComponent) {
    this.apiURL = 'http://localhost:3000'
  }

  editar(){
    this.emEdicao? this.emEdicao=false : this.emEdicao=true
  }

  DELETE_user(id: string) {
    this.http.delete<User>(`${this.apiURL}/api/adminDelete/${id}`).subscribe(
    resultado => { console.log(resultado); this.appComponent.READ_users(); });
 } 

 CREATE_user(nome: string, senha:string) {
  this.http.post<User>(`${this.apiURL}/api/adminPost`, {nome:nome, senha:senha}).subscribe(
  resultado => { console.log(resultado); this.appComponent.READ_users(); });
}

UPDATE_user(id:string,nome:string,senha:string) {
  this.http.patch<User>(`${this.apiURL}/api/adminUpdate/${id}`, {nome:nome, senha:senha}).subscribe(
  resultado => { console.log(resultado); this.appComponent.READ_users(); this.emEdicao=false });
}

}
