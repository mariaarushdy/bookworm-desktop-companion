
import React, { useState } from 'react';
import Header from '../components/Header';
import BookCatalog from '../components/BookCatalog';
import AddBookForm from '../components/AddBookForm';
import { Book } from '../types/Book';

const Index = () => {
  const [currentView, setCurrentView] = useState<'catalog' | 'add' | 'edit'>('catalog');
  const [editingBook, setEditingBook] = useState<Book | undefined>();

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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
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
      </main>
      
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>2025 © نظام إدارة المكتبة</span>
            <span>Activate Windows - Go to Settings to activate Windows</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
