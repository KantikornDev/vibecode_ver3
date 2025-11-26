import React, { useState, useRef, useEffect } from 'react';
import { Block, AIActionType } from '../types';
import { BlockComponent } from './BlockComponent';
import { AIMenu } from './AIMenu';
import { streamAIContent } from '../services/geminiService';
import { nanoid } from 'nanoid';
import { Sparkles, StopCircle } from 'lucide-react';

const Editor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: nanoid(), type: 'heading1', content: 'Meeting Notes' },
    { id: nanoid(), type: 'paragraph', content: 'Use "Ask AI" to generate content or select text to summarize.' },
    { id: nanoid(), type: 'paragraph', content: '' },
  ]);
  
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  
  // AI Menu State
  const [aiMenuVisible, setAiMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{top: number, left: number} | null>(null);
  const [selectedText, setSelectedText] = useState('');
  
  // AI Execution State
  const [isAiStreaming, setIsAiStreaming] = useState(false);
  const [streamingBlockId, setStreamingBlockId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Update a block's content
  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  // Handle Enter key (new block) and Backspace (merge/delete)
  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentIndex = blocks.findIndex(b => b.id === id);
      const newBlock: Block = { id: nanoid(), type: 'paragraph', content: '' };
      const newBlocks = [...blocks];
      newBlocks.splice(currentIndex + 1, 0, newBlock);
      setBlocks(newBlocks);
      setFocusedId(newBlock.id);
    } else if (e.key === 'Backspace') {
      const currentIndex = blocks.findIndex(b => b.id === id);
      if (blocks[currentIndex].content === '' && blocks.length > 1) {
        e.preventDefault();
        const prevBlock = blocks[currentIndex - 1];
        const newBlocks = blocks.filter(b => b.id !== id);
        setBlocks(newBlocks);
        if (prevBlock) setFocusedId(prevBlock.id);
      }
    } else if (e.key === ' ' && (e.metaKey || e.ctrlKey)) {
        // Trigger AI with Ctrl+Space
        e.preventDefault();
        const block = blocks.find(b => b.id === id);
        if (block) {
            // Calculate position near the block
            const el = document.activeElement as HTMLElement;
            const rect = el?.getBoundingClientRect();
            if (rect) {
                setMenuPosition({ top: rect.bottom, left: rect.left });
                setSelectedText(window.getSelection()?.toString() || '');
                setAiMenuVisible(true);
            }
        }
    }
  };

  // Handle AI Actions
  const handleAIAction = async (action: AIActionType, prompt?: string) => {
    setAiMenuVisible(false);
    setIsAiStreaming(true);

    // Context gathering
    const fullContext = blocks.map(b => b.content).join('\n');
    const activeBlockIndex = focusedId ? blocks.findIndex(b => b.id === focusedId) : blocks.length - 1;
    
    // If we have selected text, we might want to replace it or append after it.
    // For simplicity:
    // 1. If Summarize/Fix -> Create NEW block after current one with result.
    // 2. If Generate -> Create NEW block after current one.
    
    // Create a placeholder block for streaming
    const newBlockId = nanoid();
    const newBlock: Block = { id: newBlockId, type: 'paragraph', content: '' };
    
    // Insert new block
    const newBlocks = [...blocks];
    newBlocks.splice(activeBlockIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
    setStreamingBlockId(newBlockId);
    setFocusedId(null); // Lose focus while streaming

    try {
      await streamAIContent(
        action, 
        selectedText || fullContext, // Use selected text if available, else full doc context
        prompt, 
        (chunk) => {
          setBlocks(currentBlocks => 
            currentBlocks.map(b => b.id === newBlockId ? { ...b, content: chunk } : b)
          );
        }
      );
    } catch (e) {
      console.error("AI Error", e);
      setBlocks(currentBlocks => 
        currentBlocks.map(b => b.id === newBlockId ? { ...b, content: "Error generating content. Please check your API key." } : b)
      );
    } finally {
      setIsAiStreaming(false);
      setStreamingBlockId(null);
      setFocusedId(newBlockId); // Focus the new block
    }
  };

  // Selection detection for AI menu positioning
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0 && !isAiStreaming) {
        // Wait a bit to ensure user finished selecting
         // Simplified: We rely on the button or Ctrl+Space to open menu for now to avoid UI clutter
      }
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [isAiStreaming]);

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white relative" ref={containerRef}>
      
      {/* Cover Image Placeholder */}
      <div className="h-48 bg-gradient-to-r from-pink-100 to-blue-100 w-full group relative">
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-white/50 backdrop-blur text-xs px-2 py-1 rounded hover:bg-white text-gray-600">Change cover</button>
          </div>
      </div>

      <div className="max-w-3xl mx-auto px-12 pb-32 -mt-12 relative z-10">
        {/* Document Icon */}
        <div className="text-7xl mb-4 select-none cursor-pointer hover:opacity-80 transition-opacity">📑</div>

        {/* Blocks */}
        <div className="space-y-1 min-h-[500px]">
          {blocks.map(block => (
            <BlockComponent
              key={block.id}
              block={block}
              isFocused={focusedId === block.id}
              isHovered={hoveredBlockId === block.id}
              onUpdate={updateBlock}
              onFocus={setFocusedId}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setHoveredBlockId(block.id)}
              onMouseLeave={() => setHoveredBlockId(null)}
            />
          ))}
        </div>

        {/* Empty State / Bottom Area Helper */}
        <div 
          className="h-32 cursor-text" 
          onClick={() => {
             // Add new block at end if clicking empty space
             const id = nanoid();
             setBlocks([...blocks, { id, type: 'paragraph', content: '' }]);
             setFocusedId(id);
          }}
        />
      </div>

      {/* Floating AI Button (Notion-like) - Always visible bottom right or contextually */}
      {!aiMenuVisible && !isAiStreaming && (
        <button 
          onClick={() => {
              setMenuPosition(null); // Center it
              setAiMenuVisible(true);
              setSelectedText(window.getSelection()?.toString() || '');
          }}
          className="fixed bottom-8 right-8 bg-white shadow-lg border border-purple-100 rounded-full px-4 py-2 flex items-center gap-2 text-purple-600 font-medium hover:shadow-xl hover:bg-purple-50 transition-all z-40"
        >
          <Sparkles size={18} />
          Ask AI
        </button>
      )}

      {/* AI Streaming Indicator */}
      {isAiStreaming && (
        <div className="fixed bottom-8 right-8 bg-white shadow-lg border border-purple-100 rounded-full px-4 py-2 flex items-center gap-3 z-40">
           <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
               Gemini is writing...
           </div>
           <button onClick={() => {
               // Abort logic would go here if we implemented abort controller in service
               setIsAiStreaming(false);
           }} className="text-gray-400 hover:text-gray-600">
               <StopCircle size={16} />
           </button>
        </div>
      )}

      {/* AI Menu Modal */}
      <AIMenu
        isVisible={aiMenuVisible}
        onClose={() => setAiMenuVisible(false)}
        onSubmit={handleAIAction}
        position={menuPosition}
        selectedText={selectedText}
      />

    </div>
  );
};

export default Editor;
