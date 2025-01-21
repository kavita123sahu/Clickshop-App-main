import { Utils } from "../common/Utils";
import { BaseUrl, Method } from "../config/Key";

export const get_all_whishlist = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `wishlist`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const remove_whishlist = async (id: number) => {
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
            let serverResponse = await fetch(BaseUrl.urlV3 + `wishlist/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const show_whishlist = async (id: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await Utils.getData('_USER_ID');
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `show_whishlist/${userId}/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}


export const add_whishlist = async (data: any) => {
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
            let serverResponse = await fetch(BaseUrl.urlV3 + `wishlist`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

