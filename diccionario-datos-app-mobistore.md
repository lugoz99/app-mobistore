```mermaid
erDiagram
    USER {
        UUID id PK
        TEXT email UK
        TEXT password
        TEXT fullName
        BOOLEAN isActive
        TEXT_array roles
    }

    DEVICE {
        UUID id PK
        TEXT modelName UK
        FLOAT price
        TEXT technicalDetails
        TEXT modelSlug UK
        INT unitsInStock
        TEXT_array availableColor
        TEXT targetMarket
        TEXT_array accessoriesIncluded
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
        UUID userId FK
    }

    ORDERITEM {
        UUID id PK
        INT quantity
        DECIMAL unitPrice
        UUID orderId FK
        UUID deviceId FK
    }

    PAYMENT {
        UUID id PK
        TEXT paymentMethod
        DATETIME paymentDate
        DECIMAL amount
        TEXT status
        UUID orderId FK
    }

    CATEGORY {
        UUID id PK
        TEXT name UK
        TEXT description
        DATETIME createdAt
        DATETIME updatedAt
    }

    %% Relaciones con la sintaxis matemática real de erDiagram
    USER ||--o{ DEVICE : "1 a cero-o-muchos"
    USER ||--o{ ORDER : "1 a cero-o-muchos"
    DEVICE ||--o{ DEVICEIMAGE : "1 a cero-o-muchos"
    ORDER ||--|{ ORDERITEM : "1 a uno-o-muchos"
    DEVICE ||--o{ ORDERITEM : "1 a cero-o-muchos"
    ORDER ||--|| PAYMENT : "1 a 1"
    CATEGORY ||--o{ DEVICE : "1 a cero-o-muchos"
```


¿Qué significa cada valor en este contexto?

En el contexto de tu aplicación (como un e-commerce o catálogo de dispositivos), define la gama o segmento de mercado al que está destinado un producto:

    budget (Gama de entrada / Económico): Productos accesibles, de bajo costo, enfocados en funcionalidades básicas.

    mid-range (Gama media): Productos con balance entre costo y rendimiento; buena calidad a un precio moderado.

    premium (Gama alta): Productos de costo elevado, mejores materiales, mejores características y diseño superior.

    flagship (Gama insignia / Top de línea): El producto estrella de la marca; lo más avanzado en tecnología y el más costoso (ejemplo: Samsung Ultra, iPhone Pro Max).


    return devices.map(({ images, ...product }) => ({

...product,
images: images?.map((img) => img.url) ?? [],
}));
