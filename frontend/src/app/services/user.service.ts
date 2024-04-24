import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL } from '../shared/urls/urls';
import { ToastrService } from 'ngx-toastr';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );
  userObservable$: Observable<User> = this.userSubject.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user: User) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastr.success(
            `Bem vindo, ${user.name}!`,
            'Logado com sucesso!'
          );
        },
        error: (errorResponse) => {
          this.toastr.error(errorResponse.error, 'Falha ao entrar');
        },
      })
    );
  }

  public setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) {
      return JSON.parse(userJson) as User;
    } else {
      return new User();
    }
  }
}
