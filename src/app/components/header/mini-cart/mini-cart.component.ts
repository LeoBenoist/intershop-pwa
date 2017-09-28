import { Component } from '@angular/core';
import { CartStatusService } from '../../../services/cart-status/cart-status.service';

@Component({
  selector: 'is-mini-cart',
  templateUrl: './mini-cart.component.html',
})

export class MiniCartComponent {

  public isCollapsed = true;
  cartPrice: number;
  cartLength: number;

  constructor(cartStatusService: CartStatusService) {
    cartStatusService.subscribe(this.calculateCartValues);
  }

  /**
   * Calculate the total price of cart items
   * @param  {} cartItems
   */
  calculateCartValues = (cartItems) => {
    this.cartPrice = 0;
    this.cartLength = 0;
    if (cartItems && cartItems.length) {
      cartItems.forEach(item => {
        this.cartPrice = this.cartPrice + item.salePrice.value;
      });
      this.cartLength = cartItems.length;
    }
  }
}