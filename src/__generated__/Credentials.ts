/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: FBIT32qQ6cfxzsTYdPe/Mf2Z2sw7QDucWrk2l7Hje3EVn24tsK1nvXzCC1eWnxkZLy+fXUBJEEobSeqeyt9VBg==
 */

/* eslint-disable */
// tslint:disable

interface Credentials {
  /**
   * @default NULL
   */
  Domain: (string) | null
  /**
   * @default NULL
   */
  Password: (string) | null
  /**
   * @default NULL
   */
  Req_Perms: (string) | null
}
export default Credentials;

interface Credentials_InsertParameters {
  /**
   * @default NULL
   */
  Domain?: (string) | null
  /**
   * @default NULL
   */
  Password?: (string) | null
  /**
   * @default NULL
   */
  Req_Perms?: (string) | null
}
export type {Credentials_InsertParameters}
