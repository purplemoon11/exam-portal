import { DataSource } from "typeorm";

const datasource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  entities: [],
  // logging: true,
});

export default datasource;
