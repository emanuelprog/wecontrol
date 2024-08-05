# WeControl

## Overview
WeControl is a project developed using Spring Boot for the backend and Angular for the frontend. It implements Spring Security for authentication and includes functionalities for user registration, login, password change via email validation, and a system for managing moai.

## Project Structure
- **Backend:** Spring Boot
- **Frontend:** Angular
- **Authentication:** Spring Security

## Features
1. **Authentication and Authorization**
   - User Registration
   - User Login
   - Password Change via Email Validation
   - Roles: Admin and User

2. **Moai Management**
   - **Admin Role:**
     - Create and manage moai
   - **User Role:**
     - Choose to participate in moai
     - Moai month generation based on the creation date
   - Automated daily method to check if a moai can be started
   - Bidding system where the highest bidder wins

## Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Authenticate a user.
- **POST** `/api/auth/reset-password`: Request a password reset.
- **POST** `/api/auth/refresh-token`: Refresh token.

### Moai Management
- **GET** `/api/moai/{id}`: Retrieve a list of all moais (Filtered by id).
- **POST** `/api/moai/create`: Create a new moai (Admin only).
- **PUT** `/api/moai/{id}`: Update moai details (Admin only).
- **DELETE** `/api/moai/{id}`: Delete a moai (Admin only).
- **POST** `/api/moai/add-participant`: Participate in a moai (User only).
- **POST** `/api/moai/bid-monthly`: Place a bid in a moai (User only).

## Roles and Permissions
- **Admin:**
  - Can create, update, and delete moais.
  - Can manage all aspects of moai.
- **User:**
  - Can view available moais.
  - Can participate in moais.
  - Can place bids in moais.

## Automated Tasks
A scheduled task runs daily to check if a moai can be initiated based on predefined criteria.

## Configuration
- **Spring Security:** Configured for role-based access control.
- **Email Service:** Configured for sending validation emails for password resets and other notifications.

## Installation and Setup

### Backend Setup
1. Clone the repository: `git clone <repository-url>`
2. Navigate to the backend directory: `cd wecontrol-backend`
3. Build the project: `mvn clean install`
4. Run the application: `mvn spring-boot:run`

### Frontend Setup
1. Navigate to the frontend directory: `cd wecontrol-frontend`
2. Install dependencies: `npm install`
3. Run the application: `npm run start`

## Technologies Used
- **Backend:**
  - Spring Boot
  - Spring Security
  - MongoDB
  - EmailJS

- **Frontend:**
  - Angular
  - Angular Material
  - RxJS

## Future Enhancements
- Add more granular permissions and roles.
- Enhance the bidding system with real-time updates.
- Integrate notifications for users about moai status changes.

## Contributing
To contribute to the project, follow these steps:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/<feature_name>`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/<feature_name>`
5. Open a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any inquiries or issues, please contact the project maintainer at emanuelbessadev@gmail.com
