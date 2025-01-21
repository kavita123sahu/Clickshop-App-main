import { Utils } from "../common/Utils";
import { BaseUrl, Method } from "../config/Key";

export const get_product_details = async (id: any, showCheapest = true) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userDetails = await Utils.getData('_USER_DETAILS');
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v3/products/${id}?user_id=${userDetails?.id}&show_cheapest=${showCheapest}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_related_product = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v1/products/related/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_product_reviews = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v1/reviews/product/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_top_from_seller = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v1/products/top-from-seller/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const postReview = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.POST,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v1/addReview`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}


export const getDataForSeller = async (id: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v1/shops/details/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}


export const getDataFromLink = async (link: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(link, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}