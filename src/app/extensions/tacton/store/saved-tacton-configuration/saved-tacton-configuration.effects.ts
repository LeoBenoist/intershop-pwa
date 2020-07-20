import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import { mapToPayloadProperty } from 'ish-core/utils/operators';

import { setCurrentConfiguration } from '../product-configuration';
import { getTactonProductForSelectedProduct } from '../tacton-config';

import { saveTactonConfigurationReference } from './saved-tacton-configuration.actions';

@Injectable()
export class SavedTactonConfigurationEffects {
  constructor(private actions$: Actions, private store: Store) {}

  saveCurrentConfigurationReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setCurrentConfiguration),
      mapToPayloadProperty('configuration'),
      withLatestFrom(this.store.pipe(select(getTactonProductForSelectedProduct))),
      map(([configuration, tactonProduct]) => saveTactonConfigurationReference({ configuration, tactonProduct }))
    )
  );
}
