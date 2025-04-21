Museum Database Web Application

Overview

The Museum Database Web Application is a React-based platform designed to manage and showcase various aspects of a museum’s operations. This includes event listings, membership perks, gift shop items, and more. Developed as part of an academic project, the application emphasizes modular design, responsive UI components, and efficient state management to provide users with an intuitive and seamless experience.
Installation

Technologies Used

- Frontend: React.js  
- Backend: Node.js  
- Database: MySQLServer  
- Hosting: Railway  

Setup

To set up and run the project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/faridktx/museum-database.git
cd museum-database
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be accessible at http://localhost:3000.

Project Structure

```
museum-database/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── constants.js
│   │   ├── dashboard/
│   │   │   └── header.jsx
│   │   ├── home/
│   │   │   ├── contact.jsx
│   │   │   ├── features.jsx
│   │   │   ├── footer.jsx
│   │   │   ├── header.jsx
│   │   │   ├── hero.jsx
│   │   │   └── overview.jsx
│   │   ├── exhibit-carousel.jsx
│   │   ├── events-list.jsx
│   │   ├── membership-perks.jsx
│   │   ├── on-sign-up.jsx
│   │   ├── popup.jsx
│   │   ├── testimonials-slider.jsx
│   │   ├── utils.custom.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── dashboards/
│   │   │   ├── admin-dashboard.jsx
│   │   │   ├── curator-dashboard.jsx
│   │   │   ├── customer-dashboard.jsx
│   │   │   └── giftshop-dashboard.jsx
│   │   ├── support/
│   │   │   ├── support-account.jsx
│   │   │   ├── support-api.jsx
│   │   │   ├── support-center.jsx
│   │   │   ├── support-contact.jsx
│   │   │   ├── support-documentation.jsx
│   │   │   ├── support-faq.jsx
│   │   │   ├── support-knowledge.jsx
│   │   │   ├── support-report.jsx
│   │   │   └── support-tutorials.jsx
│   │   ├── admin-notifications.jsx
│   │   ├── cart.jsx
│   │   ├── dashboard.jsx
│   │   ├── giftshop.jsx
│   │   ├── home.jsx
│   │   ├── memberships.jsx
│   │   ├── not-found.jsx
│   │   ├── plan-visit.jsx
│   │   ├── ticket-memberships.jsx
│   │   └── unauthorized.jsx
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
```

Key Directories and Files

- public/: Contains the index.html file and other static assets.
- src/: Main source code directory.
- components/: Reusable UI components and utility functions.
- dashboard/: Components specific to the dashboard interface.
- home/: Components used on the homepage.
- pages/: Page-level components representing different routes.
- dashboards/: Different user role dashboards.
- support/: Support-related pages.
- App.jsx: Root component that sets up routing.
- index.jsx: Entry point of the React application.
