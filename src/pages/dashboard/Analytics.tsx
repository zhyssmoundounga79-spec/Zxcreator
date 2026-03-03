import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUp, Users, Eye, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Lun', views: 4000, subs: 240, viralScore: 65 },
  { name: 'Mar', views: 3000, subs: 139, viralScore: 58 },
  { name: 'Mer', views: 2000, subs: 980, viralScore: 88 },
  { name: 'Jeu', views: 2780, subs: 390, viralScore: 72 },
  { name: 'Ven', views: 1890, subs: 480, viralScore: 60 },
  { name: 'Sam', views: 2390, subs: 380, viralScore: 75 },
  { name: 'Dim', views: 3490, subs: 430, viralScore: 85 },
];

export default function Analytics() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analyses de Performance</h1>
        <p className="text-gray-400">Suivez la croissance de votre empire médiatique.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Vues Totales', value: '1.2M', change: '+12%', icon: Eye, color: 'text-blue-400' },
          { label: 'Nouveaux Abonnés', value: '+3.4K', change: '+8%', icon: Users, color: 'text-purple-400' },
          { label: 'Taux d\'Engagement', value: '8.2%', change: '+2%', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Score Viral Moyen', value: '85', change: '+5pts', icon: ArrowUp, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-zinc-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold mb-6">Croissance des Vues</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold mb-6">Nouveaux Abonnés</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#27272a' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="subs" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 md:col-span-2">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Tendance du Score Viral
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="viralScore" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorViral)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
