// CartMiddleware.ts

import { Middleware } from 'redux';
import { Utils } from "../../common/Utils";
import { Actions } from "../types/Types";

export const cartPersistenceMiddleware: Middleware = store => next => (action: any) => {
    const result = next(action);

    if (action.type === Actions.ADD_TO_CART || action.type === Actions.REMOVE_FROM_CART) {
        const state = store.getState();
        Utils.storeData('cart_items', JSON.stringify(state.cart.cart_items));
    }

    return result;
};