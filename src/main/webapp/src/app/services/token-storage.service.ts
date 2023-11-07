import { Injectable } from '@angular/core';

const TOKEN_KEY = "sig-auth-token";
const USER_KEY_LISTE = "sig-user-liste";
import { User } from '../model/users/User.model';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  usersObjet: Array<User> = [];

  constructor() { }

  clearStorage(): void {
    window.localStorage.clear();
  }

  signOut(): void {
    let curent_liste = JSON.parse(window.localStorage.getItem(USER_KEY_LISTE) ?? '[]');
    if(curent_liste){  //Si la liste des utilisateurs n'est pas null on l'hydrate à l'objet users
      this.usersObjet = curent_liste; 
    }

    for(let entry of this.usersObjet){ //on boucle sur cette liste
        entry.enabled = false;
    }
    window.localStorage.setItem(USER_KEY_LISTE, JSON.stringify(this.usersObjet));
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return window.localStorage.getItem(TOKEN_KEY) ?? '';
  }

  public getListeUser(): string{
    return window.localStorage.getItem(USER_KEY_LISTE) ?? '[]';
  }

  /*
    A noté que l'objet user reçu ici en paramètre est déjà mentionné comme connecté
  */
  public addUserLocalListe(user: User): void{
    let curent_liste = JSON.parse(window.localStorage.getItem(USER_KEY_LISTE) ?? '[]');
    if(curent_liste){  //Si la liste des utilisateurs n'est pas null on l'hydrate à l'objet users
      this.usersObjet = curent_liste; 
    }
    let exist = false;
    let index = 0;
    let targetIndex = 0;
    for(let entry of this.usersObjet){ //on boucle sur cette liste
      if(entry.id == user.id) //si le compte est déjà est en local, on le connecte
      {
        exist = true;
        entry.enabled = true;
        targetIndex = index;
      }else{
        entry.enabled = false;
      }
      index++;
    }

    if(exist == false)
    {
      this.usersObjet.push(user);
    }else{
      this.usersObjet[targetIndex] = user;
    }
    window.localStorage.setItem(USER_KEY_LISTE, JSON.stringify(this.usersObjet));
  }

  public UpdateUserLocalListe(user: any): void{
    let curent_liste = JSON.parse(window.localStorage.getItem(USER_KEY_LISTE) ?? '[]');
    if(curent_liste){  //Si la liste des utilisateurs n'est pas null on l'hydrate à l'objet users
      this.usersObjet = curent_liste;
    }

    for(let entry of this.usersObjet){ //on boucle sur cette liste
      if(entry.id == user.id) //si le compte est déjà est en local, on le connecte
      {
        entry.firstname = user.firstname;
        entry.lastname = user.lastname;
        entry.imgProfil = user.imgprofil;
        break;
      }
    }

    window.localStorage.setItem(USER_KEY_LISTE, JSON.stringify(this.usersObjet));
  }

  public getCurrentUser(){
    let curent_liste = JSON.parse(this.getListeUser());
    if(curent_liste){
      this.usersObjet = curent_liste;
    }
    for(let entry of this.usersObjet){
      if(entry.enabled == true)
      {
        return entry;
      }
    }
    return null;
  }
}
