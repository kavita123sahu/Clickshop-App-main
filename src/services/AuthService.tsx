import { Utils } from "../common/Utils";
import { BaseUrl, Method } from "../config/Key";

export const login = async (data: Object) => {
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
            let serverResponse = await fetch(BaseUrl.urlV3 + 'auth/login', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const signup = async (data: Object) => {
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
            let serverResponse = await fetch(BaseUrl.urlV3 + 'auth/register', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const verify_otp = async (data: Object) => {
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
            let serverResponse = await fetch(BaseUrl.urlV3 + 'auth/verify-otp', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}
export const forgot_password = async (data: Object) => {
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
            let serverResponse = await fetch(BaseUrl.urlV3 + 'auth/reset-password', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const sendOtp = async (data: Object) => {
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
            let serverResponse = await fetch(BaseUrl.urlV3 + 'auth/forgot-password', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}
export const logout = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let access_token = Utils.getData('ACCESS_TOKEN');
            let fetchParameter = {
                method: Method.GET,
                // body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'access_token': 'Bearer ' + access_token
                },
            }
            let serverResponse = await fetch(BaseUrl.url + 'auth/logout', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}