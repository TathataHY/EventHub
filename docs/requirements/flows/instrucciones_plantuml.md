# Instrucciones para Usar PlantUML con los Diagramas de Flujo

Este documento proporciona instrucciones sobre cómo utilizar PlantUML para renderizar los diagramas de flujo incluidos en la documentación de EventHub.

## ¿Qué es PlantUML?

PlantUML es una herramienta de código abierto que permite crear diagramas UML a través de un lenguaje de texto simple. Esto facilita:

- Mantener los diagramas bajo control de versiones
- Modificar fácilmente los diagramas
- Generar visualizaciones de alta calidad en varios formatos (PNG, SVG, PDF)
- Integrar los diagramas en documentación y wikis

## Opciones para Renderizar Diagramas PlantUML

### 1. Uso de la Herramienta Web

La forma más sencilla de visualizar los diagramas es usando el servidor web de PlantUML:

1. Visita [PlantUML Web Server](https://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000)
2. Copia y pega el código PlantUML (el contenido entre las etiquetas ```plantuml y ```)
3. El diagrama se renderizará automáticamente

### 2. Extensiones para IDE

Muchos IDE tienen extensiones que permiten renderizar PlantUML directamente:

- **VS Code**: Instala la extensión "PlantUML"
- **IntelliJ IDEA**: Instala el plugin "PlantUML integration"
- **Eclipse**: Instala el plugin "PlantUML"

### 3. Instalación Local

Para generar diagramas localmente (útil para proyectos grandes o entornos sin conexión):

#### Requisitos previos
- Java Runtime Environment (JRE)
- Graphviz (para algunos tipos de diagramas)

#### Pasos de instalación

1. **Descargar PlantUML**:
   - Descarga la última versión del JAR desde [plantuml.com/download](https://plantuml.com/download)

2. **Instalar Graphviz** (requerido para diagramas de actividad como los de este proyecto):
   - Windows: Descarga desde [graphviz.org](https://graphviz.org/download/)
   - macOS: `brew install graphviz`
   - Linux: `sudo apt-get install graphviz`

3. **Ejecutar PlantUML**:
   - Interfaz gráfica: `java -jar plantuml.jar`
   - Línea de comando: `java -jar plantuml.jar archivo.puml`

### 4. Integración con Herramientas de Documentación

PlantUML se puede integrar con diversas herramientas:

- **Markdown**: Algunas implementaciones de Markdown (como la de GitHub) soportan PlantUML
- **Asciidoctor**: Tiene soporte nativo para PlantUML
- **Sphinx**: Puede usar la extensión sphinxcontrib-plantuml
- **Docusaurus**: Puede usar plugins para renderizar PlantUML

## Ejemplo de Uso

Para renderizar el diagrama de registro de usuario desde un terminal:

1. Guarda el código PlantUML en un archivo llamado `registro_usuario.puml`:
   ```
   @startuml Registro_Usuario
   title Flujo de Registro de Usuario
   
   start
   :Usuario accede a la pantalla de inicio;
   :Selecciona "Registrarse";
   :Se muestra formulario de registro;
   :Usuario ingresa datos (nombre, correo, contraseña);
   
   if (¿Datos válidos?) then (Sí)
     :Crear cuenta de usuario;
     :Enviar correo de verificación;
     :Mostrar mensaje de éxito;
     :Usuario recibe correo;
     
     if (¿Usuario hace clic en enlace?) then (Sí)
       :Verificar cuenta;
       :Activar cuenta;
       :Redirigir a inicio de sesión;
       stop
     else (No)
       :Cuenta permanece sin verificar;
       stop
     endif
     
   else (No)
     :Mostrar errores de validación;
     :Volver al formulario;
     goto Formulario
   endif
   
   @enduml
   ```

2. Ejecuta PlantUML para generar una imagen:
   ```
   java -jar plantuml.jar registro_usuario.puml
   ```

3. Esto generará un archivo `registro_usuario.png` con el diagrama visualizado.

## Consejos para Editar los Diagramas

- **Prueba incremental**: Al hacer cambios grandes, renderiza el diagrama frecuentemente para asegurarte de que la sintaxis es correcta
- **Usa comentarios**: Agrega `' Esto es un comentario` para documentar secciones complejas
- **Personalización**: Consulta la [documentación de PlantUML](https://plantuml.com/activity-diagram-beta) para opciones avanzadas de estilo

## Recursos Adicionales

- [Documentación oficial de PlantUML](https://plantuml.com/)
- [Referencia de diagramas de actividad](https://plantuml.com/activity-diagram-beta)
- [Ejemplos de PlantUML](https://real-world-plantuml.com/) 