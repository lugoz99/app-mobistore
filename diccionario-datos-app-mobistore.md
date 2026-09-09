# Documentación del Proyecto y Arquitectura de Datos

## 1. Modelo Entidad-Relación (ERD)

```mermaid
erDiagram
    USER {
        UUID id PK
        TEXT email UK
        TEXT password
        TEXT fullName
        BOOLEAN isActive
        string_array roles
    }

    DEVICE {
        UUID id PK
        TEXT modelName UK
        FLOAT price
        TEXT technicalDetails
        TEXT modelSlug UK
        INT unitsInStock
        string_array availableColor
        TEXT targetMarket
        string_array accessoriesIncluded
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
        DATETIME orderDate
        DECIMAL totalAmount
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
        TEXT paymentMethod
        DATETIME paymentDate
        DECIMAL amount
        TEXT status
        TEXT stripePaymentIntentId
        TEXT stripeChargeId
        TEXT currency
        INT attemptNumber
        TEXT failureCode
        TEXT failureMessage
        DATETIME createdAt
        UUID orderId FK
    }

    CATEGORY {
        UUID id PK
        TEXT name UK
        TEXT description
        DATETIME createdAt
        DATETIME updatedAt
    }

    %% Relaciones con cardinalidades numéricas
    USER ||--o{ DEVICE : "1 a 0..N"
    USER ||--o{ ORDER : "1 a 0..N"
    DEVICE ||--o{ DEVICEIMAGE : "1 a 0..N"
    ORDER ||--|{ ORDERITEM : "1 a 1..N"
    DEVICE ||--o{ ORDERITEM : "1 a 0..N"
    ORDER ||--o{ PAYMENT : "1 a 0..N (múltiples intentos, fallos y reembolsos)"
    CATEGORY ||--o{ DEVICE : "1 a 0..N"
```

---

## 2. Definición del Campo `targetMarket`

Define el segmento comercial o gama del dispositivo:

- **`budget` (Gama de entrada / Económico):** Productos accesibles, de bajo costo, enfocados en funciones básicas.
- **`mid-range` (Gama media):** Balance entre costo y rendimiento; buena calidad a precio moderado.
- **`premium` (Gama alta):** Productos de costo elevado, mejores materiales y características superiores.
- **`flagship` (Gama insignia / Top de línea):** El producto estrella de la marca; tecnología más avanzada de la categoría (ejemplo: Samsung Ultra, iPhone Pro Max).

---

## 3. Mapeo de Respuesta (Transformación de Imágenes)

Función para aplanar la relación de imágenes a un arreglo de URLs simples en la respuesta del Backend:

```javascript
return devices.map(({ images, ...product }) => ({
  ...product,
  images: images?.map((img) => img.url) ?? [],
}));
```

---

## 4. Diccionario de Atributos: PAYMENT

| Atributo                | Tipo      | Significado                                                                                                                                                               |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                    | UUID (PK) | Identificador único de esta fila/intento de pago en tu base de datos.                                                                                                     |
| `paymentMethod`         | TEXT      | Método usado para pagar (ej. `card`, `oxxo`, `transfer`, según lo que soporte Stripe en tu integración).                                                                  |
| `paymentDate`           | DATETIME  | Fecha y hora en que el pago se confirmó como exitoso. Queda vacío/null si el intento falló.                                                                               |
| `amount`                | DECIMAL   | Monto cobrado (o a cobrar) en este intento específico.                                                                                                                    |
| `status`                | TEXT      | Estado del intento: `pending`, `succeeded`, `failed`, `refunded`.                                                                                                         |
| `stripePaymentIntentId` | TEXT      | ID del `PaymentIntent` de Stripe (`pi_...`). Agrupa el proceso de cobro de una orden; puede repetirse en varias filas si reintentas confirmaciones sobre el mismo intent. |
| `stripeChargeId`        | TEXT      | ID del `Charge` de Stripe (`ch_...`). Es único por cada intento real de cobro, incluso si el `PaymentIntent` es el mismo.                                                 |
| `currency`              | TEXT      | Moneda del cobro (ej. `COP`, `USD`), en formato ISO 4217.                                                                                                                 |
| `attemptNumber`         | INT       | Número de intento para esa orden (1, 2, 3...), útil para mostrar historial sin contar filas.                                                                              |
| `failureCode`           | TEXT      | Código de error que devuelve Stripe cuando el pago falla (ej. `card_declined`, `insufficient_funds`, `expired_card`). Null si el pago fue exitoso.                        |
| `failureMessage`        | TEXT      | Mensaje legible para humanos que explica por qué falló el pago. Null si fue exitoso.                                                                                      |
| `createdAt`             | DATETIME  | Fecha y hora en que se creó el registro del intento, sin importar si tuvo éxito o no.                                                                                     |
| `orderId`               | UUID (FK) | Referencia a la orden a la que pertenece este intento de pago.                                                                                                            |

---

## 5. Diagrama de Secuencia: Carga Desacoplada de Archivos

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
    FE->>BE: POST /api/productos (JSON con nombre, precio e imagen_url)
    BE->>BE: Valida DTO y guarda en Base de Datos
    BE-->>FE: 201 Created { id: 1, nombre: "Camisa", ... }
    FE-->>U: Muestra mensaje de éxito y redirige
```
