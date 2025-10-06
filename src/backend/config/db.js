import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",      
  host: "localhost",
  database: "prueba",   // Sebas: 123 Yo: 1234
  password: "123",
  port: 5432
});

export default pool;
