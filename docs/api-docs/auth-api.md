# GunKustom API Documentation

This document provides an overview of the available API endpoints for the **GunKustom** application, including their purpose, request parameters, and responses.

---

## General Information

- **API Version:** 1.0
- **Authentication:** Bearer Token (JWT)
- **Base URL:** `/`

---

## Table of Contents

- [Authentication](#authentication)
  - [Sign Up](#sign-up)
  - [Log In](#log-in)
  - [Google OAuth](#google-oauth)
- [Users](#users)
  - [Get User by ID](#get-user-by-id)
  - [Update User](#update-user)
  - [Delete User](#delete-user)
  - [Add Build to User](#add-build-to-user)
  - [Remove Build from User](#remove-build-from-user)
- [User Builds](#user-builds)
  - [Create Build](#create-build)
  - [Get All Builds for a User](#get-all-builds-for-a-user)
  - [Get Build by ID](#get-build-by-id)
  - [Update Build](#update-build)
  - [Delete Build](#delete-build)
- [Vendor API](#vendor-api)
  - [Get Vendor Parts](#get-vendor-parts)
- [Profile](#profile)
  - [Update Profile](#update-profile)
  - [Get Profile](#get-profile)

---

## Authentication

### **Sign Up**

- **Endpoint:** `POST /auth/signup`
- **Description:** Register a new user and receive a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "username": "user123"
  }
  ```
- **Responses:**
  - `201`: User successfully signed up.
  - `400`: Signup failed.

---

### **Log In**

- **Endpoint:** `POST /auth/login`
- **Description:** Log in a user and receive a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `200`: User successfully logged in.
  - `401`: Invalid credentials.

---

### **Google OAuth**

- **Endpoint:** `GET /auth/google`
- **Description:** Redirect to Google OAuth for authentication.
- **Endpoint:** `GET /auth/google/callback`
- **Description:** Handle Google OAuth callback and return a token.

---

## Users

### **Get User by ID**

- **Endpoint:** `GET /users/{id}`
- **Description:** Retrieve a user by ID and include their associated builds.
- **Path Parameters:**
  - `id` (string): The ID of the user.
- **Responses:**
  - `200`: User and their builds.
  - `404`: User not found.

---

### **Update User**

- **Endpoint:** `PATCH /users/{id}`
- **Description:** Update fields for an existing user.
- **Path Parameters:**
  - `id` (string): The ID of the user.
- **Request Body:**
  ```json
  {
    "email": "new-email@example.com"
  }
  ```
- **Responses:**
  - `200`: User successfully updated.
  - `404`: User not found.
  - `400`: Invalid data.

---

### **Delete User**

- **Endpoint:** `DELETE /users/{id}`
- **Description:** Delete a user by ID.
- **Path Parameters:**
  - `id` (string): The ID of the user.
- **Responses:**
  - `200`: User successfully deleted.
  - `404`: User not found.

---

### **Add Build to User**

- **Endpoint:** `POST /users/{id}/builds/{buildId}`
- **Description:** Associate a build with a user.
- **Path Parameters:**
  - `id` (string): The ID of the user.
  - `buildId` (string): The ID of the build to associate.
- **Responses:**
  - `200`: Build successfully added.
  - `404`: User not found.

---

### **Remove Build from User**

- **Endpoint:** `DELETE /users/{id}/builds/{buildId}`
- **Description:** Remove a build association from a user.
- **Path Parameters:**
  - `id` (string): The ID of the user.
  - `buildId` (string): The ID of the build to remove.
- **Responses:**
  - `200`: Build successfully removed.
  - `404`: User not found.

---

## User Builds

### **Create Build**

- **Endpoint:** `POST /user-builds`
- **Description:** Create a new build for a user.
- **Request Body:**
  ```json
  {
    "userId": "user123",
    "buildName": "My Custom Build",
    "parts": ["part1", "part2"]
  }
  ```
- **Responses:**
  - `201`: Build created successfully.
  - `400`: Invalid input.

---

### **Get All Builds for a User**

- **Endpoint:** `GET /user-builds`
- **Description:** Retrieve all builds for a specific user.
- **Query Parameters:**
  - `userId` (string): The ID of the user.
- **Responses:**
  - `200`: List of builds.
  - `404`: User not found.

---

### **Get Build by ID**

- **Endpoint:** `GET /user-builds/{id}`
- **Description:** Retrieve details of a specific build.
- **Path Parameters:**
  - `id` (string): The ID of the build.
- **Query Parameters:**
  - `userId` (string): The ID of the user.
- **Responses:**
  - `200`: Build details.
  - `404`: Build not found.

---

### **Update Build**

- **Endpoint:** `PUT /user-builds/{id}`
- **Description:** Update an existing build by ID.
- **Path Parameters:**
  - `id` (string): The ID of the build.
- **Query Parameters:**
  - `userId` (string): The ID of the user.
- **Request Body:**
  ```json
  {
    "buildName": "Updated Build",
    "parts": ["updatedPart1", "updatedPart2"]
  }
  ```
- **Responses:**
  - `200`: Build updated successfully.
  - `404`: Build not found.

---

### **Delete Build**

- **Endpoint:** `DELETE /user-builds/{id}`
- **Description:** Delete a build by ID.
- **Path Parameters:**
  - `id` (string): The ID of the build.
- **Query Parameters:**
  - `userId` (string): The ID of the user.
- **Responses:**
  - `200`: Build deleted successfully.
  - `404`: Build not found.

---

## Vendor API

### **Get Vendor Parts**

- **Endpoint:** `GET /redoptec`
- **Description:** Retrieve all vendor parts.
- **Responses:**
  - `200`: List of vendor parts.
  - `404`: No parts found.
  - `500`: Failed to fetch parts.

---

## Profile

### **Update Profile**

- **Endpoint:** `PATCH /profile/{id}`
- **Description:** Update the profile of a user.
- **Path Parameters:**
  - `id` (string): The ID of the user.
- **Request Body:**
  ```json
  {
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+1234567890"
  }
  ```
- **Responses:**
  - `200`: Profile updated successfully.
  - `404`: User not found.

---

### **Get Profile**

- **Endpoint:** `GET /profile/{id}`
- **Description:** Retrieve the profile of a user.
- **Path Parameters:**
  - `id` (string): The ID of the user.
- **Responses:**
  - `200`: Profile retrieved successfully.
  - `404`: User not found.

---
