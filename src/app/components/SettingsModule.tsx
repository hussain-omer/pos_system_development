import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { 
  Settings, 
  Store, 
  Receipt, 
  Printer, 
  DollarSign,
  Globe,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  Save,
  RefreshCw,
  Percent,
  Clock,
  Phone,
  MapPin,
  Mail,
  FileText,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsModule() {
  // Store Information
  const [storeInfo, setStoreInfo] = useState({
    name: 'Naya Savera Agro Store',
    phone: '+92 300 1234567',
    email: 'contact@nayasavera.pk',
    address: 'Main Bazar, Village Name, District, Pakistan',
    taxId: 'NTN-1234567-8'
  });

  // Tax Settings
  const [taxSettings, setTaxSettings] = useState({
    enableTax: true,
    taxRate: 17,
    taxLabel: 'GST'
  });

  // Receipt Settings
  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showTaxId: true,
    footerMessage: 'Thank you for your business!',
    printAutomatically: false,
    smsReceipt: true
  });

  // Currency Settings
  const [currencySettings, setCurrencySettings] = useState({
    currency: 'PKR',
    symbol: 'PKR',
    position: 'before'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    lowStockThreshold: 10,
    expiryAlerts: true,
    expiryDaysBefore: 30,
    salesNotifications: true
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    offlineMode: true,
    darkMode: false
  });

  // POS Display Settings
  const [posSettings, setPosSettings] = useState(() => {
    const saved = localStorage.getItem('posDisplaySettings');
    return saved ? JSON.parse(saved) : { 
      showOutOfStock: false,
      currency: 'PKR',
      currencySymbol: 'PKR',
      currencyPosition: 'before'
    };
  });

  // Credit Settings
  const [creditSettings, setCreditSettings] = useState(() => {
    const saved = localStorage.getItem('creditSettings');
    return saved ? JSON.parse(saved) : {
      overdueDays: 30
    };
  });

  const handleSaveSettings = () => {
    // Save POS settings to localStorage
    localStorage.setItem('posDisplaySettings', JSON.stringify(posSettings));
    // Save Credit settings to localStorage
    localStorage.setItem('creditSettings', JSON.stringify(creditSettings));
    toast.success('Settings saved successfully!');
  };

  const handleExportData = () => {
    const allSettings = {
      storeInfo,
      taxSettings,
      receiptSettings,
      currencySettings,
      notificationSettings,
      systemSettings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `naya-savera-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('Settings exported successfully!');
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.storeInfo) setStoreInfo(imported.storeInfo);
          if (imported.taxSettings) setTaxSettings(imported.taxSettings);
          if (imported.receiptSettings) setReceiptSettings(imported.receiptSettings);
          if (imported.currencySettings) setCurrencySettings(imported.currencySettings);
          if (imported.notificationSettings) setNotificationSettings(imported.notificationSettings);
          if (imported.systemSettings) setSystemSettings(imported.systemSettings);
          toast.success('Settings imported successfully!');
        } catch (error) {
          toast.error('Failed to import settings');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      setStoreInfo({
        name: 'Naya Savera Agro Store',
        phone: '+92 300 1234567',
        email: 'contact@nayasavera.pk',
        address: 'Main Bazar, Village Name, District, Pakistan',
        taxId: 'NTN-1234567-8'
      });
      setTaxSettings({ enableTax: true, taxRate: 17, taxLabel: 'GST' });
      setReceiptSettings({
        showLogo: true,
        showTaxId: true,
        footerMessage: 'Thank you for your business!',
        printAutomatically: false,
        smsReceipt: true
      });
      setCurrencySettings({ currency: 'PKR', symbol: 'PKR', position: 'before' });
      setNotificationSettings({
        lowStockAlerts: true,
        lowStockThreshold: 10,
        expiryAlerts: true,
        expiryDaysBefore: 30,
        salesNotifications: true
      });
      setSystemSettings({
        autoBackup: true,
        backupFrequency: 'daily',
        offlineMode: true,
        darkMode: false
      });
      toast.success('Settings reset to defaults');
    }
  };

  return (
    <div className="space-y-6 p-3 lg:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 pl-2">System Settings</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="size-4" />
            Export Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetSettings}
            className="flex items-center gap-2"
          >
            <RefreshCw className="size-4" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSaveSettings}
            className="flex items-center gap-2"
          >
            <Save className="size-4" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Header Card with Actions */}
      <Card>
      </Card>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Store Information */}
        <Card className="border-2 hover:border-purple-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Store className="size-5 text-[#C7359C]" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeInfo.name}
                  onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone" className="flex items-center gap-1">
                  <Phone className="size-3" />
                  Phone Number
                </Label>
                <Input
                  id="storePhone"
                  value={storeInfo.phone}
                  onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail" className="flex items-center gap-1">
                  <Mail className="size-3" />
                  Email
                </Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeInfo.email}
                  onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeTaxId">Tax ID / NTN</Label>
                <Input
                  id="storeTaxId"
                  value={storeInfo.taxId}
                  onChange={(e) => setStoreInfo({ ...storeInfo, taxId: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress" className="flex items-center gap-1">
                <MapPin className="size-3" />
                Address
              </Label>
              <Input
                id="storeAddress"
                value={storeInfo.address}
                onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card className="border-2 hover:border-purple-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Percent className="size-5 text-[#C7359C]" />
              Tax Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableTax" className="text-base">Enable Tax</Label>
                <p className="text-sm text-gray-500">Apply tax to all sales</p>
              </div>
              <Switch
                id="enableTax"
                checked={taxSettings.enableTax}
                onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, enableTax: checked })}
              />
            </div>
            {taxSettings.enableTax && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={taxSettings.taxRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, taxRate: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxLabel">Tax Label (GST/VAT/Sales Tax)</Label>
                  <Input
                    id="taxLabel"
                    value={taxSettings.taxLabel}
                    onChange={(e) => setTaxSettings({ ...taxSettings, taxLabel: e.target.value })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receipt Settings */}
        <Card className="border-2 hover:border-purple-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="size-5 text-[#C7359C]" />
              Receipt Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showLogo" className="text-base">Show Logo on Receipt</Label>
                <p className="text-sm text-gray-500">Display store logo</p>
              </div>
              <Switch
                id="showLogo"
                checked={receiptSettings.showLogo}
                onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showLogo: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showTaxId" className="text-base">Show Tax ID on Receipt</Label>
                <p className="text-sm text-gray-500">Display NTN/Tax ID</p>
              </div>
              <Switch
                id="showTaxId"
                checked={receiptSettings.showTaxId}
                onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showTaxId: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="printAuto" className="text-base flex items-center gap-1">
                  <Printer className="size-3" />
                  Auto Print Receipt
                </Label>
                <p className="text-sm text-gray-500">Automatically print after checkout</p>
              </div>
              <Switch
                id="printAuto"
                checked={receiptSettings.printAutomatically}
                onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, printAutomatically: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsReceipt" className="text-base">SMS Receipt</Label>
                <p className="text-sm text-gray-500">Send receipt via SMS</p>
              </div>
              <Switch
                id="smsReceipt"
                checked={receiptSettings.smsReceipt}
                onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, smsReceipt: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footerMessage" className="flex items-center gap-1">
                <FileText className="size-3" />
                Footer Message
              </Label>
              <Input
                id="footerMessage"
                value={receiptSettings.footerMessage}
                onChange={(e) => setReceiptSettings({ ...receiptSettings, footerMessage: e.target.value })}
                placeholder="Thank you message"
              />
            </div>
          </CardContent>
        </Card>

                {/* POS Display Settings */}
        <Card className="border-2 hover:border-purple-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="size-5 text-[#C7359C]" />
              POS Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showOutOfStock" className="text-base">Show Out of Stock Products</Label>
                <p className="text-sm text-gray-500">Display products with zero inventory on POS screen</p>
              </div>
              <Switch
                id="showOutOfStock"
                checked={posSettings.showOutOfStock}
                onCheckedChange={(checked) => {
                  const newSettings = { ...posSettings, showOutOfStock: checked };
                  setPosSettings(newSettings);
                  localStorage.setItem('posDisplaySettings', JSON.stringify(newSettings));
                  toast.success(checked ? 'Out of stock products will now be shown' : 'Out of stock products will be hidden');
                }}
              />
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-base flex items-center gap-2 mb-3">
                <DollarSign className="size-4 text-[#C7359C]" />
                Currency Display
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="posCurrency">Currency Code</Label>
                  <Input
                    id="posCurrency"
                    value={posSettings.currency}
                    onChange={(e) => {
                      const newSettings = { ...posSettings, currency: e.target.value };
                      setPosSettings(newSettings);
                      localStorage.setItem('posDisplaySettings', JSON.stringify(newSettings));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posCurrencySymbol">Currency Symbol</Label>
                  <Input
                    id="posCurrencySymbol"
                    value={posSettings.currencySymbol}
                    onChange={(e) => {
                      const newSettings = { ...posSettings, currencySymbol: e.target.value };
                      setPosSettings(newSettings);
                      localStorage.setItem('posDisplaySettings', JSON.stringify(newSettings));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posCurrencyPosition">Symbol Position</Label>
                  <select
                    id="posCurrencyPosition"
                    value={posSettings.currencyPosition}
                    onChange={(e) => {
                      const newSettings = { ...posSettings, currencyPosition: e.target.value };
                      setPosSettings(newSettings);
                      localStorage.setItem('posDisplaySettings', JSON.stringify(newSettings));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="before">Before (PKR 1000)</option>
                    <option value="after">After (1000 PKR)</option>
                  </select>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 mt-3">
                <p className="text-sm text-gray-600">Preview:</p>
                <p className="text-lg font-bold text-[#C7359C]">
                  {posSettings.currencyPosition === 'before' 
                    ? `${posSettings.currencySymbol} 1,234.50` 
                    : `1,234.50 ${posSettings.currencySymbol}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-2 hover:border-purple-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="size-5 text-[#C7359C]" />
              Notifications & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lowStockAlerts" className="text-base">Low Stock Alerts</Label>
                <p className="text-sm text-gray-500">Get notified when stock is low</p>
              </div>
              <Switch
                id="lowStockAlerts"
                checked={notificationSettings.lowStockAlerts}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })}
              />
            </div>
            {notificationSettings.lowStockAlerts && (
              <div className="space-y-2 ml-4">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={notificationSettings.lowStockThreshold}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockThreshold: parseInt(e.target.value) })}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="expiryAlerts" className="text-base flex items-center gap-1">
                  <Clock className="size-3" />
                  Expiry Alerts
                </Label>
                <p className="text-sm text-gray-500">Alert for expiring products</p>
              </div>
              <Switch
                id="expiryAlerts"
                checked={notificationSettings.expiryAlerts}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, expiryAlerts: checked })}
              />
            </div>
            {notificationSettings.expiryAlerts && (
              <div className="space-y-2 ml-4">
                <Label htmlFor="expiryDaysBefore">Alert Days Before Expiry</Label>
                <Input
                  id="expiryDaysBefore"
                  type="number"
                  value={notificationSettings.expiryDaysBefore}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, expiryDaysBefore: parseInt(e.target.value) })}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="salesNotifications" className="text-base">Sales Notifications</Label>
                <p className="text-sm text-gray-500">Daily sales summary</p>
              </div>
              <Switch
                id="salesNotifications"
                checked={notificationSettings.salesNotifications}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, salesNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="border-2 hover:border-purple-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="size-5 text-[#C7359C]" />
              System & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoBackup" className="text-base">Auto Backup</Label>
                <p className="text-sm text-gray-500">Automatic data backup</p>
              </div>
              <Switch
                id="autoBackup"
                checked={systemSettings.autoBackup}
                onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoBackup: checked })}
              />
            </div>
            {systemSettings.autoBackup && (
              <div className="space-y-2 ml-4">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <select
                  id="backupFrequency"
                  value={systemSettings.backupFrequency}
                  onChange={(e) => setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="offlineMode" className="text-base">Offline Mode</Label>
                <p className="text-sm text-gray-500">Work without internet</p>
              </div>
              <Switch
                id="offlineMode"
                checked={systemSettings.offlineMode}
                onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, offlineMode: checked })}
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="text-base">Data Management</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="flex-1"
                >
                  <Download className="size-4 mr-2" />
                  Export Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={handleImportData}
                  className="flex-1"
                >
                  <Upload className="size-4 mr-2" />
                  Import Settings
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleResetSettings}
                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300"
              >
                <RefreshCw className="size-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="size-5 text-[#C7359C]" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Backup:</span>
                <span className="font-medium">Today, 2:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage Used:</span>
                <span className="font-medium">24.5 MB / 1 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Settings */}
        <Card className="border-2 hover:border-purple-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="size-5 text-[#C7359C]" />
              Credit Management Settings
            </CardTitle>
            <CardDescription>Configure credit and overdue policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="overdueDays" className="text-base">Overdue Period (Days)</Label>
              <p className="text-sm text-gray-500">Number of days after which credit becomes overdue</p>
              <Input
                id="overdueDays"
                type="number"
                min="1"
                max="365"
                value={creditSettings.overdueDays}
                onChange={(e) => setCreditSettings({ ...creditSettings, overdueDays: parseInt(e.target.value) || 30 })}
              />
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 mt-3">
                <p className="text-sm text-gray-600">
                  Credit transactions older than <span className="font-bold text-[#C7359C]">{creditSettings.overdueDays} days</span> will be marked as overdue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}