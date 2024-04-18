import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/shared/models/Caritem';
import { Cart } from 'src/app/shared/models/Cart';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  cart!: Cart;

  // Aqui iremos observar as mudanças que acontecem em cart dentro do service e acrescentar essas mudanças na nossa propriedade cart deste component
  // em cartService os métodos alteram os valores da propriedade cart lá de dentro
  constructor(private cartService: CartService) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });
  }

  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem.food.id);
  }

  changeQuantity(cartItem: CartItem, quantityInString: string) {
    const quantity = Number(quantityInString);
    this.cartService.changeQuantity(cartItem.food.id, quantity);
  }
}
