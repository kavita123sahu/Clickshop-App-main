import { Utils } from "../common/Utils";
import { BaseUrl, Method } from "../config/Key";

export const get_all_categories = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + 'categories/filter', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_sub_categories = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `categories/subcat/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_sub_sub_categories = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `categories/subsubcat/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_sub3_categories = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `categories/sub3cat/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_sub4_categories = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `categories/sub4cat/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_sub5_categories = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `categories/sub5cat/${id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}