import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/urls/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

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

  // obter o ultimo valor do usuário logado
  public get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (userResponse: User) => {
          this.setUserToLocalStorage(userResponse);
          this.userSubject.next(userResponse);
          this.toastr.success(
            `Bem vindo, ${userResponse.name}!`,
            'Logado com sucesso!'
          );
        },
        error: (errorResponse) => {
          this.toastr.error(errorResponse.error, 'Falha ao entrar');
        },
      })
    );
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user: User) => {
          this.setUserToLocalStorage(user.token);
          this.userSubject.next(user);
          this.toastr.success(`
            Welcome ${user.name}, register sucessfully!
            `);
        },
        error: (errorResponse) => {
          this.toastr.error(
            errorResponse.error,
            'Failed to create a new user!'
          );
        },
      })
    );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  public setUserToLocalStorage(token: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(token));
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
