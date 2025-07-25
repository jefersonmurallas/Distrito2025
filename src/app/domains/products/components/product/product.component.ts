import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { Product } from '@shared/models/product.model';

import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-product',
  imports: [CommonModule, TimeAgoPipe, RouterLinkWithHref],
  templateUrl: './product.component.html',
})
export class ProductComponent {
  readonly product = input.required<Product>();

  addToCart = output<Product>();

  addToCartHandler() {
    this.addToCart.emit(this.product());
  }
}
