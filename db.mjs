import mysql from "mysql2/promise"

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'my-secret-pw',
  database: 'regisflow'
});

export default db;