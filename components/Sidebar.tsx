import React from 'react';
import { FileText, Plus, Search, Settings, ChevronRight, BarChart2, Briefcase } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  pages: Page[];
  activePageId: string;
  onNavigate: (id: string) => void;
  onCreatePage: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ pages, activePageId, onNavigate, onCreatePage }) => {
  const documents = pages.filter(p => p.type === 'document');
  const summaryPage = pages.find(p => p.type === 'summary');

  return (
    <div className="w-64 h-screen bg-[#F7F7F5] border-r border-gray-200 flex flex-col hidden md:flex text-gray-600 text-sm font-medium select-none">
      {/* User Profile / Workspace Switcher */}
      <div className="p-4 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors m-2 rounded-md">
        <div className="w-5 h-5 bg-orange-400 rounded text-white flex items-center justify-center text-xs font-bold">U</div>
        <span className="font-semibold text-gray-700">My Workspace</span>
      </div>

      {/* Special Pages */}
      <div className="px-3 py-1 mb-2">
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer text-gray-500">
          <Search size={16} />
          <span>Search</span>
        </div>
        {summaryPage && (
          <div 
            onClick={() => onNavigate(summaryPage.id)}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer ${activePageId === summaryPage.id ? 'bg-gray-200 text-gray-900 font-semibold' : 'text-gray-700'}`}
          >
            <BarChart2 size={16} className="text-purple-600" />
            <span>Summary & Insights</span>
          </div>
        )}
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer text-gray-500">
          <Settings size={16} />
          <span>Settings</span>
        </div>
      </div>

      {/* Private Pages */}
      <div className="mt-2 px-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-2 group">
            <span>PRIVATE</span>
            <Plus size={14} className="cursor-pointer hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onCreatePage} />
        </div>
        
        {documents.map(page => (
           <div 
             key={page.id}
             onClick={() => onNavigate(page.id)}
             className={`flex items-center gap-2 p-1 py-1.5 rounded-md hover:bg-gray-200 cursor-pointer mb-0.5 transition-colors ${activePageId === page.id ? 'bg-gray-200 text-gray-900' : 'text-gray-700'}`}
           >
             <ChevronRight size={16} className="text-gray-400" />
             <FileText size={16} className="text-gray-500" />
             <span className="truncate">{page.title || 'Untitled'}</span>
          </div>
        ))}
        
        <div 
            onClick={onCreatePage}
            className="flex items-center gap-2 p-1 py-1.5 rounded-md hover:bg-gray-200 cursor-pointer text-gray-400 mt-1"
        >
            <Plus size={16} />
            <span>Add a page</span>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-200 bg-white/50">
        <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Gemini AI Ready
        </div>
      </div>
    </div>
  );
};

export default Sidebar;