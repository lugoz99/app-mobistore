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
   ```

   and configure or add global pipes configuration in the main.ts
Testing YOLO badge
