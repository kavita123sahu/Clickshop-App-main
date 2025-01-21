import { Utils } from "../common/Utils";
import { BaseUrl, Method } from "../config/Key";

export const postAddress = async (data: object) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN')
            let fetchParameter = {
                method: Method.POST,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + 'shipping-address', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const getAddress = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN')
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + 'shipping-address', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const updateAddress = async (data: any, addressID: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN')
            console.log(token, addressID);

            let fetchParameter = {
                method: Method.PUT,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `shipping-address/${addressID}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const getAddressByID = async (addressID: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN')
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `shipping-address/${addressID}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const setDefaultAddress = async (addressID: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN')
            let fetchParameter = {
                method: Method.PATCH,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `shipping-address/${addressID}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const checkPostalCode = async (postal_code: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN')
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `shipping-address/verify-pincode/${postal_code}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}


export const deleteAddress = async (addId: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN')
            let fetchParameter = {
                method: Method.DELETE,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `shipping-address/${addId}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}