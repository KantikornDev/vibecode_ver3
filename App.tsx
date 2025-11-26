import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { Page, Block } from './types';
import { nanoid } from 'nanoid';

// Initial Data
const initialPages: Page[] = [
  {
    id: 'summary-dashboard',
    title: 'Summary & Insights',
    type: 'summary',
    blocks: [],
    updatedAt: new Date()
  },
  {
    id: 'page-1',
    title: 'Meeting Notes: Q4 Strategy',
    type: 'document',
    blocks: [
      { id: nanoid(), type: 'heading1', content: 'Q4 Strategy Meeting' },
      { id: nanoid(), type: 'paragraph', content: 'Attendees: John, Sarah, Mike' },
      { id: nanoid(), type: 'heading2', content: 'Key Objectives' },
      { id: nanoid(), type: 'bullet', content: 'Increase user retention by 15%' },
      { id: nanoid(), type: 'bullet', content: 'Launch the new mobile app feature' },
      { id: nanoid(), type: 'paragraph', content: 'Action items need to be assigned by Friday.' },
    ],
    updatedAt: new Date()
  },
  {
    id: 'page-2',
    title: 'Project Delta Ideas',
    type: 'document',
    blocks: [
      { id: nanoid(), type: 'heading1', content: 'Project Delta' },
      { id: nanoid(), type: 'paragraph', content: 'Brainstorming session for the new AI interface.' },
      { id: nanoid(), type: 'quote', content: 'Simplicity is the ultimate sophistication.' },
      { id: nanoid(), type: 'paragraph', content: 'We should focus on speed and reliability first.' },
    ],
    updatedAt: new Date()
  }
];

const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  // Start with the first real document, or summary if you prefer
  const [activePageId, setActivePageId] = useState<string>(initialPages[1].id);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const handleCreatePage = () => {
    const newPage: Page = {
      id: nanoid(),
      title: 'Untitled',
      type: 'document',
      blocks: [
        { id: nanoid(), type: 'heading1', content: '' },
      ],
      updatedAt: new Date()
    };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
  };

  const handleUpdatePage = (id: string, blocks: Block[], title: string) => {
    setPages(prev => prev.map(p => 
      p.id === id 
        ? { ...p, blocks, title, updatedAt: new Date() } 
        : p
    ));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-900 font-sans">
      <Sidebar 
        pages={pages} 
        activePageId={activePageId} 
        onNavigate={setActivePageId}
        onCreatePage={handleCreatePage}
      />
      <Editor 
        key={activePageId} // Force re-mount on page switch to ensure clean state
        page={activePage} 
        allPages={pages}
        onUpdatePage={handleUpdatePage} 
      />
    </div>
  );
};

export default App;