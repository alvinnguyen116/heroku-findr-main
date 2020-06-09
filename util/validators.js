import {ROLE, TOKENS} from "./enums";
import EmailValidator from "email-validator";

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

/**
 * @param token
 * @desc Whether a token is valid.
 */
export const isValidToken = token => Object.values(TOKENS).includes(token);
