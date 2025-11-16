# Servicios y API - Documentación

## Configuración de la API

La aplicación está configurada para usar la API real en: `https://api.childfound.online/api`

### Archivos de configuración:
- `src/app/config/api.config.ts` - Configuración base de la API
- `src/app/interceptors/api.interceptor.ts` - Interceptor para manejo de errores HTTP

## Modelos de datos

### User Interface (`src/app/models/user.interface.ts`)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number | null;
  city: string | null;
  rubroId: string;
  googleId: string | null;
  moduleId: string;
  roles: 'user' | 'admin' | 'moderator';
  businesses: Business[];
}
```

### Business Interface (`src/app/models/business.interface.ts`)
```typescript
interface Business {
  id: string;
  name: string;
  userId: string;
  rubroId: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  isSuccessful: boolean;
  createdAt: string;
  finalizedAt: string | null;
}
```

## Servicios disponibles

### 1. UserService (`src/app/services/user.service.ts`)

**Métodos principales:**
- `getUsers(page, limit, search)` - Obtener usuarios con paginación
- `getUserById(id)` - Obtener usuario por ID
- `getUsersByRubro(rubroId)` - Obtener usuarios por rubro
- `createUser(user)` - Crear nuevo usuario
- `updateUser(id, user)` - Actualizar usuario
- `deleteUser(id)` - Eliminar usuario
- `searchUsers(query)` - Buscar usuarios
- `getUserStats()` - Obtener estadísticas

**Ejemplo de uso:**
```typescript
constructor(private userService: UserService) {}

loadUsers() {
  this.userService.getUsersByRubro('39d39663-09e7-4b8b-aae9-dca9457e37de')
    .subscribe(users => {
      console.log('Usuarios:', users);
    });
}
```

### 2. BusinessService (`src/app/services/business.service.ts`)

**Métodos principales:**
- `getBusinesses()` - Obtener todos los negocios
- `getBusinessById(id)` - Obtener negocio por ID
- `getBusinessesByUser(userId)` - Obtener negocios por usuario
- `getBusinessesByRubro(rubroId)` - Obtener negocios por rubro
- `createBusiness(business)` - Crear nuevo negocio
- `updateBusiness(id, business)` - Actualizar negocio
- `updateBusinessStatus(id, status)` - Actualizar estado
- `finalizeBusiness(id, isSuccessful)` - Finalizar negocio

### 3. RubroService (`src/app/services/rubro.service.ts`)

**Métodos principales:**
- `getRubros()` - Obtener todos los rubros
- `getRubroById(id)` - Obtener rubro por ID
- `getUsersByRubro(rubroId)` - Obtener usuarios de un rubro
- `createRubro(rubro)` - Crear nuevo rubro
- `updateRubro(id, rubro)` - Actualizar rubro

## Componentes de ejemplo

### 1. ApiTestComponent (`src/app/components/api-test/api-test.component.ts`)

Componente para probar la conexión con la API real. Puedes acceder en la ruta `/api-test`.

**Características:**
- Prueba la conexión con la API
- Muestra los datos de usuarios y negocios
- Manejo de errores
- Visualización de la respuesta completa

### 2. UsersManagementComponent (`src/app/pages/users-management/users-management.component.ts`)

Componente completo para gestión de usuarios con PrimeNG.

**Características:**
- Tabla con paginación
- Búsqueda de usuarios
- Visualización de detalles
- Acciones CRUD

## Cómo usar los servicios

### 1. Importar en tu componente:
```typescript
import { UserService, BusinessService } from '../services';
```

### 2. Inyectar en el constructor:
```typescript
constructor(
  private userService: UserService,
  private businessService: BusinessService
) {}
```

### 3. Usar en tus métodos:
```typescript
loadData() {
  // Cargar usuarios por rubro
  this.userService.getUsersByRubro('rubro-id').subscribe(users => {
    this.users = users;
  });

  // Cargar negocios
  this.businessService.getBusinesses().subscribe(businesses => {
    this.businesses = businesses;
  });
}
```

## Manejo de errores

Los servicios incluyen manejo automático de errores a través del interceptor:
- Reintentos automáticos
- Mensajes de error descriptivos
- Logging en consola

## Estado reactivo

Los servicios usan BehaviorSubject para mantener estado reactivo:
```typescript
// Suscribirse a cambios de usuarios
this.userService.users$.subscribe(users => {
  // Actualizar UI automáticamente
});
```

## Próximos pasos

1. **Autenticación**: Agregar tokens JWT a las peticiones
2. **Cache**: Implementar cache para mejorar rendimiento
3. **Offline**: Soporte para modo offline
4. **Validaciones**: Agregar validaciones de formularios
5. **Tests**: Implementar tests unitarios para los servicios

## URLs de la API disponibles

Basado en tu API real:
- `GET /rubros/{rubroId}/users` - Obtener usuarios por rubro ✅ Implementado
- `GET /users` - Obtener todos los usuarios
- `GET /businesses` - Obtener todos los negocios
- `POST /users` - Crear usuario
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

Para probar la implementación, visita: `http://localhost:4200/api-test`