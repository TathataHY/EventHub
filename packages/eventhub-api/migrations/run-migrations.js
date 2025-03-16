const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config({ path: path.resolve(__dirname, '../../..', '.env') });

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  multipleStatements: true
};

// Función para ejecutar un script SQL
async function executeSqlFile(filePath, config) {
  return new Promise((resolve, reject) => {
    console.log(`Ejecutando migración: ${filePath}`);
    
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    const connection = mysql.createConnection(config);
    
    connection.connect((err) => {
      if (err) {
        console.error('Error al conectar a la base de datos:', err);
        reject(err);
        return;
      }
      
      connection.query(sqlContent, (error, results) => {
        connection.end();
        
        if (error) {
          console.error('Error al ejecutar la migración:', error);
          reject(error);
          return;
        }
        
        console.log(`Migración ejecutada con éxito: ${filePath}`);
        resolve(results);
      });
    });
  });
}

// Función principal para ejecutar todas las migraciones
async function runMigrations() {
  try {
    // Crear la base de datos si no existe
    const connection = mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true
    });
    
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'eventhub'};`, (err) => {
      if (err) {
        console.error('Error al crear la base de datos:', err);
        connection.end();
        return;
      }
      
      console.log('Base de datos verificada o creada');
      connection.end();
      
      // Obtener todos los archivos de migración ordenados por nombre
      const migrationsDir = __dirname;
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      // Ejecutar las migraciones en orden
      const runMigrationsSequentially = async () => {
        for (const file of migrationFiles) {
          const filePath = path.join(migrationsDir, file);
          await executeSqlFile(filePath, {
            ...dbConfig,
            database: process.env.DB_NAME || 'eventhub'
          });
        }
        console.log('Todas las migraciones se han ejecutado correctamente');
      };
      
      runMigrationsSequentially().catch(console.error);
    });
  } catch (error) {
    console.error('Error al ejecutar las migraciones:', error);
  }
}

// Ejecutar las migraciones
runMigrations(); 