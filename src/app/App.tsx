import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Globe, ShoppingCart, Package, DollarSign, Users, BarChart3, Menu, ChevronLeft, ChevronRight, Settings, Box, Warehouse, MoreHorizontal, Truck, Mic, CreditCard } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { POSMain } from './components/POSMain';
import { Inventory } from './components/Inventory';
import { SalesDashboard } from './components/SalesDashboard';
import { CustomerManagement } from './components/CustomerManagement';
import { ProductManagement } from './components/ProductManagement';
import { SettingsModule } from './components/SettingsModule';
import { OrderManagement } from './components/OrderManagement';
import { CreditManagement } from './components/CreditManagement';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import logo from 'figma:asset/398106a4d8b6ec3c2e6cc932aa53a5772540f723.png';

// Language context
export type Language = 'en' | 'ur';

interface Translations {
  en: Record<string, string>;
  ur: Record<string, string>;
}

export const translations: Translations = {
  en: {
    pos: 'POS',
    inventory: 'Inventory',
    sales: 'Sales',
    customers: 'Customers',
    products: 'Products',
    orders: 'Orders',
    credit: 'Credit',
    settings: 'Settings',
    switchLanguage: 'Switch to Urdu',
    appName: 'Naya Savera',
  },
  ur: {
    pos: 'فروخت',
    inventory: 'انوینٹری',
    sales: 'فروخت کی رپورٹ',
    customers: 'گاہک',
    products: 'مصنوعات',
    orders: 'آرڈرز',
    credit: 'ادھار',
    settings: 'ترتیبات',
    switchLanguage: 'Switch to English',
    appName: 'نیا سویرا',
  },
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [preSelectedOrderItems, setPreSelectedOrderItems] = useState<any[] | null>(null);
  const [showVoiceRecognition, setShowVoiceRecognition] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen" dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <Toaster position="top-right" richColors duration={1000} />
      {/* Header */}
      <header className="bg-gradient-to-r from-[#FFD700] to-[#FFC700] border-b shadow-md sticky top-0 z-50 flex-shrink-0">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Naya Savera" className="h-16 -my-2" />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-[#C7359C]"
          >
            <Globe className="size-4 text-[#C7359C]" />
            <span className="text-[#C7359C] font-medium hidden sm:inline">{t('switchLanguage')}</span>
          </Button>
        </div>
      </header>

      {/* Main Content with Sidebar - Desktop Only */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Collapsible Sidebar - Hidden on Mobile */}
        <div className={`hidden md:block bg-gradient-to-b from-[#C7359C] to-[#9b2b7a] text-white flex-shrink-0 transition-all duration-300 ease-in-out relative h-full ${sidebarCollapsed ? 'w-16' : 'w-52'}`}>
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-4 bg-white text-[#C7359C] rounded-full p-1 shadow-lg hover:scale-110 transition-transform z-10"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>

          {/* Navigation Items */}
          <nav className="pt-12 px-3 h-full">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('pos')}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all ${
                  activeTab === 'pos' 
                    ? 'bg-white text-[#C7359C] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? t('pos') : ''}
              >
                <ShoppingCart className="size-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>
                  {t('pos')}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all ${
                  activeTab === 'inventory' 
                    ? 'bg-white text-[#C7359C] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? t('inventory') : ''}
              >
                <Warehouse className="size-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>
                  {t('inventory')}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('sales')}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all ${
                  activeTab === 'sales' 
                    ? 'bg-white text-[#C7359C] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? t('sales') : ''}
              >
                <BarChart3 className="size-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>
                  {t('sales')}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all ${
                  activeTab === 'customers' 
                    ? 'bg-white text-[#C7359C] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? t('customers') : ''}
              >
                <Users className="size-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>
                  {t('customers')}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('product')}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all ${
                  activeTab === 'product' 
                    ? 'bg-white text-[#C7359C] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? t('products') : ''}
              >
                <Box className="size-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>
                  {t('products')}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all ${
                  activeTab === 'orders' 
                    ? 'bg-white text-[#C7359C] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? t('orders') : ''}
              >
                <Truck className="size-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>
                  {t('orders')}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('credit')}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all ${
                  activeTab === 'credit' 
                    ? 'bg-white text-[#C7359C] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? t('credit') : ''}
              >
                <CreditCard className="size-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>
                  {t('credit')}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all ${
                  activeTab === 'settings' 
                    ? 'bg-white text-[#C7359C] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? t('settings') : ''}
              >
                <Settings className="size-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>
                  {t('settings')}
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="p-2 sm:p-3 h-full">
            {activeTab === 'pos' && <POSMain language={language} showMobileCart={showMobileCart} setShowMobileCart={setShowMobileCart} showVoiceRecognition={showVoiceRecognition} setShowVoiceRecognition={setShowVoiceRecognition} />}
            {activeTab === 'inventory' && (
              <Inventory 
                language={language} 
                onCreateOrderFromInventory={(items) => {
                  setPreSelectedOrderItems(items);
                  setActiveTab('orders');
                }}
              />
            )}
            {activeTab === 'sales' && <SalesDashboard language={language} />}
            {activeTab === 'customers' && <CustomerManagement language={language} />}
            {activeTab === 'product' && <ProductManagement />}
            {activeTab === 'orders' && (
              <OrderManagement 
                language={language} 
                preSelectedItems={preSelectedOrderItems}
                onItemsUsed={() => setPreSelectedOrderItems(null)}
              />
            )}
            {activeTab === 'settings' && <SettingsModule />}
            {activeTab === 'credit' && <CreditManagement language={language} />}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-5 h-16">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'pos' 
                ? 'text-[#C7359C] bg-purple-50' 
                : 'text-gray-600'
            }`}
          >
            <ShoppingCart className="size-5" />
            <span className="text-xs font-medium">{t('pos')}</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'inventory' 
                ? 'text-[#C7359C] bg-purple-50' 
                : 'text-gray-600'
            }`}
          >
            <Warehouse className="size-5" />
            <span className="text-xs font-medium">{t('inventory')}</span>
          </button>

          {/* Voice Recognition - Prominent Center Button */}
          <button
            onClick={() => {
              if (activeTab !== 'pos') {
                setActiveTab('pos');
              }
              setShowVoiceRecognition(true);
            }}
            className="relative flex flex-col items-center justify-center -mt-2"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-18 bg-gradient-to-r from-[#C7359C] to-[#A62F82] rounded-full shadow-lg flex items-center justify-center border-4 border-white hover:scale-110 transition-transform">
              <Mic className="size-8 text-white" />
            </div>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'customers' 
                ? 'text-[#C7359C] bg-purple-50' 
                : 'text-gray-600'
            }`}
          >
            <Users className="size-5" />
            <span className="text-xs font-medium">{t('customers')}</span>
          </button>

          <Sheet open={showMoreMenu} onOpenChange={setShowMoreMenu}>
            <SheetTrigger asChild>
              <button
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  activeTab === 'product' || activeTab === 'orders' || activeTab === 'settings' || activeTab === 'sales'
                    ? 'text-[#C7359C] bg-purple-50' 
                    : 'text-gray-600'
                }`}
              >
                <MoreHorizontal className="size-5" />
                <span className="text-xs font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>More Options</SheetTitle>
                <SheetDescription>
                  Access additional features
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-3 py-4">
                {/* Sales moved to More menu on mobile */}
                <button
                  onClick={() => {
                    setActiveTab('sales');
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    activeTab === 'sales'
                      ? 'border-[#C7359C] bg-purple-50'
                      : 'border-gray-200 hover:border-[#C7359C] hover:bg-purple-50'
                  }`}
                >
                  <div className="bg-gradient-to-r from-[#C7359C] to-purple-600 p-3 rounded-xl">
                    <BarChart3 className="size-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{t('sales')}</h3>
                    <p className="text-sm text-gray-600">View sales reports and analytics</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('product');
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    activeTab === 'product'
                      ? 'border-[#C7359C] bg-purple-50'
                      : 'border-gray-200 hover:border-[#C7359C] hover:bg-purple-50'
                  }`}
                >
                  <div className="bg-gradient-to-r from-[#C7359C] to-purple-600 p-3 rounded-xl">
                    <Box className="size-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Products</h3>
                    <p className="text-sm text-gray-600">Manage your product catalog</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    activeTab === 'orders'
                      ? 'border-[#C7359C] bg-purple-50'
                      : 'border-gray-200 hover:border-[#C7359C] hover:bg-purple-50'
                  }`}
                >
                  <div className="bg-gradient-to-r from-[#C7359C] to-purple-600 p-3 rounded-xl">
                    <Truck className="size-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Orders</h3>
                    <p className="text-sm text-gray-600">Order from Syngenta</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('credit');
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    activeTab === 'credit'
                      ? 'border-[#C7359C] bg-purple-50'
                      : 'border-gray-200 hover:border-[#C7359C] hover:bg-purple-50'
                  }`}
                >
                  <div className="bg-gradient-to-r from-[#C7359C] to-purple-600 p-3 rounded-xl">
                    <CreditCard className="size-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Credit</h3>
                    <p className="text-sm text-gray-600">Manage credit transactions</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    activeTab === 'settings'
                      ? 'border-[#C7359C] bg-purple-50'
                      : 'border-gray-200 hover:border-[#C7359C] hover:bg-purple-50'
                  }`}
                >
                  <div className="bg-gradient-to-r from-[#C7359C] to-purple-600 p-3 rounded-xl">
                    <Settings className="size-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Settings</h3>
                    <p className="text-sm text-gray-600">Configure your POS system</p>
                  </div>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}