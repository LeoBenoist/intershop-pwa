import { Address } from '../address/address.model';

import { Customer } from './customer.model';

/**
 * response data type for signIn user
 */
export interface CustomerData extends Customer {
  title?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;

  phoneHome?: string;
  phoneBusiness?: string;
  phoneMobile?: string;
  fax?: string;
  email?: string;

  preferredLanguage?: string;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;
}