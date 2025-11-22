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
- **Quick-Add Products**: Fast product addition with pre-filled details
- **Inventory Management**: Real-time stock tracking with low-stock alerts
- **Quality Assurance**: Product reviews and ratings
- **Nutritional Information**: Detailed product information
- **Order Tracking**: Real-time delivery updates
- **Analytics Dashboard**: Performance metrics and revenue tracking
- **Draft Orders**: Save incomplete orders for later completion
- **Supplier Management**: Multi-supplier ordering with ratings

### 🚚 **Transport Services**
- **Logistics Coordination**: Delivery scheduling and real-time tracking
- **Route Optimization**: Efficient delivery planning
- **Order Processing**: Bulk order management and distribution workflows
- **Quality Control**: Product inspection and grading systems
- **Performance Tracking**: Delivery metrics and analytics
- **Fleet Management**: Vehicle and driver coordination
- **Driver Communication**: Multi-channel contact system (call, SMS, email, video)
- **Analytics Export**: Export reports in PDF, CSV, Excel, and JSON formats
- **AI Report Generation**: Automated comprehensive analytics reports
- **Real-time Tracking**: Live driver location and delivery status monitoring

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
- AI-powered report generation with customizable focus areas
- Multi-format export (PDF, CSV, Excel, JSON)
- Executive summaries and operational reports
- Period-over-period comparisons
- Driver and fleet performance metrics
- Fuel consumption and efficiency analysis

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
4. Contact drivers via call, SMS, email, or video
5. Track deliveries in real-time with live location
6. Generate and export analytics reports
7. Monitor driver and fleet performance
8. Optimize routes and fuel consumption

### **Demo Mode Features**
- **Mock Authentication**: Test all user flows without Firebase
- **Sample Data**: Pre-populated inventory and user data
- **Full Functionality**: All features work with simulated backend
- **Clear Indicators**: Demo mode warnings throughout the interface
- **EmailJS Fallback**: Password reset works in demo mode when EmailJS is not configured
- **Error Recovery**: Automatic fallback to demo responses for email service errors

## 📱 Mobile Experience & Responsive Design

### **Fully Responsive**
- **Mobile-First Design**: All pages optimized for mobile devices (320px+)
- **Adaptive Layouts**: Seamless experience across phones, tablets, and desktops
- **Breakpoint System**: xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Touch-Optimized**: 44x44px minimum touch targets for all interactive elements
- **Fast Performance**: Optimized for mobile networks with lazy loading and code splitting

### **Responsive Features**
- **Flexible Grids**: Auto-adapting column layouts (1→2→4 columns)
- **Stacked Navigation**: Mobile-friendly navigation that stacks vertically
- **Responsive Typography**: Text scales appropriately for each screen size
- **Adaptive Spacing**: Padding and margins adjust based on viewport
- **Smart Truncation**: Long text truncates with ellipsis to prevent overflow
- **Full-Width Buttons**: Buttons expand to full width on mobile for easy tapping
- **Horizontal Scroll Prevention**: No horizontal scrolling on any device
- **iOS Zoom Prevention**: Input fields sized to prevent unwanted zoom on focus

### **Performance Optimizations**
- **GPU Acceleration**: Smooth animations using CSS transforms
- **Lazy Loading**: Images and components load on demand
- **Progressive Enhancement**: Core functionality works on all devices
- **Reduced Motion**: Respects user's motion preferences for accessibility
- **Viewport Optimization**: Proper viewport meta tags and safe area insets
- **Touch Feedback**: Instant visual feedback for all touch interactions

### **Documentation**
- **[Responsive Guide](./docs/RESPONSIVE_GUIDE.md)**: Comprehensive responsive design documentation
- **[Quick Reference](./docs/QUICK_RESPONSIVE_REFERENCE.md)**: Copy-paste responsive patterns
- **[Migration Guide](./docs/MIGRATION_GUIDE.md)**: Step-by-step guide to make pages responsive
- **[Optimization Summary](./docs/RESPONSIVE_OPTIMIZATION_SUMMARY.md)**: Overview of all responsive improvements

### **Testing**
- **Multi-Device Testing**: Verified on iPhone SE, iPhone 12/13, iPad, and various desktop sizes
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Real Device Testing**: Tested on actual mobile devices for touch interactions
- **Performance Monitoring**: Built-in performance utilities for tracking metrics

### **PWA Features**
- **Installable**: Can be installed as a mobile app
- **Offline Support**: Basic functionality without internet
- **Fast Loading**: Optimized for mobile networks
- **Native Feel**: App-like experience on mobile devices

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
  - [System Demo Guide](./SYSTEM_DEMO.md)
  - [Performance Optimizations](./PERFORMANCE_OPTIMIZATIONS.md)
  - [Project Blueprint](./docs/blueprint.md)
- **Demo Mode**: Full functionality available without configuration
- **Bug Reports**: Create issues in the project repository

## 📄 Legal

- **Privacy Policy**: `/privacy`
- **Terms of Service**: `/terms`
- **Support Center**: `/support`

## 🎯 Roadmap

### **Recent Updates (v0.2.0)**
- [x] Updated transport login page to use farmer's emerald/green color scheme
- [x] Standardized all login pages with identical structure and features
- [x] Enhanced voice assistant with transport and retail navigation support
- [x] Updated homepage icons: Truck for transport, Building for retail
- [x] Unified authentication experience across all user types
- [x] Advanced driver communication system with call, message, and email capabilities
- [x] Comprehensive analytics export functionality with multiple format support
- [x] AI-powered analytics report generation with customizable focus areas
- [x] Enhanced retail order management with quick-add product features
- [x] Real-time delivery tracking and driver contact system
- [x] Multi-channel communication (voice, text, email, file attachments)

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

### **Current Version**: 0.2.0
### **Last Updated**: November 2025

## 🔧 Recent Bug Fixes & Improvements

### **Transport Communication System (v0.2.0)**
- **Multi-Channel Communication**: Integrated call, SMS, email, and video call capabilities
- **Voice Messages**: Added voice recording and playback for driver communication
- **File Attachments**: Support for images, videos, and documents in messages
- **Communication History**: Track all interactions with drivers
- **Quick Messages**: Pre-defined message templates for common scenarios
- **Emergency Contacts**: Quick access to emergency driver contacts

### **Analytics & Reporting (v0.2.0)**
- **AI-Powered Generation**: Automated report creation with customizable focus areas
- **Multi-Format Export**: Support for PDF, CSV, Excel, and JSON formats
- **Custom Date Ranges**: Flexible date selection for report generation
- **Progress Tracking**: Real-time progress indicators during report generation
- **Email Delivery**: Optional email delivery of generated reports
- **Template Sharing**: Share report templates with team members

### **Retail Order Management (v0.2.0)**
- **Quick-Add Products**: Fast product addition with supplier auto-selection
- **Draft Orders**: Save incomplete orders for later completion
- **Dynamic Quantity Controls**: Increment/decrement buttons for easy quantity adjustment
- **Real-time Total Calculation**: Automatic order total updates
- **Supplier Ratings**: Display supplier ratings during selection
- **Validation**: Comprehensive order validation before submission

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
