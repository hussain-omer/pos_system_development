import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  RefreshCw,
  Calendar,
  Loader2,
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit,
  ShoppingCart,
  Package,
  FileDown,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-77be783d`;

interface InventoryMovement {
  id: string;
  variantId: string;
  variantName: string;
  productId: string;
  productName: string;
  batchId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  reference?: string;
  timestamp: string;
  performedBy?: string;
}

export function InventoryMovementLogs() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/inventory-movements`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMovements(data.movements || []);
      } else {
        toast.error('Failed to load inventory movements');
      }
    } catch (error) {
      console.error('Error fetching inventory movements:', error);
      toast.error('Error loading movements');
    } finally {
      setLoading(false);
    }
  };

  const clearAllLogs = async () => {
    setShowClearConfirm(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/inventory-movements/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Successfully cleared ${data.deletedCount} movement logs`);
        setMovements([]);
      } else {
        toast.error('Failed to clear movement logs');
      }
    } catch (error) {
      console.error('Error clearing movement logs:', error);
      toast.error('Error clearing logs');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredMovements = movements.filter(movement => {
    // Build displayName for search (variantName if exists, else productName)
    const displayName = movement.variantName || movement.productName;
    
    const matchesSearch = 
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Type filter
    if (typeFilter !== 'all' && movement.type !== typeFilter) return false;

    return true;
  });

  // Sort movements
  const sortedMovements = [...filteredMovements].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'date-asc':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'product':
        return a.productName.localeCompare(b.productName);
      case 'quantity-desc':
        return b.quantity - a.quantity;
      case 'quantity-asc':
        return a.quantity - b.quantity;
      default:
        return 0;
    }
  });

  // Calculate statistics
  const totalIn = movements.filter(m => m.type === 'IN').reduce((sum, m) => sum + m.quantity, 0);
  const totalOut = movements.filter(m => m.type === 'OUT').reduce((sum, m) => sum + m.quantity, 0);
  const totalAdjustments = movements.filter(m => m.type === 'ADJUSTMENT').length;

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Product', 'Batch ID', 'Type', 'Quantity', 'Reason', 'Reference'];
    const rows = sortedMovements.map(movement => [
      new Date(movement.timestamp).toLocaleString(),
      movement.productName,
      movement.batchId,
      movement.type,
      movement.quantity,
      movement.reason,
      movement.reference || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-movements-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Movement logs exported successfully!');
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'IN':
        return <ArrowUpCircle className="size-4 text-green-600" />;
      case 'OUT':
        return <ArrowDownCircle className="size-4 text-red-600" />;
      case 'ADJUSTMENT':
        return <Edit className="size-4 text-blue-600" />;
      default:
        return <Package className="size-4 text-gray-600" />;
    }
  };

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'IN':
        return <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Stock In</Badge>;
      case 'OUT':
        return <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">Stock Out</Badge>;
      case 'ADJUSTMENT':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">Adjustment</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock In</p>
                <p className="text-2xl font-bold text-green-600">{totalIn.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Total units added</p>
              </div>
              <ArrowUpCircle className="size-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Out</p>
                <p className="text-2xl font-bold text-red-600">{totalOut.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Total units removed</p>
              </div>
              <ArrowDownCircle className="size-10 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Adjustments</p>
                <p className="text-2xl font-bold text-blue-600">{totalAdjustments}</p>
                <p className="text-xs text-gray-500 mt-1">Manual corrections</p>
              </div>
              <Edit className="size-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movement Logs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="size-5" />
                Inventory Movement History
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchMovements}
                disabled={loading}
              >
                <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToCSV}
                disabled={sortedMovements.length === 0}
              >
                <FileDown className="size-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                disabled={sortedMovements.length === 0}
              >
                <Trash2 className="size-4 mr-2" />
                Clear Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search by product, batch ID, reason, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Movement Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="IN">Stock In</SelectItem>
                <SelectItem value="OUT">Stock Out</SelectItem>
                <SelectItem value="ADJUSTMENT">Adjustments</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                <SelectItem value="product">Product Name</SelectItem>
                <SelectItem value="quantity-desc">Quantity (High-Low)</SelectItem>
                <SelectItem value="quantity-asc">Quantity (Low-High)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setSortBy('date-desc');
              }}
              className="md:col-span-2"
            >
              <RefreshCw className="size-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Movement Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-purple-600" />
            </div>
          ) : sortedMovements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <History className="size-12 mb-3 opacity-50" />
              <p className="text-sm">No movement history found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Date & Time</TableHead>
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">Batch ID</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold text-right">Quantity</TableHead>
                      <TableHead className="font-semibold">Reason</TableHead>
                      <TableHead className="font-semibold">Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMovements.map((movement) => {
                      const displayName = movement.variantName || movement.productName;
                      
                      return (
                        <TableRow key={movement.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="size-3 text-gray-400" />
                              <div>
                                <p className="text-sm font-semibold">
                                  {new Date(movement.timestamp).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(movement.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold">{displayName}</p>
                            <p className="text-xs text-gray-500">{movement.variantId || movement.productId}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-mono text-xs">{movement.batchId}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getMovementIcon(movement.type)}
                              {getMovementBadge(movement.type)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-bold ${
                              movement.type === 'IN' ? 'text-green-600' : 
                              movement.type === 'OUT' ? 'text-red-600' : 
                              'text-blue-600'
                            }`}>
                              {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '±'}
                              {movement.quantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{movement.reason}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-600">{movement.reference || '-'}</p>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {sortedMovements.map((movement) => {
                  const displayName = movement.variantName || movement.productName;
                  
                  return (
                    <Card key={movement.id}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getMovementIcon(movement.type)}
                                {getMovementBadge(movement.type)}
                              </div>
                              <p className="font-semibold text-sm">{displayName}</p>
                              <p className="text-xs text-gray-500">{movement.variantId || movement.productId}</p>
                            </div>
                            <div className="text-right">
                              <span className={`font-bold text-lg ${
                                movement.type === 'IN' ? 'text-green-600' : 
                                movement.type === 'OUT' ? 'text-red-600' : 
                                'text-blue-600'
                              }`}>
                                {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '±'}
                                {movement.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-gray-600">Batch ID</p>
                              <p className="font-mono font-semibold">{movement.batchId}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Date</p>
                              <p className="font-semibold">{new Date(movement.timestamp).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="text-xs">
                            <p className="text-gray-600">Reason</p>
                            <p className="font-semibold">{movement.reason}</p>
                          </div>

                          {movement.reference && (
                            <div className="text-xs">
                              <p className="text-gray-600">Reference</p>
                              <p className="font-semibold">{movement.reference}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Clear Logs Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 shadow-2xl border-2">
            <CardHeader className="bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="size-6 text-red-600" />
                </div>
                <CardTitle className="text-xl text-red-900">Clear All Movement Logs?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <p className="text-gray-700">
                  You are about to delete <strong className="text-red-600">{movements.length} movement log{movements.length !== 1 ? 's' : ''}</strong>.
                </p>
                <p className="text-gray-700">
                  This action will permanently remove all inventory movement history including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
                  <li>Stock in records</li>
                  <li>Stock out records</li>
                  <li>Adjustment records</li>
                  <li>All timestamps and references</li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-yellow-800 font-semibold flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    This action cannot be undone!
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={clearAllLogs}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4 mr-2" />
                      Clear All Logs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}