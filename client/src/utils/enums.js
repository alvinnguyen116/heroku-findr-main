const ROUTES = Object.freeze({
   ABOUT: "/about",
   FIND_PEOPLE: "/find",
   LOGIN: "/login",
   REGISTER: "/register",
   NEXT_STEPS: "/next-steps",
   MY_PROFILE: "/me"
});

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

export {
   ROUTES,
   SNACKBAR_SEVERITY,
   COOKIE,
   FONTS,
   MEDIA_TYPES
};