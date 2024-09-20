import mysql from "mysql2/promise"

const db = mysql.createPool({
  host: process.env.HOST ?? "localhost",
  user: process.env.USER ?? "root",
  password: process.env.PASSWORD ?? "my-secret-pw",
  database: process.env.DATABASE ?? "regisflow",
  timezone: 'Z'
});

export default db;