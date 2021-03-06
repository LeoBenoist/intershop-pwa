import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-master-link',
  templateUrl: './product-master-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductMasterLinkComponent implements OnInit {
  product$: Observable<VariationProductView>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('productAsVariationProduct');
    this.visible$ = this.context.select('displayProperties', 'variations');
  }
}
