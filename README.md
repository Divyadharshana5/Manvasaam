# 🌾 Manvaasam - Agricultural Marketplace Platform

**Empowering Farmers, Delivering Freshness**

Manvaasam is a comprehensive digital platform that connects farmers, transport services, and retail shops in a seamless agricultural marketplace ecosystem. Our mission is to bridge the gap between farm and table while ensuring fair prices for farmers and fresh produce for retail shops in Ranipet, Kanchipuram, Tiruvallur, Chengalpattu, and Vellore districts.

> **Demo Mode Available**: The application runs in full demo mode with mock data when Firebase is not configured, allowing you to explore all features without setup.

## 🚀 What We Do

### **Core Mission**
- **Empower Farmers**: Provide direct market access and fair pricing
- **Connect Communities**: Bridge farmers, retail shops, and transport services
- **Ensure Freshness**: Streamline the supply chain for faster delivery
- **Promote Sustainability**: Support local agriculture and reduce food waste

### **Key Features**
- 🌱 **Multi-Role Platform**: Separate dashboards for farmers, retail shops, and transport services
- 🎤 **AI Voice Assistant**: Multilingual voice navigation and support
- 📱 **Mobile-First Design**: Optimized for all devices with fast loading
- 🔐 **Secure Authentication**: Firebase-based auth with passkey support for farmers
- 🌍 **Multilingual Support**: Available in multiple languages
- 📊 **Real-time Analytics**: Track orders, inventory, and performance
- 💬 **Smart Matchmaking**: AI-powered farmer-customer matching
- 🚚 **Order Management**: End-to-end order tracking and fulfillment

## 🏗️ Technical Stack

### **Frontend**
- **Framework**: Next.js 15.3.3 (React 18.3.1)
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: Framer Motion 12.23.12 with LazyMotion
- **Icons**: Lucide React 0.475.0
- **Forms**: React Hook Form 7.54.2 with Zod validation
- **Charts**: Recharts 2.15.1 for analytics dashboards

### **Backend & Database**
- **Runtime**: Node.js with Next.js API routes
- **Database**: MongoDB 6.8.0
- **Authentication**: Firebase Auth with Admin SDK (with mock mode fallback)
- **File Storage**: MongoDB Storage
- **Session Management**: HTTP-only cookies
- **Email Service**: EmailJS 4.4.1 for password reset functionality

### **AI & Voice**
- **AI Framework**: Google Genkit 1.16.1
- **Speech Recognition**: Custom STT (Speech-to-Text) flows
- **Text-to-Speech**: Custom TTS flows
- **Natural Language**: Navigation understanding AI
- **Voice Processing**: WAV audio processing
- **Telemetry**: OpenTelemetry with Jaeger exporter

### **Development Tools**
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js with Turbo mode
- **Bundle Analysis**: Built-in webpack bundle analyzer
- **Patch Management**: patch-package for dependency fixes

### **Performance & Optimization**
- **Bundle Splitting**: Optimized webpack configuration with vendor chunks
- **Image Optimization**: Next.js Image with WebP/AVIF support
- **Lazy Loading**: Dynamic imports and React Suspense
- **Caching**: HTTP headers with 1-year static asset caching
- **Compression**: Gzip compression enabled
- **GPU Acceleration**: CSS transforms for smooth animations
- **Progressive Loading**: Staged content loading for better UX

## 👥 User Roles & Features

### 🌾 **Farmers**
- **Profile Management**: Crop listings, farm details, certifications
- **Product Catalog**: Add/manage crops with pricing and availability
- **Order Management**: Receive and fulfill orders from retail shops
- **Analytics Dashboard**: Track sales, revenue, and performance
- **Passkey Authentication**: Secure biometric login
- **Voice Assistant**: Hands-free navigation and order updates

### 🏪 **Retail Shops**
- **Product Discovery**: Browse fresh produce by category/location
- **Order Placement**: Easy ordering with delivery options
- **Inventory Management**: Real-time stock tracking with low-stock alerts
- **Quality Assurance**: Product reviews and ratings
- **Nutritional Information**: Detailed product information
- **Order Tracking**: Real-time delivery updates
- **Analytics Dashboard**: Performance metrics and revenue tracking

### 🚚 **Transport Services**
- **Logistics Coordination**: Delivery scheduling and real-time tracking
- **Route Optimization**: Efficient delivery planning
- **Order Processing**: Bulk order management and distribution workflows
- **Quality Control**: Product inspection and grading systems
- **Performance Tracking**: Delivery metrics and analytics
- **Fleet Management**: Vehicle and driver coordination

## 🎯 Key Functionalities

### **Smart Matchmaking**
- AI-powered farmer-customer matching based on location, preferences, and availability
- Seasonal crop recommendations
- Price optimization algorithms

### **Voice Assistant**
- Multilingual voice navigation
- Hands-free order placement
- Voice-activated search and filtering
- Accessibility support for all users

### **Real-time Analytics**
- Sales performance tracking
- Inventory management
- Market trend analysis
- Revenue optimization insights

### **Order Management**
- End-to-end order tracking
- Automated notifications
- Delivery scheduling
- Payment processing integration

### **Quality Assurance**
- Product rating and review system
- Quality control checkpoints
- Freshness guarantees
- Return and refund policies

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm (included with Node.js)
- MongoDB instance (optional - mock mode available)
- Firebase project (optional - mock mode available)

### **Quick Start (Demo Mode)**

1. **Clone the repository**
```bash
git clone <repository-url>
cd manvaasam
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

The application will run in demo mode with mock data, allowing you to explore all features without any configuration.

### **Production Setup**

For production deployment, configure these environment variables in `.env.local`:

```env
# Firebase Configuration (see FIREBASE_SETUP.md)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# EmailJS Configuration (see EMAILJS_SETUP.md)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# MongoDB (optional)
MONGODB_URI=mongodb://localhost:27017/manvaasam
```

### **Build Commands**
```bash
# Development with turbo mode
npm run dev

# Production build
npm run build

# Production build with bundle analysis
npm run build:analyze

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# Performance testing
npm run perf

# Optimized build (experimental)
npm run optimize
```

## 🌐 Application Structure

### **Authentication Flow**
```
Home Page → Role Selection → Login/Register → Dashboard
```

### **User Journeys**

**Retail Registration & Management:**
1. Navigate to `/login/retail`
2. Complete retail registration with shop details
3. Access retail dashboard with real-time metrics
4. Manage inventory and orders
5. View analytics and performance data

**Farmer Registration:**
1. Select "Farmer" role
2. Complete registration with passkey setup
3. Connect with retail shops in your area
4. Access farmer dashboard
5. Add crops and manage inventory

**Retail Shopping:**
1. Browse products by category and location
2. Check availability from farmers
3. Add items to cart with stock reservation
4. Place order with delivery details
5. Track order status in real-time

**Transport Operations:**
1. Register as transport service
2. Access logistics management interface
3. Manage delivery routes and schedules
4. Coordinate with farmers and retail shops
5. Track delivery performance

### **Demo Mode Features**
- **Mock Authentication**: Test all user flows without Firebase
- **Sample Data**: Pre-populated inventory and user data
- **Full Functionality**: All features work with simulated backend
- **Clear Indicators**: Demo mode warnings throughout the interface
- **EmailJS Fallback**: Password reset works in demo mode when EmailJS is not configured
- **Error Recovery**: Automatic fallback to demo responses for email service errors

## 📱 Mobile Experience

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large tap targets and smooth interactions
- **Fast Loading**: Optimized performance for mobile networks
- **Offline Support**: Basic functionality without internet
- **PWA Ready**: Installable as mobile app

## 🔒 Security Features

- **Firebase Authentication**: Industry-standard security with mock mode fallback
- **Passkey Support**: Biometric authentication for farmers
- **HTTP-Only Cookies**: Secure session management
- **Input Validation**: Comprehensive form validation with Zod schemas
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API abuse prevention
- **Password Reset**: Secure email-based password reset via EmailJS with fallback to demo mode
- **Environment Variables**: Sensitive data protection
- **Mock Mode Security**: Safe demo environment without real credentials
- **Error Handling**: Graceful EmailJS error handling with automatic fallback

## 🌍 Internationalization

- **Multi-language Support**: English, Hindi, and regional languages
- **RTL Support**: Right-to-left language compatibility
- **Cultural Adaptation**: Localized content and formats
- **Voice Assistant**: Multilingual voice commands

## 📊 Performance Metrics

### **Core Web Vitals Targets**
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

### **Optimization Features**
- **Bundle Splitting**: Vendor chunks and dynamic imports
- **Lazy Loading**: Components load on demand
- **Image Optimization**: WebP/AVIF with Next.js Image
- **GPU Acceleration**: CSS transforms for smooth animations
- **Reduced Motion**: Accessibility-compliant animations
- **Progressive Loading**: Staged content delivery
- **Caching Strategy**: 1-year static asset caching

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines and code of conduct before submitting pull requests.

### **Development Guidelines**
- Follow TypeScript best practices
- Write comprehensive tests
- Maintain code documentation
- Follow accessibility standards
- Optimize for performance

## 📞 Support & Contact

- **Email**: support@manvaasam.com
- **Documentation**: 
  - [Firebase Setup Guide](./FIREBASE_SETUP.md)
  - [EmailJS Setup Guide](./EMAILJS_SETUP.md)
  - [Hub System Demo](./HUB_SYSTEM_DEMO.md)
  - [Performance Optimizations](./PERFORMANCE_OPTIMIZATIONS.md)
  - [Project Blueprint](./docs/blueprint.md)
- **Demo Mode**: Full functionality available without configuration
- **Bug Reports**: Create issues in the project repository

## 📄 Legal

- **Privacy Policy**: `/privacy`
- **Terms of Service**: `/terms`
- **Support Center**: `/support`

## 🎯 Roadmap

### **Recent Updates (v0.1.2)**
- [x] Updated transport login page to use farmer's emerald/green color scheme
- [x] Standardized all login pages with identical structure and features
- [x] Enhanced voice assistant with transport and retail navigation support
- [x] Updated homepage icons: Truck for transport, Building for retail
- [x] Unified authentication experience across all user types

### **Upcoming Features**
- [ ] Production Firebase integration
- [ ] Real-time notifications system
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] IoT integration for smart farming
- [ ] Machine learning price prediction
- [ ] Blockchain supply chain tracking
- [ ] Drone delivery integration
- [ ] Carbon footprint tracking
- [ ] Farmer education platform

### **Current Version**: 0.1.2
### **Last Updated**: January 2025

## 🔧 Recent Bug Fixes & Improvements

### **EmailJS Integration (v0.1.1)**
- **Enhanced Error Handling**: Fixed empty error object issues with comprehensive try-catch blocks
- **Demo Mode Fallback**: Automatic fallback to demo mode when EmailJS configuration is missing or fails
- **Improved Logging**: Added detailed logging for debugging EmailJS issues without breaking user experience
- **Single Initialization**: Prevented multiple EmailJS initializations that could cause conflicts
- **Template Validation**: Enhanced template parameter validation and error recovery
- **Test Component**: Added `/components/test-emailjs-debug.tsx` for isolated EmailJS testing

### **Password Reset Functionality**
- **Graceful Degradation**: Password reset always returns success in demo mode
- **Error Recovery**: Silent error handling prevents UI breakage from EmailJS failures
- **User Experience**: Consistent messaging regardless of EmailJS configuration status
- **Browser Compatibility**: Added browser environment checks for EmailJS operations

---

**Built with ❤️ for the farming community**

*Manvaasam - Bridging the gap between farm and table*
