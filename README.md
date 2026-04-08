# 🧪 Experiment 7: Role-Based Authorization (RBAC) using Spring Boot

---

## 🚨 Important Instructions

* **Deadline:** 07 April 2026 (Evening)
* Submit your project details via Google Form

---

## 📌 Assessment Topic

Implement **Role-Based Access Control (RBAC)** in a Spring Boot backend using **Spring Security**.

---

## 🎯 Objective

This project demonstrates:

* Authentication using username & password
* Authorization using roles (**ADMIN, USER**)
* Securing APIs based on roles
* Testing secured endpoints using Postman
* Understanding **401 Unauthorized vs 403 Forbidden**

---

## 🧩 Features Implemented

### 🔐 Authentication

* User login using Spring Security
* Users stored with roles:

  * `ROLE_USER`
  * `ROLE_ADMIN`

### 🛡️ Authorization

* Role-based access control for endpoints:

| Endpoint         | Access      |
| ---------------- | ----------- |
| `/api/public/**` | Public      |
| `/api/user/**`   | USER, ADMIN |
| `/api/admin/**`  | ADMIN only  |

### ⚠️ Access Control Rules

* ❌ No authentication → **401 Unauthorized**
* ❌ Invalid role → **403 Forbidden**
* ✅ Valid access → **200 OK**

---

## 🏗️ Project Structure

```
src/
├── main/
│   ├── java/com/example/experiment7/
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   ├── AdminController.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   └── LoginResponse.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   └── Role.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   ├── service/
│   │   │   ├── CustomUserDetailsService.java
│   │   │   └── AuthService.java
│   │   └── Experiment7Application.java
│   └── resources/
│       ├── application.properties
│       └── data.sql
└── pom.xml
```

---

## 🗄️ Database / User Setup

### Example Users

| Username | Password | Role  |
| -------- | -------- | ----- |
| user1    | user123  | USER  |
| admin1   | admin123 | ADMIN |

> Passwords are encoded using BCrypt.

---

## 🔧 Technologies Used

* Spring Boot
* Spring Security
* Spring Data JPA
* H2 / MySQL Database
* Maven

---

## 🔐 Security Configuration

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/public/**").permitAll()
            .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .httpBasic(Customizer.withDefaults());

    return http.build();
}
```

---

## 🌐 API Endpoints

### 1️⃣ Public Endpoint

```
GET /api/public/hello
```

Response:

```json
{
  "message": "This is a public endpoint"
}
```

---

### 2️⃣ User Endpoint

```
GET /api/user/profile
```

Access:

* USER
* ADMIN

Response:

```json
{
  "message": "Welcome, authenticated user"
}
```

---

### 3️⃣ Admin Endpoint

```
GET /api/admin/dashboard
```

Access:

* ADMIN only

Response:

```json
{
  "message": "Welcome, admin"
}
```

---

## 🧪 Postman Testing

### ✅ Case 1: Public Access

* No authentication required
* Expected: **200 OK**

### ✅ Case 2: USER Access

* Login as `user1`
* `/api/user/profile` → **200 OK**

### ❌ Case 3: USER → Admin Endpoint

* `/api/admin/dashboard`
* Expected: **403 Forbidden**

### ✅ Case 4: ADMIN Access

* Login as `admin1`
* `/api/admin/dashboard` → **200 OK**

### ❌ Case 5: No Authentication

* `/api/user/profile`
* Expected: **401 Unauthorized**

---

## 📸 Screenshots

Add screenshots in `screenshots/` folder:

```
screenshots/
├── 01-login-success.png
├── 02-user-endpoint-success.png
├── 03-admin-endpoint-success.png
├── 04-access-denied.png
```

### Required Screenshots:

* Login success
* User endpoint success
* Admin endpoint success
* Access denied (403)

### Recommended:

* Invalid login
* 401 Unauthorized
* Project structure

---

## 🛠️ Implementation Steps

1. Create **User Entity**
2. Create **UserRepository**
3. Implement **UserDetailsService**
4. Configure **Password Encoder (BCrypt)**
5. Configure **Spring Security**
6. Create Controllers:

   * PublicController
   * UserController
   * AdminController
7. Test APIs using Postman

---

## ✅ Conclusion

This project successfully demonstrates:

* Secure authentication using Spring Security
* Role-based authorization (RBAC)
* API protection based on roles
* Proper handling of 401 and 403 responses

---

## 🚀 How to Run

```bash
mvn spring-boot:run
```

Then open:

```
http://localhost:8080/api/public/hello
```

---

## 👨‍💻 Author

**Raj Kumar**

---
