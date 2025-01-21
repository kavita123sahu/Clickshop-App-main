import { Utils } from "../common/Utils";
import { Method } from "../config/Key";

export const get_order_history = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };

            let serverResponse = await fetch(`https://clikshop.co.in/api/v3/order-history`, fetchParameter);

            if (serverResponse.ok) {
                let response = await serverResponse.json();
                resolve(response);
            } else {
                let rawText = await serverResponse.text();
                console.error("Server Error:", rawText);
                reject(new Error(`Server Error: ${serverResponse.status} - ${rawText}`));
            }
        } catch (error) {
            console.error("Request Error:", error);
            reject(error);
        }
    });
};

export const cancel_order = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.POST,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v3/cancel-order`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const replace_product = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            let fetchParameter = {
                method: Method.POST,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v3/replace-order`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}