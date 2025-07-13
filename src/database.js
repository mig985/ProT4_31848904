import mysql from 'mysql2/promise';

const propiedades = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'biblioteca'
};

export const pool = mysql.createPool(propiedades);

