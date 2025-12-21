# Frontend Architecture

## Overview
The frontend is built with React and TypeScript, using Vite as the build tool. The UI is styled with Tailwind CSS and follows a component-based architecture.

## Technology Stack
- **Framework**: React 19 with Hooks
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API, Convex React SDK, and Framer Motion
- **Routing**: React Router v6 (Direct URL access implemented)
- **UI Components**: Radix UI & Lucide React icons
- **Notifications**: Sonner
- **Animations**: Framer Motion

## Project Structure
```
src/
├── components/           # Shared components
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   ├── ui/              # Reusable UI components (Button, Input, Modal)
│   └── ThemeProvider.tsx # Dark/light theme context
├── features/            # Feature-specific components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── documents/       # Document management
│   ├── expenses/        # Expense tracking
│   ├── products/        # Product management
│   ├── reports/         # Reporting components
│   ├── sales/           # Sales management
│   ├── settings/        # User settings
│   ├── cash-tracking/    # Cash & Debt Tracking
│   └── users/           # User management
├── lib/                 # Utility functions
└── App.tsx             # Root application component
```

## Component Architecture

### Layout Components
- `Navbar`: Top navigation bar with profile dropdown
- `Sidebar`: Side navigation menu
- `BusinessDashboard`: Main dashboard layout component

### Feature Components
Each feature has its own directory with related components:
- **Auth**: Sign in, sign up, and Staff-specific login portal
- **Dashboard**: Main dashboard view with statistics and real-time graphs
- **Products**: Product listing, creation, and 2-phase approval workflow
- **Sales**: Sales recording, debt tracking, and transaction auditing
- **Expenses**: Expense tracking with category-based budgets
- **Documents**: Folder-based file management system
- **Cash Tracking**: Financial flows, including bank/mobile money deposits
- **Staff**: Dedicated UI for managing staff roles and permissions
- **Reports**: Daily and monthly business analytics
- **Settings**: User profile and application preferences
- **Users**: Team member management

### UI Components
Reusable UI components in `src/components/ui/`:
- `Button`: Customizable button component
- `Input`: Styled input field
- `Modal`: Modal dialog component
- `Portal`: React portal for rendering overlays
- `StatCard`: Statistics card for dashboard

## State Management

### React Context
- `ThemeProvider`: Manages dark/light theme state
- Custom contexts for feature-specific state when needed

### Convex Integration
- `useQuery`: For fetching real-time data
- `useMutation`: For modifying data
- `useAction`: For complex operations
- Automatic subscription and re-rendering when data changes

## Routing
Implemented with React Router v6:
- `/` - Dashboard (default route)
- `/:module` - Specific module views (products, sales, cash-tracking, etc.)
- Authentication routes handled by Convex components

Navigation between modules is handled by the `BusinessDashboard` component which manages the active module state and renders the appropriate feature component.

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom color palette for light/dark themes
- Responsive design for all screen sizes
- Consistent spacing and typography

### Theme System
- Light and dark themes
- Theme preference persisted in localStorage
- Toggle button in Navbar
- Context-based theme switching

## Key Features

### Real-time Updates
- Data automatically updates when backend changes
- No manual refresh required
- Smooth user experience with live data

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly controls
- Collapsible sidebar for mobile

### Accessibility
- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigation support
- Color contrast compliant with WCAG

### Performance Optimizations
- Code splitting by route
- Lazy loading of non-critical components
- Efficient re-rendering with React.memo
- Bundle optimization with Vite

## Build and Deployment

### Development
- Hot module replacement with Vite
- TypeScript compilation
- Tailwind CSS JIT compilation

### Production
- Minified bundle generation
- Static asset optimization
- Environment variable injection

## Testing
- Component testing with Jest and React Testing Library
- End-to-end testing with Cypress
- Visual regression testing

## Future Enhancements
- Progressive Web App (PWA) support
- Advanced caching strategies
- Offline functionality
- Internationalization (i18n)