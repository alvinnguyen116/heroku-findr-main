import axios from 'axios';
import { GiphyFetch } from '@giphy/js-fetch-api'

const URL = {
    LOCAL: "http://localhost:3000",
    PROD: "https://findr-main-api.herokuapp.com"
};

/**
 * @desc Pre-configure an axios object
 * for Authentication API.
 */
const AuthAxios = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? URL.LOCAL : URL.PROD,
    timeout: 30000,
    withCredentials: true
});

export class AuthAPI {

    static register({email, password}) {
        return AuthAxios({
            method: 'post',
            url: '/register',
            data: {email, password}
        });
    }

    static login({email,password}) {
        return AuthAxios({
           method: 'post',
           url: '/login/local',
           data: {email, password}
        });
    }

    static logout() {
        return AuthAxios({
            method: 'delete',
            url: '/logout'
        });
    }

    static getNewToken() {
        return AuthAxios({
            method: 'get',
            url: '/token'
        });
    }
}

/**
 * @desc Pre-configure an axios object
 * for Main API.
 */
const MainAxios = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? URL.LOCAL : URL.PROD,
    timeout: 30000,
    withCredentials: true
});

/**
 * WARNING:
 *  - Don't expose key in public repo.
 */
const gf = new GiphyFetch('b7pYDF2hOUyeJ8qN4GgoIH1ep9VW5KWz');

export class MainAPI {

    static gifSearch({term, type, offset= 0}) {
        return gf.search(term, { sort: 'relevant', type, offset});
    }

    static gifTrending ({type, offset = 0}) {
        return gf.trending({ sort: 'relevant', type, offset});
    }

    static updateProfile({catchphrase, gifs, name, tags, aboutMe, theme, token}) {
        return MainAxios({
            method: 'post',
            url: '/profile/update',
            data: {catchphrase, gifs, name, tags, aboutMe, theme},
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    /**
     * @param original
     * @param cropped
     * @param token
     * @desc Multer middleware for uploading images only accepts
     * multipart/form-data.
     */
    static updateProfilePicture({original, cropped, token}) {
        // Create new Form Data
        const data = new FormData();
        data.append('original', original);
        data.append('cropped', cropped);

        return MainAxios({
            method: 'post',
            url: '/profile/update/picture',
            data,
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'multipart/form-data'
            }
        });
    }

    static searchProfiles({limit = 25, offset = 0, tags = '', token}) {
        return MainAxios({
            method: 'get',
            url: `/profile/search?limit=${limit}&offset=${offset}&tags=${tags}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    static getProfile(token) {
        return MainAxios({
            method: 'get',
            url: '/profile/me',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static getImage(id) {
        return MainAxios({
            method: 'get',
            responseType: 'arraybuffer',
            url: `/image/${id}`
        })
    }
}