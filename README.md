# Property Rental Management System on ICP

A decentralized property rental management system built on the Internet Computer Protocol (ICP) blockchain. This platform connects landlords and tenants, facilitates property listings, handles rental applications, and manages property-related communications and maintenance.

## 🏠 Features

### For Landlords & Agencies
- **Property Management**
  - List new properties with detailed specifications
  - Upload property images and virtual tours
  - Track property views and interest
  - Manage multiple properties
  - View property analytics and performance metrics

- **Tenant Management**
  - Review rental applications
  - Access tenant verification tools
  - Manage lease agreements
  - Track rental payments
  - Handle maintenance requests

### For Tenants
- **Property Search**
  - Advanced search filters
  - Virtual property tours
  - Save favorite properties
  - Property ratings and reviews
  - Neighborhood insights

- **Rental Process**
  - Online rental applications
  - Document upload system
  - In-app messaging with landlords
  - Maintenance request submission
  - Rental payment tracking

### General Features
- User verification system
- Real-time messaging
- Review and rating system
- Document management
- Payment tracking
- Maintenance request system
- Analytics and reporting

## 🚀 Technical Stack

- **Backend**: TypeScript on Internet Computer Protocol (ICP)
- **Database**: StableBTreeMap for persistent storage
- **API**: Express.js
- **Authentication**: ICP Identity
- **UUID Generation**: uuid v4

## 📋 Prerequisites

- Node.js (v14 or higher)
- DFX (ICP SDK)
- TypeScript
- Internet Computer CLI

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/Mirriamnjeri/rentals
cd rentals
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Running the Application

1. Start the local development environment:
```bash
dfx start --clean --background
```

2. Deploy the canister:
```bash
dfx deploy
```

## 📚 API Documentation

### Property Endpoints

```typescript
POST /properties
GET /properties/search
GET /properties/:id
PUT /properties/:id
DELETE /properties/:id
```

### Application Endpoints

```typescript
POST /applications
GET /properties/:propertyId/applications
PUT /applications/:id
```

### Review Endpoints

```typescript
POST /reviews
GET /properties/:propertyId/reviews
PUT /reviews/:id
```

### Maintenance Endpoints

```typescript
POST /maintenance
GET /properties/:propertyId/maintenance
PUT /maintenance/:id
```

### Message Endpoints

```typescript
POST /messages
GET /messages/:userId
PUT /messages/:id/read
```

## 🔐 Security

- All data is stored on the ICP blockchain ensuring transparency and immutability
- User verification system for both landlords and tenants
- Secure document storage and sharing
- Protected API endpoints
- Data encryption for sensitive information

## 📈 Analytics

The system provides comprehensive analytics including:
- Property view counts
- Application conversion rates
- Average occupancy rates
- Tenant satisfaction metrics
- Revenue analytics
- Maintenance response times

Made with ❤️ for the ICP community