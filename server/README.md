## Hanok Backend (Spring Boot)

Run locally (no Maven install required; uses Maven Wrapper):

```bash
# Windows (from server folder)
mvnw.cmd spring-boot:run

# Or if you have Maven on PATH:
mvn spring-boot:run
```

The app uses H2 (file) by default and exposes:

- GET `/api/categories`
- GET `/api/menu-items?categoryId=...`
- GET `/api/platters`

### Using MySQL (e.g. MySQL Workbench)

1. **Create the database in MySQL Workbench**
   - Open MySQL Workbench and connect to your local MySQL server (e.g. `localhost:3306`).
   - Run: `CREATE DATABASE IF NOT EXISTS hanok;`
   - (Optional) Create a user: `CREATE USER 'hanok'@'localhost' IDENTIFIED BY 'yourpassword'; GRANT ALL ON hanok.* TO 'hanok'@'localhost';`

2. **Configure credentials**  
   Edit `src/main/resources/application-mysql.properties`: set `spring.datasource.username` and `spring.datasource.password` to your MySQL user (e.g. `root`/your password, or `hanok`/yourpassword).

3. **Run the server with MySQL**
   ```bash
   mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
   JPA will create/update tables `categories`, `menu_items`, and `platters` in the `hanok` database.

4. **Use the menu**
   - Open your menu page (e.g. `menu.html` via your static server or open the file). The page calls `http://localhost:8080/api/categories`, `/api/platters`, and `/api/menu-items` — the same data you see in MySQL Workbench.

OpenAPI docs: visit `/swagger-ui/index.html` when running.


