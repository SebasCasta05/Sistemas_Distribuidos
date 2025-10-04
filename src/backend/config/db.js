import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",      // tu usuario
  host: "localhost",     // o el host donde tengas PostgreSQL
  database: "prueba",   // nombre de la BD
  password: "123",
  port: 5432
});

export default pool;
