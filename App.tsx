
import React, { useState, useMemo, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
} from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  ShoppingCart, 
  Truck, 
  Package, 
  IndianRupee,
  RefreshCw,
  BarChart3,
  Plus,
  Minus,
  LayoutDashboard,
  Wallet,
  Info,
  Moon,
  Sun
} from 'lucide-react';
import { CalculatorInputs, CalculatedResults } from './types';

const COLORS = ['#4F46E5', '#EF4444', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6', '#EC4899'];

type ActiveTab = 'dashboard' | 'orders' | 'costs';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const [inputs, setInputs] = useState<CalculatorInputs>({
    totalOrders: 10,
    cancelledOverCall: 0,
    rtoPercentage: 10,
    sellingPrice: 600,
    productCost: 100,
    adCostPerOrder: 100,
    adGstPercentage: 18,
    shippingCost: 50,
    rtoShippingCost: 72,
    productDamageRtoPercentage: 0,
    packingCost: 10,
    miscellaneous: 5,
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.body.style.backgroundColor = '#FDFDFF';
    }
  }, [isDarkMode]);

  const results = useMemo((): CalculatedResults => {
    const { 
      totalOrders, cancelledOverCall, rtoPercentage, 
      sellingPrice, productCost, adCostPerOrder, adGstPercentage,
      shippingCost, rtoShippingCost, productDamageRtoPercentage,
      packingCost, miscellaneous 
    } = inputs;

    const orderToBeShipped = Math.max(0, totalOrders - cancelledOverCall);
    const rtoCount = orderToBeShipped * (rtoPercentage / 100);
    const deliveredOrders = Math.max(0, orderToBeShipped - rtoCount);
    const totalRevenue = deliveredOrders * sellingPrice;
    const totalProductCost = deliveredOrders * productCost;
    const totalDamageLoss = rtoCount * productCost * (productDamageRtoPercentage / 100);
    const totalAdCost = totalOrders * adCostPerOrder * (1 + adGstPercentage / 100);
    const totalShippingCost = orderToBeShipped * shippingCost;
    const totalRtoShipping = rtoCount * rtoShippingCost;
    const totalPackingCost = orderToBeShipped * packingCost;
    const totalMiscellaneous = miscellaneous;

    const totalExpenses = (
      totalProductCost + totalAdCost + totalShippingCost + 
      totalRtoShipping + totalDamageLoss + totalPackingCost + totalMiscellaneous
    );

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      orderToBeShipped, rtoCount, deliveredOrders, totalRevenue,
      totalProductCost, totalAdCost, totalShippingCost, totalRtoShipping,
      totalDamageLoss, totalPackingCost, totalMiscellaneous,
      totalExpenses, netProfit, profitMargin
    };
  }, [inputs]);

  const chartData = useMemo(() => {
    const data = [
      { name: 'Product', value: results.totalProductCost },
      { name: 'Ads', value: results.totalAdCost },
      { name: 'Forward Shipping', value: results.totalShippingCost },
      { name: 'RTO Shipping', value: results.totalRtoShipping },
      { name: 'Packing', value: results.totalPackingCost },
      { name: 'RTO Loss', value: results.totalDamageLoss },
      { name: 'Misc', value: results.totalMiscellaneous },
    ];
    return data
      .filter(item => item.value > 0)
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
        percentageOfRevenue: results.totalRevenue > 0 ? (item.value / results.totalRevenue) * 100 : 0,
        percentageOfExpenses: results.totalExpenses > 0 ? (item.value / results.totalExpenses) * 100 : 0
      }));
  }, [results]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    const numValue = typeof value === 'string' ? (parseFloat(value) || 0) : value;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const resetInputs = () => {
    setInputs({
      totalOrders: 10, cancelledOverCall: 0, rtoPercentage: 10,
      sellingPrice: 600, productCost: 100, adCostPerOrder: 100,
      adGstPercentage: 18, shippingCost: 50, rtoShippingCost: 72,
      productDamageRtoPercentage: 0, packingCost: 10, miscellaneous: 5,
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-24 md:pb-8 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#FDFDFF] text-slate-900'}`}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-30 px-4 py-3 flex items-center justify-between transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Calculator className="text-white w-5 h-5" />
          </div>
          <h1 className={`font-bold text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>E-com Profit Pro</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-50'}`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={resetInputs} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-50'}`} title="Reset Inputs">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar / Results (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-5 space-y-6 order-2">
            <ResultsPanel results={results} chartData={chartData} isDarkMode={isDarkMode} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-7 order-1 space-y-6">
            
            {/* Mobile Tab Navigation */}
            <div className={`lg:hidden flex p-1 rounded-2xl border mb-6 shadow-sm transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <TabButton 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')}
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="Summary"
                isDarkMode={isDarkMode}
              />
              <TabButton 
                active={activeTab === 'orders'} 
                onClick={() => setActiveTab('orders')}
                icon={<Package className="w-4 h-4" />}
                label="Orders"
                isDarkMode={isDarkMode}
              />
              <TabButton 
                active={activeTab === 'costs'} 
                onClick={() => setActiveTab('costs')}
                icon={<Wallet className="w-4 h-4" />}
                label="Costs"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Dashboard View (Mobile) */}
            <div className={`${activeTab !== 'dashboard' && 'hidden'} lg:hidden`}>
               <ResultsPanel results={results} chartData={chartData} isDarkMode={isDarkMode} />
            </div>

            {/* Orders View */}
            <div className={`${activeTab !== 'orders' && 'hidden'} lg:block space-y-4`}>
              <section className={`p-6 rounded-3xl border shadow-sm transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Package className="w-4 h-4" /> Order Flow
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <CounterInput 
                    label="Total Orders Received" 
                    value={inputs.totalOrders} 
                    onChange={(v) => handleInputChange('totalOrders', v)}
                    icon={<ShoppingCart className="w-4 h-4 text-indigo-500" />}
                    isDarkMode={isDarkMode}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup 
                      label="Cancelled Call" 
                      value={inputs.cancelledOverCall} 
                      onChange={(v) => handleInputChange('cancelledOverCall', v)}
                      type="number"
                      isDarkMode={isDarkMode}
                    />
                    <InputGroup 
                      label="RTO Rate (%)" 
                      value={inputs.rtoPercentage} 
                      onChange={(v) => handleInputChange('rtoPercentage', v)}
                      suffix="%"
                      type="number"
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Costs View */}
            <div className={`${activeTab !== 'costs' && 'hidden'} lg:block space-y-4`}>
              <section className={`p-6 rounded-3xl border shadow-sm transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Unit Economics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Selling Price" value={inputs.sellingPrice} onChange={(v) => handleInputChange('sellingPrice', v)} prefix="₹" isDarkMode={isDarkMode} />
                  <InputGroup label="Product Cost" value={inputs.productCost} onChange={(v) => handleInputChange('productCost', v)} prefix="₹" isDarkMode={isDarkMode} />
                  <InputGroup label="Marketing (CPA)" value={inputs.adCostPerOrder} onChange={(v) => handleInputChange('adCostPerOrder', v)} prefix="₹" isDarkMode={isDarkMode} />
                  <InputGroup label="Ad GST (%)" value={inputs.adGstPercentage} onChange={(v) => handleInputChange('adGstPercentage', v)} suffix="%" isDarkMode={isDarkMode} />
                  <InputGroup label="Forward Ship" value={inputs.shippingCost} onChange={(v) => handleInputChange('shippingCost', v)} prefix="₹" isDarkMode={isDarkMode} />
                  <InputGroup label="RTO Shipping" value={inputs.rtoShippingCost} onChange={(v) => handleInputChange('rtoShippingCost', v)} prefix="₹" isDarkMode={isDarkMode} />
                  <InputGroup label="Packing Cost" value={inputs.packingCost} onChange={(v) => handleInputChange('packingCost', v)} prefix="₹" isDarkMode={isDarkMode} />
                  <InputGroup label="Other Exp." value={inputs.miscellaneous} onChange={(v) => handleInputChange('miscellaneous', v)} prefix="₹" isDarkMode={isDarkMode} />
                </div>
              </section>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Summary Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 border-t px-6 py-4 flex items-center justify-between z-40 transition-colors shadow-[0_-8px_30px_rgb(0,0,0,0.04)] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="space-y-0.5">
            <p className="text-[10px] text-slate-400 font-black uppercase">Net Profit</p>
            <p className={`text-2xl font-black ${results.netProfit >= 0 ? 'text-indigo-500' : 'text-red-500'}`}>
                ₹{Math.round(results.netProfit).toLocaleString()}
            </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
          <span className="text-[10px] font-black text-slate-400 uppercase">Margin</span>
          <span className={`text-sm font-black ${results.netProfit >= 0 ? 'text-indigo-500' : 'text-red-500'}`}>
            {results.profitMargin.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// UI Components

const ResultsPanel = ({ results, chartData, isDarkMode }: { results: CalculatedResults, chartData: any[], isDarkMode: boolean }) => (
  <div className="space-y-6">
    {/* Delivery Funnel Cards */}
    <div className="grid grid-cols-2 gap-4">
      <div className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <ShoppingCart className="w-5 h-5 text-indigo-500 mb-2" />
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Delivered</div>
          <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{results.deliveredOrders.toFixed(1)}</div>
        </div>
      </div>
      <div className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <IndianRupee className="w-5 h-5 text-emerald-500 mb-2" />
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gross Sales</div>
          <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>₹{Math.round(results.totalRevenue).toLocaleString()}</div>
        </div>
      </div>
    </div>

    {/* Profit Card */}
    <div className={`p-6 rounded-3xl border transition-all ${results.netProfit >= 0 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'bg-red-500 text-white shadow-xl shadow-red-500/20'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[11px] font-bold uppercase opacity-70 tracking-widest mb-1">Your Net Profit</div>
          <div className="text-4xl font-black">₹{Math.round(results.netProfit).toLocaleString()}</div>
        </div>
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <div className="flex-1">
          <div className="text-[10px] font-bold opacity-60 uppercase mb-1">Profit Margin</div>
          <div className="text-lg font-black">{results.profitMargin.toFixed(1)}%</div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[10px] font-bold opacity-60 uppercase mb-1">Total Expenses</div>
          <div className="text-lg font-black italic opacity-90">₹{Math.round(results.totalExpenses).toLocaleString()}</div>
        </div>
      </div>
    </div>

    {/* Cost Analysis Section */}
    <div className={`p-6 rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <h3 className={`text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        <BarChart3 className="w-4 h-4 text-indigo-500" /> Cost Breakdown
      </h3>
      
      <div className="h-64 w-full mb-6 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: isDarkMode ? '#f8fafc' : '#1e293b' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value: number, name: string, props: any) => [
                `₹${Math.round(value).toLocaleString()} (${props.payload.percentageOfExpenses.toFixed(1)}% of Exp)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-black text-slate-400 uppercase">Expenses</span>
          <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>₹{Math.round(results.totalExpenses / 1000)}k</span>
        </div>
      </div>
      
      {/* Detailed Percentage List */}
      <div className="space-y-4">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Detailed Breakdown (% of Revenue)</div>
        {chartData.map((item, index) => (
          <div key={index} className="group cursor-default">
            <div className="flex justify-between items-end mb-1.5 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-indigo-500 block leading-tight">{item.percentageOfRevenue.toFixed(1)}%</span>
                <span className="text-[10px] text-slate-400 font-bold block leading-tight">₹{Math.round(item.value).toLocaleString()}</span>
              </div>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <div 
                className="h-full transition-all duration-1000 ease-out rounded-full opacity-60"
                style={{ backgroundColor: item.color, width: `${Math.min(100, item.percentageOfRevenue * 2)}%` }} // Scaled for visibility
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-8 p-4 rounded-3xl border flex items-start gap-3 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
          Percentages are shown relative to your Gross Revenue. A higher percentage in Ads or Product cost usually indicates lower net margins.
        </p>
      </div>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label, isDarkMode }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, isDarkMode: boolean }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 px-2 rounded-xl flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all
      ${active ? 'bg-indigo-600 text-white shadow-lg' : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">{label}</span>
  </button>
);

const CounterInput = ({ label, value, onChange, icon, isDarkMode }: { label: string, value: number, onChange: (v: number) => void, icon: React.ReactNode, isDarkMode: boolean }) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
    <div className={`flex items-center rounded-3xl border overflow-hidden shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
      <button 
        onClick={() => onChange(Math.max(0, value - 1))} 
        className={`p-5 transition-colors ${isDarkMode ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 active:bg-indigo-50 active:text-indigo-600'}`}
      >
        <Minus className="w-5 h-5" />
      </button>
      <div className={`flex-1 flex items-center justify-center gap-3 font-black text-2xl transition-colors ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        <span className="opacity-20">{icon}</span>
        {value}
      </div>
      <button 
        onClick={() => onChange(value + 1)} 
        className={`p-5 transition-colors ${isDarkMode ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 active:bg-indigo-50 active:text-indigo-600'}`}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const InputGroup = ({ label, value, onChange, prefix, suffix, type = 'number', isDarkMode }: { label: string, value: number, onChange: (v: string) => void, prefix?: string, suffix?: string, type?: string, isDarkMode: boolean }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
    <div className="relative group">
      {prefix && <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-indigo-500 transition-colors">{prefix}</span>}
      <input
        type={type}
        inputMode="decimal"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-2xl py-4 transition-all outline-none focus:ring-4 font-black shadow-sm transition-colors
          ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:ring-slate-800 focus:border-indigo-500' : 'bg-slate-50/50 border-slate-100 text-slate-800 focus:ring-indigo-50 focus:border-indigo-200'}
          ${prefix ? 'pl-10' : 'pl-5'} ${suffix ? 'pr-10' : 'pr-5'}
        `}
      />
      {suffix && <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-400">{suffix}</span>}
    </div>
  </div>
);

export default App;
