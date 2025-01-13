# Assignment 3 - Car Wash Booking System Backend Application

# Description

The Car Wash Booking System is a web application that allows users to book car wash services conveniently.

## Features

- **User Authentication:** Users can sign up, log in, and manage their services. Each user can view their own bookings, including past and upcoming services, compare services, and update their profile.
- **Booking Management:** Customers can select a preferred date and time slot for their car wash Booking.
- **Service and Slot Management:** Admin can create different Car wash services and set time slots for those services. Admin can manage Bookings, update availability.
- **User Review:** Admin can create different Car wash services and set time slots for those services. Admin can manage Bookings, update availability.
- **Payment Integration:** Secure payment processing using AMARPAY.Customers can make payments for their bookings online.
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
NODE_ENV=development
PORT=5000
DB_URI=Your Mongodb connnection Uri
BCRYPT_SALT_ROUNDS= any number
JWT_ACCESS_SECRET= Your JWT Secret
JWT_ACCESS_EXPIRES_IN= Your Jwt Token Expire time
JWT_REFRESH_SECRET= Your JWT Secret
JWT_REFRESH_EXPIRES_IN= Your Jwt Token Expire time
RESET_PASS_UI_LINK= your password reset link
CLOUDINARY_CLOUD_NAME= your cloudinary cloud name
CLOUDINARY_API_KEY= your cloudinary secret api
CLOUDINARY_API_SECRET=your cloudinary secret key
EMAIL_USER= your email
EMAIL_PASS= your nodemailer pass
STRIPE_SECRET_KEY=your stripe secret key
STORE_ID = your store id
SIGNATURE_KEY = your signature key
PAYMENT_URL= payment url

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
  - `POST /api/auth/refresh-token`: Refresh the access token for an authenticated user.
  - `POST /api/auth/forget-password`: Request a password reset link for a user who forgot their password.
  - `POST /api/auth/reset-password`: Reset the password using a token provided from the password reset request.

- **User Routes:**

  - `GET /api/users`: Get All Users. (Only Accessible by Admin)
  - `GET /api/users/:id`: Get Single User By Id (Only Accessible by Admin And User)
  - `PATCH /api/users/role/:id`: Update User role (Only Accessible by Admin)
  - `PATCH /api/users/:id`: Update User By Id (Only Accessible by Admin And User)
  - `DELETE /api/users/:id`: Delete User By Id (Only Accessible by Admin)

- **Service Routes:**

  - `POST /api/services`: Create a Service. (Only Accessible by Admin)
  - `GET /api/services/:id`: Get a Service.
  - `GET /api/services:` Get all Services.
  - `PUT /api/services/:id`: Update Services (Only Accessible by Admin)
  - `DELETE /api/services/:id`: Delete (Soft Delete) a Service (Only Accessible by Admin)

- **Slot Routes:**

  - `POST /api/services/slots`: Create Slot (Only Accessible by Admin).
  - `DELETE /api/services/slots/:id`: Delete Slot (Only Accessible by Admin).
  - `DELETE /api/services/slots/isBooked/:id`: Update Slot Status (Only Accessible by Admin).
  - `GET /api/slots/availability`: Get available slots.
  - `GET /api/slots/availability/service/:serviceId`: Get available slots by service id.

- **Booking Routes:**

  - `POST /api/bookings`: Book a Service (Only Accessible by User).
  - `GET /api/bookings`: Get All Bookings (Only Accessible by Admin).
  - `DELETE /api/bookings/:id`: Delete Bookings (Only Accessible by Admin).
  - `GET /api/my-bookings`: Get User's Bookings (Only Accessible by User).
  - `GET /api/my-bookings/pending`: Get User's Pending Bookings (Only Accessible by User).
  - `GET /api/my-bookings/my-past-bookings`: Get User's Past Bookings (Only Accessible by User).
  - `GET /api/my-bookings/my-upcoming-bookings`: Get User's Upcoming Bookings (Only Accessible by User).
  - `DELETE /api/my-bookings/:id`: Delete User Booking (Only Accessible by User).

- **Review Routes:**

  - `POST /api/review`: Submit a Review for a Service (Accessible only to authenticated users).
  - `GET /api/review`: Get User Reviews
