interface SeedDevice {
    modelName: string;
    price: number;
    technicalDetails: string;
    modelSlug: string;
    unitsInStock: number;
    availableColor: string[];
    targetMarket: 'premium' | 'budget' | 'mid-range' | 'flagship';
    accessoriesIncluded: string[];
    images: string[];
}

interface SeedData {
    devices: SeedDevice[];
}

export const initialData: SeedData = {
    devices: [
        {
            modelName: "Samsung Galaxy S24 Ultra",
            price: 1299.99,
            technicalDetails: "12GB RAM, 256GB almacenamiento, Snapdragon 8 Gen 3, cámara principal 200MP, batería 5000mAh, pantalla 6.8'' AMOLED",
            modelSlug: "samsung_galaxy_s24_ultra",
            unitsInStock: 15,
            availableColor: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
            targetMarket: "flagship",
            accessoriesIncluded: ["cargador", "cable USB-C", "S Pen"],
            images: [
                's24_ultra_front_2000.jpg',
                's24_ultra_back.jpg',
            ],
        },
        {
            modelName: "iPhone 16 Pro Max",
            price: 1449.00,
            technicalDetails: "8GB RAM, 512GB almacenamiento, chip A18 Pro, cámara triple 48MP, batería 4685mAh, pantalla 6.9'' Super Retina XDR",
            modelSlug: "iphone_16_pro_max",
            unitsInStock: 8,
            availableColor: ["Desert Titanium", "Natural Titanium", "Black Titanium"],
            targetMarket: "flagship",
            accessoriesIncluded: ["cable USB-C a USB-C", "documentación", "herramienta para SIM"],
            images: [
                'iphone16_pm_front_2000.jpg',
                'iphone16_pm_back.jpg',
            ],
        },
        {
            modelName: "Xiaomi Redmi Note 13",
            price: 249.99,
            technicalDetails: "8GB RAM, 128GB almacenamiento, MediaTek Helio G99-Ultra, cámara principal 108MP, batería 5000mAh, carga rápida 33W",
            modelSlug: "xiaomi_redmi_note_13",
            unitsInStock: 40,
            availableColor: ["Midnight Black", "Ocean Teal", "Ice Blue"],
            targetMarket: "mid-range",
            accessoriesIncluded: ["cargador 33W", "cable USB-C", "case de silicona"],
            images: [
                'redmi_note13_front_2000.jpg',
                'redmi_note13_back.jpg',
            ],
        },
        {
            modelName: "Google Pixel 9",
            price: 799.00,
            technicalDetails: "12GB RAM, 128GB almacenamiento, chip Google Tensor G4, cámara principal 50MP, batería 4700mAh, pantalla 6.3'' OLED",
            modelSlug: "google_pixel_9",
            unitsInStock: 20,
            availableColor: ["Obsidian", "Porcelain", "Wintergreen"],
            targetMarket: "premium",
            accessoriesIncluded: ["cable USB-C", "adaptador de datos", "documentación"],
            images: [
                'pixel9_front_2000.jpg',
                'pixel9_back.jpg',
            ],
        },
        {
            modelName: "Motorola Moto G54",
            price: 179.99,
            technicalDetails: "8GB RAM, 256GB almacenamiento, Snapdragon 6s Gen 3, cámara principal 50MP, batería 5000mAh, pantalla 6.5'' IPS",
            modelSlug: "motorola_moto_g54",
            unitsInStock: 60,
            availableColor: ["Midnight Blue", "Mint Green"],
            targetMarket: "budget",
            accessoriesIncluded: ["cargador", "cable USB-C", "case transparente"],
            images: [
                'moto_g54_front_2000.jpg',
                'moto_g54_back.jpg',
            ],
        },
        {
            modelName: "OnePlus 12",
            price: 899.00,
            technicalDetails: "16GB RAM, 256GB almacenamiento, Snapdragon 8 Gen 3, cámara principal 50MP Hasselblad, batería 5400mAh, carga 100W",
            modelSlug: "oneplus_12",
            unitsInStock: 12,
            availableColor: ["Flowy Emerald", "Silky Black"],
            targetMarket: "flagship",
            accessoriesIncluded: ["cargador 100W", "cable USB-C", "case de protección"],
            images: [
                'oneplus12_front_2000.jpg',
                'oneplus12_back.jpg',
            ],
        },
        {
            modelName: "Samsung Galaxy A55",
            price: 429.99,
            technicalDetails: "8GB RAM, 128GB almacenamiento, Exynos 1480, cámara principal 50MP OIS, batería 5000mAh, pantalla 6.6'' Super AMOLED",
            modelSlug: "samsung_galaxy_a55",
            unitsInStock: 35,
            availableColor: ["Awesome Iceblue", "Awesome Navy", "Awesome Lilac"],
            targetMarket: "mid-range",
            accessoriesIncluded: ["cable USB-C", "documentación"],
            images: [
                'galaxy_a55_front_2000.jpg',
                'galaxy_a55_back.jpg',
            ],
        },
        {
            modelName: "iPhone SE (2024)",
            price: 429.00,
            technicalDetails: "4GB RAM, 64GB almacenamiento, chip A15 Bionic, cámara principal 12MP, batería 2018mAh, pantalla 4.7'' Retina HD",
            modelSlug: "iphone_se_2024",
            unitsInStock: 25,
            availableColor: ["Midnight", "Starlight", "Red"],
            targetMarket: "budget",
            accessoriesIncluded: ["cable USB-C a Lightning", "documentación"],
            images: [
                'iphone_se_front_2000.jpg',
                'iphone_se_back.jpg',
            ],
        },
        {
            modelName: "Huawei Nova 12",
            price: 349.99,
            technicalDetails: "8GB RAM, 256GB almacenamiento, Snapdragon 778G, cámara principal 50MP, batería 4600mAh, carga rápida 66W",
            modelSlug: "huawei_nova_12",
            unitsInStock: 18,
            availableColor: ["Starry Silver", "Emerald Green"],
            targetMarket: "mid-range",
            accessoriesIncluded: ["cargador 66W", "cable USB-C", "case de silicona"],
            images: [
                'nova12_front_2000.jpg',
                'nova12_back.jpg',
            ],
        },
        {
            modelName: "ASUS ROG Phone 8",
            price: 999.00,
            technicalDetails: "16GB RAM, 512GB almacenamiento, Snapdragon 8 Gen 3, cámara principal 50MP, batería 5500mAh, pantalla 6.78'' AMOLED 165Hz",
            modelSlug: "asus_rog_phone_8",
            unitsInStock: 6,
            availableColor: ["Phantom Black", "Storm White"],
            targetMarket: "flagship",
            accessoriesIncluded: ["cargador 65W", "cable USB-C", "case gaming", "AeroActive Cooler"],
            images: [
                'rog_phone8_front_2000.jpg',
                'rog_phone8_back.jpg',
            ],
        },
    ],
};