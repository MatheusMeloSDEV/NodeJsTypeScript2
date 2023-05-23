import { Component, Input } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { User } from './user';

@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent {
   @Input() users = []
   title = 'TODOapp';
   arrayDeTarefas: Tarefa[] = [];
   arrayDeUsers: User[] = [];
   apiURL : string;
   tokenJWT = '{ "token":""}';
   usuarioLogado = false;
   adminLogado = false;
   loginForm = false;
 constructor(private http: HttpClient) {
 this.apiURL = 'http://localhost:3000';
 this.READ_tarefas();
 }
 CREATE_tarefa(descricaoNovaTarefa: string) {
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe(
    resultado => { console.log(resultado); this.READ_tarefas(); });
 }
READ_tarefas() {
 const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
 this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`, { 'headers': idToken }).subscribe(
 (resultado) => { this.arrayDeTarefas = resultado; this.usuarioLogado = true; this.loginForm = true },
 (error) => { this.usuarioLogado = false; this.loginForm = false }
 )
}  
 DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    var indice = this.arrayDeTarefas.indexOf(tarefaAserRemovida);
    var id = this.arrayDeTarefas[indice]._id;
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`).subscribe(
    resultado => { console.log(resultado); this.READ_tarefas(); });
 }   
 UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    var indice = this.arrayDeTarefas.indexOf(tarefaAserModificada);
    var id = this.arrayDeTarefas[indice]._id;
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`,
    tarefaAserModificada).subscribe(
    resultado => { console.log(resultado); this.READ_tarefas(); });
 }

 READ_users() {
   const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
   this.http.get<User[]>(`${this.apiURL}/api/getUsers`, { 'headers': idToken }).subscribe(
   (resultado) => { this.arrayDeUsers = resultado; this.adminLogado = true; this.loginForm = true; console.log(this.arrayDeUsers)},
   (error) => { this.adminLogado = false; this.loginForm = false }
   )
  }  
 
 login(username: string, password: string) {
   var credenciais = { "nome": username, "senha": password }

   if(credenciais.nome =="admin" && credenciais.senha =="admin"){
      this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe(resultado => {
         this.tokenJWT = JSON.stringify(resultado);
         this.READ_users();
      });
   }
   else{
      this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe(resultado => {
         this.tokenJWT = JSON.stringify(resultado);
         this.READ_tarefas();
         });
   }
   
  }
  

}


