import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
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
    const savedBooks = localStorage.getItem('library_books');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-row-reverse justify-between items-end px-1">
        <h2 className="text-2xl font-bold">كتالوج المكتبة</h2>
        <div className="text-md text-gray-700 font-normal">{filteredBooks.length} كتاب في المجموعة</div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-1">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="البحث بالعنوان، المؤلف، المحتوى، أو الرقم التسلسلي..."
            className="form-input pl-11 bg-[#f8f6f3] font-normal text-base w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: "#f8f6f3", minHeight: 44 }}
          />
        </div>
        <div>
          <select
            className="form-input bg-[#f8f6f3] w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ minHeight: 44 }}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Books grid/cards */}
      <div className="flex flex-col gap-8">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-lg p-6 transition-all"
            style={{ minWidth: 340, maxWidth: 400, marginRight: "auto", marginLeft: "auto" }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                <div className="text-sm text-gray-500 font-normal">بواسطة {book.author}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditBook(book)}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="تعديل"
                >
                  <Edit size={17} className="text-gray-700" />
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="حذف"
                >
                  <Trash2 size={17} className="text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="space-y-1 text-base text-gray-800">
              <div className="flex justify-between"><span className="font-medium">الرقم التسلسلي:</span> <span>{book.serialNumber}</span></div>
              <div className="flex justify-between"><span className="font-medium">الموقع:</span> <span>{book.shelf ? `الصف ${book.shelf}${book.column ? `، العمود ${book.column}` : ""}` : "—"}</span></div>
              <div className="flex justify-between"><span className="font-medium">إجمالي النسخ:</span> <span>{book.totalCopies}</span></div>
              <div className="flex justify-between"><span className="font-medium">متاح:</span> <span>{book.availableCopies}</span></div>
              <div className="flex justify-between"><span className="font-medium">المحتوى:</span> <span>{book.subject || "—"}</span></div>
              <div className="flex justify-between"><span className="font-medium">ص</span> <span>{book.pages || "—"}</span></div>
            </div>
            <div className="mt-6">
              <button onClick={() => onEditBook(book)} className="w-full bg-[#233958] text-white py-2 rounded-md flex items-center justify-center gap-2 font-medium text-lg hover:bg-blue-900 transition">
                <Edit size={18} />
                <span>إعادة</span>
              </button>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-lg font-normal">
            {(searchTerm || selectedCategory !== 'جميع الكتب') 
              ? 'لم يتم العثور على كتب تطابق البحث'
              : 'لا توجد كتب في المكتبة بعد'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCatalog;
