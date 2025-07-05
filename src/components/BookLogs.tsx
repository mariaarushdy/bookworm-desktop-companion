import React, { useState, useEffect } from 'react';
import { Calendar, User, Book, TrendingUp, RotateCcw, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  action: 'borrow' | 'return';
  timestamp: string;
  serialNumber: number;
  specialNumber?: string;
}

interface BookStats {
  bookTitle: string;
  borrowCount: number;
  serialNumber: number;
  specialNumber?: string;
}

interface BorrowerStats {
  name: string;
  borrowCount: number;
}

const BookLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'borrow' | 'return'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedLogs = localStorage.getItem('library_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.action === filter;
    const matchesSearch = log.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.serialNumber.toString().includes(searchTerm) ||
                         (log.specialNumber && log.specialNumber.toString().includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const bookStats: BookStats[] = logs
    .filter(log => log.action === 'borrow')
    .reduce((acc: BookStats[], log) => {
      const existing = acc.find(stat => stat.serialNumber === log.serialNumber);
      if (existing) {
        existing.borrowCount++;
      } else {
        acc.push({
          bookTitle: log.bookTitle,
          borrowCount: 1,
          serialNumber: log.serialNumber,
          specialNumber: log.specialNumber
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.borrowCount - a.borrowCount);

  const borrowerStats: BorrowerStats[] = logs
    .filter(log => log.action === 'borrow')
    .reduce((acc: BorrowerStats[], log) => {
      const existing = acc.find(stat => stat.name === log.borrowerName);
      if (existing) {
        existing.borrowCount++;
      } else {
        acc.push({
          name: log.borrowerName,
          borrowCount: 1
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.borrowCount - a.borrowCount);

  const totalBorrows = logs.filter(log => log.action === 'borrow').length;
  const totalReturns = logs.filter(log => log.action === 'return').length;
  const currentlyBorrowed = totalBorrows - totalReturns;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end px-1">
        <h2 className="text-2xl font-bold">سجل العمليات</h2>
        <div className="text-md text-gray-700 font-normal">{filteredLogs.length} عملية</div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Book className="text-blue-600" size={20} />
            <span className="font-medium text-gray-700">إجمالي الاستعارات</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalBorrows}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="text-green-600" size={20} />
            <span className="font-medium text-gray-700">إجمالي الإرجاع</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{totalReturns}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-orange-600" size={20} />
            <span className="font-medium text-gray-700">مستعار حالياً</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{currentlyBorrowed}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-purple-600" size={20} />
            <span className="font-medium text-gray-700">المستعيرون</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{borrowerStats.length}</div>
        </div>
      </div>

      {/* Top Books and Borrowers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Borrowed Books */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-blue-600" size={20} />
            <h3 className="text-lg font-bold">الكتب الأكثر استعارة</h3>
          </div>
          <div className="space-y-3">
            {bookStats.slice(0, 5).map((book, index) => (
              <div key={book.serialNumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{book.bookTitle}</div>
                  <div className="text-sm text-gray-500">
                    الرقم العام: {book.serialNumber}
                    {book.specialNumber && ` • الرقم الخاص: ${book.specialNumber}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {book.borrowCount} مرة
                  </span>
                  <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active Borrowers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-purple-600" size={20} />
            <h3 className="text-lg font-bold">المستعيرون الأكثر نشاطاً</h3>
          </div>
          <div className="space-y-3">
            {borrowerStats.slice(0, 5).map((borrower, index) => (
              <div key={borrower.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{borrower.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                    {borrower.borrowCount} كتاب
                  </span>
                  <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="البحث في السجل بالاسم، عنوان الكتاب، أو الرقم..."
            className="form-input pl-4 bg-[#f8f6f3] font-normal text-base w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: "#f8f6f3", minHeight: 44 }}
          />
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'borrow' | 'return')}
            className="form-input bg-[#f8f6f3] w-full"
            style={{ minHeight: 44 }}
          >
            <option value="all">جميع العمليات</option>
            <option value="borrow">الاستعارات فقط</option>
            <option value="return">الإرجاع فقط</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ والوقت
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  العملية
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  الكتاب
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  المستعير
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  الأرقام
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {new Date(log.timestamp).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      log.action === 'borrow' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {log.action === 'borrow' ? 'استعارة' : 'إرجاع'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.bookTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {log.borrowerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>عام: {log.serialNumber}</div>
                    {log.specialNumber && <div>خاص: {log.specialNumber}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-lg font-normal">
            {searchTerm || filter !== 'all' 
              ? 'لم يتم العثور على عمليات تطابق البحث'
              : 'لا توجد عمليات في السجل بعد'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookLogs; 