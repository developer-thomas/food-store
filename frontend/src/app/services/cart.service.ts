import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/Caritem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor() {}

  // FUNCIONAMENTOS DOS MÉTODOS A SEGUIR:
  // Todos os métodos alteram alguma coisa específica dentro de cart, e para que possamos trabalhar com essas mudanças, iremos observar o subject de cart
  // A propriedade cart acima armazena os dados do localStorage. O método setCartToLocalStorage define as info no localStorage

  // em addToCart iremos verificar se o item passado como argumento já existe em cart.items, se existir não faz nada
  // caso não exista, vai adicionar uma nova instancia de CartItem e defini-la dentro de localStorage.
  addToCart(food: Food): void {
    let cartItemExists = this.cart.items.find(
      (item) => item.food.id === food.id
    );
    if (cartItemExists) {
      return;
    } else {
      this.cart.items.push(new CartItem(food));
      this.setCartToLocalStorage();
    }
  }

  removeFromCart(foodId: string): void {
    let remainingElements = this.cart.items.filter(
      (item) => item.food.id !== foodId
    );
    this.cart.items = remainingElements;
    return this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find((item) => item.food.id === foodId);
    if (!cartItem) {
      return;
    } else {
      cartItem.quantity = quantity;
      cartItem.price = quantity * cartItem.food.price;
      this.setCartToLocalStorage();
    }
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  private setCartToLocalStorage(): void {
    // Soma os valores totais dos itens
    this.cart.totalPrice = this.cart.items.reduce(
      (acc, cur) => acc + cur.price,
      0
    );

    // Soma as quantidades totais dos itens
    this.cart.totalCount = this.cart.items.reduce(
      (acc, cur) => acc + cur.quantity,
      0
    );

    // Adiciona a propriedade cart ao localStorage, lembrnado que no localStorage tem que ser string, logo iremos transformar
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage(): Cart {
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
