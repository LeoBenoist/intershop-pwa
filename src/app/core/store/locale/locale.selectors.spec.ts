import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { getAvailableLocales, getCurrentLocale, SelectLocale, SetAvailableLocales } from '.';
import { Locale } from '../../../models/locale/locale.interface';
import { CoreState } from '../core.state';
import { reducers } from '../core.system';

describe('Locale Selectors', () => {

  let store: Store<CoreState>;

  let currentLocale$: Observable<Locale>;
  let availableLocales$: Observable<Locale[]>;

  const locales = [
    { lang: 'cn' },
    { lang: 'jp' }
  ] as Locale[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
      ],
    });

    store = TestBed.get(Store);

    currentLocale$ = store.pipe(select(getCurrentLocale));
    availableLocales$ = store.pipe(select(getAvailableLocales));
  });

  it('should have nothing when just initialized', () => {
    currentLocale$.subscribe(locale => expect(locale).toBeNull());
    availableLocales$.subscribe(array => expect(array.length).toBe(0));
  });

  it('should select a available locales when SetAvailableLocales action is reduced', () => {
    store.dispatch(new SetAvailableLocales(locales));

    availableLocales$.subscribe(array => {
      expect(array.length).toBe(locales.length);
      expect(array).toEqual(locales);
    });

    // should still be null
    currentLocale$.subscribe(locale => expect(locale).toBeNull());
  });

  it('should select a locale when SelectLocale action is reduced', () => {
    store.dispatch(new SetAvailableLocales(locales));
    store.dispatch(new SelectLocale(locales[1]));

    currentLocale$.subscribe(locale => expect(locale).toEqual(locales[1]));
  });
});