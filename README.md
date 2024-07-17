# Assignment 3 - Car Wash Booking System Backend Application

# Description

The Car Wash Booking System is a web application that allows users to book car wash services conveniently.

## Features

- **User Authentication:** Users can sign up, log in, and see their Bookings.
- **Booking Management:** Customers can select a preferred date and time slot for their car wash Booking.
- **Service and Slot Management:** Admin can create different Car wash services and set time slots for those services. Admin can manage Bookings, update availability.
- **Error Handling:** Proper error messages are displayed for invalid inputs or failed operations.

## Technology Stack

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Database:** MongoDB (using Mongoose for ODM)
- **Authentication:** JSON Web Tokens (JWT)
- **Error Handling:** Custom middleware
- **Deployment:** Deployed on Vercel

## Installation and Setup

1. Clone the repository:

```
https://github.com/tonoy3125/Car-Wash-Booking-System.git
```

2. Install dependencies:

```
cd car-wash-booking-system
npm install
```

3. Set up environment variables:
   Create a `.env` file with the following variables:

```
PORT=5000
DB_URI=Your Mongodb connnection Uri
BCRYPT_SALT_ROUNDS= any number
JWT_ACCESS_SECRET= Your JWT Secret
JWT_ACCESS_EXPIRES= Your Jwt Token Expire time

```

4. Start the server:

```
npm run start:dev
```

5. Access the application in your browser at `http://localhost:5000`

## API Documentation

- **Authentication Routes:**

  - `POST /api/auth/signup`: Register a new user.
  - `POST /api/auth/login`: Log in an existing user.

- **Service Routes:**

  - `POST /api/services`: Create a Service. (Only Accessible by Admin)
  - `GET /api/services/:id`: Get a Service.
  - `GET /api/services:` Get all Services.
  - `PUT /api/services/:id`: Update Services (Only Accessible by Admin)
  - `DELETE /api/services/:id`: Delete (Soft Delete) a Service (Only Accessible by Admin)

- **Slot Routes:**

  - `POST /api/services/slots`: Create Slot (Only Accessible by Admin).
  - `GET /api/slots/availability`: Get available slots.

- **Booking Routes:**

  - `POST /api/bookings`: Book a Service (Only Accessible by User).
  - `GET /api/bookings`: Get All Bookings (Only Accessible by Admin).
  - `GET /api/my-bookings`: Get User's Bookings (Only Accessible by User).
