# Zenith - Premium Developer Resources Hub

A modern, anime-aesthetic web application built with Astro, featuring Firebase authentication and Firestore database integration. This is a premium-quality resource hub for developers to discover, submit, and discuss software, plugins, and scripts.

## 🌟 Features

- **Premium Design**: Anime/lofi aesthetic with black and purple color palette
- **Firebase Integration**: Google Authentication + Firestore database
- **Resource Management**: Submit, approve, and manage developer resources
- **Community Hub**: Discussion board for resource requests and general topics
- **User Dashboard**: Personal space to manage submissions and track status
- **Responsive Design**: Optimized for all devices and screen sizes
- **Modern Tech Stack**: Built with Astro, React, Tailwind CSS, and TypeScript

## 🚀 Tech Stack

- **Frontend**: Astro + React + TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-in)
- **Deployment**: Optimized for Netlify/Vercel

## 🛠️ Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings
5. Update `src/lib/firebase.ts` with your configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 2. Firestore Security Rules

Set up the following security rules in your Firestore console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Submissions collection
    match /submissions/{document} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Community posts collection
    match /community-posts/{document} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Deployment

The app is optimized for static deployment on Netlify or Vercel:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── AuthButton.tsx   # Authentication component
│   ├── Card.astro       # Resource card component
│   ├── Navigation.astro # Main navigation
│   └── SubmissionForm.tsx # Resource submission form
├── layouts/
│   └── Layout.astro     # Base layout with styles
├── lib/
│   └── firebase.ts      # Firebase configuration
├── pages/
│   ├── index.astro      # Homepage with resources
│   ├── dashboard.astro  # User dashboard
│   └── community.astro  # Community discussion board
└── styles/              # Global styles and animations
```

## 🎨 Design Features

- **Color Palette**: Black (#0a0a0c) to purple (#7c6df2) gradient
- **Typography**: Inter font family for modern, clean look
- **Animations**: Subtle hover effects, glow animations, and smooth transitions
- **Layout**: Card-based design with glassmorphism effects
- **Icons**: Lucide React icons with SVG optimization

## 🔧 Key Components

### Resource Cards
- Display software, plugins, and scripts
- Category filtering and search
- External link integration
- User action buttons (edit/delete for owners)

### Authentication System
- Google Sign-in integration
- User state management
- Protected routes and actions

### Community Features
- Discussion board with threaded conversations
- Post types: requests, discussions, help
- User profiles and avatars

### Dashboard
- Personal submission management
- Approval status tracking
- Statistics and analytics

## 📊 Database Schema

### Submissions Collection
```typescript
{
  id: string;
  name: string;
  description: string;
  icon?: string;
  link: string;
  category: 'software' | 'plugin' | 'script';
  userId: string;
  userEmail: string;
  userName: string;
  createdAt: Timestamp;
  approved: boolean;
}
```

### Community Posts Collection
```typescript
{
  id: string;
  title: string;
  content: string;
  type: 'request' | 'discussion' | 'help';
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Timestamp;
  replies: Array<Reply>;
}
```

## 🚀 Performance Optimizations

- Static site generation with Astro
- Lazy loading of React components
- Optimized images and assets
- Minimal JavaScript bundle size
- Efficient Firebase queries with indexes

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly interface elements
- Adaptive navigation and layouts

## 🔒 Security Features

- Firebase Authentication integration
- Firestore security rules
- Input validation and sanitization
- XSS protection
- CSRF protection

## 📈 Future Enhancements

- Real-time notifications
- Advanced search and filtering
- User reputation system
- Resource rating and reviews
- API integration for automated submissions
- Advanced moderation tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Astro for the amazing framework
- Tailwind CSS for utility-first styling
- Lucide for beautiful icons
- Inter font family for typography

---

Built with ❤️ for the developer community