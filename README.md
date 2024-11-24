# Role-Based Access Control (RBAC) UI

## Project Overview

This project is a **Role-Based Access Control (RBAC) UI** that allows administrators to manage user roles and permissions efficiently within a web application. It is built using **React**, with state management for handling authentication, roles, and permissions. The app uses **JWT authentication** for securing the admin login and role management functionality. The user interface is developed using **Tailwind CSS**, providing a responsive, modern, and accessible design.

### The Core Concept

Role-Based Access Control (RBAC) is a widely used approach for managing and restricting access to system resources based on users' roles. In this application, administrators can:
- View, add, edit, and delete user roles.
- Assign and manage permissions for each role.
- Control access to various system resources by associating permissions with roles.

The goal of this project is to build a UI that mimics a real-world role and permission management system, with easy-to-use features and a modern interface.

## Features

### 1. **Admin Login**

The application provides a simple login page for the administrator to access the system. It uses **JWT (JSON Web Token)** for user authentication. After a successful login, the admin is redirected to the admin dashboard to manage roles and permissions.

#### Admin Credentials:
- **Email**: `admin123@gmail.com`
- **Password**: `admin123`

### 2. **Role Management**

The main feature of the application is managing user roles. An admin can:
- **View roles**: See all available roles with details such as role name, description, and the number of users assigned to each role.
- **Create new roles**: Add new roles to the system using a modal form, including specifying the role’s name, description, and default permissions.
- **Edit existing roles**: Modify the details of an existing role.
- **Delete roles**: Remove roles from the system if no longer needed.

### 3. **Permission Management**

Roles can have multiple permissions associated with them. Permissions define the specific actions users with that role can perform. For example, a user with an "Admin" role might have permission to create, edit, and delete user accounts.

- **Assign Permissions**: The admin can assign specific permissions to roles, such as "Read", "Write", or "Delete", for various system functions.
- **Permissions Categories**: Permissions are categorized into different groups, e.g., "User Management", "Role Management", "Content Management", etc.

### 4. **Search and Filter**

The application allows the admin to search and filter roles by:
- **Role Name**
- **Role Description**
- **Permissions**

Filtering and sorting help the admin find roles quickly in a large system.

### 5. **Interactive Modal Forms**

For adding or editing roles, the application uses **modals** to provide a user-friendly interface for role and permission management. The modals include:
- Fields for entering role details (name, description).
- Checkboxes for assigning permissions to the role.
- Validation messages to ensure correct input (e.g., role name cannot be empty).

### 6. **Dynamic Role Permissions**

Permissions are not static. Admins can dynamically toggle permissions on or off for each role, allowing them to customize the level of access each role has in the system. For example, a "Manager" role may only have access to "View" permissions, while an "Admin" role has access to "Create", "Edit", and "Delete" permissions.

### 7. **Responsive and User-Friendly UI**

- **Tailwind CSS**: The design of the application is powered by Tailwind CSS, ensuring the app is responsive across devices and displays a clean, modern aesthetic.
- **Dark Mode / Light Mode**: The UI automatically adapts to the user’s system preference (light or dark mode).
- **Smooth Transitions**: The use of **Framer Motion** enables smooth animations when elements are added, removed, or changed, providing a polished user experience.

### 8. **Authentication and Authorization**

The login page upon successful authentication, the user receives a **JWT token** for subsequent API requests. This token ensures the admin is authorized to access the admin dashboard.

### 9. **Mock Backend**

While the front-end is fully functional, the backend is mocked. The roles and permissions are managed locally in the application’s state rather than a live database. This mock API mimics real-world API interactions and can be replaced with a real backend later.

### 10. **Error Handling and Validation**

- **Validation**: Role names and descriptions are validated before submission to ensure they meet the required format.
- **Error Handling**: Basic error handling is implemented to show messages for failed requests or invalid operations.

---
