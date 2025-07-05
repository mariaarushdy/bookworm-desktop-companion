# Bookworm Desktop Companion

A comprehensive library management system built with React and TypeScript for managing personal or small library collections.

## 🚀 Features

### 📚 Book Management
- **Add Books**: Complete book information including title, author, serial numbers, location, and headlines
- **Edit Books**: Update book information with automatic log synchronization
- **Search & Filter**: Advanced search by title, author, numbers, or headlines
- **3-Column Layout**: Responsive grid display for better book browsing

### 📊 Borrowing System
- **Borrow Books**: Track who borrowed which books with timestamps
- **Return Books**: Easy return process with one-click functionality
- **Availability Tracking**: Real-time available/borrowed status
- **Multiple Copies**: Support for multiple copies of the same book

### 📈 Analytics & Logs
- **Complete History**: Every borrow and return operation is logged
- **Statistics Dashboard**: Total borrows, returns, and currently borrowed books
- **Popular Books**: Track which books are borrowed most frequently
- **Active Borrowers**: See who borrows books most often
- **Search & Filter Logs**: Find specific transactions easily

### 💻 Desktop App Support
- **Offline Capability**: Works completely offline using localStorage
- **Desktop Application**: Electron-based desktop app for native experience
- **Static Website**: Can be used as a simple website by opening index.html

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Desktop**: Capacitor + Electron
- **Build Tool**: Vite
- **Storage**: Browser localStorage (no server required)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Development
```bash
# Clone the repository
git clone https://github.com/mariaarushdy/bookworm-desktop-companion.git
cd bookworm-desktop-companion

# Install dependencies
npm install

# Start development server
npm run dev
```

### Static Website (No Server Required)
```bash
# Build the project
npm run build

# Open dist/index.html in your browser
# That's it! The website works offline
```

### Desktop Application
```bash
# Build and run desktop app
npm run electron:dev

# Build desktop app installer
npm run electron:dist
```

## 🚀 Usage

### Adding Books
1. Click "إضافة كتاب جديد" (Add New Book)
2. Fill in book details including numbers and location
3. Add sub-headlines with page numbers (optional)
4. Save the book

### Managing Borrowing
1. Go to "تصفح الكتب" (Browse Books)
2. Click "استعارة" (Borrow) on available books
3. Enter borrower name and confirm
4. Use "إرجاع" (Return) button when book is returned

### Viewing Analytics
1. Click "سجل العمليات" (Operations Log)
2. View statistics and popular books/borrowers
3. Search through historical transactions
4. Filter by borrow/return operations

## 📱 Features Overview

- **🔍 Advanced Search**: Search across all book fields and borrower names
- **📊 Real-time Statistics**: Live updates of library usage
- **🎯 Responsive Design**: Works on desktop, tablet, and mobile
- **💾 Data Persistence**: All data saved locally in browser
- **🔒 Offline First**: No internet connection required
- **🎨 Arabic Support**: Full RTL language support

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👩‍💻 Author

Built with ❤️ for library management needs.
