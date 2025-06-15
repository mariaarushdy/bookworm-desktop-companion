
import React from 'react';
import { Book } from 'lucide-react';

const Header = () => {
  return (
    <header className="library-header w-full px-0 py-0 min-h-[76px] flex items-center" style={{ borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        <div className="flex items-center gap-3">
          <Book size={22} />
          <span className="text-xs font-normal opacity-80 mr-1">تنظيم كتب وإدارة مكتبتك</span>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold mr-2 leading-[1.3]">نظام إدارة المكتبة</h1>
          <Book size={24} />
        </div>
      </div>
    </header>
  );
};

export default Header;
