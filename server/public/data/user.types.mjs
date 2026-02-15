/**
 * Samler data-shapes pÃ¥ ett sted for Ã¥ unngÃ¥ duplikater.
 *
 * @typedef {Object} UserPublic
 * @property {string} id
 * @property {string} username
 * @property {string} createdAt
 * @property {Object} consent
 *
 * @typedef {Object} UserCreatePayload
 * @property {string} username
 * @property {string} password
 * @property {boolean} tosAccepted
 *
 * @typedef {Object} LoginPayload
 * @property {string} username
 * @property {string} password
 *
 * @typedef {Object} UpdateMePayload
 * @property {string=} username
 * @property {string=} password
 */

export {};
