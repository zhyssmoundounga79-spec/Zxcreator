import { useRef, useEffect } from 'react';
import { Search, X, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSearch, SearchResult } from '../context/SearchContext';

export default function DashboardSearch() {
  const { query, setQuery, results, isOpen, setIsOpen } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Handle keyboard shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  const handleSelect = (result: SearchResult) => {
    if (result.type === 'nav' && result.path) {
      navigate(result.path);
      setIsOpen(false);
      setQuery('');
    } else if (result.type === 'history' && result.content) {
      // Copy content to clipboard
      navigator.clipboard.writeText(result.content);
      // Maybe show a toast? For now just close
      setIsOpen(false);
      // Optional: Navigate to the tool page if path is stored
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="block w-full pl-10 pr-12 py-2.5 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-zinc-900 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 sm:text-sm transition-all shadow-sm"
          placeholder="Rechercher (⌘K)"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-gray-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-gray-500 bg-zinc-800 rounded border border-zinc-700">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (query || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto custom-scrollbar"
          >
            {results.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Aucun résultat trouvé pour "{query}"
              </div>
            ) : (
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-800/50 flex items-start gap-3 transition-colors group border-b border-zinc-800/50 last:border-0"
                  >
                    <div className={`mt-0.5 p-2 rounded-lg ${result.type === 'nav' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {result.icon && <result.icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                          {result.title}
                        </span>
                        {result.subtitle && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            {result.type === 'history' && <Clock className="w-3 h-3" />}
                            {result.subtitle}
                          </span>
                        )}
                      </div>
                      {result.content && (
                        <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-400">
                          {result.content}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                  </button>
                ))}
              </div>
            )}
            
            <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 text-[10px] text-gray-500 flex justify-between">
              <span>↑↓ pour naviguer</span>
              <span>↵ pour sélectionner</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
