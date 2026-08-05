# Learning NestJS

1. Once we've **created** the project  
   1.1 **Uninstall** Prettier with:

   ```bash
   npm uninstall prettier eslint-plugin-prettier eslint-config-prettier
   ```

2. Postgress with Docker
   2.1 **docker-compose.yaml**
   ```
   npm uninstall prettier eslint-plugin-prettier eslint-config-prettier
   ```
   2.2 **Start the database** (e.g., PostgreSQL):
   ```bash
   docker-compose up -d
   ```
3. Install ORM with Typeorm
   2.1 **installation**
   ```
   npm install --save @nestjs/typeorm typeorm pg
   ```
   2.2 **Start the database** (e.g., PostgreSQL):
   ```bash
   docker-compose up -d
   ```
4. Configure env
   2.1 **installation**

   ```
   npm install @nestjs/config
   ```

   and configure the app.module with

   ```
   ConfigModule.forRoot()

   ```

   - add .env in .gitignore

5. Install validators
   2.1 **installation**

   ```
   npm i class-validator class-transformer
   npm i uuid
   ```

6. Notas
   - si es mongo el id lo genera el, no es necesario ponerlo
     extends de Document y decorador @schema
     export SchemaFactory.createClassFor
     recordar -> modulos -> import

7. Relaciones

En NestJS usando **TypeORM**, la relación 1 a N se define con los decoradores `@OneToMany` (en el lado 1) y `@ManyToOne` (en el lado N).

Por convención, el lado **N** es el que guarda la clave foránea en la tabla de la base de datos, y **TypeORM genera el nombre de la columna automáticamente** combinando el nombre de la propiedad + el nombre de la columna clave primaria.

---

### Ejemplo práctico: Un `User` tiene muchas `Photo`s (1 a N)

#### 1. Lado N (La entidad que contiene la clave foránea): `Photo`

En el lado "N", usas `@ManyToOne` para definir la relación y `@JoinColumn()` si quieres personalizar el nombre físico de la columna en la base de datos.

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  // Definición de la relación
  @ManyToOne(() => User, (user) => user.photos)
  @JoinColumn({ name: 'user_id' }) // <-- OPCIONAL: Define el nombre exacto de la columna FK
  user: User;
}
```

#### 2. Lado 1: `User`

En el lado "1", usas `@OneToMany` apuntando a la propiedad del lado N. Aquí **no** se genera ninguna columna física en la tabla `users`.

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from './photo.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Definición del lado inverso
  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
```

---

### Reglas de nombramiento para la Clave Foránea (FK)

| Configuración                              | Nombre de la columna en la BD | Explicación                                                     |
| ------------------------------------------ | ----------------------------- | --------------------------------------------------------------- |
| **Por defecto** (sin `@JoinColumn`)        | `userId`                      | Genera `propiedad` + `Id` en formato _camelCase_.               |
| **Con `@JoinColumn({ name: 'user_id' })**` | `user_id`                     | Fuerza el nombre a _snake_case_ (recomendado para PostgreSQL).  |
| **Con la propiedad explícita ID**          | `userId` / `user_id`          | Permite acceder directamente al ID sin cargar toda la relación. |

---

### Mapeo explícito del ID de la relación (Recomendado)

En proyectos reales de NestJS, es muy común querer acceder directamente al ID de la relación sin tener que cargar toda la entidad relacional. Para ello, defines tanto la columna del ID como la propiedad relacional:

```typescript
@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  // Propiedad para acceder al valor del ID directamente
  @Column({ name: 'user_id' })
  userId: number;

  // Objeto de relación
  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Debe coincidir con name de @Column
  user: User;
}
```

De esta forma:

- `photo.userId` te devuelve el número del ID (ej: `5`).
- `photo.user` te devuelve el objeto completo de la entidad `User` (si hiciste `relations: ['user']`).

APLANAR
import { Transform } from 'class-transformer';

export class ProductResponseDto {
id: number;
name: string;

// Transforma el arreglo de objetos ProductImage[] a string[]
@Transform(({ value }) => value?.map((img: { url: string }) => img.url) || [])
images: string[];
}

documentacon : https://orkhan.gitbook.io/typeorm

UNA QUERY RUNNER VARIAS QUERIES
