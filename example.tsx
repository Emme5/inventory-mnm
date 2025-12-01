"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  User, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  MoreVertical, 
  TrendingUp, 
  AlertTriangle,
  LogOut,
  Menu,
  X,
  QrCode,
  ArrowUpCircle,
  ArrowDownCircle,
  Camera,
  CheckCircle2
} from 'lucide-react';

// --- Mock Data เริ่มต้น ---
const initialProducts = [
  { id: 1, name: 'หูฟังไร้สาย Pro', sku: 'AUDIO-001', category: 'Electronics', price: 2500, stock: 45, status: 'In Stock' },
  { id: 2, name: 'คีย์บอร์ด Mechanical', sku: 'IT-KB-02', category: 'Accessories', price: 3200, stock: 8, status: 'Low Stock' },
  { id: 3, name: 'เมาส์เกมมิ่ง', sku: 'IT-MS-05', category: 'Accessories', price: 1500, stock: 0, status: 'Out of Stock' },
  { id: 4, name: 'จอมอนิเตอร์ 24"', sku: 'MON-24-LG', category: 'Electronics', price: 5900, stock: 12, status: 'In Stock' },
  { id: 5, name: 'สายชาร์จ USB-C', sku: 'ACC-CBL-01', category: 'Accessories', price: 290, stock: 150, status: 'In Stock' },
];

// --- Components ย่อย ---

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const Badge = ({ status }) => {
  let styles = '';
  switch (status) {
    case 'In Stock': styles = 'bg-green-100 text-green-700'; break;
    case 'Low Stock': styles = 'bg-orange-100 text-orange-700'; break;
    case 'Out of Stock': styles = 'bg-red-100 text-red-700'; break;
    default: styles = 'bg-gray-100 text-gray-700';
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory'); // เริ่มที่หน้า Inventory เพื่อโชว์ฟีเจอร์
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State สำหรับจัดการข้อมูลสินค้า (เปลี่ยนจากค่าคงที่มาเป็น State เพื่อให้แก้ไขได้)
  const [products, setProducts] = useState(initialProducts);

  // State สำหรับ Stock Control Modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockMode, setStockMode] = useState('in'); // 'in' หรือ 'out'
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  // State สำหรับจำลอง QR Scanner
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // ฟังก์ชันเปิด Modal จัดการสต็อก
  const openStockModal = (product, mode = 'in') => {
    setSelectedProduct(product);
    setStockMode(mode);
    setQuantity(1);
    setNote('');
    setIsStockModalOpen(true);
  };

  // ฟังก์ชันบันทึกการปรับสต็อก
  const handleStockSubmit = () => {
    if (!selectedProduct) return;

    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        let newStock = p.stock;
        if (stockMode === 'in') newStock += parseInt(quantity);
        else newStock = Math.max(0, newStock - parseInt(quantity)); // ห้ามติดลบ

        // อัปเดตสถานะอัตโนมัติ
        let newStatus = 'In Stock';
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock < 10) newStatus = 'Low Stock';

        return { ...p, stock: newStock, status: newStatus };
      }
      return p;
    });

    setProducts(updatedProducts);
    setIsStockModalOpen(false);
    // แจ้งเตือนสำเร็จ (จำลอง)
    // alert(`ปรับปรุงสต็อก ${selectedProduct.name} เรียบร้อย!`); 
  };

  // ฟังก์ชันจำลองการสแกน QR
  const startScan = () => {
    setIsScannerOpen(true);
    setIsScanning(true);
    
    // จำลองว่าเจอสินค้าใน 2 วินาที
    setTimeout(() => {
      setIsScanning(false);
      // สุ่มสินค้ามา 1 ชิ้นเพื่อจำลองว่าสแกนเจอ
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setIsScannerOpen(false);
      openStockModal(randomProduct, 'in');
    }, 2000);
  };

  // ฟังก์ชันสลับหน้าเนื้อหา
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-800">ภาพรวม (Dashboard)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="สินค้าทั้งหมด" value={products.length} icon={Package} color="bg-blue-500" />
              <StatCard title="มูลค่ารวม" value="฿452,000" icon={TrendingUp} color="bg-green-500" />
              <StatCard title="สินค้าใกล้หมด" value={products.filter(p => p.stock < 10).length} icon={AlertTriangle} color="bg-orange-500" />
            </div>
            {/* ... (Activity Log code from previous example) ... */}
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">คลังสินค้า (Inventory)</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                {/* ปุ่ม QR Scan - Highlight */}
                <button 
                  onClick={startScan}
                  className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <QrCode size={20} />
                  <span>สแกน QR</span>
                </button>
                <button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <Plus size={20} />
                  <span className="hidden sm:inline">เพิ่มสินค้า</span>
                  <span className="sm:hidden">เพิ่ม</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อสินค้า, SKU หรือสแกน..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* ปุ่ม Scan เล็กในช่องค้นหา */}
                <button onClick={startScan} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  <QrCode size={18} />
                </button>
              </div>
              <select className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>ทุกสถานะ</option>
                <option>สินค้าพร้อมขาย</option>
                <option>สินค้าใกล้หมด</option>
              </select>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-sm">สินค้า</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-sm">ราคา</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-sm">คงเหลือ</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-sm">สถานะ</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-600 text-sm">จัดการสต็อก</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="bg-gray-100 px-1 rounded">{product.sku}</span>
                            {product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-800">฿{product.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`font-mono font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-800'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge status={product.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* ปุ่ม Stock In */}
                            <button 
                              onClick={() => openStockModal(product, 'in')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors tooltip-trigger"
                              title="นำสินค้าเข้า"
                            >
                              <ArrowUpCircle size={20} />
                            </button>
                            {/* ปุ่ม Stock Out */}
                            <button 
                              onClick={() => openStockModal(product, 'out')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="นำสินค้าออก (ขาย/เบิก)"
                            >
                              <ArrowDownCircle size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
             <h2 className="text-2xl font-bold text-gray-800">บัญชีผู้ใช้</h2>
             {/* Mock Content */}
             <div className="bg-white p-8 text-center text-gray-500 rounded-xl border border-gray-100">
               (Account Settings Content)
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Sidebar (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <div className="flex items-center gap-2 text-indigo-600">
              <Package size={28} />
              <span className="text-xl font-bold">StockOne</span>
            </div>
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} className="text-gray-500"/>
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'ภาพรวม' },
              { id: 'inventory', icon: Package, label: 'คลังสินค้า & สต็อก' },
              { id: 'account', icon: User, label: 'บัญชีผู้ใช้' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 capitalize md:block hidden">
              ระบบจัดการสต็อกสินค้า
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {/* ปุ่ม QR Scan บน Header สำหรับ Mobile ที่เข้าถึงง่าย */}
             <button onClick={startScan} className="md:hidden p-2 text-gray-600 bg-gray-100 rounded-full">
               <QrCode size={20} />
             </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold">JD</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {renderContent()}
        </main>

        {/* --- Stock Control Modal --- */}
        {isStockModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">จัดการสต็อกสินค้า</h3>
                <button onClick={() => setIsStockModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Product Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Package size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{selectedProduct.name}</h4>
                    <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
                    <p className="text-sm mt-1">คงเหลือปัจจุบัน: <span className="font-bold text-gray-800">{selectedProduct.stock}</span> ชิ้น</p>
                  </div>
                </div>

                {/* Action Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                  <button 
                    onClick={() => setStockMode('in')}
                    className={`py-2 rounded-md text-sm font-semibold transition-all ${stockMode === 'in' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowUpCircle size={16} /> นำเข้า (In)
                    </div>
                  </button>
                  <button 
                    onClick={() => setStockMode('out')}
                    className={`py-2 rounded-md text-sm font-semibold transition-all ${stockMode === 'out' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowDownCircle size={16} /> นำออก (Out)
                    </div>
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">จำนวน</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >-</button>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                        className="flex-1 text-center h-10 border border-gray-200 rounded-lg font-bold text-lg"
                      />
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="เช่น รับของจาก Supplier A / เบิกไปใช้" 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className={`p-4 rounded-lg flex justify-between items-center ${stockMode === 'in' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <span className="text-sm font-medium">ยอดคงเหลือหลังปรับ:</span>
                  <span className="text-xl font-bold">
                    {stockMode === 'in' ? selectedProduct.stock + quantity : Math.max(0, selectedProduct.stock - quantity)}
                  </span>
                </div>

                <button 
                  onClick={handleStockSubmit}
                  className={`w-full py-3 rounded-xl text-white font-bold shadow-sm transition-colors ${stockMode === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  ยืนยันการ{stockMode === 'in' ? 'รับเข้า' : 'นำออก'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Mock Camera Scanner Overlay --- */}
        {isScannerOpen && (
           <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
             <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                {/* Camera Viewfinder UI */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1"></div>
                    
                    {/* Scanning Line Animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>

                {/* Text feedback */}
                <div className="absolute bottom-10 left-0 right-0 text-center">
                   <p className="text-white text-lg font-medium">
                     {isScanning ? 'กำลังค้นหา Barcode/QR...' : 'พบสินค้า!'}
                   </p>
                   {!isScanning && <div className="mt-2 text-green-400 flex justify-center items-center gap-2"><CheckCircle2 size={20}/> สำเร็จ</div>}
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setIsScannerOpen(false)}
                  className="absolute top-4 right-4 text-white bg-black/40 p-2 rounded-full hover:bg-black/60"
                >
                  <X size={24} />
                </button>
             </div>
             <p className="text-gray-400 mt-4 text-sm">จำลองการทำงานกล้อง (Simulation)</p>
           </div>
        )}

      </div>
    </div>
  );
}