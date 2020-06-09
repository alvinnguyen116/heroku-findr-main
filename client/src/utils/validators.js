import EmailValidator from "email-validator";

/**
 * @param email
 * @desc Whether an email is valid.
 */
const isValidEmail = email => !!EmailValidator.validate(email);

/**
 * @param pw {string}
 * @desc A password must adhere to the following:
 *  - at least 7 characters
 *  - contains at least 1 number
 *  - contains at least 1 of the following special characters (!,@,#,%,&)
 */
const isValidPassword = pw => {
    const numberRegex = new RegExp(".*\\d.*");
    const specialRegex = new RegExp(".*[!@#%&].*");
    return pw && (pw.length >= 7) && numberRegex.test(pw) && specialRegex.test(pw);
};

export {
    isValidEmail,
    isValidPassword
};