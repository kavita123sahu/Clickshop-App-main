import { tokens } from "react-native-paper/lib/typescript/styles/themes/v3/tokens";
import { Utils } from "../common/Utils";
import { BaseUrl, Method } from "../config/Key";

export const add_to_cart = async (data: object) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.POST,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + 'cart', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_cart_list = async (postalCode?: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            const user = await Utils.getData('_USER_DETAILS');
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }

            const url = postalCode
                ? `${BaseUrl.urlV3}cart?postal_code=${postalCode}`
                : `${BaseUrl.urlV3}cart`;

            let serverResponse = await fetch(url, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}


export const remove_from_cart = async (productID: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.DELETE,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `cart/${productID}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const update_quantity = async (productID: any, data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.PUT,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `cart/${productID}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const create_order_ID = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.POST,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `order`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const verify_order = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.POST,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `order/verify-payment`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}