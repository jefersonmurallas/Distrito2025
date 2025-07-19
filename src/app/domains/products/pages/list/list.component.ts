import {
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';

import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { CategoryService } from '@shared/services/category.service';
import { toObservable, toSignal} from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
})
export default class ListComponent {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  readonly slug =  input<string>();

  categoriesResource = toSignal(this.categoryService.getAll(), { initialValue: [] });

  productResource = toSignal(
    toObservable(this.slug).pipe(
      switchMap((currentSlug) => {
        const requestParams = currentSlug ? { category_slug: currentSlug } : {};
        return this.productService.getProducts(requestParams);
      })
    ),
    { initialValue: [] } // Valor inicial para products
  );

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  } 

}
