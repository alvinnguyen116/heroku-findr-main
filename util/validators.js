const {ROLE} = require("./enums");
const EmailValidator = require("email-validator");

/**
 * @param email
 * @desc Whether an email is valid.
 */
export const isValidEmail = email => !!EmailValidator.validate(email);

/**
 * @param role
 * @desc Whether a role is valid.
 */

export const isValidRole = role => Object.values(ROLE).includes(role);

