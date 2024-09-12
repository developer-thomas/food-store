import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public cartQuantity = 0;
  public user!: User;

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {
    this.cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    });

    this.userService.userObservable$.subscribe((loggedUser: User) => {
      this.user = loggedUser;
    });
    console.log(this.user);
  }

  ngOnInit() {}

  logout() {
    this.userService.logout();
  }

  isUserAuth() {
    return this.user.token;
  }
}
