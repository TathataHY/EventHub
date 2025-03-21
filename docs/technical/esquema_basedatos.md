# Esquema de Base de Datos - EventHub

## Entidades y Relaciones

### 1. Users (Usuarios)
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_picture VARCHAR(255),
  bio TEXT,
  role ENUM('admin', 'organizer', 'user') DEFAULT 'user',
  is_blocked BOOLEAN DEFAULT FALSE,
  provider ENUM('system', 'google', 'facebook') DEFAULT 'system',
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. User_Preferences (Preferencias de Usuario)
```sql
CREATE TABLE user_preferences (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  notification_events BOOLEAN DEFAULT TRUE,
  notification_messages BOOLEAN DEFAULT TRUE,
  notification_system BOOLEAN DEFAULT TRUE,
  visibility_profile ENUM('public', 'private', 'friends') DEFAULT 'public',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Categories (Categorías de Eventos)
```sql
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. User_Interests (Intereses de Usuario)
```sql
CREATE TABLE user_interests (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  interest_level INT DEFAULT 5, -- 1-10 scale
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY user_category (user_id, category_id)
);
```

### 5. Events (Eventos)
```sql
CREATE TABLE events (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  organizer_id VARCHAR(36) NOT NULL,
  location VARCHAR(255),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  max_attendees INT,
  price DECIMAL(10, 2) DEFAULT 0.00,
  is_published BOOLEAN DEFAULT FALSE,
  is_cancelled BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  cover_image VARCHAR(255),
  status ENUM('draft', 'published', 'cancelled', 'finished') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 6. Event_Categories (Categorías de Eventos)
```sql
CREATE TABLE event_categories (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY event_category (event_id, category_id)
);
```

### 7. Event_Attendees (Asistentes a Eventos)
```sql
CREATE TABLE event_attendees (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY event_user (event_id, user_id)
);
```

### 8. Event_Followers (Seguidores de Eventos)
```sql
CREATE TABLE event_followers (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY event_user_follow (event_id, user_id)
);
```

### 9. Comments (Comentarios)
```sql
CREATE TABLE comments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  event_id VARCHAR(36) NOT NULL,
  parent_id VARCHAR(36) NULL,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE SET NULL
);
```

### 10. Ratings (Valoraciones)
```sql
CREATE TABLE ratings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  event_id VARCHAR(36) NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  UNIQUE KEY user_event_rating (user_id, event_id)
);
```

### 11. Notifications (Notificaciones)
```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('system', 'event', 'payment', 'user', 'comment', 'reminder') NOT NULL,
  channel ENUM('email', 'push', 'in_app', 'sms') NOT NULL,
  html TEXT,
  read BOOLEAN DEFAULT FALSE,
  sent BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMP NULL,
  read_at TIMESTAMP NULL,
  related_entity_id VARCHAR(36),
  related_entity_type VARCHAR(50),
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 12. Notification_Preferences (Preferencias de Notificación)
```sql
CREATE TABLE notification_preferences (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  notification_type ENUM('system', 'event', 'payment', 'user', 'comment', 'reminder') NOT NULL,
  email_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY user_notification_type (user_id, notification_type)
);
```

### 13. Notification_Templates (Plantillas de Notificación)
```sql
CREATE TABLE notification_templates (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('system', 'event', 'payment', 'user', 'comment', 'reminder') NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  html_template TEXT,
  variables JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 14. Payments (Pagos)
```sql
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  event_id VARCHAR(36),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,
  payment_provider VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_type ENUM('event_ticket', 'subscription', 'donation', 'service') NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);
```

### 15. Tickets (Entradas)
```sql
CREATE TABLE tickets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  event_id VARCHAR(36) NOT NULL,
  payment_id VARCHAR(36),
  code VARCHAR(100) UNIQUE NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'used', 'expired') DEFAULT 'pending',
  price DECIMAL(10, 2),
  description TEXT,
  is_used BOOLEAN DEFAULT FALSE,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
);
```

### 16. User_Groups (Grupos de Usuario)
```sql
CREATE TABLE groups (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  creator_id VARCHAR(36) NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 17. Group_Members (Miembros de Grupo)
```sql
CREATE TABLE group_members (
  id VARCHAR(36) PRIMARY KEY,
  group_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  role ENUM('admin', 'moderator', 'member') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY group_user (group_id, user_id)
);
```

## Índices para Optimización

```sql
-- Índices para notificaciones
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Índices para tickets
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_code ON tickets(code);

-- Índices para mejorar búsquedas de eventos
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_events_price ON events(price);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer ON events(organizer_id);

-- Índices para búsquedas de usuario
CREATE INDEX idx_users_name ON users(full_name);
CREATE INDEX idx_users_role ON users(role);

-- Índices para búsquedas de categorías
CREATE INDEX idx_categories_name ON categories(name);

-- Índices para pagos
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_event ON payments(event_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Índices para comentarios y valoraciones
CREATE INDEX idx_comments_event ON comments(event_id);
CREATE INDEX idx_ratings_event ON ratings(event_id);
``` 