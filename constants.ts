
import { UserRole, User } from './types';

export const APP_NAME = "InsurShield AI";

export const BAIC_CONFIG = {
  API_URL: "https://crewai-agents-capgemini.dev.uniphorecloud.com/api/v1/agents/execute",
  JWT_TOKEN: "eyJ0b2tlblR5cGUiOiJBUFBfQUNDRVNTIiwiYWxnIjoiUlM1MTIifQ.eyJzdWIiOiJjNzljOTA3NS05MDQ4LTRmMDQtYjFjMS01N2E4NGQ2OTAwNzMiLCJyb2xlcyI6WyJVc2VyIl0sImdyb3VwcyI6WyJmYzY2N2MyNS0zN2I0LTRlN2EtYjUzOS05NWIxODBjZTM3MDciLCJmODIyYTliMy02MzFmLTQ4ZjAtYTIyOC0xNDIyMWI5YTIxOGQiXSwiaWF0IjoxNzY3NTk4MzYxLCJ0ZW5hbnQiOiI0YjQ2NzEyMi1hNWJlLTRhNWMtYTZlMy1kZDA3NDc2Y2YxN2EiLCJpc3MiOiJ1bmlwaG9yZWNsb3VkLmNvbSIsImV4cCI6MTc2NzYwMTk2MX0.X87SmlzTLnN-VAiwMVCNxtw7NwMHdJXuIgKYUlZXzyagYvYGla2oJPtiOYi3uFsZMr5CrtzG79st9hWpn_7RzsYMMafOMtLpTr1h0BG9P-_0a02nrxYX54D2__vkiMi2zNwZVO68BHKLl5xdcvt6oyvH6Jcjpgi8wybxkq8rUBxCID_0Nl7XsdfDJvBwtlf0HHvzZ5eUGfBTc0V7JEQKyfm0MmGo3gRPz9lzkRd9mOvFhEqsUyyn-wMlpW4jcEIewFdqrnJsZqybrH0a35E8_4LTD1weseDLVW8RzSI3gKhlQoaTFykbt5Pa12J7aXUGzdDJbxaZljmlB2gd1tGQ_g",
  GROUP_ID: "fc667c25-37b4-4e7a-b539-95b180ce3707",
  TENANT_ID: "4b467122-a5be-4a5c-a6e3-dd07476cf17a",
  USER_ID: "d6e687e1-d956-45dc-8e86-ad3a4b295af8",
  AGENT_ID: "68d83a34-4c4f-4037-a466-23b77065138e",
  TIMEZONE: "Asia/Calcutta"
};

export const ZILLOW_API_CONFIG = {
  CLIENT_ID: "gaTeOhRNwWd9rzkXubn8",
  CLIENT_SECRET: "6JRmkW3lDnoKSC8eB32AmpuBDwMTcCZM7Iz0lJye",
  SERVER_TOKEN: "00c132c099f2aba1c72922c307471c41",
  BROWSER_TOKEN: "b92502640625ae20389e3f14c0c38b40"
};

export const PROPERTY_TYPES = [
  "Luxury Residential",
  "Estate / Manor",
  "Commercial High-Rise",
  "Heritage / Historic Asset",
  "Industrial Facility",
  "Retail Complex"
];

export const CONSTRUCTION_TYPES = [
  "Concrete & Steel",
  "Reinforced Masonry",
  "Timber Frame",
  "Mixed Construction",
  "Heritage Stone"
];

export const DEPARTMENTS = [
  "Underwriting",
  "Compliance",
  "Risk Management",
  "Legal"
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Sarah Chen (Admin)',
    email: 'admin',
    password: 'password123',
    role: UserRole.ADMIN_MANAGER,
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'uw-1',
    name: 'Avinash Singh',
    email: 'avi@gmail.com',
    password: '1234',
    role: UserRole.UNDERWRITER,
    status: 'Active',
    createdAt: new Date().toISOString()
  }
];

export const MOCK_GUIDELINES = [
  {
    id: 'g-1',
    name: 'High-Value Coastal Property Risk 2024',
    content: 'All properties within 1 mile of shoreline must have verified flood defense systems. Minimum valuation of $5M required for premium coverage tier. High structural resilience certification mandatory.',
    version: '1.2.0',
    department: 'Risk Management',
    effectiveDate: '2024-01-01',
    isActive: true,
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'g-2',
    name: 'Heritage Asset Underwriting v3',
    content: 'Heritage properties require specialized restoration contractors. Fire suppression must be non-destructive (e.g., gas-based). Theft risk requires 24/7 monitored alarm systems.',
    version: '3.0.1',
    department: 'Underwriting',
    effectiveDate: '2023-11-15',
    isActive: true,
    uploadedAt: new Date().toISOString()
  }
];
