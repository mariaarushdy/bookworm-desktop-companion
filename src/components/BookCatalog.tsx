
import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { Book } from '../types/Book';

interface BookCatalogProps {
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
}

const BookCatalog: React.FC<BookCatalogProps> = ({ onAddBook, onEditBook }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('جميع الكتب');

  useEffect(() => {
    // Load books from localStorage
    const savedBooks = localStorage.getItem('library_books');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.serialNumber.toString().includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'جميع الكتب' || book.subject === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const deleteBook = (id: string) => {
    const updatedBooks = books.filter(book => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('library_books', JSON.stringify(updatedBooks));
  };

  const categories = ['جميع الكتب', ...Array.from(new Set(books.map(book => book.subject)))];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">كتالوج المكتبة</h2>
        <div className="text-sm text-gray-600">
          كتاب في المجموعة {filteredBooks.length}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="البحث في الكتب... البحث بالعنوان، المؤلف، أو الرقم التسلسلي"
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="form-input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid gap-4">
        {filteredBooks.map(book => (
          <div key={book.id} className="library-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                <div className="text-sm text-gray-600">بواسطة {book.author}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditBook(book)}
                  className="btn-secondary p-2"
                  title="تعديل"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="btn-secondary p-2 bg-red-600 hover:bg-red-700"
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">الرقم التسلسلي:</span>
                <div>{book.serialNumber}</div>
              </div>
              <div>
                <span className="font-medium">الموضوع:</span>
                <div>{book.subject}</div>
              </div>
              <div>
                <span className="font-medium">إجمالي النسخ:</span>
                <div>{book.totalCopies}</div>
              </div>
              <div>
                <span className="font-medium">متاح:</span>
                <div>{book.availableCopies}</div>
              </div>
              <div>
                <span className="font-medium">المخزن:</span>
                <div>{book.shelf || 'غير محدد'}</div>
              </div>
              <div>
                <span className="font-medium">رقم العمود:</span>
                <div>{book.column || 'غير محدد'}</div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredBooks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || selectedCategory !== 'جميع الكتب' 
              ? 'لم يتم العثور على كتب تطابق البحث'
              : 'لا توجد كتب في المكتبة بعد'
            }
          </div>
        )}
      </div>

      {/* Add Book Button */}
      <div className="fixed bottom-6 left-6">
        <button
          onClick={onAddBook}
          className="btn-primary rounded-full p-4 shadow-lg flex items-center gap-2"
          title="إضافة كتاب جديد"
        >
          <Plus size={20} />
          <span className="hidden md:inline">إضافة كتاب جديد</span>
        </button>
      </div>
    </div>
  );
};

export default BookCatalog;
