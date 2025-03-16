# Historias de Usuario - EventHub

Este documento contiene las historias de usuario para la aplicación EventHub, organizadas por módulos funcionales. Cada historia sigue el formato:

**Como** [tipo de usuario]  
**Quiero** [objetivo]  
**Para** [beneficio/valor]

Además, cada historia incluye sus criterios de aceptación específicos.

## Módulo 1: Autenticación y Gestión de Usuarios

### HU-001: Registro en la aplicación

**Como** usuario no registrado  
**Quiero** crear una cuenta en la aplicación  
**Para** poder acceder a todas las funcionalidades disponibles

**Criterios de aceptación:**
- El usuario puede registrarse proporcionando nombre, correo electrónico y contraseña
- El sistema valida el formato correcto del correo electrónico
- El sistema verifica que el correo no esté previamente registrado
- La contraseña debe cumplir requisitos mínimos de seguridad (8+ caracteres, alfanumérica)
- El usuario recibe un correo de verificación tras el registro
- El usuario puede completar el registro haciendo clic en el enlace de verificación

### HU-002: Inicio de sesión

**Como** usuario registrado  
**Quiero** iniciar sesión en mi cuenta  
**Para** acceder a mis eventos y configuraciones personales

**Criterios de aceptación:**
- El usuario puede iniciar sesión usando su correo y contraseña
- El sistema muestra un mensaje de error apropiado si las credenciales son incorrectas
- El usuario tiene la opción de "Recordarme" para mantener la sesión activa
- El usuario puede iniciar sesión utilizando proveedores externos (Google, Facebook)
- El sistema redirige al usuario a la página principal después de iniciar sesión
- El sistema implementa protección contra intentos repetidos de inicio de sesión fallidos

### HU-003: Recuperación de contraseña

**Como** usuario registrado  
**Quiero** recuperar el acceso a mi cuenta si olvido mi contraseña  
**Para** no perder mi información y configuraciones

**Criterios de aceptación:**
- El usuario puede solicitar restablecer la contraseña desde la pantalla de inicio de sesión
- El sistema envía un correo con instrucciones para crear una nueva contraseña
- El enlace de restablecimiento tiene un tiempo de expiración por seguridad
- El usuario puede crear una nueva contraseña que cumpla con los requisitos de seguridad
- El sistema confirma el cambio exitoso y permite iniciar sesión con la nueva contraseña

### HU-004: Edición de perfil

**Como** usuario registrado  
**Quiero** editar mi información de perfil  
**Para** mantener mis datos actualizados

**Criterios de aceptación:**
- El usuario puede modificar su nombre, foto de perfil y datos personales
- El sistema valida que los cambios cumplan con los formatos requeridos
- El usuario puede cambiar su contraseña actual por una nueva
- Los cambios se guardan y reflejan inmediatamente en el sistema
- El usuario recibe confirmación cuando los cambios se guardan exitosamente

## Módulo 2: Gestión de Eventos

### HU-005: Creación de evento

**Como** organizador  
**Quiero** crear un nuevo evento  
**Para** atraer asistentes y gestionar la asistencia

**Criterios de aceptación:**
- El organizador puede crear eventos proporcionando: nombre, descripción, fecha, hora, ubicación
- El sistema permite agregar categorías y etiquetas al evento
- El organizador puede establecer la capacidad máxima de asistentes
- El sistema permite subir imágenes y materiales promocionales
- El organizador puede especificar si el evento es gratuito o de pago
- Para eventos de pago, el sistema permite configurar diferentes tipos de entradas con precios
- El organizador puede guardar un borrador para completar la creación posteriormente
- El sistema valida que toda la información obligatoria esté completa antes de publicar

### HU-006: Edición de evento

**Como** organizador  
**Quiero** editar los detalles de un evento existente  
**Para** corregir información o actualizar detalles

**Criterios de aceptación:**
- El organizador puede modificar cualquier detalle del evento antes de su publicación
- Para eventos ya publicados, el organizador puede actualizar información no crítica
- El sistema advierte sobre cambios críticos (fecha, ubicación) en eventos con asistentes confirmados
- Los asistentes reciben notificaciones sobre cambios relevantes
- El historial de cambios queda registrado en el sistema
- El organizador puede ver una vista previa de cómo se verá el evento con los cambios

### HU-007: Cancelación de evento

**Como** organizador  
**Quiero** cancelar un evento programado  
**Para** notificar a los asistentes cuando no se pueda realizar

**Criterios de aceptación:**
- El organizador puede cancelar un evento en cualquier momento
- El sistema requiere que el organizador proporcione un motivo de cancelación
- Todos los asistentes registrados reciben una notificación de la cancelación
- Para eventos de pago, el sistema gestiona la devolución del dinero automáticamente
- El evento se marca como "Cancelado" en los resultados de búsqueda
- El organizador puede enviar un mensaje personalizado a los asistentes

### HU-008: Publicación de evento

**Como** organizador  
**Quiero** publicar mi evento para hacerlo visible a todos los usuarios  
**Para** maximizar la difusión y asistencia

**Criterios de aceptación:**
- El organizador puede publicar un evento una vez completada toda la información requerida
- Para eventos de pago, el sistema procesa el pago de la tarifa de publicación
- El evento aparece en las búsquedas y listados según su categoría y ubicación
- El sistema proporciona opciones para compartir en redes sociales
- El organizador recibe confirmación cuando el evento es publicado exitosamente
- El evento es accesible mediante un enlace único

## Módulo 3: Búsqueda y Asistencia

### HU-009: Búsqueda de eventos

**Como** usuario  
**Quiero** buscar eventos según diferentes criterios  
**Para** encontrar actividades que coincidan con mis intereses

**Criterios de aceptación:**
- El usuario puede buscar eventos usando palabras clave
- El sistema permite filtrar por categoría, fecha, ubicación y precio
- Los resultados se presentan ordenados por relevancia o fecha
- El usuario puede ver eventos en un mapa si la búsqueda es por ubicación
- El sistema muestra sugerencias basadas en búsquedas anteriores
- El usuario puede guardar búsquedas frecuentes

### HU-010: Visualización de detalles de evento

**Como** usuario  
**Quiero** ver información detallada de un evento  
**Para** decidir si me interesa asistir

**Criterios de aceptación:**
- El usuario puede acceder a toda la información del evento: descripción, agenda, ubicación, etc.
- El sistema muestra claramente fecha, hora y duración del evento
- El usuario puede ver la ubicación en un mapa interactivo
- La página muestra el número de asistentes confirmados y capacidad disponible
- El usuario puede ver imágenes y materiales promocionales en buena calidad
- La información de precio y tipos de entrada está claramente presentada

### HU-011: Confirmación de asistencia

**Como** usuario registrado  
**Quiero** confirmar mi asistencia a un evento  
**Para** asegurar mi lugar y recibir actualizaciones

**Criterios de aceptación:**
- El usuario puede confirmar asistencia con un solo clic para eventos gratuitos
- Para eventos de pago, el sistema guía al usuario a través del proceso de compra
- El usuario recibe una confirmación por correo electrónico
- El sistema agrega el evento al calendario personal del usuario
- El usuario puede cancelar su asistencia hasta cierto tiempo antes del evento
- El sistema muestra claramente si un evento está a capacidad completa

### HU-012: Compra de entradas

**Como** usuario registrado  
**Quiero** comprar entradas para un evento de pago  
**Para** asegurar mi asistencia y acceso

**Criterios de aceptación:**
- El usuario puede seleccionar el tipo y cantidad de entradas a comprar
- El sistema muestra un resumen claro del pedido antes de finalizar
- El proceso de pago es seguro y compatible con múltiples métodos
- El usuario recibe las entradas por correo electrónico en formato digital
- Las entradas incluyen código QR/barcode para validación
- El usuario puede solicitar reembolso según la política del evento

## Módulo 4: Interacción Social

### HU-013: Comentarios en eventos

**Como** usuario registrado  
**Quiero** comentar en los eventos  
**Para** hacer preguntas o compartir opiniones

**Criterios de aceptación:**
- El usuario puede publicar comentarios en la página de un evento
- Los comentarios muestran el nombre y foto de perfil del usuario
- El organizador puede responder directamente a los comentarios
- El sistema notifica a los usuarios cuando reciben respuestas
- Los usuarios pueden reportar comentarios inapropiados
- El sistema aplica filtros básicos de lenguaje inapropiado

### HU-014: Creación de grupos de asistentes

**Como** usuario registrado  
**Quiero** crear o unirme a un grupo de asistentes para un evento  
**Para** coordinar con otras personas que asistirán

**Criterios de aceptación:**
- El usuario puede crear un grupo asociado a un evento específico
- El creador puede establecer si el grupo es público o privado
- Los usuarios pueden buscar y unirse a grupos públicos
- Para grupos privados, se requiere invitación o contraseña
- El sistema proporciona un chat grupal para los miembros
- Los usuarios reciben notificaciones de actividad en sus grupos

### HU-015: Compartir eventos

**Como** usuario  
**Quiero** compartir eventos que me interesan  
**Para** invitar a amigos o difundir el evento

**Criterios de aceptación:**
- El usuario puede compartir un evento en redes sociales con un solo clic
- El sistema genera un enlace corto para compartir por cualquier medio
- Al compartir, se incluye la información clave y una imagen del evento
- El usuario puede enviar invitaciones directas por correo electrónico
- El sistema realiza un seguimiento de cuántas veces se ha compartido un evento
- El organizador puede ver estadísticas de compartidos

## Módulo 5: Evaluación y Estadísticas

### HU-016: Evaluación de eventos asistidos

**Como** asistente  
**Quiero** calificar y comentar sobre un evento al que asistí  
**Para** compartir mi experiencia y proporcionar retroalimentación

**Criterios de aceptación:**
- El usuario puede calificar el evento en una escala de 1-5 estrellas
- El sistema permite escribir una reseña detallada
- El usuario puede incluir fotos con su reseña
- Las reseñas se muestran en la página del evento para futuros interesados
- El organizador puede responder a las reseñas
- El sistema calcula y muestra un promedio de calificaciones

### HU-017: Visualización de estadísticas para organizadores

**Como** organizador  
**Quiero** ver estadísticas detalladas de mis eventos  
**Para** evaluar su éxito y planificar mejoras

**Criterios de aceptación:**
- El organizador puede ver métricas clave: número de vistas, registros, asistencia final
- El sistema proporciona gráficos de tendencias de registro a lo largo del tiempo
- El organizador puede ver datos demográficos básicos de los asistentes
- Las estadísticas incluyen tasas de conversión (vistas vs. registros)
- El sistema muestra un resumen de la retroalimentación y calificaciones
- El organizador puede exportar los datos en formatos estándar (CSV, Excel)

## Módulo 6: Pagos y Membresías

### HU-018: Gestión de pagos como organizador

**Como** organizador  
**Quiero** gestionar los pagos recibidos por mis eventos  
**Para** llevar un control financiero adecuado

**Criterios de aceptación:**
- El organizador puede ver un registro detallado de todas las transacciones
- El sistema calcula automáticamente las comisiones y el monto neto
- El organizador puede solicitar retiros a su cuenta bancaria
- El sistema proporciona facturas y recibos para fines contables
- El organizador puede establecer políticas de reembolso personalizadas
- El sistema notifica sobre transacciones importantes o problemas

### HU-019: Suscripción a membresía premium

**Como** usuario  
**Quiero** adquirir una membresía premium  
**Para** obtener beneficios adicionales en la plataforma

**Criterios de aceptación:**
- El usuario puede ver claramente los diferentes niveles de membresía y sus beneficios
- El proceso de suscripción es simple y seguro
- El sistema gestiona renovaciones automáticas con notificación previa
- El usuario puede cancelar su membresía en cualquier momento
- Los beneficios se aplican inmediatamente después del pago exitoso
- El usuario recibe confirmación de su nueva condición de miembro

## Módulo 7: Notificaciones y Comunicación

### HU-020: Configuración de notificaciones

**Como** usuario  
**Quiero** personalizar las notificaciones que recibo  
**Para** estar informado solo de lo que me interesa

**Criterios de aceptación:**
- El usuario puede activar/desactivar distintos tipos de notificaciones
- El sistema permite elegir entre notificaciones por correo, push o ambas
- El usuario puede establecer la frecuencia de los resúmenes (diarios, semanales)
- Los cambios en la configuración se aplican inmediatamente
- El usuario puede silenciar temporalmente todas las notificaciones
- El sistema respeta las preferencias configuradas consistentemente

### HU-021: Centro de mensajes

**Como** usuario  
**Quiero** tener un centro unificado de mensajes  
**Para** gestionar todas mis comunicaciones en la plataforma

**Criterios de aceptación:**
- El usuario puede ver todos sus mensajes organizados por conversaciones
- El sistema indica claramente los mensajes no leídos
- El usuario puede buscar mensajes por contenido o remitente
- El sistema permite responder directamente desde el centro de mensajes
- Los mensajes incluyen contexto (evento relacionado, grupo, etc.)
- El usuario puede archivar o eliminar conversaciones

## Módulo 8: Administración

### HU-022: Panel de administración

**Como** administrador  
**Quiero** tener acceso a un panel de control completo  
**Para** gestionar todos los aspectos de la plataforma

**Criterios de aceptación:**
- El administrador puede ver estadísticas globales de la plataforma
- El sistema permite buscar y gestionar usuarios y eventos
- El administrador puede responder a reportes de contenido inapropiado
- El panel incluye herramientas para configuración del sistema
- El administrador puede gestionar categorías y características destacadas
- El sistema mantiene un registro de auditoría de acciones administrativas

### HU-023: Moderación de contenido

**Como** administrador  
**Quiero** moderar el contenido publicado  
**Para** mantener un ambiente seguro y apropiado

**Criterios de aceptación:**
- El administrador recibe alertas sobre contenido reportado
- El sistema proporciona herramientas para revisar rápidamente el contenido
- El administrador puede aprobar, rechazar o modificar contenido
- El sistema permite aplicar sanciones graduales a usuarios que violen normas
- El administrador puede enviar advertencias a usuarios específicos
- Las decisiones de moderación quedan registradas con justificación 