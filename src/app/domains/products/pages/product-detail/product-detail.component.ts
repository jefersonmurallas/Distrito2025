import { Component, inject, input, linkedSignal, effect } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { switchMap } from 'rxjs';


import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { MetaTagsService } from '@shared/services/meta-tags.service';

import { environment } from '@env/environment';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent{
  readonly slug = input.required<string>();
  productResource = toSignal(
    toObservable(this.slug).pipe(
      switchMap((currentSlug) => {
        return this.productService.getOne(currentSlug);
      })
    ),
    { initialValue: undefined } // Valor inicial para products // Valor inicial para products
  );
  $cover = linkedSignal({
    source: this.productResource,
    computation: (product, previousValue)=>{
    if(product && product.images.length > 0){
      return product.images[0];
    }
    return previousValue?.value;
    }
  });
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  metaService = inject(MetaTagsService);

  constructor(){ 
    effect(()=>{
      const product = this.productResource();
      if(product){
        this.metaService.updateMetaTags({
          title: product.title,
          description: product.description,
          image: product.images[0],
          url: `${environment.dominio}/product/${product.slug}`
        })
      }
    })
  }

  


  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productResource();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
