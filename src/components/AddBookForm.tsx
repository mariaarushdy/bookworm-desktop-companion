
import React, { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X } from "lucide-react";

interface AddBookFormProps {
  book?: Book;
  onSave: () => void;
  onCancel: () => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    serialNumber: '',
    subject: '',
    totalCopies: 1,
    shelf: '',
    column: ''
  });

  const [headlines, setHeadlines] = useState<{ page: number; text: string; id: string }[]>([
    { page: 1, text: '', id: uuidv4() }
  ]);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        serialNumber: book.serialNumber.toString(),
        subject: book.subject,
        totalCopies: book.totalCopies,
        shelf: book.shelf || '',
        column: book.column || ''
      });
      
      if (book.headlines && book.headlines.length > 0) {
        setHeadlines(book.headlines.map(h => ({ ...h, id: uuidv4() })));
      }
    }
  }, [book]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddHeadline = () => {
    setHeadlines(prev => [...prev, { page: 1, text: '', id: uuidv4() }]);
  };

  const handleRemoveHeadline = (id: string) => {
    if (headlines.length > 1) {
      setHeadlines(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleHeadlineChange = (id: string, field: 'page' | 'text', value: string | number) => {
    setHeadlines(prev => prev.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  const updateLogsBookTitle = (bookId: string, newTitle: string) => {
    const logs = JSON.parse(localStorage.getItem('library_logs') || '[]');
    const updatedLogs = logs.map((log: any) => 
      log.bookId === bookId 
        ? { ...log, bookTitle: newTitle }
        : log
    );
    localStorage.setItem('library_logs', JSON.stringify(updatedLogs));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const books = JSON.parse(localStorage.getItem('library_books') || '[]');
    
    // Filter out empty headlines
    const validHeadlines = headlines
      .filter(h => h.text.trim() !== '')
      .map(({ id, ...h }) => h);
    
    if (book) {
      // Edit existing book
      const updatedBooks = books.map((b: Book) => 
        b.id === book.id 
          ? {
              ...b,
              ...formData,
              serialNumber: parseInt(formData.serialNumber),
              headlines: validHeadlines,
              availableCopies: formData.totalCopies // Reset available copies when editing
            }
          : b
      );
      localStorage.setItem('library_books', JSON.stringify(updatedBooks));
      
      // Update logs if book title changed
      if (book.title !== formData.title) {
        updateLogsBookTitle(book.id, formData.title);
      }
    } else {
      // Add new book
      const newBook: Book = {
        id: uuidv4(),
        ...formData,
        serialNumber: parseInt(formData.serialNumber),
        headlines: validHeadlines,
        availableCopies: formData.totalCopies,
        dateAdded: new Date().toISOString()
      };
      books.push(newBook);
      localStorage.setItem('library_books', JSON.stringify(books));
    }
    
    onSave();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto p-10 mt-4" style={{ minWidth: 350 }}>
      <h2 className="text-2xl font-extrabold mb-8"> {book ? 'تعديل الكتاب' : 'إضافة كتاب جديد'} </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">العنوان *</label>
            <input
              type="text"
              name="title"
              className="form-input bg-[#f8f6f3]"
              placeholder="عنوان الكتاب"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">المؤلف *</label>
            <input
              type="text"
              name="author"
              className="form-input bg-[#f8f6f3]"
              placeholder="اسم المؤلف"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">الرقم العام *</label>
            <input
              type="number"
              name="serialNumber"
              className="form-input bg-[#f8f6f3]"
              placeholder="الرقم العام للكتاب"
              value={formData.serialNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">الرقم الخاص *</label>
            <input
              type="number"
              name="subject"
              className="form-input bg-[#f8f6f3]"
              placeholder="الرقم الخاص"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">الافقي *</label>
            <input
              type="text"
              name="shelf"
              className="form-input bg-[#f8f6f3]"
              placeholder="الافقي"
              value={formData.shelf}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">الراسي *</label>
            <input
              type="number"
              name="column"
              className="form-input bg-[#f8f6f3]"
              placeholder="الراسي"
              value={formData.column}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">عدد النسخ *</label>
            <input
              type="number"
              name="totalCopies"
              className="form-input bg-[#f8f6f3]"
              placeholder="عدد النسخ"
              value={formData.totalCopies}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
        <div>
          <div className="flex flex-col items-start gap-1">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-[#E6ECF3] text-[#233958] rounded-md border border-[#d0d6de] hover:bg-[#d5e3f5] transition mb-2 cursor-pointer"
              aria-label="إضافة عنوان فرعي"
              onClick={handleAddHeadline}
            >
              <Plus size={18} />
            </button>
            
            <div className="w-full space-y-2">
              {headlines.map((headline) => (
                <div key={headline.id} className="flex flex-row gap-3 items-center w-full">
                  <div className="flex items-center gap-1 w-28">
                    <input
                      type="number"
                      className="form-input bg-[#f8f6f3] h-8 text-xs px-2 py-1 w-16 text-center"
                      placeholder="الصفحة"
                      value={headline.page}
                      onChange={(e) => handleHeadlineChange(headline.id, 'page', parseInt(e.target.value) || 1)}
                      min="1"
                      style={{ fontSize: "0.92rem" }}
                    />
                    <span className="text-sm ml-1" style={{ fontSize: "0.95rem", color: '#4B5563' }}>ص</span>
                  </div>
                  <input
                    type="text"
                    className="form-input bg-[#f8f6f3] h-8 text-xs px-2 py-1 flex-1"
                    placeholder="عنوان فرعي"
                    value={headline.text}
                    onChange={(e) => handleHeadlineChange(headline.id, 'text', e.target.value)}
                    style={{ fontSize: "0.93rem" }}
                  />
                  {headlines.length > 1 && (
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-md border border-red-200 hover:bg-red-200 transition cursor-pointer"
                      aria-label="حذف العنوان الفرعي"
                      onClick={() => handleRemoveHeadline(headline.id)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#6b7280] text-white px-8 py-2 rounded-md text-lg font-medium hover:bg-[#4b5563] transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="bg-[#233958] text-white px-12 py-2 rounded-md text-lg font-bold hover:bg-blue-900 transition"
          >
            {book ? 'حفظ التغييرات' : 'إضافة الكتاب'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
