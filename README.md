# Chai Hissab 📱☕

A minimal React PWA for tracking daily cafe expenses with real-time sync and offline support.

## Features ✨

- 📱 **PWA Support** - Install as native app with offline capability
- ⚡ **Quick Add Interface** - Fast expense logging with quantity controls
- 📊 **Purchase History** - View expenses by day/week/month
- 🔄 **Real-time Sync** - Data synced with Supabase backend
- 🌙 **Dark Mode** - Toggle between light and dark themes
- ⚙️ **Item Management** - Add, edit, and delete cafe items
- 💾 **Offline First** - Works without internet, syncs when connected

## Tech Stack 🛠️

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Shadcn/ui + Tailwind CSS
- **State**: Zustand with persistence
- **Database**: Supabase (PostgreSQL)
- **PWA**: Vite PWA plugin with Workbox

## Quick Start 🚀

### 1. Clone and Install

```bash
git clone <repository-url>
cd chai-hissab
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database

Run the SQL script in your Supabase SQL Editor:

```bash
# Copy the contents of supabase-schema.sql
# Paste and run in Supabase > SQL Editor
```

This creates:
- `items` table (cafe items with prices)
- `purchases` table (daily transactions)
- `monthly_bills` table (monthly payment tracking)

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### 5. Install as PWA

- On mobile: Tap "Add to Home Screen" when prompted
- On desktop: Click the install icon in the address bar

## Project Structure 📁

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── QuickAddGrid.tsx # Fast expense logging
│   ├── PurchaseHistory.tsx # View/manage purchases
│   ├── PeriodSelector.tsx # Date range selection
│   └── ItemManager.tsx  # Item CRUD operations
├── stores/             # Zustand store slices
│   ├── itemsSlice.ts   # Items management
│   ├── purchasesSlice.ts # Purchase tracking
│   ├── uiSlice.ts      # UI state
│   ├── syncSlice.ts    # Supabase sync
│   └── index.ts        # Combined store
├── lib/                # Utility libraries
│   ├── types.ts        # TypeScript interfaces
│   ├── supabase.ts     # Supabase client
│   ├── supabaseService.ts # API services
│   └── utils.ts        # Helper functions
└── App.tsx             # Main app component
```

## Usage Guide 📖

### Adding Expenses

1. **Quick Add Tab**: Tap items to add quantities
2. **Quantity Controls**: Use +/- buttons or type directly
3. **Batch Add**: Select multiple items, then "Add to Expenses"

### Viewing History

1. **History Tab**: View all purchases
2. **Period Selector**: Switch between Day/Week/Month
3. **Navigation**: Use arrows to browse dates
4. **Delete**: Tap trash icon to remove purchases

### Managing Items

1. **Settings Tab**: Access item management
2. **Add Items**: Set name and price for new items
3. **Edit Items**: Update existing item details
4. **Delete Items**: Remove items (with confirmation)

## Database Schema 🗃️

### Items Table
```sql
id          UUID PRIMARY KEY
name        VARCHAR(255) UNIQUE
current_price DECIMAL(10,2)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### Purchases Table
```sql
id          UUID PRIMARY KEY
item_id     UUID REFERENCES items(id)
item_name   VARCHAR(255) -- denormalized
quantity    INTEGER
unit_price  DECIMAL(10,2)
total       DECIMAL(10,2)
date        DATE
created_at  TIMESTAMP
```

### Monthly Bills Table
```sql
id          UUID PRIMARY KEY
month       INTEGER (1-12)
year        INTEGER
amount_paid DECIMAL(10,2)
date_paid   DATE
created_at  TIMESTAMP
```

## API Integration 🔌

The app automatically:
- Loads items from Supabase on startup
- Syncs purchases in real-time
- Falls back to local storage if offline
- Retries failed operations when back online

## PWA Features 📱

- **Offline Support**: Core functionality works without internet
- **Background Sync**: Syncs data when connection restored
- **App-like Experience**: Full-screen, splash screen, app icons
- **Cross-platform**: Works on iOS, Android, desktop

## Contributing 🤝

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License.

## Support 💡

For issues and questions:
1. Check the [Issues](link-to-issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

Made with ❤️ for tracking your daily chai expenses!