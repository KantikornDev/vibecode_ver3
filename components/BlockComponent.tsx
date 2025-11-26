import React, { useRef, useEffect } from 'react';
import { Block } from '../types';
import { GripVertical } from 'lucide-react';

interface BlockComponentProps {
  block: Block;
  isFocused: boolean;
  onUpdate: (id: string, content: string) => void;
  onFocus: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHovered: boolean;
}

export const BlockComponent: React.FC<BlockComponentProps> = ({
  block,
  isFocused,
  onUpdate,
  onFocus,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  isHovered
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [block.content]);

  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isFocused]);

  const getStyles = () => {
    switch (block.type) {
      case 'heading1': return 'text-4xl font-bold mt-6 mb-2 text-gray-900';
      case 'heading2': return 'text-2xl font-bold mt-4 mb-2 text-gray-800';
      case 'heading3': return 'text-xl font-bold mt-3 mb-1 text-gray-800';
      case 'quote': return 'border-l-4 border-gray-900 pl-4 italic text-gray-600 my-2';
      case 'bullet': return 'list-disc ml-4';
      default: return 'text-base text-gray-800 my-1 leading-relaxed';
    }
  };

  return (
    <div 
      className="group relative flex items-start -ml-8 pl-8 py-0.5"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Drag Handle / Menu Trigger (Visible on Hover) */}
      <div className={`absolute left-0 top-1.5 text-gray-300 cursor-grab hover:bg-gray-100 rounded transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <GripVertical size={20} />
      </div>

      <textarea
        ref={textareaRef}
        value={block.content}
        onChange={(e) => onUpdate(block.id, e.target.value)}
        onKeyDown={(e) => onKeyDown(e, block.id)}
        onFocus={() => onFocus(block.id)}
        placeholder={block.type === 'paragraph' ? "Type '/' for commands" : "Heading"}
        className={`w-full bg-transparent resize-none outline-none overflow-hidden placeholder-gray-300 ${getStyles()}`}
        rows={1}
      />
    </div>
  );
};
