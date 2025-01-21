import { Utils } from "../common/Utils";
import { Method } from "../config/Key";


export const update_Profile = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            const user = await Utils.getData('_USER_DETAILS');
            let fetchParameter = {
                method: Method.POST,
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v3/user/${user?.id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_user = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await Utils.getData('_TOKEN');
            const user = await Utils.getData('_USER_DETAILS');
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
            let serverResponse = await fetch(`https://clikshop.co.in/api/v3/user/${user?.id}`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}