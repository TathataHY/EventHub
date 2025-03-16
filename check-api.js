const http = require('http');

// URL de la API que queremos probar
const apiUrl = 'http://localhost:3000';

console.log(`Verificando conexión a la API en ${apiUrl}...`);

// Intentar hacer una solicitud HTTP a la API
const req = http.get(apiUrl, (res) => {
  console.log(`Código de estado: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ La API está funcionando correctamente');
  } else {
    console.log(`⚠️ La API respondió con un código de estado inesperado: ${res.statusCode}`);
  }
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      // Intentar analizar la respuesta como JSON
      const jsonResponse = JSON.parse(data);
      console.log('Respuesta de la API:', jsonResponse);
    } catch (e) {
      console.log('Respuesta de la API (no es JSON):', data.substring(0, 200));
      if (data.length > 200) {
        console.log('... (respuesta truncada)');
      }
    }
  });
});

req.on('error', (error) => {
  console.error(`❌ Error al conectar con la API: ${error.message}`);
  console.log('Asegúrate de que:');
  console.log('1. Los contenedores Docker estén ejecutándose (yarn docker:up)');
  console.log('2. La base de datos MySQL esté inicializada correctamente');
  console.log('3. La API esté configurada para conectarse a la base de datos');
});

req.end(); 