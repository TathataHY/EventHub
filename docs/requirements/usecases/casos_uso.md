# Casos de Uso Detallados - EventHub

Este documento describe los casos de uso principales de la aplicación EventHub, organizados por módulos funcionales.

## Módulo 1: Autenticación y Gestión de Usuarios

### CU-001: Registro de Usuario

**Actor Principal:** Usuario no registrado

**Descripción:** El usuario se registra en la aplicación para poder acceder a sus funcionalidades.

**Precondiciones:**
- El usuario no está registrado en el sistema
- El usuario tiene una dirección de correo electrónico válida

**Flujo Normal:**
1. El usuario abre la aplicación y selecciona "Registrarse"
2. El sistema muestra un formulario de registro con los siguientes campos:
   - Nombre completo
   - Correo electrónico
   - Contraseña
   - Confirmación de contraseña
3. El usuario completa los campos y envía el formulario
4. El sistema valida los datos:
   - El correo electrónico tiene formato válido
   - La contraseña cumple con los requisitos de seguridad
   - Las contraseñas coinciden
5. El sistema crea la cuenta y envía un correo de verificación
6. El sistema muestra un mensaje de éxito y solicita verificar el correo

**Flujo Alternativo 1:** El correo ya está registrado
1. En el paso 4, el sistema detecta que el correo ya está registrado
2. El sistema muestra un mensaje de error
3. El usuario debe usar otro correo o iniciar sesión

**Postcondiciones:**
- Se crea una cuenta de usuario nueva
- El usuario recibe un correo de verificación

### CU-002: Inicio de Sesión

**Actor Principal:** Usuario registrado

**Descripción:** El usuario accede a su cuenta en la aplicación.

**Precondiciones:**
- El usuario está registrado en el sistema

**Flujo Normal:**
1. El usuario abre la aplicación y selecciona "Iniciar Sesión"
2. El sistema muestra un formulario con campos para:
   - Correo electrónico
   - Contraseña
3. El usuario completa los campos y envía el formulario
4. El sistema valida las credenciales
5. El sistema genera un token de autenticación
6. El sistema redirige al usuario a la pantalla principal

**Flujo Alternativo 1:** Credenciales incorrectas
1. En el paso 4, el sistema detecta credenciales incorrectas
2. El sistema muestra un mensaje de error
3. El usuario puede intentar nuevamente o restablecer contraseña

**Postcondiciones:**
- El usuario obtiene un token de autenticación válido
- El usuario accede a las funcionalidades de la aplicación

### CU-003: Restablecimiento de Contraseña

**Actor Principal:** Usuario registrado

**Descripción:** El usuario restablece su contraseña olvidada.

**Precondiciones:**
- El usuario está registrado en el sistema

**Flujo Normal:**
1. El usuario selecciona "Olvidé mi contraseña" en la pantalla de inicio de sesión
2. El sistema muestra un formulario para ingresar el correo electrónico
3. El usuario ingresa su correo y envía el formulario
4. El sistema envía un correo con un enlace temporal para restablecer la contraseña
5. El usuario abre el enlace y accede a un formulario para nueva contraseña
6. El usuario ingresa y confirma la nueva contraseña
7. El sistema actualiza la contraseña en la base de datos
8. El sistema confirma el cambio y redirige al inicio de sesión

**Postcondiciones:**
- La contraseña del usuario es actualizada
- Se invalidan todas las sesiones activas anteriores

## Módulo 2: Gestión de Eventos

### CU-004: Creación de Evento

**Actor Principal:** Usuario organizador

**Descripción:** El usuario crea un nuevo evento en la plataforma.

**Precondiciones:**
- El usuario ha iniciado sesión
- El usuario tiene permisos de organizador

**Flujo Normal:**
1. El usuario selecciona "Crear Evento" en el menú principal
2. El sistema muestra un formulario con los siguientes campos:
   - Nombre del evento
   - Descripción
   - Fecha y hora de inicio
   - Fecha y hora de finalización
   - Ubicación (física o virtual)
   - Categoría
   - Capacidad
   - Precio (si aplica)
   - Imágenes promocionales
3. El usuario completa los campos obligatorios y opcionales
4. El usuario selecciona "Vista previa" para verificar la información
5. El usuario confirma la creación del evento
6. El sistema registra el evento y genera un identificador único
7. El sistema muestra una confirmación con las opciones de gestión disponibles

**Flujo Alternativo 1:** Guardar como borrador
1. En el paso 3, el usuario puede seleccionar "Guardar como borrador"
2. El sistema guarda la información parcial para edición posterior

**Postcondiciones:**
- Se crea un nuevo evento en el sistema
- El evento aparece en el listado del organizador
- Si se publica, el evento es visible para búsquedas

### CU-005: Edición de Evento

**Actor Principal:** Usuario organizador

**Descripción:** El usuario modifica los detalles de un evento existente.

**Precondiciones:**
- El usuario ha iniciado sesión
- El usuario es el creador del evento o tiene permisos de administración
- El evento existe en el sistema

**Flujo Normal:**
1. El usuario selecciona "Mis Eventos" en el menú principal
2. El sistema muestra la lista de eventos creados por el usuario
3. El usuario selecciona el evento a editar
4. El sistema muestra el formulario con los datos actuales del evento
5. El usuario modifica los campos deseados
6. El usuario confirma los cambios
7. El sistema actualiza la información del evento
8. El sistema muestra una confirmación de actualización exitosa

**Flujo Alternativo 1:** Edición de evento publicado
1. Si el evento ya está publicado, el sistema advierte que ciertas modificaciones pueden requerir notificación a los asistentes
2. El usuario confirma los cambios
3. El sistema notifica a los asistentes sobre los cambios relevantes

**Postcondiciones:**
- La información del evento se actualiza en el sistema
- Los asistentes son notificados de cambios importantes

### CU-006: Cancelación de Evento

**Actor Principal:** Usuario organizador

**Descripción:** El usuario cancela un evento programado.

**Precondiciones:**
- El usuario ha iniciado sesión
- El usuario es el creador del evento o tiene permisos de administración
- El evento existe en el sistema y no ha finalizado

**Flujo Normal:**
1. El usuario selecciona "Mis Eventos" en el menú principal
2. El sistema muestra la lista de eventos creados por el usuario
3. El usuario selecciona el evento a cancelar
4. El usuario selecciona la opción "Cancelar Evento"
5. El sistema solicita confirmación y motivo de cancelación
6. El usuario confirma la cancelación y proporciona el motivo
7. El sistema marca el evento como cancelado
8. El sistema notifica a todos los asistentes registrados

**Flujo Alternativo 1:** Evento con pagos procesados
1. Si el evento tiene pagos procesados, el sistema informa sobre el proceso de reembolso
2. El usuario confirma la cancelación con conocimiento de reembolsos
3. El sistema inicia el proceso de reembolso a los asistentes

**Postcondiciones:**
- El evento se marca como cancelado
- Los asistentes son notificados
- Se procesan reembolsos si aplica

## Módulo 3: Búsqueda y Asistencia

### CU-007: Búsqueda de Eventos

**Actor Principal:** Usuario registrado o no registrado

**Descripción:** El usuario busca eventos según criterios específicos.

**Precondiciones:**
- La aplicación está operativa

**Flujo Normal:**
1. El usuario accede a la pantalla de búsqueda
2. El sistema muestra opciones de filtrado:
   - Categoría
   - Fecha
   - Ubicación
   - Precio
   - Modalidad (presencial/virtual)
3. El usuario aplica los filtros deseados y/o ingresa términos de búsqueda
4. El sistema muestra los resultados ordenados por relevancia
5. El usuario puede explorar los eventos mostrados

**Flujo Alternativo 1:** Búsqueda sin resultados
1. El sistema no encuentra eventos que coincidan con los criterios
2. El sistema muestra un mensaje indicando que no hay resultados
3. El sistema sugiere modificar los criterios de búsqueda

**Postcondiciones:**
- El usuario visualiza los eventos que coinciden con sus criterios

### CU-008: Registro de Asistencia

**Actor Principal:** Usuario registrado

**Descripción:** El usuario confirma su asistencia a un evento.

**Precondiciones:**
- El usuario ha iniciado sesión
- El evento existe y está activo
- El evento no ha alcanzado su capacidad máxima

**Flujo Normal:**
1. El usuario selecciona un evento de su interés
2. El sistema muestra los detalles del evento
3. El usuario selecciona "Asistir" o "Comprar entrada"
4. Si el evento es gratuito:
   a. El sistema confirma inmediatamente la asistencia
5. Si el evento es pagado:
   a. El sistema muestra opciones de pago
   b. El usuario completa el proceso de pago
   c. El sistema confirma la transacción
6. El sistema registra la asistencia y emite un ticket/confirmación
7. El sistema agrega el evento al calendario del usuario

**Flujo Alternativo 1:** Evento con capacidad llena
1. El sistema detecta que el evento ha alcanzado su capacidad máxima
2. El sistema ofrece la opción de unirse a lista de espera
3. El usuario puede confirmar unirse a la lista de espera

**Postcondiciones:**
- Se registra la asistencia del usuario al evento
- El usuario recibe confirmación/ticket
- El usuario recibe recordatorios del evento

## Módulo 4: Interacción Social

### CU-009: Comentarios en Eventos

**Actor Principal:** Usuario registrado

**Descripción:** El usuario comenta en un evento.

**Precondiciones:**
- El usuario ha iniciado sesión
- El evento permite comentarios

**Flujo Normal:**
1. El usuario accede a los detalles de un evento
2. El usuario selecciona la sección de comentarios
3. El usuario escribe su comentario
4. El sistema valida el contenido del comentario
5. El sistema publica el comentario visible para otros usuarios

**Flujo Alternativo 1:** Comentario con contenido prohibido
1. El sistema detecta contenido prohibido en el comentario
2. El sistema rechaza la publicación y muestra un aviso al usuario

**Postcondiciones:**
- El comentario se publica en el evento
- Otros usuarios pueden ver e interactuar con el comentario

### CU-010: Creación de Grupo de Asistentes

**Actor Principal:** Usuario asistente

**Descripción:** El usuario crea un grupo para coordinar con otros asistentes.

**Precondiciones:**
- El usuario ha iniciado sesión
- El usuario ha confirmado asistencia al evento

**Flujo Normal:**
1. El usuario accede a un evento al que asistirá
2. El usuario selecciona "Crear grupo de asistentes"
3. El sistema solicita nombre y descripción del grupo
4. El usuario completa la información y confirma
5. El sistema crea el grupo y genera un enlace para invitar
6. El usuario puede compartir el enlace con otros asistentes

**Postcondiciones:**
- Se crea un grupo asociado al evento
- El usuario puede invitar a otros asistentes al grupo

## Módulo 5: Evaluación y Estadísticas

### CU-011: Evaluación Post-Evento

**Actor Principal:** Usuario asistente

**Descripción:** El usuario califica y comenta un evento al que asistió.

**Precondiciones:**
- El usuario ha iniciado sesión
- El usuario asistió al evento
- El evento ha finalizado

**Flujo Normal:**
1. El sistema envía una notificación para evaluar el evento
2. El usuario accede a la evaluación
3. El usuario asigna una calificación (1-5 estrellas)
4. El usuario puede escribir una reseña opcional
5. El usuario envía la evaluación
6. El sistema registra la evaluación y actualiza la calificación promedio

**Postcondiciones:**
- La evaluación del usuario se registra en el sistema
- La calificación promedio del evento se actualiza
- El organizador recibe la retroalimentación

### CU-012: Visualización de Estadísticas

**Actor Principal:** Usuario organizador

**Descripción:** El organizador visualiza estadísticas de sus eventos.

**Precondiciones:**
- El usuario ha iniciado sesión
- El usuario ha creado eventos en la plataforma

**Flujo Normal:**
1. El usuario selecciona "Estadísticas" en el panel de organizador
2. El sistema muestra opciones de eventos para analizar
3. El usuario selecciona el evento o periodo de interés
4. El sistema muestra estadísticas como:
   - Número de asistentes
   - Demografía de asistentes
   - Calificaciones y reseñas
   - Ingresos generados (si aplica)
   - Comparativa con eventos similares

**Postcondiciones:**
- El organizador obtiene información detallada sobre el rendimiento de sus eventos 