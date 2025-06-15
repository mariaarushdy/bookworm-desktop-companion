
import React from 'react';
import { Book } from 'lucide-react';

const Header = () => {
  return (
    <header className="library-header p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Book size={24} />
          <span className="text-sm">تنظيم وثائق وإدارة مكتبتك</span>
        </div>
        <div className="flex items-center gap-2">
          <Book size={20} />
          <h1 className="text-lg font-semibold">نظام إدارة المكتبة</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
