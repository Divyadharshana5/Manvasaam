# 🌾 Manvaasam - Agricultural Marketplace Platform

**Empowering Farmers, Delivering Freshness**

Manvaasam is a comprehensive digital platform that connects farmers, distribution hubs, customers, and restaurants in a seamless agricultural marketplace ecosystem. Our mission is to bridge the gap between farm and table while ensuring fair prices for farmers and fresh produce for consumers.

> **Demo Mode Available**: The application runs in full demo mode with mock data when Firebase is not configured, allowing you to explore all features without setup.

## 🚀 What We Do

### **Core Mission**
- **Empower Farmers**: Provide direct market access and fair pricing
- **Connect Communities**: Bridge farmers, hubs, customers, and restaurants
- **Ensure Freshness**: Streamline the supply chain for faster delivery
- **Promote Sustainability**: Support local agriculture and reduce food waste

### **Key Features**
- 🌱 **Multi-Role Platform**: Separate dashboards for farmers, hubs, customers, and restaurants
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
- **File Storage**: Firebase Storage
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
- **Order Management**: Receive and fulfill orders from hubs/customers
- **Analytics Dashboard**: Track sales, revenue, and performance
- **Passkey Authentication**: Secure biometric login
- **Voice Assistant**: Hands-free navigation and order updates

### 🏢 **Distribution Hubs**
- **Branch Management**: Multi-location hub operations with centralized control
- **Inventory Management**: Real-time stock tracking with low-stock alerts
- **Farmer Network**: Auto-assignment of farmers to nearest hubs
- **Order Processing**: Bulk order management and distribution workflows
- **Quality Control**: Product inspection and grading systems
- **Logistics Coordination**: Delivery scheduling and real-time tracking
- **Analytics Dashboard**: Performance metrics and revenue tracking
- **Admin Portal**: Hub network management and capacity monitoring

### 🛒 **Customers**
- **Product Discovery**: Browse fresh produce by category/location
- **Order Placement**: Easy ordering with delivery options
- **Subscription Services**: Regular delivery schedules
- **Quality Assurance**: Product reviews and ratings
- **Nutritional Information**: Detailed product information
- **Order Tracking**: Real-time delivery updates

### 🍽️ **Restaurants**
- **Bulk Ordering**: Commercial quantity purchases
- **Supplier Management**: Direct farmer relationships
- **Menu Planning**: Seasonal ingredient availability
- **Cost Management**: Competitive pricing and budgeting
- **Quality Standards**: Specification-based ordering
- **Delivery Scheduling**: Flexible delivery windows

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
- npm or yarn
- MongoDB instance
- Firebase project (optional - runs in mock mode)

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd manvaasam
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
# Configure your environment variables
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

### **Build Commands**
```bash
# Development with turbo mode
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# Performance analysis
npm run build:analyze
```

## 🌐 Application Structure

### **Authentication Flow**
```
Home Page → Role Selection → Login/Register → Dashboard
```

### **User Journeys**

**Farmer Registration:**
1. Select "Farmer" role
2. Complete registration with passkey setup
3. Access farmer dashboard
4. Add crops and manage inventory

**Customer Shopping:**
1. Browse products by category
2. Add items to cart
3. Place order with delivery details
4. Track order status

**Hub Operations:**
1. Manage farmer network
2. Process incoming inventory
3. Fulfill customer orders
4. Coordinate deliveries

## 📱 Mobile Experience

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large tap targets and smooth interactions
- **Fast Loading**: Optimized performance for mobile networks
- **Offline Support**: Basic functionality without internet
- **PWA Ready**: Installable as mobile app

## 🔒 Security Features

- **Firebase Authentication**: Industry-standard security
- **Passkey Support**: Biometric authentication for farmers
- **HTTP-Only Cookies**: Secure session management
- **Input Validation**: Comprehensive form validation
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API abuse prevention

## 🌍 Internationalization

- **Multi-language Support**: English, Hindi, and regional languages
- **RTL Support**: Right-to-left language compatibility
- **Cultural Adaptation**: Localized content and formats
- **Voice Assistant**: Multilingual voice commands

## 📊 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

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
- **Documentation**: [Link to detailed docs]
- **Community**: [Link to community forum]
- **Bug Reports**: [Link to issue tracker]

## 📄 Legal

- **Privacy Policy**: `/privacy`
- **Terms of Service**: `/terms`
- **Support Center**: `/support`

## 🎯 Roadmap

### **Upcoming Features**
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] IoT integration for smart farming
- [ ] Blockchain supply chain tracking
- [ ] Machine learning price prediction
- [ ] Drone delivery integration
- [ ] Carbon footprint tracking
- [ ] Farmer education platform

### **Current Version**: 1.0.0
### **Last Updated**: December 2024

---

**Built with ❤️ for the farming community**

*Manvaasam - Bridging the gap between farm and table*