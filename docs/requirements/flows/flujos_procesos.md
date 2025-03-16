# Diagramas de Flujo - EventHub

Este documento describe los principales flujos de procesos de la aplicación EventHub utilizando PlantUML para una representación visual clara y mantenible.

## 1. Flujo de Registro e Inicio de Sesión

### 1.1 Flujo de Registro de Usuario

```plantuml
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

### 1.2 Flujo de Inicio de Sesión

```plantuml
@startuml Inicio_Sesion
title Flujo de Inicio de Sesión

start
:Usuario accede a la pantalla de inicio;
:Selecciona "Iniciar Sesión";
:Se muestra formulario de inicio de sesión;
:Usuario ingresa credenciales;

if (¿Credenciales válidas?) then (Sí)
  :Generar token de autenticación;
  :Almacenar token en cliente;
  :Redirigir a pantalla principal;
  stop
else (No)
  :Mostrar mensaje de error;
  :Volver al formulario;
  goto Formulario
endif

@enduml
```

### 1.3 Flujo de Restablecimiento de Contraseña

```plantuml
@startuml Restablecimiento_Contrasena
title Flujo de Restablecimiento de Contraseña

start
:Usuario accede a pantalla de inicio de sesión;
:Selecciona "Olvidé mi contraseña";
:Se muestra formulario para ingresar correo;
:Usuario ingresa su correo electrónico;

if (¿Correo existe en el sistema?) then (Sí)
  :Generar token de restablecimiento;
  :Enviar correo con enlace de restablecimiento;
  :Mostrar mensaje de confirmación;
  :Usuario recibe correo;
  
  if (¿Usuario hace clic en enlace?) then (Sí)
    :Validar token;
    :Mostrar formulario de nueva contraseña;
    :Usuario ingresa nueva contraseña;
    
    if (¿Contraseña válida?) then (Sí)
      :Actualizar contraseña en la base de datos;
      :Invalidar sesiones activas anteriores;
      :Mostrar mensaje de éxito;
      :Redirigir a inicio de sesión;
      stop
    else (No)
      :Mostrar errores de validación;
      goto Formulario_Contraseña
    endif
    
  else (No)
    :Token expira después de tiempo límite;
    stop
  endif
  
else (No)
  :Mostrar mensaje genérico "Se ha enviado correo si existe";
  :Redirigir a inicio de sesión;
  stop
endif

@enduml
```

## 2. Flujo de Gestión de Eventos

### 2.1 Flujo de Creación de Evento

```plantuml
@startuml Creacion_Evento
title Flujo de Creación de Evento

start
:Organizador accede a pantalla principal;
:Selecciona "Crear Evento";
:Se muestra formulario de creación de evento;

:Ingresar información básica 
(nombre, descripción, categoría);

repeat
  if (¿Continuar o guardar borrador?) then (Continuar)
    :Ingresar detalles
    (fecha, hora, ubicación);
    
    if (¿Continuar o guardar borrador?) then (Continuar)
      :Configurar entradas y precios
      (capacidad, tipos de entradas);
    else (Guardar)
      :Guardar como borrador;
      stop
    endif
    
  else (Guardar)
    :Guardar como borrador;
    stop
  endif
repeat while (¿Más secciones?) is (Sí)
->No;

:Mostrar vista previa del evento;

if (¿Publicar o editar?) then (Editar)
  :Volver al formulario;
  goto Formulario
else (Publicar)
  if (¿Evento gratuito?) then (Sí)
    :Publicar evento directamente;
  else (No)
    :Procesar pago de publicación;
    
    if (¿Pago exitoso?) then (Sí)
      :Publicar evento;
    else (No)
      :Mostrar error de pago;
      :Volver a vista previa;
      goto Vista_Previa
    endif
  endif
  
  :Enviar confirmación de publicación;
  :Mostrar panel de gestión del evento;
  stop
endif

@enduml
```

### 2.2 Flujo de Edición de Evento

```plantuml
@startuml Edicion_Evento
title Flujo de Edición de Evento

start
:Organizador accede a pantalla principal;
:Selecciona "Mis Eventos";
:Sistema muestra lista de eventos del organizador;
:Organizador selecciona un evento específico;
:Sistema muestra panel de gestión del evento;
:Organizador selecciona "Editar";
:Sistema muestra formulario con datos actuales;
:Organizador modifica información del evento;

if (¿Evento ya publicado?) then (Sí)
  if (¿Cambios son significativos?) then (Sí)
    :Mostrar advertencia sobre impacto en asistentes;
    
    if (¿Confirmar cambios?) then (Sí)
      :Guardar cambios;
    else (No)
      :Volver al formulario;
      goto Formulario
    endif
  else (No)
    :Guardar cambios;
  endif
else (No)
  :Guardar cambios;
endif

if (¿Cambios requieren notificación?) then (Sí)
  :Notificar a asistentes sobre los cambios;
  :Actualizar información en tickets/calendario;
else (No)
  :No enviar notificaciones;
endif

:Mostrar confirmación de actualización;
:Redirigir al panel de gestión del evento;
stop

@enduml
```

### 2.3 Flujo de Cancelación de Evento

```plantuml
@startuml Cancelacion_Evento
title Flujo de Cancelación de Evento

start
:Organizador accede al panel de gestión del evento;
:Selecciona "Cancelar Evento";
:Sistema muestra formulario de cancelación;
:Organizador ingresa motivo de cancelación;

if (¿Evento tiene pagos procesados?) then (Sí)
  :Mostrar información de política de reembolsos;
  :Explicar proceso de devoluciones;
endif

if (¿Organizador confirma cancelación?) then (Sí)
  :Marcar evento como cancelado en sistema;
  :Notificar a todos los asistentes registrados;
  
  if (¿Hay pagos que reembolsar?) then (Sí)
    :Iniciar proceso automático de reembolso;
    :Generar registros de transacciones;
  endif
  
  :Mostrar confirmación de cancelación;
  :Actualizar estado en listados de eventos;
  :Redirigir a lista de eventos del organizador;
else (No)
  :Cancelar operación;
  :Volver al panel de gestión;
endif

stop

@enduml
```

## 3. Flujo de Búsqueda y Asistencia

### 3.1 Flujo de Búsqueda de Eventos

```plantuml
@startuml Busqueda_Eventos
title Flujo de Búsqueda de Eventos

start
:Usuario accede a pantalla principal;
:Foco en barra de búsqueda;
:Usuario ingresa términos de búsqueda;
:Sistema muestra resultados iniciales;

if (¿Usuario desea aplicar filtros?) then (Sí)
  :Expandir panel de filtros;
  :Usuario selecciona filtros 
  (categoría, fecha, ubicación, precio);
  :Sistema actualiza resultados en tiempo real;
endif

:Usuario explora resultados disponibles;

if (¿Se encontraron eventos?) then (Sí)
  if (¿Usuario ordena resultados?) then (Sí)
    :Aplicar criterio de ordenamiento
    (fecha, relevancia, distancia);
  endif
  :Usuario examina listado;
  :Usuario selecciona un evento específico;
  :Sistema muestra página de detalles del evento;
else (No)
  :Mostrar mensaje "No se encontraron resultados";
  :Sugerir términos alternativos;
  :Ofrecer modificar filtros;
  if (¿Usuario modifica búsqueda?) then (Sí)
    :Usuario ajusta términos o filtros;
    goto NuevaBusqueda
  else (No)
    :Usuario navega a otra sección;
    stop
  endif
endif

stop

@enduml
```

### 3.2 Flujo de Registro de Asistencia

```plantuml
@startuml Registro_Asistencia
title Flujo de Registro de Asistencia

start
:Usuario visualiza detalles del evento;
:Usuario selecciona "Asistir" o "Comprar entradas";

if (¿Usuario ha iniciado sesión?) then (Sí)
  :Verificar disponibilidad de espacios;
  
  if (¿Hay capacidad disponible?) then (Sí)
    if (¿Evento gratuito?) then (Sí)
      :Confirmar asistencia directamente;
    else (No)
      :Mostrar opciones de entradas;
      :Usuario selecciona tipo y cantidad;
      :Sistema muestra resumen de compra;
      :Usuario selecciona método de pago;
      :Sistema procesa el pago;
      
      if (¿Pago exitoso?) then (Sí)
        :Confirmar compra y asistencia;
      else (No)
        :Mostrar error de pago;
        :Ofrecer intentar nuevamente;
        goto MetodoPago
      endif
    endif
    
    :Generar ticket o confirmación;
    :Enviar confirmación por correo;
    :Ofrecer agregar al calendario;
    :Agregar evento a "Mis Eventos" del usuario;
    
  else (No)
    :Mostrar mensaje "Capacidad completa";
    
    if (¿Evento permite lista de espera?) then (Sí)
      :Ofrecer unirse a lista de espera;
      
      if (¿Usuario desea unirse?) then (Sí)
        :Registrar en lista de espera;
        :Notificar posición en lista;
        :Enviar confirmación;
      else (No)
        :Volver a detalles del evento;
      endif
      
    else (No)
      :Sugerir eventos similares;
    endif
  endif
  
else (No)
  :Redirigir a pantalla de inicio de sesión;
  :Almacenar intención de asistencia;
  
  if (¿Usuario completa inicio de sesión?) then (Sí)
    :Redirigir de vuelta al evento;
    goto ContinuarRegistro
  else (No)
    stop
  endif
endif

stop

@enduml
```

## 4. Flujo de Interacción Social

### 4.1 Flujo de Comentarios en Eventos

```plantuml
@startuml Comentarios_Eventos
title Flujo de Comentarios en Eventos

start
:Usuario visualiza detalles del evento;
:Usuario navega a la sección de comentarios;

if (¿Usuario ha iniciado sesión?) then (Sí)
  :Mostrar formulario de comentario;
  :Usuario escribe un comentario;
  :Usuario envía el comentario;
  
  :Sistema valida el contenido;
  
  if (¿Contenido apropiado?) then (Sí)
    :Publicar comentario;
    :Actualizar lista de comentarios;
    :Notificar al organizador (opcional);
  else (No)
    :Mostrar mensaje de advertencia;
    :Sugerir modificaciones al contenido;
    goto Escribir_Comentario
  endif
  
else (No)
  :Mostrar mensaje "Inicia sesión para comentar";
  
  if (¿Usuario decide iniciar sesión?) then (Sí)
    :Redirigir a pantalla de inicio de sesión;
    :Almacenar intención de comentar;
    
    if (¿Inicio de sesión exitoso?) then (Sí)
      :Redirigir de vuelta al evento;
      :Mostrar formulario de comentario;
      goto Escribir_Comentario
    else (No)
      stop
    endif
    
  else (No)
    :Usuario continúa navegando sin comentar;
  endif
endif

:Usuario puede ver todos los comentarios;
:Usuario puede responder a otros comentarios;
stop

@enduml
```

### 4.2 Flujo de Creación de Grupo de Asistentes

```plantuml
@startuml Creacion_Grupo
title Flujo de Creación de Grupo de Asistentes

start
:Usuario visualiza detalles del evento;
:Usuario selecciona "Crear grupo de asistentes";

if (¿Usuario ha confirmado asistencia?) then (Sí)
  :Sistema muestra formulario de creación de grupo;
  :Usuario ingresa nombre del grupo;
  :Usuario ingresa descripción;
  :Usuario configura privacidad del grupo (público/privado);
  
  :Usuario confirma creación del grupo;
  :Sistema crea el grupo y asigna al usuario como administrador;
  :Sistema genera enlace de invitación único;
  
  :Mostrar pantalla de confirmación con enlace;
  
  if (¿Usuario desea compartir enlace ahora?) then (Sí)
    :Mostrar opciones de compartir 
    (WhatsApp, Email, copiar enlace, etc.);
    :Usuario selecciona método de compartir;
    :Sistema abre la aplicación correspondiente;
    :Usuario completa el envío de invitación;
  endif
  
  :Mostrar panel de administración del grupo;
  :Usuario puede invitar, gestionar miembros y configurar el grupo;
  
else (No)
  :Mostrar mensaje "Debes confirmar asistencia para crear un grupo";
  
  if (¿Usuario desea confirmar asistencia?) then (Sí)
    :Redirigir a flujo de confirmación de asistencia;
  else (No)
    :Usuario vuelve a detalles del evento;
  endif
endif

stop

@enduml
```

## 5. Flujo de Evaluación y Estadísticas

### 5.1 Flujo de Evaluación Post-Evento

```plantuml
@startuml Evaluacion_PostEvento
title Flujo de Evaluación Post-Evento

start
:Sistema detecta evento finalizado;
:Sistema envía notificación a asistentes;
:Usuario recibe notificación para evaluar evento;

:Usuario abre notificación o accede desde historial;
:Sistema muestra formulario de evaluación;

:Usuario selecciona calificación (1-5 estrellas);

if (¿Usuario desea agregar comentario?) then (Sí)
  :Usuario escribe reseña detallada;
  :Usuario puede adjuntar fotos (opcional);
endif

:Usuario envía evaluación;
:Sistema valida datos;

if (¿Datos válidos?) then (Sí)
  :Registrar evaluación en base de datos;
  :Actualizar calificación promedio del evento;
  :Actualizar estadísticas del organizador;
  
  :Enviar notificación al organizador;
  :Mostrar mensaje de agradecimiento al usuario;
  
  if (¿Primera evaluación del usuario?) then (Sí)
    :Ofrecer puntos de fidelidad o premio;
  endif
  
else (No)
  :Mostrar mensaje de error;
  :Solicitar corregir datos;
  goto Formulario
endif

stop

@enduml
```

### 5.2 Flujo de Visualización de Estadísticas

```plantuml
@startuml Visualizacion_Estadisticas
title Flujo de Visualización de Estadísticas

start
:Organizador accede al panel de control;
:Selecciona sección "Estadísticas";

:Sistema muestra vista general de todos los eventos;
:Organizador selecciona evento específico o periodo;

:Sistema procesa datos del evento/periodo;
:Mostrar estadísticas generales
(asistencia, ingresos, calificaciones);

fork
  :Visualizar gráfico de asistencia;
fork again
  :Visualizar gráfico de ingresos;
fork again
  :Visualizar demografía de asistentes;
fork again
  :Visualizar calificaciones y reseñas;
end fork

if (¿Exportar estadísticas?) then (Sí)
  :Seleccionar formato (PDF, Excel, CSV);
  :Sistema genera archivo de exportación;
  :Descargar archivo;
endif

:Organizador analiza resultados;

if (¿Ver detalles específicos?) then (Sí)
  :Seleccionar categoría específica;
  :Sistema muestra datos detallados;
  :Organizador visualiza análisis profundo;
endif

stop

@enduml
```

## 6. Flujo de Pagos y Transacciones

### 6.1 Flujo de Procesamiento de Pagos

```plantuml
@startuml Procesamiento_Pagos
title Flujo de Procesamiento de Pagos

start
:Usuario selecciona entradas para comprar;
:Sistema muestra resumen de compra;
:Usuario confirma compra;

:Sistema muestra opciones de pago disponibles;
:Usuario selecciona método de pago;

if (¿Método seleccionado?) then (Tarjeta de crédito/débito)
  :Sistema muestra formulario de tarjeta;
  :Usuario ingresa datos de tarjeta;
  :Sistema valida formato de datos;
  
  if (¿Datos válidos?) then (Sí)
    :Enviar datos a procesador de pagos;
  else (No)
    :Mostrar errores de validación;
    goto Formulario_Tarjeta
  endif
  
elseif (¿Método seleccionado?) then (PayPal)
  :Redirigir a página de PayPal;
  :Usuario completa proceso en PayPal;
  :PayPal notifica resultado a sistema;
  
elseif (¿Método seleccionado?) then (Transferencia bancaria)
  :Mostrar datos bancarios;
  :Usuario realiza transferencia externa;
  :Usuario sube comprobante;
  :Marcar como "Pendiente de verificación";
  :Notificar al organizador;
  
else (Otro método)
  :Procesar según proveedor específico;
endif

if (¿Pago aprobado?) then (Sí)
  :Registrar transacción en sistema;
  :Generar entradas/tickets;
  :Generar factura/recibo;
  :Enviar confirmación por correo;
  :Actualizar capacidad disponible del evento;
  :Mostrar pantalla de éxito;
  
else (No)
  :Registrar intento fallido;
  :Mostrar mensaje de error;
  
  if (¿Reintentar pago?) then (Sí)
    :Volver a selección de método de pago;
    goto Seleccion_Metodo
  else (No)
    :Cancelar proceso de compra;
    stop
  endif
endif

:Usuario puede descargar entradas;
:Usuario puede ver compra en "Mis tickets";

stop

@enduml
```

### 6.2 Flujo de Gestión de Membresías

```plantuml
@startuml Gestion_Membresias
title Flujo de Gestión de Membresías

start
:Usuario accede a sección de membresías;
:Sistema muestra planes disponibles;
:Usuario selecciona un plan;

:Sistema muestra detalles y beneficios del plan;
:Usuario selecciona "Suscribirse";

if (¿Usuario ya tiene membresía activa?) then (Sí)
  if (¿Es una actualización?) then (Sí)
    :Mostrar diferencias y costo adicional;
    :Usuario confirma actualización;
  else (No)
    :Informar que tiene una membresía activa;
    :Ofrecer cancelar membresía actual;
    
    if (¿Cancelar actual?) then (Sí)
      :Programar cancelación al fin del periodo;
      :Continuar con nueva suscripción;
    else (No)
      stop
    endif
  endif
endif

:Mostrar resumen de suscripción;
:Usuario confirma compra;

:Redirigir al flujo de procesamiento de pagos;
:Sistema procesa pago;

if (¿Pago exitoso?) then (Sí)
  :Activar membresía;
  :Registrar fecha de inicio y renovación;
  :Aplicar beneficios al usuario;
  :Enviar correo de confirmación;
  :Mostrar pantalla de bienvenida/éxito;
else (No)
  :Mostrar error de pago;
  :Ofrecer intentar con otro método;
endif

stop

@enduml
```

## 7. Flujo de Administración del Sistema

### 7.1 Flujo de Moderación de Contenido

```plantuml
@startuml Moderacion_Contenido
title Flujo de Moderación de Contenido

start
:Sistema monitorea contenido generado por usuarios;

fork
  :Detección automática de contenido inapropiado;
fork again
  :Usuarios reportan contenido inapropiado;
end fork

:Sistema agrega contenido a cola de moderación;
:Administrador accede al panel de moderación;
:Sistema muestra lista de contenido reportado/detectado;

repeat
  :Administrador selecciona contenido para revisar;
  :Sistema muestra contexto completo;
  
  if (¿Contenido infringe normas?) then (Sí)
    :Seleccionar tipo de infracción;
    :Seleccionar acción a tomar;
    
    if (¿Acción seleccionada?) then (Eliminar)
      :Eliminar contenido;
      :Notificar al usuario;
    elseif (¿Acción seleccionada?) then (Advertir)
      :Mantener contenido;
      :Enviar advertencia al usuario;
    elseif (¿Acción seleccionada?) then (Bloquear usuario)
      :Eliminar contenido;
      :Bloquear cuenta de usuario;
      :Enviar notificación de bloqueo;
    endif
    
  else (No)
    :Marcar como "Revisado y aprobado";
    :Descartar reporte;
    
    if (¿Reporte malicioso?) then (Sí)
      :Advertir al usuario que reportó;
    endif
  endif
  
  :Registrar acción en historial de moderación;
repeat while (¿Más contenido por revisar?) is (Sí)

:Sistema actualiza estadísticas de moderación;
stop

@enduml
```

### 7.2 Flujo de Configuración del Sistema

```plantuml
@startuml Configuracion_Sistema
title Flujo de Configuración del Sistema

start
:Administrador accede al panel de administración;
:Selecciona "Configuración del sistema";

:Sistema muestra categorías de configuración;
:Administrador selecciona categoría;
:Sistema muestra parámetros disponibles;

:Administrador modifica parámetros;
:Administrador confirma cambios;

:Sistema valida configuración;

if (¿Configuración válida?) then (Sí)
  :Guardar cambios en sistema;
  :Registrar en historial de cambios;
  
  if (¿Requiere reinicio de servicios?) then (Sí)
    if (¿Aplicar ahora?) then (Sí)
      :Notificar a usuarios activos;
      :Programar reinicio;
      :Ejecutar reinicio controlado;
    else (No)
      :Programar para horario de bajo uso;
    endif
  endif
  
  :Mostrar confirmación de cambios;
  
else (No)
  :Mostrar errores de validación;
  :Sugerir correcciones;
endif

stop

@enduml
``` 