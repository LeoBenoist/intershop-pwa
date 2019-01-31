import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { Region } from 'ish-core/models/region/region.model';
import { getAllCountries, getCountriesLoading } from 'ish-core/store/countries';
import { LoadRegions, getRegionsByCountryCode } from 'ish-core/store/regions';
import { isBusinessCustomer } from 'ish-core/store/user';
import { determineSalutations, updateValidatorsByDataLength } from '../../../forms/utils/form-utils';
import { AddressFormFactoryProvider } from '../../configurations/address-form-factory.provider';

/**
 * The Address Form Container Component fetches address form related data (countries, regions, titles) and displays an address form using the {@link AddressFormComponent}
 *
 * @example
 * renders the address form for the input (parentForm) form.
 * <ish-address-form-container [parentForm]="form" ></ish-address-form-container>
 */
@Component({
  selector: 'ish-address-form-container',
  templateUrl: './address-form.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressFormContainerComponent implements OnChanges, OnDestroy {
  countries$ = this.store.pipe(select(getAllCountries));
  loading$ = this.store.pipe(select(getCountriesLoading));

  /**
   * Parent form: it must contain control 'countryCodeSwitch' and the actual address control
   */
  @Input() parentForm: FormGroup;

  /**
   * control name of the address form control:  default name 'address'
   */
  @Input() controlName = 'address';

  regions$: Observable<Region[]>;
  titles: string[];
  isBusinessCustomer = false;

  private destroy$ = new Subject();

  constructor(
    private store: Store<{}>,
    private afs: AddressFormFactoryProvider,
    private cd: ChangeDetectorRef,
    private featureToggle: FeatureToggleService
  ) {
    this.store
      .pipe(
        select(isBusinessCustomer),
        takeUntil(this.destroy$)
      )
      .subscribe(
        data => (this.isBusinessCustomer = data || this.featureToggle.enabled('businessCustomerRegistration'))
      );
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.parentForm) {
      const group = this.afs.getFactory('default').getGroup({ isBusinessAddress: this.isBusinessCustomer });
      this.parentForm.setControl(this.controlName, group);

      this.parentForm
        .get('countryCodeSwitch')
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(countryCodeSwitch => this.handleCountryChange(countryCodeSwitch));
    }
  }

  /**
   * Changes address form after country has been changed.
   * Gets country specific data like regions and salutations
   * @param countryCode country code of the country that has been selected in the address form
   */
  private handleCountryChange(countryCode: string) {
    const oldFormValue = this.parentForm.get(this.controlName).value;
    const group = this.afs.getFactory(countryCode).getGroup({
      isBusinessAddress: this.isBusinessCustomer,
      value: {
        ...oldFormValue,
        countryCode,
      },
    });
    this.parentForm.setControl(this.controlName, group);

    this.fetchDataAfterCountryChange(countryCode);
  }

  /**
   * fetches titles and regions after country change and updates address form validator for regions
   */
  private fetchDataAfterCountryChange(countryCode: string) {
    if (countryCode) {
      this.store.dispatch(new LoadRegions({ countryCode }));
      this.regions$ = this.store.pipe(select(getRegionsByCountryCode, { countryCode }));
      this.regions$.pipe(takeUntil(this.destroy$)).subscribe(regions => this.updateRegions(regions));
      this.titles = determineSalutations(countryCode);
      this.cd.detectChanges(); // necessary to show titles/regions while editing an existing address
    }
  }

  /**
   * update validators for "state (mainDivision)" control in address form according to regions
   */
  private updateRegions(regions: Region[]) {
    if (this.parentForm && this.parentForm.get(this.controlName)) {
      const stateControl = this.parentForm.get(this.controlName).get('mainDivision');
      if (regions && stateControl) {
        updateValidatorsByDataLength(stateControl, regions, Validators.required, false);
      }
    }
  }

  get countryCode() {
    return this.parentForm && this.parentForm.get('countryCodeSwitch')
      ? this.parentForm.get('countryCodeSwitch').value
      : undefined;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
