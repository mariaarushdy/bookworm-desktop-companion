
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
    <div className="library-card p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6">
        {book ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">العنوان *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="عنوان الكتاب"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">المؤلف *</label>
            <input
              type="text"
              name="author"
              className="form-input"
              placeholder="اسم المؤلف"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">الرقم التسلسلي *</label>
            <input
              type="number"
              name="serialNumber"
              className="form-input"
              placeholder="الرقم التسلسلي للكتاب"
              value={formData.serialNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">عدد النسخ *</label>
            <input
              type="number"
              name="totalCopies"
              className="form-input"
              placeholder="عدد النسخ"
              value={formData.totalCopies}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">الرف</label>
            <input
              type="text"
              name="shelf"
              className="form-input"
              placeholder="رقم الرف"
              value={formData.shelf}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">العمود</label>
            <input
              type="text"
              name="column"
              className="form-input"
              placeholder="رقم العمود"
              value={formData.column}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">الموضوع والمحتوى</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="subject"
              className="form-input flex-1"
              placeholder="الموضوع أو الموضوع"
              value={formData.subject}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="pages"
              className="form-input w-32"
              placeholder="الصفحة"
              value={formData.pages}
              onChange={handleInputChange}
              min="1"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {book ? 'حفظ التغييرات' : 'إضافة الكتاب'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
