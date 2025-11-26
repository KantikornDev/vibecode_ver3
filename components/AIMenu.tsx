import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Loader2, Wand2, SpellCheck, AlignLeft, FileText } from 'lucide-react';
import { AIActionType } from '../types';

interface AIMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (action: AIActionType, prompt?: string) => void;
  position: { top: number; left: number } | null;
  selectedText: string;
}

export const AIMenu: React.FC<AIMenuProps> = ({ isVisible, onClose, onSubmit, position, selectedText }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const style: React.CSSProperties = position 
    ? { top: position.top + 30, left: position.left, zIndex: 50 } 
    : { top: '20%', left: '50%', transform: 'translate(-50%, 0)', zIndex: 50 };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customPrompt.trim()) {
      onSubmit(AIActionType.GENERATE_FROM_PROMPT, customPrompt);
      setCustomPrompt('');
    }
  };

  const hasSelection = selectedText.length > 0;

  return (
    <div 
      style={style} 
      className="absolute w-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-100 ring-1 ring-black/5"
    >
      {/* Input Area */}
      <div className="p-3 flex items-center gap-3 border-b border-gray-100">
        <Sparkles className="text-purple-600 animate-pulse" size={20} />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
            placeholder={hasSelection ? "Ask AI about selection..." : "Ask AI to write..."}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
        </form>
        {customPrompt && (
          <button onClick={() => handleSubmit()} className="text-purple-600 hover:bg-purple-50 p-1 rounded">
            <Send size={16} />
          </button>
        )}
      </div>

      {/* Suggested Actions */}
      <div className="p-1.5 bg-gray-50/50">
        <div className="text-[10px] font-semibold text-gray-400 px-3 py-1 uppercase tracking-wider">
          {hasSelection ? 'Edit or Review' : 'Draft with AI'}
        </div>
        
        {hasSelection ? (
          <>
             <button 
              onClick={() => onSubmit(AIActionType.IMPROVE_WRITING)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors text-left"
            >
              <Wand2 size={16} className="text-purple-500" />
              <span>Improve writing</span>
            </button>
            <button 
              onClick={() => onSubmit(AIActionType.FIX_SPELLING)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors text-left"
            >
              <SpellCheck size={16} className="text-green-500" />
              <span>Fix spelling & grammar</span>
            </button>
            <button 
              onClick={() => onSubmit(AIActionType.SUMMARIZE)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors text-left"
            >
              <AlignLeft size={16} className="text-orange-500" />
              <span>Summarize</span>
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => onSubmit(AIActionType.GENERATE_FROM_PROMPT, "Write a blog post outline about...")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors text-left"
            >
              <FileText size={16} className="text-blue-500" />
              <span>Draft a blog post...</span>
            </button>
            <button 
               onClick={() => onSubmit(AIActionType.GENERATE_FROM_PROMPT, "Create a to-do list for...")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors text-left"
            >
              <FileText size={16} className="text-green-500" />
              <span>To-do list...</span>
            </button>
             <button 
               onClick={() => onSubmit(AIActionType.CONTINUE_WRITING)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors text-left"
            >
              <Wand2 size={16} className="text-purple-500" />
              <span>Continue writing</span>
            </button>
          </>
        )}
      </div>
      
      <div className="p-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 px-4">
        <span>Gemini 2.5 Flash</span>
        <span>esc to close</span>
      </div>
    </div>
  );
};
