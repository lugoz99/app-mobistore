# Documentación de Datos de MobiStore

Este documento describe las entidades principales, sus campos, relaciones y reglas de negocio. Los nombres de tablas y campos siguen el código TypeORM del proyecto.

## Resumen del modelo

- `User` es dueño de sus devices y órdenes.
- `Category` agrupa los devices.
- `Device` guarda el precio actual del catálogo.
- `Order` guarda la compra del cliente.
- `OrderItem` guarda cada device incluido en una orden.
- `Payment` guarda cada intento de pago de una orden.
- `DeviceImage` guarda las imágenes de un device.

## 1. Modelo Entidad-Relación (ERD)

```mermaid
erDiagram
    USER {
        UUID id PK
        TEXT email UK
        TEXT password
        TEXT fullName
        BOOLEAN isActive
        TEXT_ARRAY roles
    }

    DEVICE {
        UUID id PK
        TEXT modelName UK
        TEXT sku UK
        TEXT brand
        FLOAT price
        BOOLEAN isActive
        TEXT technicalDetails
        TEXT modelSlug UK
        INT unitsInStock
        TEXT_ARRAY availableColor
        TEXT targetMarket
        TEXT_ARRAY accessoriesIncluded
        UUID userId FK
        UUID categoryId FK
    }

    DEVICEIMAGE {
        INT id PK
        TEXT url
        TEXT publicId
        UUID deviceId FK
    }

    ORDER {
        UUID id PK
        DATETIME createdAt
        DECIMAL totalAmount
        CHAR currency
        TEXT status
        TEXT shippingAddress
        UUID userId FK
    }

    ORDERITEM {
        UUID id PK
        INT quantity
        DECIMAL unitPrice
        TEXT selectedColor
        UUID orderId FK
        UUID deviceId FK
    }

    PAYMENT {
        UUID id PK
        DECIMAL amount
        CHAR currency
        TEXT status
        TEXT stripeSessionId UK
        TEXT stripePaymentIntentId
        TEXT failureCode
        TEXT failureMessage
        DATETIME createdAt
        DATETIME paidAt
        UUID orderId FK
    }

    CATEGORY {
        UUID id PK
        TEXT name UK
        DATETIME createdAt
        DATETIME updateAt
    }

    %% Each order item belongs to one order and one device.
    USER ||--o{ DEVICE : "1 a 0..N"
    USER ||--o{ ORDER : "1 a 0..N"
    DEVICE ||--o{ DEVICEIMAGE : "1 a 0..N"
    ORDER ||--|{ ORDERITEM : "1 a 1..N"
    DEVICE ||--o{ ORDERITEM : "1 a 0..N"
    ORDER ||--o{ PAYMENT : "1 a 0..N"
    CATEGORY ||--o{ DEVICE : "1 a 0..N"
```

---

## 2. Reglas de precios y órdenes

### `Device.price`

`Device.price` es el precio actual mostrado en el catálogo. Puede cambiar cuando la tienda actualiza un device.

### `OrderItem.unitPrice`

`OrderItem.unitPrice` es una copia de `Device.price` en el momento de la compra. No debe cambiar cuando cambie el precio del catálogo.

El backend debe leer el precio desde `Device` al crear un item. El cliente no debe elegir este valor.

El subtotal del item se calcula así:

`quantity * unitPrice`

El total de la orden es la suma de todos los subtotales. `totalAmount` debe calcularlo el backend.

### Creating an order with several devices

Una orden puede contener muchos items. Cada item apunta a un device:

| orderId | deviceId | quantity | selectedColor | unitPrice |
| ------- | -------- | -------- | ------------- | --------- |
| Order A | Device 1 | 1        | Black         | 2499.99   |
| Order A | Device 2 | 2        | Blue          | 899.99    |

El mismo `orderId` puede aparecer en varias filas porque todas pertenecen a la misma orden.

## 3. Definición del campo `targetMarket`

Define el segmento comercial o gama del dispositivo:

- **`budget` (Gama de entrada / Económico):** Productos accesibles, de bajo costo, enfocados en funciones básicas.
- **`mid-range` (Gama media):** Balance entre costo y rendimiento; buena calidad a precio moderado.
- **`premium` (Gama alta):** Productos de costo elevado, mejores materiales y características superiores.
- **`flagship` (Gama insignia / Top de línea):** El producto estrella de la marca; tecnología más avanzada de la categoría (ejemplo: Samsung Ultra, iPhone Pro Max).

---

## 4. Mapeo de respuesta de imágenes

Función para aplanar la relación de imágenes a un arreglo de URLs simples en la respuesta del Backend:

```javascript
return devices.map(({ images, ...product }) => ({
  ...product,
  images: images?.map((img) => img.url) ?? [],
}));
```

---

## 5. Diccionario de atributos: DEVICE

| Atributo              | Tipo      | Significado                                              |
| --------------------- | --------- | -------------------------------------------------------- |
| `id`                  | UUID (PK) | Identificador único del device.                          |
| `modelName`           | TEXT (UK) | Nombre del modelo.                                       |
| `sku`                 | TEXT (UK) | Código único de inventario del device.                   |
| `brand`               | TEXT      | Marca del device, por ejemplo `Apple` o `Samsung`.       |
| `price`               | FLOAT     | Precio actual del catálogo.                              |
| `isActive`            | BOOLEAN   | Indica si el device aparece en el catálogo.              |
| `technicalDetails`    | TEXT      | Detalles técnicos opcionales.                            |
| `modelSlug`           | TEXT (UK) | Nombre usado en URLs.                                    |
| `unitsInStock`        | INT       | Cantidad disponible.                                     |
| `availableColor`      | TEXT[]    | Colores disponibles.                                     |
| `targetMarket`        | TEXT      | Segmento: `budget`, `mid-range`, `premium` o `flagship`. |
| `accessoriesIncluded` | TEXT[]    | Accesorios incluidos.                                    |
| `userId`              | UUID (FK) | Usuario que creó o actualizó el device.                  |
| `categoryId`          | UUID (FK) | Categoría del device.                                    |

## 6. Diccionario de atributos: USER

| Atributo   | Tipo      | Significado                                   |
| ---------- | --------- | --------------------------------------------- |
| `id`       | UUID (PK) | Identificador único del usuario.              |
| `email`    | TEXT (UK) | Correo único, guardado en minúsculas.         |
| `password` | TEXT      | Contraseña almacenada de forma no retornable. |
| `fullName` | TEXT      | Nombre completo del usuario.                  |
| `isActive` | BOOLEAN   | Indica si la cuenta está activa.              |
| `roles`    | TEXT[]    | Roles asignados; por defecto contiene `user`. |

## 7. Diccionario de atributos: DEVICEIMAGE

| Atributo   | Tipo      | Significado                                       |
| ---------- | --------- | ------------------------------------------------- |
| `id`       | INT (PK)  | Identificador único de la imagen.                 |
| `url`      | TEXT      | URL pública de la imagen.                         |
| `publicId` | TEXT      | Identificador opcional del archivo en Cloudinary. |
| `deviceId` | UUID (FK) | Device al que pertenece la imagen.                |

## 8. Diccionario de atributos: ORDER

| Atributo          | Tipo          | Significado                                                          |
| ----------------- | ------------- | -------------------------------------------------------------------- |
| `id`              | UUID (PK)     | Identificador único de la orden.                                     |
| `createdAt`       | DATETIME      | Fecha y hora de creación.                                            |
| `totalAmount`     | DECIMAL(10,2) | Suma de los subtotales de la orden.                                  |
| `currency`        | CHAR(3)       | Moneda ISO 4217, por ejemplo `USD` o `COP`.                          |
| `status`          | ENUM          | Estado actual: `PENDING_PAYMENT`, `PAID`, `CANCELLED` o `FULFILLED`. |
| `shippingAddress` | TEXT          | Dirección de entrega.                                                |
| `userId`          | UUID (FK)     | Usuario dueño de la orden.                                           |

## 9. Diccionario de atributos: ORDERITEM

| Atributo        | Tipo          | Significado                               |
| --------------- | ------------- | ----------------------------------------- |
| `id`            | UUID (PK)     | Identificador único de la línea.          |
| `quantity`      | INT           | Cantidad del device comprado.             |
| `unitPrice`     | DECIMAL(10,2) | Precio histórico del device en la compra. |
| `selectedColor` | TEXT          | Color elegido por el cliente.             |
| `orderId`       | UUID (FK)     | Orden a la que pertenece la línea.        |
| `deviceId`      | UUID (FK)     | Device comprado.                          |

## 10. Diccionario de atributos: PAYMENT

| Atributo                | Tipo          | Significado                                                          |
| ----------------------- | ------------- | -------------------------------------------------------------------- |
| `id`                    | UUID (PK)     | Identificador único del pago.                                        |
| `amount`                | DECIMAL(10,2) | Monto de este pago.                                                  |
| `currency`              | CHAR(3)       | Moneda ISO 4217 del cobro.                                           |
| `status`                | ENUM          | Estado: `PENDING`, `SUCCEEDED`, `FAILED`, `CANCELED` o `REFUNDED`.   |
| `stripeSessionId`       | TEXT (UK)     | ID único de la sesión de Checkout de Stripe.                         |
| `stripePaymentIntentId` | TEXT (UK)     | ID único del `PaymentIntent` de Stripe.                              |
| `failureCode`           | TEXT          | Código de error de Stripe; queda vacío cuando no hay fallo.          |
| `failureMessage`        | TEXT          | Mensaje legible del fallo; queda vacío cuando no hay fallo.          |
| `createdAt`             | DATETIME      | Fecha y hora de creación del registro del pago.                      |
| `paidAt`                | DATETIME      | Fecha y hora de confirmación; queda vacío si el pago no fue exitoso. |
| `orderId`               | UUID (FK)     | Orden a la que pertenece el pago.                                    |

---

## 11. Diccionario de atributos: CATEGORY

| Atributo    | Tipo      | Significado                                            |
| ----------- | --------- | ------------------------------------------------------ |
| `id`        | UUID (PK) | Identificador único de la categoría.                   |
| `name`      | TEXT (UK) | Nombre único de la categoría. Se guarda en minúsculas. |
| `createdAt` | DATETIME  | Fecha de creación.                                     |
| `updateAt`  | DATETIME  | Fecha de la última actualización.                      |

## 12. Flujo de carga de imágenes

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant FE as Frontend (React)
    participant ST as Storage (Cloudinary/S3)
    participant BE as API Backend (BD)

    %% Paso 1: Subida de la imagen
    Note over U,ST: PASO 1: Subida del archivo
    U->>FE: Selecciona "foto.jpg" en el input
    FE->>ST: POST /upload (envía archivo binario)
    ST-->>FE: 200 OK { url: "https://cloud.com/foto.jpg" }

    Note over FE: Muestra preview en pantalla<br/>Guarda URL en el estado (useState)

    %% Paso 2: Creación del recurso
    Note over U,BE: PASO 2: Creación de la entidad
    U->>FE: Completa precio/nombre y da clic en "Guardar"
    FE->>BE: POST /api/devices (JSON con datos del modelo y URLs de imágenes)
    BE->>BE: Valida DTO y guarda en Base de Datos
    BE-->>FE: 201 Created { id: "uuid", modelName: "Phone", ... }
    FE-->>U: Muestra mensaje de éxito y redirige
```

## 13. Estados permitidos

| Entity           | Values                                                   |
| ---------------- | -------------------------------------------------------- |
| `Order.status`   | `PENDING_PAYMENT`, `PAID`, `CANCELLED`, `FULFILLED`      |
| `Payment.status` | `PENDING`, `SUCCEEDED`, `FAILED`, `CANCELED`, `REFUNDED` |

Los estados deben coincidir con los valores enum usados por TypeORM. No uses `CONFIRMED`, `PROCESSING`, `SHIPPED` o `DELIVERED` hasta agregarlos a la entidad.

## 14. DTOs y validación

Los DTOs validan los datos antes de guardarlos en la base de datos. Validan UUIDs, números positivos, fechas, códigos de moneda, estados y items anidados.

Cuando una orden contiene varios devices, `CreateOrderWithDevidesDto` recibe un arreglo `orderItems`. Cada item contiene `deviceId`, `quantity` y `selectedColor`. El backend crea primero la orden, después crea una fila `OrderItem` por device y asigna el `unitPrice` histórico.

## 15. Pasarela de pago

```mermaid
flowchart LR
    U[Usuario] -->|Crea orden| O[Order]
    O -->|Contiene| OI[Order Items]
    U -->|Solicita checkout| P[Payment Service]

    subgraph CHECKOUT[Preparacion del checkout]
        O -->|Orden PENDING_PAYMENT| P
        P -->|Crea pago pendiente| PAY[Payment PENDING]
    end

    PAY -->|paymentId y orderId| S[Stripe Checkout]
    S --> STRIPE[Stripe]
    STRIPE -->|Webhook| P

    subgraph RESULTADO[Resultado del pago]
        P -->|Exito| SUCCESS[Payment SUCCEEDED]
        SUCCESS -->|Actualiza| PAID[Order PAID]
        P -->|Fallo| FAILED[Payment FAILED]
        FAILED -->|Conserva estado| WAIT[Order PENDING_PAYMENT]
    end

    PAID -->|Obtiene usuario| USER[User]
    USER -->|Envia email| R[Resend]
    R -->|Confirmacion| U

```
