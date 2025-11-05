# Retail Shop Profile Page

## Overview
Created a comprehensive retail shop profile page that displays all essential shop details for retail users.

## Location
- **File**: `src/app/dashboard/retail/profile/page.tsx`
- **Route**: `/dashboard/retail/profile`

## Features

### Shop Information Display
- **Shop Name** - Name of the retail store
- **Shop Type** - Type of retail business (e.g., Grocery & Fresh Produce)
- **Owner Name** - Name of the shop owner
- **Established Year** - When the business was established

### Contact Details
- **Email** - Primary business email
- **Primary Phone** - Main contact number
- **Alternate Phone** - Secondary contact number  
- **Website** - Business website URL

### Address & Location
- **Full Address** - Complete business address
- **City** - Business city location
- **State** - Business state location
- **Pincode** - Area postal code
- **Landmark** - Nearby landmark for easy location

### Business Details
- **GST Number** - Government tax registration number
- **License Number** - Business license number
- **Business Hours** - Operating hours
- **Delivery Radius** - Service delivery area

### Additional Information
- **Shop Description** - Detailed description of the business
- **Specialties** - Products/services the shop specializes in
- **Payment Methods** - Accepted payment options (Cash, UPI, Card, etc.)

## Key Components

### Profile Display
- Clean, organized layout with sectioned information
- Icons for each detail type for better visual organization
- Verification status badge
- Responsive design for mobile and desktop

### Edit Functionality
- Comprehensive edit dialog with form validation
- Organized into logical sections (Shop Info, Contact, Address, Business Details)
- Real-time form validation using Zod schema
- Success/error toast notifications

### Navigation Integration
- Updated retail layout sidebar to include "Shop Profile" link
- Proper routing within the retail dashboard

## Technical Details

### Form Validation
- Uses `react-hook-form` with `zod` validation
- Validates phone numbers, email addresses, pincode format
- Character limits for text areas
- URL validation for website field

### State Management
- Fetches profile data from `/api/users/${uid}` endpoint
- Local state management for profile data
- Loading states and error handling

### Styling
- Consistent with existing design system
- Green/emerald color scheme matching retail theme
- Gradient backgrounds and hover effects
- Responsive grid layouts

## Usage
1. Navigate to `/dashboard/retail/profile` or click "Shop Profile" in the retail sidebar
2. View all shop details in organized sections
3. Click "Edit Shop Details" to modify information
4. Fill out the form and save changes

## Mock Data
The page includes comprehensive mock data for demonstration:
- Sample shop information (Fresh Mart Grocery Store)
- Complete address details
- Business registration numbers
- Operating hours and service details

This provides a complete shop profile management solution for retail users.