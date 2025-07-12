# *Team 2213*

Team Members :
Krish Modi - krishmodi33@gmail.com

Ansh Soni - ansh.soni0403@gmail.com

Pratham Patel - pratham042002@gmail.com

Aneri Shah - anerishah2424@gmail.com

PROBLEM STATEMENT
# TOPIC 3- ReWear – Community Clothing Exchange 
Overview: 
Develop ReWear, a web-based platform that enables users to exchange unused clothing 
through direct swaps or a point-based redemption system. The goal is to promote sustainable 
fashion and reduce textile waste by encouraging users to reuse wearable garments instead of 
discarding them. **
# ReWear - Community Clothing Exchange Platform

ReWear is a modern, sustainable fashion platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### Core Features
- **User Authentication** - Secure email/password signup and login
- **Landing Page** - Beautiful introduction with featured items carousel
- **Browse Items** - Advanced filtering, search, and sorting capabilities
- **Item Details** - Comprehensive item view with image gallery and swap options
- **Add Items** - Easy item listing with AI-powered suggestions
- **User Dashboard** - Personal stats, activity tracking, and quick actions
- **Admin Panel** - Content moderation and platform management

### Advanced Features
- **Point System** - Earn and spend points for sustainable fashion
- **Direct Swaps** - Request swaps with other community members
- **AI Integration** - Smart suggestions for item titles, descriptions, and pricing
- **Real-time Updates** - Live data synchronization across the platform
- **Responsive Design** - Beautiful UI that works on all devices

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Icons**: Heroicons
- **File Upload**: React Dropzone

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewear-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL commands from `database-setup.sql` in your Supabase SQL editor
   - Configure authentication settings in Supabase dashboard

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Tables

#### `profiles`
- User profile information
- Points balance tracking
- Avatar and personal details

#### `items`
- Clothing item listings
- Images, descriptions, and metadata
- Status tracking (available, pending, swapped)

#### `swaps`
- Swap request management
- Status tracking (pending, accepted, rejected, completed)

## 🎨 UI Components

### Design System
- **Color Palette**: Emerald and teal gradients with amber accents
- **Typography**: Inter font family
- **Components**: Custom button styles, cards, and glass morphism effects
- **Animations**: Smooth transitions and hover effects

### Key Components
- `Navigation` - Responsive navigation with authentication state
- `SignInForm` / `SignUpForm` - Authentication forms with validation
- `ItemCard` - Reusable item display component
- `ImageGallery` - Multi-image display with thumbnails
- `AdminPanel` - Content moderation interface

## 🔧 API Routes

### `/api/items`
- `GET` - Fetch items with filtering and sorting
- `POST` - Create new item listings

### `/api/swaps`
- `GET` - Fetch user's swap requests
- `POST` - Create new swap requests

## 🛡️ Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Authentication** - Supabase Auth integration
- **Input Validation** - Zod schema validation
- **Admin Access** - Role-based admin panel access

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Use the provided Dockerfile
- **Self-hosted**: Build and serve the production bundle

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤖 AI Features

### Smart Suggestions
- **Title Generation** - Context-aware item titles
- **Description Writing** - Detailed item descriptions
- **Price Optimization** - Suggested point values
- **Tag Recommendations** - Relevant tags for discoverability

## 🔄 Real-time Features

- Live item status updates
- Instant swap request notifications
- Real-time point balance changes
- Live admin dashboard statistics

## 🎯 Future Enhancements

- **Chat System** - Direct messaging between users
- **Image Recognition** - AI-powered item categorization
- **Recommendation Engine** - Personalized item suggestions
- **Mobile App** - Native iOS/Android applications
- **Payment Integration** - Premium features and donations
- **Social Features** - User profiles and following system

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🙏 Acknowledgments

- **Supabase** for the amazing backend platform
- **Vercel** for seamless deployment
- **Tailwind CSS** for the utility-first CSS framework
- **Heroicons** for the beautiful icon set
- **Next.js** team for the incredible React framework

---

**Made with ❤️ for sustainable fashion**
