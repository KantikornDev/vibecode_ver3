import React, { useState } from 'react';
import { Page, AIActionType, DashboardData, ActionItem } from '../types';
import { streamAIContent, generateStructuredData } from '../services/geminiService';
import { Sparkles, Loader2, RefreshCw, PieChart, Activity, ListTodo, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface SummaryViewProps {
  pages: Page[];
}

export const SummaryView: React.FC<SummaryViewProps> = ({ pages }) => {
  const [summary, setSummary] = useState<string>('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const documentCount = pages.filter(p => p.type === 'document').length;

  const generateAnalysis = async () => {
    setIsLoading(true);
    setSummary('');
    setData(null);
    
    // Aggregate content
    const context = pages
      .filter(p => p.type === 'document')
      .map(p => `Title: ${p.title}\nContent: ${p.blocks.map(b => b.content).join('\n')}`)
      .join('\n\n---\n\n');

    const summaryPrompt = `Provide a high-level executive summary of the workspace. Focus on progress, bottlenecks, and next steps. Keep it professional and concise.`;

    try {
      // Parallel execution: Stream text AND fetch JSON data
      const textPromise = streamAIContent(
        AIActionType.GENERATE_FROM_PROMPT,
        context,
        summaryPrompt,
        (chunk) => setSummary(chunk)
      );

      const dataPromise = generateStructuredData(context);

      await textPromise;
      const structuredData = await dataPromise;
      
      if (structuredData) {
        setData(structuredData);
      }
      
      setLastUpdated(new Date());
    } catch (e) {
      setSummary("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F7F7F5] min-h-screen overflow-y-auto">
      {/* Hero Header with Glass Effect */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 px-12 py-6 flex justify-between items-center transition-all duration-300">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg text-white">
               <PieChart size={24} />
            </div>
            Workspace Intelligence
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-14">
            AI-powered insights across {documentCount} documents
          </p>
        </div>
        
        <button 
          onClick={generateAnalysis}
          disabled={isLoading}
          className="group relative flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isLoading ? 'Analyzing...' : 'Refresh Insights'}
          </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-12 py-10 space-y-8 pb-32">
        
        {/* Empty State */}
        {!summary && !isLoading && !data && (
           <div className="text-center py-20 opacity-60">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <RefreshCw size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Ready to analyze your workspace</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">Click the button above to generate graphs, summaries, and action tables from your notes.</p>
           </div>
        )}

        {/* Top Row: Executive Summary & Circular Stats */}
        {(summary || isLoading) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Narrative Summary Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500" />
               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <Activity className="text-purple-500" size={20} />
                 Executive Summary
               </h3>
               <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                  {summary || <div className="space-y-2 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>}
               </div>
            </div>

            {/* Health & Sentiment Cards */}
            <div className="space-y-6">
                {/* Project Health Circular Chart */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center relative">
                    <h4 className="text-gray-500 font-medium text-sm mb-4 uppercase tracking-wider">Project Health</h4>
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                            {data && (
                                <circle 
                                    cx="64" cy="64" r="56" 
                                    stroke={data.metrics.projectHealth > 70 ? "#22c55e" : "#eab308"} 
                                    strokeWidth="12" 
                                    fill="transparent" 
                                    strokeDasharray={351} 
                                    strokeDashoffset={351 - (351 * data.metrics.projectHealth) / 100}
                                    className="transition-all duration-1000 ease-out"
                                />
                            )}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-gray-800">
                                {data ? data.metrics.projectHealth : 0}%
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-4 text-xs font-semibold">
                       <span className="flex items-center gap-1 text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-green-500" /> Healthy
                       </span>
                       <span className="flex items-center gap-1 text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" /> At Risk
                       </span>
                    </div>
                </div>

                {/* Sentiment Pill */}
                {data && (
                    <div className={`rounded-2xl p-6 border flex items-center justify-between shadow-sm ${
                        data.metrics.sentiment === 'Positive' ? 'bg-green-50 border-green-100 text-green-900' : 
                        data.metrics.sentiment === 'Critical' ? 'bg-red-50 border-red-100 text-red-900' : 
                        'bg-blue-50 border-blue-100 text-blue-900'
                    }`}>
                        <div>
                            <div className="text-xs opacity-70 uppercase font-bold tracking-wider">Overall Tone</div>
                            <div className="text-xl font-bold mt-1">{data.metrics.sentiment}</div>
                        </div>
                        <div className="text-3xl">
                             {data.metrics.sentiment === 'Positive' ? '🚀' : data.metrics.sentiment === 'Critical' ? '🚨' : '⚖️'}
                        </div>
                    </div>
                )}
            </div>
          </div>
        )}

        {/* Second Row: Graphs & Tables */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700 fade-in fill-mode-backwards" style={{animationDelay: '0.2s'}}>
            
            {/* Topic Distribution Graph */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
               <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center justify-between">
                  <span>Topic Distribution</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-normal">Based on relevance</span>
               </h3>
               <div className="space-y-5">
                  {data.topics.map((topic, i) => (
                      <div key={i}>
                          <div className="flex justify-between text-sm mb-1.5 font-medium text-gray-600">
                              <span>{topic.topic}</span>
                              <span>{topic.count}%</span>
                          </div>
                          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${topic.count}%`, transition: 'width 1.5s ease-out' }} 
                              />
                          </div>
                      </div>
                  ))}
               </div>
            </div>

            {/* Smart Tasks Table */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                       <ListTodo className="text-blue-500" size={20} />
                       Action Items
                   </h3>
                   <span className="text-xs font-medium text-gray-400 px-2 py-1 bg-white border rounded">
                       {data.actionItems.length} extracted
                   </span>
               </div>
               
               <div className="overflow-auto flex-1 max-h-[400px]">
                   <table className="w-full text-left text-sm">
                       <thead className="bg-white sticky top-0 z-10 text-gray-400 font-medium uppercase text-xs tracking-wider">
                           <tr>
                               <th className="px-6 py-3 border-b border-gray-100">Task</th>
                               <th className="px-6 py-3 border-b border-gray-100">Assignee</th>
                               <th className="px-6 py-3 border-b border-gray-100">Priority</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                           {data.actionItems.map((item, idx) => (
                               <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                   <td className="px-6 py-3.5 text-gray-700 font-medium group-hover:text-blue-700">
                                       {item.task}
                                   </td>
                                   <td className="px-6 py-3.5 text-gray-500">
                                       <div className="flex items-center gap-2">
                                           <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                               {item.assignee.charAt(0)}
                                           </div>
                                           {item.assignee}
                                       </div>
                                   </td>
                                   <td className="px-6 py-3.5">
                                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                           item.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                                           item.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                           'bg-green-50 text-green-700 border-green-100'
                                       }`}>
                                           {item.priority}
                                       </span>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
               {data.actionItems.length === 0 && (
                   <div className="p-8 text-center text-gray-400">No action items found in documents.</div>
               )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};