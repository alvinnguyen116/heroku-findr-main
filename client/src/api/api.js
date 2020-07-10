import axios from 'axios';
import * as qs from 'query-string';
import { GiphyFetch } from '@giphy/js-fetch-api';
import {ACCOUNT_TYPE, createRedirectUri, createIGRedirectURI, AUTH_TYPE} from "../utils/enums";

const URL = {
    LOCAL: "http://localhost:4000",
    PROD: "https://www.findrrr.com"
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

    static getAccessTokenFromCode({code, authType = AUTH_TYPE.LOGIN, accountType = ACCOUNT_TYPE.GOOGLE}) {
        const client_id = accountType === ACCOUNT_TYPE.GOOGLE ?
            '1034190105133-cl43sru1un6mdkq6ujsoi7jmmn1r3g36.apps.googleusercontent.com' :
            '277459566825286';
        const client_secret = accountType === ACCOUNT_TYPE.GOOGLE ? '3DN5stqM8sVgznkc1VOVzc8m' :
            'a139b93a0ca153511ba9f64f17c508b3';
        const redirect_uri = accountType === ACCOUNT_TYPE.GOOGLE ? createRedirectUri(authType) : createIGRedirectURI();
        const url = accountType === ACCOUNT_TYPE.GOOGLE ? `https://oauth2.googleapis.com/token` :
            'https://api.instagram.com/oauth/access_token';

        return axios({
            url,
            method: 'post',
            data: {
                client_id,
                client_secret,
                redirect_uri,
                grant_type: 'authorization_code',
                code
            },
        });
    };

    static getGoogleUserInfo(accessToken) {
        return axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    };

    static getInstagramUserInfo({user_id, access_token}) {
        return axios({
            url: `  'https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`,
            method: 'get',
        });
    };

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

    static searchProfiles({limit = 25, offset = 0, tags = ''}) {
        const queryParams = qs.stringify({
           limit, offset, tags
        });
        return MainAxios({
            method: 'get',
            url: `/profile/search?${queryParams}`
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