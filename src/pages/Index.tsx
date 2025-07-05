
import React, { useState } from 'react';
import Header from '../components/Header';
import BookCatalog from '../components/BookCatalog';
import AddBookForm from '../components/AddBookForm';
import BookLogs from '../components/BookLogs';
import { Book } from '../types/Book';

const TABS = [
  { id: "catalog", label: "تصفح الكتب" },
  { id: "add", label: "إضافة كتاب جديد" },
  { id: "logs", label: "سجل العمليات" }
];

const Index = () => {
  const [currentView, setCurrentView] = useState<'catalog' | 'add' | 'edit' | 'logs'>('catalog');
  const [editingBook, setEditingBook] = useState<Book | undefined>();

  const handleTabChange = (id: string) => {
    setEditingBook(undefined);
    setCurrentView(id as any);
  };

  const handleAddBook = () => {
    setEditingBook(undefined);
    setCurrentView('add');
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setCurrentView('edit');
  };

  const handleSave = () => {
    setCurrentView('catalog');
    setEditingBook(undefined);
  };

  const handleCancel = () => {
    setCurrentView('catalog');
    setEditingBook(undefined);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col" dir="rtl">
      <Header />
      {/* Tab Bar */}
      <div className="w-full flex items-center gap-2 bg-[#faf7f2] border-b border-[#e1e1e1] py-8">
        <div className="container flex gap-2 px-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`px-8 py-3 rounded-md font-medium transition border 
                ${((currentView === tab.id) || (tab.id === "add" && currentView === "edit")) ?
                  "bg-white border-[#e1e1e1] text-blue-900 shadow-sm" :
                  "bg-[#f8f6f3] border-transparent hover:bg-white hover:border-[#e1e1e1] text-gray-600"}`
              }
              style={{ minWidth: 180 }}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        {currentView === 'catalog' && (
          <BookCatalog 
            onAddBook={handleAddBook}
            onEditBook={handleEditBook}
          />
        )}
        {(currentView === 'add' || currentView === 'edit') && (
          <AddBookForm
            book={editingBook}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        {currentView === 'logs' && (
          <BookLogs />
        )}
      </main>
      <footer className="bg-[#233958] border-t mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center text-sm text-white">
            <span>2025 © نظام إدارة المكتبة</span>
            <span className="opacity-70">Activate Windows - Go to Settings to activate Windows</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
