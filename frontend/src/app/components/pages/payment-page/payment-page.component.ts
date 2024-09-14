import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Cart } from 'src/app/shared/models/Cart';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-payment-page',
  standalone: false,
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.scss',
})
export class PaymentPageComponent implements OnInit {
  order: Order = new Order();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    /* 
    O "items" do servidor não me retorna todas as informações do Item que está no Cart
    Diferente da page checkout que pega todas as informações do cart que estão salvas no LocalStorage
    Essa linha ficará comentada até eu armazenar as informações do carrinho no servidor
    Esta carrinho ficará vinculado ao usuário
    */

    this.orderService.getNewOrderForUser().subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (_) => {
        this.router.navigateByUrl('/checkout');
      },
    });
  }
}
