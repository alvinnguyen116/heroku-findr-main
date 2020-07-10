import * as queryString from 'query-string';

const ROUTES = Object.freeze({
   ABOUT: "/about",
   FIND_PEOPLE: "/",
   LOGIN: "/login",
   REGISTER: "/register",
   NEXT_STEPS: "/next-steps",
   MY_PROFILE: "/me",
   GOOGLE_AUTH: "/auth/google/:authType",
   INSTAGRAM_AUTH: "/auth/instagram",
   BLANK: "/blank"
});

const createRedirectUri = authType => {
   let baseURL = process.env.NODE_ENV === "development" ? `http://localhost:3000` : `https://www.findrrr.com`;
   baseURL += `/auth/google/${authType}`;
   return baseURL;
};

const createQueryParams = authType => {
   return queryString.stringify({
      client_id: "1034190105133-cl43sru1un6mdkq6ujsoi7jmmn1r3g36.apps.googleusercontent.com",
      redirect_uri: createRedirectUri(authType),
      scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      ].join(" "),
       response_type: 'code',
       access_type: 'offline',
       prompt: 'consent',
   });
};

const createGoogleUrl = authType => `https://accounts.google.com/o/oauth2/v2/auth?${createQueryParams(authType)}`;

const createIGRedirectURI = () =>  `https://www.findrrr.com${ROUTES.INSTAGRAM_AUTH}`;

const createInstagramUrl = () => {
   const queryParams = queryString.stringify({
      client_id: '277459566825286',
      redirect_uri: createIGRedirectURI(),
      scope: ['user_profile', 'user_media'].join(','),
      response_type: 'code'
   });
   return `https://api.instagram.com/oauth/authorize?${queryParams}`;
};

const SNACKBAR_SEVERITY = Object.freeze({
   SUCCESS: 'success',
   ERROR: "error",
   INFO: "info",
   WARNING: "warning"
});

const COOKIE = Object.freeze({
   LOGGED_IN: "COOKIE_LOGGED_IN"
});

const FONTS = Object.freeze({
   AMIRI: 'amiri',
   AMATIC: 'amatic',
   VT323: 'VT323',
   ROBOTO: 'roboto',
   ROBOTO_MONO: 'roboto_mono',
   SACRAMENTO: 'sacramento'
});

const MEDIA_TYPES = Object.freeze({
   GIF: "gifs",
   STICKER: "stickers"
});

const APP_NAME = "Findrrr";

const AUTH_TYPE = Object.freeze({
   REGISTER: 'register',
   LOGIN: 'login'
});

const ACCOUNT_TYPE = Object.freeze({
   LOCAL: "ACCOUNT_TYPE_LOCAL",
   GOOGLE: "ACCOUNT_TYPE_GOOGLE",
   IG: "ACCOUNT_TYPE_IG"
});

export {
   AUTH_TYPE,
   ROUTES,
   SNACKBAR_SEVERITY,
   COOKIE,
   FONTS,
   MEDIA_TYPES,
   APP_NAME,
   ACCOUNT_TYPE,
   createGoogleUrl,
   createRedirectUri,
   createInstagramUrl,
    createIGRedirectURI
};