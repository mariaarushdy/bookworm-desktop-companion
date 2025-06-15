
import React, { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from "lucide-react";

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
    column: '',
    pages: 1,
    headline: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        serialNumber: book.serialNumber.toString(),
        subject: book.subject,
        totalCopies: book.totalCopies,
        shelf: book.shelf || '',
        column: book.column || '',
        pages: book.pages || 1,
        headline: book.headline || ''
      });
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
    console.log('إضافة عنوان فرعي');
    // You can add functionality here for adding headlines
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const books = JSON.parse(localStorage.getItem('library_books') || '[]');
    
    if (book) {
      // Edit existing book
      const updatedBooks = books.map((b: Book) => 
        b.id === book.id 
          ? {
              ...b,
              ...formData,
              serialNumber: parseInt(formData.serialNumber),
              availableCopies: formData.totalCopies // Reset available copies when editing
            }
          : b
      );
      localStorage.setItem('library_books', JSON.stringify(updatedBooks));
    } else {
      // Add new book
      const newBook: Book = {
        id: uuidv4(),
        ...formData,
        serialNumber: parseInt(formData.serialNumber),
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
            <label className="form-label font-bold mb-2 text-base">الرقم التسلسلي *</label>
            <input
              type="number"
              name="serialNumber"
              className="form-input bg-[#f8f6f3]"
              placeholder="الرقم التسلسلي للكتاب"
              value={formData.serialNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">المحتوى *</label>
            <input
              type="text"
              name="subject"
              className="form-input bg-[#f8f6f3]"
              placeholder="موضوع الكتاب"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
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
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">الصف</label>
            <input
              type="text"
              name="shelf"
              className="form-input bg-[#f8f6f3]"
              placeholder="رقم الصف"
              value={formData.shelf}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold mb-2 text-base">العمود</label>
            <input
              type="text"
              name="column"
              className="form-input bg-[#f8f6f3]"
              placeholder="رقم العمود"
              value={formData.column}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          {/* "+" button above, then page and headline inputs side by side and looking good */}
          <div className="flex flex-col items-start gap-1">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-[#E6ECF3] text-[#233958] rounded-md border border-[#d0d6de] hover:bg-[#d5e3f5] transition mb-2 cursor-pointer"
              aria-label="إضافة عنوان فرعي"
              onClick={handleAddHeadline}
            >
              <Plus size={18} />
            </button>
            <div className="flex flex-row gap-3 items-center w-full">
              <div className="flex items-center gap-1 w-28">
                <input
                  type="number"
                  name="pages"
                  className="form-input bg-[#f8f6f3] h-8 text-xs px-2 py-1 w-16 text-center"
                  placeholder="الصفحة"
                  value={formData.pages}
                  onChange={handleInputChange}
                  min="1"
                  style={{ fontSize: "0.92rem" }}
                />
                <span className="text-sm ml-1" style={{ fontSize: "0.95rem", color: '#4B5563' }}>ص</span>
              </div>
              <input
                type="text"
                name="headline"
                className="form-input bg-[#f8f6f3] h-8 text-xs px-2 py-1 flex-1"
                placeholder="عنوان فرعي"
                value={formData.headline}
                onChange={handleInputChange}
                style={{ fontSize: "0.93rem" }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
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
