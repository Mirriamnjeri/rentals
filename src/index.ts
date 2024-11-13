import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express from 'express';

// Enhanced Data Models
class User {
    id: string;
    type: 'tenant' | 'landlord' | 'agency';
    name: string;
    email: string;
    phone: string;
    verificationStatus: boolean;
    rating: number;
    reviews: string[];  // Array of Review IDs
    createdAt: Date;
    updatedAt: Date | null;
}

class Property {
    id: string;
    landlordId: string;
    title: string;
    type: 'apartment' | 'house' | 'room' | 'commercial';
    status: 'available' | 'rented' | 'maintenance' | 'unlisted';
    location: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        }
    };
    specifications: {
        bedrooms: number;
        bathrooms: number;
        squareFootage: number;
        furnished: boolean;
        parking: boolean;
        petsAllowed: boolean;
    };
    amenities: string[];
    rent: {
        monthly: number;
        securityDeposit: number;
        utilities: string[];
        includedUtilities: string[];
    };
    images: string[];
    virtualTour?: string;
    availableFrom: Date;
    minimumLeaseTerm: number;  // in months
    maximumOccupants: number;
    views: number;
    favoriteCount: number;
    createdAt: Date;
    updatedAt: Date | null;
}

class Review {
    id: string;
    propertyId: string;
    userId: string;
    rating: number;
    comment: string;
    amenitiesRating: number;
    locationRating: number;
    valueForMoneyRating: number;
    landlordRating: number;
    images?: string[];
    helpful: number;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date | null;
}

class Rental {
    id: string;
    propertyId: string;
    tenantId: string;
    landlordId: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    leaseStart: Date;
    leaseEnd: Date;
    monthlyRent: number;
    securityDeposit: number;
    documents: {
        name: string;
        url: string;
        type: 'lease' | 'id' | 'proof_of_income' | 'other';
    }[];
    paymentHistory: {
        id: string;
        amount: number;
        date: Date;
        status: 'pending' | 'completed' | 'late' | 'missed';
    }[];
    createdAt: Date;
    updatedAt: Date | null;
}

class Application {
    id: string;
    propertyId: string;
    tenantId: string;
    status: 'pending' | 'approved' | 'rejected';
    desiredMoveIn: Date;
    leaseTerm: number;
    occupants: number;
    monthlyIncome: number;
    creditScore: number;
    employment: {
        employer: string;
        position: string;
        duration: number;
    };
    references: {
        name: string;
        contact: string;
        relationship: string;
    }[];
    documents: {
        name: string;
        url: string;
        type: string;
    }[];
    createdAt: Date;
    updatedAt: Date | null;
}

class Message {
    id: string;
    senderId: string;
    receiverId: string;
    propertyId?: string;
    content: string;
    type: 'text' | 'image' | 'document';
    read: boolean;
    createdAt: Date;
}

class Maintenance {
    id: string;
    propertyId: string;
    tenantId: string;
    category: 'repair' | 'replacement' | 'inspection' | 'emergency';
    status: 'reported' | 'scheduled' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'emergency';
    description: string;
    images?: string[];
    scheduledDate?: Date;
    completedDate?: Date;
    cost?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date | null;
}

// Storage
const usersStorage = StableBTreeMap<string, User>(0);
const propertiesStorage = StableBTreeMap<string, Property>(1);
const reviewsStorage = StableBTreeMap<string, Review>(2);
const rentalsStorage = StableBTreeMap<string, Rental>(3);
const applicationsStorage = StableBTreeMap<string, Application>(4);
const messagesStorage = StableBTreeMap<string, Message>(5);
const maintenanceStorage = StableBTreeMap<string, Maintenance>(6);

export default Server(() => {
    const app = express();
    app.use(express.json());

    // Property Routes
    app.post("/properties", (req, res) => {
        const property: Property = {
            id: uuidv4(),
            views: 0,
            favoriteCount: 0,
            createdAt: getCurrentDate(),
            updatedAt: null,
            ...req.body
        };
        propertiesStorage.insert(property.id, property);
        res.json(property);
    });

    app.get("/properties/search", (req, res) => {
        const {
            city,
            minPrice,
            maxPrice,
            bedrooms,
            propertyType,
            furnished,
            petsAllowed,
            page = 1,
            limit = 10
        } = req.query;

        let properties = propertiesStorage.values()
            .filter(p => p.status === 'available');

        if (city) properties = properties.filter(p => 
            p.location.city.toLowerCase().includes(city.toString().toLowerCase()));
        if (minPrice) properties = properties.filter(p => 
            p.rent.monthly >= Number(minPrice));
        if (maxPrice) properties = properties.filter(p => 
            p.rent.monthly <= Number(maxPrice));
        if (bedrooms) properties = properties.filter(p => 
            p.specifications.bedrooms >= Number(bedrooms));
        if (propertyType) properties = properties.filter(p => 
            p.type === propertyType);
        if (furnished) properties = properties.filter(p => 
            p.specifications.furnished === Boolean(furnished));
        if (petsAllowed) properties = properties.filter(p => 
            p.specifications.petsAllowed === Boolean(petsAllowed));

        // Pagination
        const startIndex = (Number(page) - 1) * Number(limit);
        const paginatedProperties = properties.slice(startIndex, startIndex + Number(limit));

        res.json(paginatedProperties);
    });

    // Application Routes
    app.post("/applications", (req, res) => {
        const application: Application = {
            id: uuidv4(),
            status: 'pending',
            createdAt: getCurrentDate(),
            updatedAt: null,
            ...req.body
        };
        applicationsStorage.insert(application.id, application);
        res.json(application);
    });

    app.get("/properties/:propertyId/applications", (req, res) => {
        const propertyId = req.params.propertyId;
        const applications = applicationsStorage.values()
            .filter(app => app.propertyId === propertyId);
        res.json(applications);
    });

    // Review Routes
    app.post("/reviews", (req, res) => {
        const review: Review = {
            id: uuidv4(),
            helpful: 0,
            verified: false,
            createdAt: getCurrentDate(),
            updatedAt: null,
            ...req.body
        };
        reviewsStorage.insert(review.id, review);
        res.json(review);
    });

    app.get("/properties/:propertyId/reviews", (req, res) => {
        const propertyId = req.params.propertyId;
        const reviews = reviewsStorage.values()
            .filter(review => review.propertyId === propertyId);
        res.json(reviews);
    });

    // Maintenance Routes
    app.post("/maintenance", (req, res) => {
        const maintenance: Maintenance = {
            id: uuidv4(),
            status: 'reported',
            createdAt: getCurrentDate(),
            updatedAt: null,
            ...req.body
        };
        maintenanceStorage.insert(maintenance.id, maintenance);
        res.json(maintenance);
    });

    app.get("/properties/:propertyId/maintenance", (req, res) => {
        const propertyId = req.params.propertyId;
        const maintenance = maintenanceStorage.values()
            .filter(m => m.propertyId === propertyId);
        res.json(maintenance);
    });

    // Messaging Routes
    app.post("/messages", (req, res) => {
        const message: Message = {
            id: uuidv4(),
            read: false,
            createdAt: getCurrentDate(),
            ...req.body
        };
        messagesStorage.insert(message.id, message);
        res.json(message);
    });

    app.get("/messages/:userId", (req, res) => {
        const userId = req.params.userId;
        const messages = messagesStorage.values()
            .filter(message => message.receiverId === userId);
        res.json(messages);
    });

    // Helper Functions
    function getCurrentDate(): Date {
        return new Date();
    }

    return app;
});
