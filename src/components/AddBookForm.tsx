import React, { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import { v4 as uuidv4 } from 'uuid';

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
    totalCopies: 1,
    shelf: '',
    column: '',
    subject: '',
    pages: 1
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        serialNumber: book.serialNumber.toString(),
        totalCopies: book.totalCopies,
        shelf: book.shelf || '',
        column: book.column || '',
        subject: book.subject,
        pages: book.pages || 1
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
          <label className="form-label font-bold mb-2 text-base">المحتوى أو الموضوع</label>
          <input
            type="text"
            name="subject"
            className="form-input bg-[#f8f6f3] mb-4"
            placeholder="العنوان أو الموضوع"
            value={formData.subject}
            onChange={handleInputChange}
          />
          <div className="flex gap-3 items-center">
            <input
              type="number"
              name="pages"
              className="form-input bg-[#f8f6f3] w-32"
              placeholder="الصفحة"
              value={formData.pages}
              onChange={handleInputChange}
              min="1"
            />
            <span className="text-base ml-2">ص</span>
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
