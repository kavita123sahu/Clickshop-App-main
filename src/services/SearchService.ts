import { Utils } from "../common/Utils";
import { BaseUrl, Method } from "../config/Key";

export const get_search_product = async (searchText = '', page = 1) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let url = `${BaseUrl.url}products/search?page=${page}`;
            if (searchText) {
                url += `&name=${encodeURIComponent(searchText)}`;
            }
            let serverResponse = await fetch(url, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_all_products = async (searchQuery: string = '', page: number = 1) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queryParams = new URLSearchParams();
            if (searchQuery.trim() !== '') {
                queryParams.append('search', searchQuery);
            }
            queryParams.append('page', page.toString());
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let url = `${BaseUrl.urlV3}products`;
            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }
            let serverResponse = await fetch(url, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}