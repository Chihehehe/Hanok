## Hanok Backend (Spring Boot)

Run locally:

```bash
mvn spring-boot:run
```

The app uses H2 (file) by default and exposes:

- GET `/api/categories`
- GET `/api/menu-items?categoryId=...`
- GET `/api/platters`

Switch to MySQL/Postgres by updating `src/main/resources/application.properties` (see commented examples) and adding the JDBC driver dependency.

OpenAPI docs: visit `/swagger-ui/index.html` when running.


