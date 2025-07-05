import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, ChevronDown, ChevronUp, BookOpen, RotateCcw } from 'lucide-react';
import { Book } from '../types/Book';
import { v4 as uuidv4 } from 'uuid';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';

interface BookCatalogProps {
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
}

const BookCatalog: React.FC<BookCatalogProps> = ({ onAddBook, onEditBook }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedStatus, setSelectedStatus] = useState('جميع الكتب');
  const [openHeadlines, setOpenHeadlines] = useState<Record<string, boolean>>({});
  const [borrowerName, setBorrowerName] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const savedBooks = localStorage.getItem('library_books');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.subject.toString().includes(searchTerm) ||
                         book.serialNumber.toString().includes(searchTerm) ||
                         (book.headlines && book.headlines.some(headline => 
                           headline.text.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    
    let matchesStatus = true;
    if (selectedStatus === 'الكتب المستعارة') {
      matchesStatus = book.borrowedBy && book.borrowedBy.length > 0;
    } else if (selectedStatus === 'الكتب المتاحة') {
      matchesStatus = book.availableCopies > 0;
    }
    
    return matchesSearch && matchesStatus;
  });

  const deleteBook = (id: string) => {
    const updatedBooks = books.filter(book => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('library_books', JSON.stringify(updatedBooks));
  };

  const toggleHeadlines = (bookId: string) => {
    setOpenHeadlines(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const borrowBook = (bookId: string, borrowerName: string) => {
    const updatedBooks = books.map(book => {
      if (book.id === bookId && book.availableCopies > 0) {
        const borrowedBy = book.borrowedBy || [];
        // Add log entry
        addLog(book.id, book.title, borrowerName, 'borrow', book.serialNumber, book.subject);
        return {
          ...book,
          availableCopies: book.availableCopies - 1,
          borrowedBy: [...borrowedBy, { name: borrowerName, date: new Date().toISOString() }]
        };
      }
      return book;
    });
    setBooks(updatedBooks);
    localStorage.setItem('library_books', JSON.stringify(updatedBooks));
    setBorrowerName('');
    setSelectedBookId(null);
  };

  const returnBook = (bookId: string, borrowerIndex: number) => {
    const updatedBooks = books.map(book => {
      if (book.id === bookId && book.borrowedBy && book.borrowedBy.length > 0) {
        const borrowedBy = [...book.borrowedBy];
        const returningBorrower = borrowedBy[borrowerIndex];
        borrowedBy.splice(borrowerIndex, 1);
        // Add log entry
        addLog(book.id, book.title, returningBorrower.name, 'return', book.serialNumber, book.subject);
        return {
          ...book,
          availableCopies: book.availableCopies + 1,
          borrowedBy
        };
      }
      return book;
    });
    setBooks(updatedBooks);
    localStorage.setItem('library_books', JSON.stringify(updatedBooks));
  };

  const handleBorrowSubmit = () => {
    if (selectedBookId && borrowerName.trim()) {
      borrowBook(selectedBookId, borrowerName.trim());
      setIsDialogOpen(false); // Close dialog after borrowing
    }
  };

  const handleDialogCancel = () => {
    setBorrowerName('');
    setSelectedBookId(null);
    setIsDialogOpen(false);
  };

  const addLog = (bookId: string, bookTitle: string, borrowerName: string, action: 'borrow' | 'return', serialNumber: number, specialNumber?: string) => {
    const logs = JSON.parse(localStorage.getItem('library_logs') || '[]');
    const newLog = {
      id: uuidv4(),
      bookId,
      bookTitle,
      borrowerName,
      action,
      timestamp: new Date().toISOString(),
      serialNumber,
      specialNumber
    };
    logs.push(newLog);
    localStorage.setItem('library_logs', JSON.stringify(logs));
  };


  const statusOptions = ['جميع الكتب', 'الكتب المتاحة', 'الكتب المستعارة'];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-end px-1">
        <h2 className="text-2xl font-bold">كتالوج المكتبة</h2>
        <div className="text-md text-gray-700 font-normal">{filteredBooks.length} كتاب في المجموعة</div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-1">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="البحث بالعنوان، المؤلف، الرقم الخاص، العناوين الفرعية، أو الرقم العام..."
            className="form-input pl-11 bg-[#f8f6f3] font-normal text-base w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: "#f8f6f3", minHeight: 44 }}
          />
        </div>
        <div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full bg-[#f8f6f3]" style={{ minHeight: 44 }}>
              <SelectValue placeholder="اختر حالة الكتب" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Books grid/cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl"
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-2 hover:bg-gray-100 rounded"
                      title="حذف"
                    >
                      <Trash2 size={17} className="text-red-600" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيتم حذف الكتاب "{book.title}" نهائياً ولا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteBook(book.id)} className="text-white">
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <div className="space-y-1 text-base text-gray-800">
              <div className="flex justify-between"><span className="font-medium">الرقم العام:</span> <span>{book.serialNumber}</span></div>
              <div className="flex justify-between"><span className="font-medium">الموقع:</span> <span>{book.shelf ? `الافقي ${book.shelf}${book.column ? `، الراسي ${book.column}` : ""}` : "—"}</span></div>
              <div className="flex justify-between"><span className="font-medium">إجمالي النسخ:</span> <span>{book.totalCopies}</span></div>
              <div className="flex justify-between"><span className="font-medium">متاح:</span> <span>{book.availableCopies}</span></div>
              <div className="flex justify-between"><span className="font-medium">الرقم الخاص:</span> <span>{book.subject || "—"}</span></div>
              {/* <div className="flex justify-between"><span className="font-medium">ص</span> <span>{book.pages || "—"}</span></div> */}
            </div>

            {/* Borrowed Books Section */}
            {book.borrowedBy && book.borrowedBy.length > 0 && (
              <div className="mt-4 bg-yellow-50 rounded p-3">
                <h4 className="font-medium text-sm text-yellow-800 mb-2">المستعارون:</h4>
                <div className="space-y-2">
                  {book.borrowedBy.map((borrower, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-yellow-700">{borrower.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-yellow-600">
                          {new Date(borrower.date).toLocaleDateString('ar-EG')}
                        </span>
                        <button
                          onClick={() => returnBook(book.id, index)}
                          className="p-1 hover:bg-yellow-200 rounded text-yellow-700"
                          title="إرجاع"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Headlines Section */}
            {book.headlines && book.headlines.length > 0 && (
              <div className="mt-4">
                <Collapsible 
                  open={openHeadlines[book.id]} 
                  onOpenChange={() => toggleHeadlines(book.id)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
                    <span>العناوين الفرعية ({book.headlines.length})</span>
                    {openHeadlines[book.id] ? 
                      <ChevronUp size={16} /> : 
                      <ChevronDown size={16} />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="bg-gray-50 rounded p-3 space-y-2">
                      {book.headlines.map((headline, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">ص {headline.page}</span>
                          <span className="text-gray-800 text-right flex-1 mr-3">{headline.text}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            <div className="mt-6">
              {book.availableCopies > 0 ? (
                <Dialog open={isDialogOpen && selectedBookId === book.id} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button 
                      onClick={() => {
                        setSelectedBookId(book.id);
                        setIsDialogOpen(true);
                      }}
                      className="w-full bg-[#233958] text-white py-2 rounded-md flex items-center justify-center gap-2 font-medium text-lg hover:bg-blue-900 transition"
                    >
                      <BookOpen size={18} />
                      <span>استعارة</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>استعارة كتاب</DialogTitle>
                      <DialogDescription>
                        أدخل اسم المستعير لكتاب "{book.title}"
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <input
                        type="text"
                        placeholder="اسم المستعير"
                        className="form-input w-full"
                        value={borrowerName}
                        onChange={(e) => setBorrowerName(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={handleDialogCancel}
                      >
                        إلغاء
                      </Button>
                      <Button 
                        onClick={handleBorrowSubmit}
                        disabled={!borrowerName.trim()}
                        className="text-white"
                      >
                        تأكيد الاستعارة
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <button 
                  disabled
                  className="w-full bg-gray-400 text-white py-2 rounded-md flex items-center justify-center gap-2 font-medium text-lg cursor-not-allowed"
                >
                  <BookOpen size={18} />
                  <span>غير متاح</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-lg font-normal">
            {searchTerm 
              ? 'لم يتم العثور على كتب تطابق البحث'
              : 'لا توجد كتب في المكتبة بعد'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCatalog;
