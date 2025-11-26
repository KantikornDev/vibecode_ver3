import React from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

const App: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-900">
      <Sidebar />
      <Editor />
    </div>
  );
};

export default App;
