/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: Dh+PpdkCxcCLFeJsl4/NOH44kZ+a9SAjHsQ8RbTaL7OSbIMOT9pCXePDXXeXyNyu+OdhDi4cFT/3L4jY8atqww==
 */

/* eslint-disable */
// tslint:disable

import Credentials, {Credentials_InsertParameters} from './Credentials'

interface DatabaseSchema {
  Credentials: {record: Credentials, insert: Credentials_InsertParameters};
}
export default DatabaseSchema;

function serializeValue(_tableName: string, _columnName: string, value: unknown): unknown {
  return value;
}
export {serializeValue}