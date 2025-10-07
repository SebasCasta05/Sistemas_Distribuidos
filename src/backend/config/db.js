import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",      
  host: "localhost",
  database: "prueba",   // Sebas: 123 Yo: 1234 ss
  password: "1234",
  port: 5432
});

export default pool;
