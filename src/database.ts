
import createConnectionPool, {sql} from '@databases/mysql';
import tables from '@databases/mysql-typed';
import DatabaseSchema, {serializeValue} from './__generated__';

export {sql};

const db = createConnectionPool('mysql://test@localhost:3306/credentials_db');
export default db;

// You can list whatever tables you actually have here:
const {Credentials} = tables<DatabaseSchema>({
  serializeValue,
});
export {Credentials};