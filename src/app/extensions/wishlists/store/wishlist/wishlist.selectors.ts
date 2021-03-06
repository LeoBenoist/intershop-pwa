import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { flatten, isEqual, uniq } from 'lodash-es';

import { Wishlist } from '../../models/wishlist/wishlist.model';
import { getWishlistsState } from '../wishlists-store';

import { initialState, wishlistsAdapter } from './wishlist.reducer';

const getWishlistState = createSelector(getWishlistsState, state => (state ? state.wishlists : initialState));

const { selectEntities, selectAll } = wishlistsAdapter.getSelectors(getWishlistState);

export const getAllWishlists = selectAll;

export const getWishlistsLoading = createSelector(getWishlistState, state => state.loading);

export const getWishlistsError = createSelector(getWishlistState, state => state.error);

export const getSelectedWishlistId = createSelector(getWishlistState, state => state.selected);

export const getSelectedWishlistDetails = createSelector(
  selectEntities,
  getSelectedWishlistId,
  (entities, id): Wishlist => id && entities[id]
);

export const getWishlistDetails = createSelector(
  selectEntities,
  (entities, props: { id: string }): Wishlist => props.id && entities[props.id]
);

export const getPreferredWishlist = createSelector(getAllWishlists, entities => entities.find(e => e.preferred));

/**
 * Gets all unique items from all wishlists
 * Returns an array of the wishlist item product SKUs
 */
export const getAllWishlistsItemsSkus = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getAllWishlists, (wishlists): string[] =>
  uniq(flatten(wishlists.map(wishlist => wishlist.items.map(items => items.sku))))
);
