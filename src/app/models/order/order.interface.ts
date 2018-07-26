import { Address } from '../address/address.model';
import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { OrderTotalData } from '../order-total/order-total.interface';
import { PaymentMethod } from '../payment-method/payment-method.model';
import { Price } from '../price/price.model';
import { ShippingBucketData } from '../shipping-bucket/shipping-bucket.interface';

export interface OrderData {
  documentNo: string;
  creationDate: Date;
  status: string;
  payments: PaymentMethod[];

  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  shippingBuckets: ShippingBucketData[];
  totals: OrderTotalData;
  valueRebates?: BasketRebate[];
  itemSurchargeTotalsByType: {
    amount: Price;
    description: string;
    displayName: string;
    name: string;
    type: string;
  }[];
}