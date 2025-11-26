import React from 'react';
import { FileText, Plus, Search, Settings, ChevronRight, Home, Clock } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-[#F7F7F5] border-r border-gray-200 flex flex-col hidden md:flex text-gray-600 text-sm font-medium">
      {/* User Profile / Workspace Switcher */}
      <div className="p-4 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors m-2 rounded-md">
        <div className="w-5 h-5 bg-orange-400 rounded text-white flex items-center justify-center text-xs font-bold">U</div>
        <span>User's Workspace</span>
      </div>

      {/* Quick Actions */}
      <div className="px-3 py-1">
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer">
          <Search size={16} />
          <span>Search</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer">
          <Clock size={16} />
          <span>Updates</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer">
          <Settings size={16} />
          <span>Settings</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer">
          <Plus size={16} />
          <span>New Page</span>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="mt-4 px-4">
        <div className="text-xs font-semibold text-gray-400 mb-2">FAVORITES</div>
        <div className="flex items-center gap-2 p-1 py-1.5 rounded-md hover:bg-gray-200 cursor-pointer text-gray-700">
           <FileText size={16} />
           <span>Product Vision</span>
        </div>
        <div className="flex items-center gap-2 p-1 py-1.5 rounded-md hover:bg-gray-200 cursor-pointer text-gray-700">
           <FileText size={16} />
           <span>Marketing Q4</span>
        </div>
      </div>

      {/* Private Pages */}
      <div className="mt-4 px-4">
        <div className="text-xs font-semibold text-gray-400 mb-2">PRIVATE</div>
         <div className="flex items-center gap-1 p-1 py-1.5 rounded-md hover:bg-gray-200 cursor-pointer text-gray-700 bg-gray-200">
           <ChevronRight size={16} className="text-gray-400"/>
           <FileText size={16} />
           <span>Meeting Notes</span>
        </div>
        <div className="flex items-center gap-1 p-1 py-1.5 rounded-md hover:bg-gray-200 cursor-pointer text-gray-700">
           <ChevronRight size={16} className="text-gray-400"/>
           <FileText size={16} />
           <span>Personal Goals</span>
        </div>
        <div className="flex items-center gap-1 p-1 py-1.5 rounded-md hover:bg-gray-200 cursor-pointer text-gray-700">
           <ChevronRight size={16} className="text-gray-400"/>
           <FileText size={16} />
           <span>Project Delta</span>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Online
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
