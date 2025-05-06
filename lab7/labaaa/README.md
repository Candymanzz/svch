# Furniture Management System

A full-stack furniture management system built with React, Redux, and Material-UI for the frontend, and Node.js, Express, and PostgreSQL for the backend.

## Features

- **Furniture Management**
  - Add, edit, delete, and view furniture items
  - Track inventory levels
  - Categorize furniture items

- **Customer Management**
  - Add, edit, delete, and view customer information
  - Track customer contact details
  - View customer history

- **Contract Management**
  - Create and manage contracts with customers
  - Track contract status and dates
  - Monitor contract amounts

- **Sales Management**
  - Record sales transactions
  - Link sales to contracts and furniture items
  - Track sales history

## Frontend Technologies

- React
- Redux Toolkit for state management
- React Router for navigation
- Material-UI for UI components
- Formik and Yup for form handling and validation
- Axios for API requests

## Backend Technologies

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/furniture-management-system.git
cd furniture-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
furniture-management-system/
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # Redux store and slices
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   └── index.js           # Entry point
├── public/                # Static files
├── package.json           # Project dependencies
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
