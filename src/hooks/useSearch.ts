import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Lightbulb, 
  FileText, 
  Zap, 
  Image as ImageIcon, 
  Video,
  Hash,
  Wallet,
  BarChart2,
  Award
} from 'lucide-react';

export interface SearchResult {
  id: string;
  type: 'nav' | 'history';
  title: string;
  subtitle?: string;
  icon?: any;
  path?: string;
  content?: string;
  timestamp?: number;
}

export interface HistoryItem {
  id: string;
  type: 'idea' | 'script' | 'hook' | 'thumbnail' | 'video' | 'hashtag';
  title: string;
  content: string;
  timestamp: number;
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Accueil', path: '/dashboard', keywords: ['home', 'dashboard', 'accueil'] },
  { icon: Lightbulb, label: 'Idées Virales', path: '/dashboard/ideas', keywords: ['ideas', 'idées', 'viral', 'generator'] },
  { icon: FileText, label: 'Scripts', path: '/dashboard/scripts', keywords: ['scripts', 'writing', 'text'] },
  { icon: Zap, label: 'Hooks', path: '/dashboard/hooks', keywords: ['hooks', 'catchy', 'titles'] },
  { icon: ImageIcon, label: 'Miniatures', path: '/dashboard/thumbnails', keywords: ['thumbnails', 'images', 'covers'] },
  { icon: Video, label: 'Vidéos Veo', path: '/dashboard/video', keywords: ['video', 'veo', 'generation'] },
  { icon: Hash, label: 'Hashtags', path: '/dashboard/hashtags', keywords: ['hashtags', 'tags', 'seo'] },
  { icon: Award, label: 'Ambassadeur', path: '/dashboard/affiliate', keywords: ['affiliate', 'ambassadeur', 'money'] },
  { icon: Wallet, label: 'Portefeuille', path: '/dashboard/wallet', keywords: ['wallet', 'portefeuille', 'credits'] },
  { icon: BarChart2, label: 'Analyses', path: '/dashboard/analytics', keywords: ['analytics', 'stats', 'data'] },
];

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigate = useNavigate();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('zx_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history item
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50 items
    setHistory(updatedHistory);
    localStorage.setItem('zx_history', JSON.stringify(updatedHistory));
  };

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // 1. Search Navigation
    NAV_ITEMS.forEach(item => {
      if (
        item.label.toLowerCase().includes(lowerQuery) || 
        item.keywords.some(k => k.includes(lowerQuery))
      ) {
        searchResults.push({
          id: `nav-${item.path}`,
          type: 'nav',
          title: item.label,
          subtitle: 'Navigation',
          icon: item.icon,
          path: item.path
        });
      }
    });

    // 2. Search History
    history.forEach(item => {
      if (
        item.title.toLowerCase().includes(lowerQuery) || 
        item.content.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: item.id,
          type: 'history',
          title: item.title,
          subtitle: new Date(item.timestamp).toLocaleDateString(),
          content: item.content,
          // Map type to icon
          icon: getIconForType(item.type)
        });
      }
    });

    setResults(searchResults);
  }, [query, history]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'idea': return Lightbulb;
      case 'script': return FileText;
      case 'hook': return Zap;
      case 'thumbnail': return ImageIcon;
      case 'video': return Video;
      case 'hashtag': return Hash;
      default: return LayoutDashboard;
    }
  };

  return {
    query,
    setQuery,
    results,
    addToHistory
  };
};
