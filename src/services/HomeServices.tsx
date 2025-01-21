import { Utils } from "../common/Utils";
import { BaseUrl, Method } from "../config/Key";


export const main_banner_data = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + 'banners', fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const small_banner_data = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `banners`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const selling_product = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `products/best-seller`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const products = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `home-categories`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const slidders = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.urlV3 + `sliders`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const product_home = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `products/home`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const new_arrival = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `products/new-arrival`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_featured_products = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `products/featured`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const get_popular_brand = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchParameter = {
                method: Method.GET,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
            let serverResponse = await fetch(BaseUrl.url + `products/popularity`, fetchParameter);
            let response = await serverResponse.json();
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}


export const getSubCategory = async (link: any) => {
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

export const get_all_products = async (
    baseLink: string,
    {
        sort_by = '',
        sort_order = '',
        price_min = '',
        price_max = '',
        search = '',
        category = '',
        page = 1,
        limit = 10
    }: {
        sort_by?: string,
        sort_order?: string,
        price_min?: string | number,
        price_max?: string | number,
        search?: string
        category?: string,
        page?: number,
        limit?: number
    }
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queryParams = new URLSearchParams({
                ...(sort_by && { sort_by }),
                ...(sort_order && { sort_order }),
                ...(price_min && { price_min: price_min.toString() }),
                ...(price_max && { price_max: price_max.toString() }),
                ...(search && { search: search.toString() }),
                ...(category && { category }),
                page: page.toString(),
                limit: limit.toString()
            });

            const fetchParameter = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            console.log(`${baseLink}&${queryParams}`);

            const serverResponse = await fetch(`${baseLink}&${queryParams}`, fetchParameter);
            const response = await serverResponse.json();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};