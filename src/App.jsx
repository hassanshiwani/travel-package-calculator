import React, { useState, useRef } from 'react';
import {
  Plus, Trash2, Settings, Download, Eye, EyeOff, 
  Home, Plane, Passport, MapPin, MapPinIcon, Zap, Upload, 
  ChevronDown, ChevronUp, MoreVertical, Copy, AlertCircle
} from 'lucide-react';
import ProfileManager from './components/ProfileManager';
import PrintTemplate from './components/PrintTemplate';
import SummaryPanel from './components/SummaryPanel';

const TravelQuotationSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const printRef = useRef();

  // Profile State
  const [company, setCompany] = useState({
    name: 'Shiwani Travel & Tours',
    logo: null,
    phone: '+92-300-1234567',
    whatsapp: '+92-300-1234567',
    email: 'info@shiwanitravel.com',
    website: 'www.shiwanitravel.com',
    address: 'Karachi, Pakistan',
    instagram: '@shiwanitravel',
    facebook: 'shiwanitravel',
    color: '#1e40af',
    bankDetails: 'Bank: HBL | Account: 1234567890',
    taxId: 'Tax ID: 12345-6789'
  });

  // Package State
  const [packageInfo, setPackageInfo] = useState({
    name: 'Umrah Gold Package',
    type: 'Umrah',
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    adults: 2,
    cwb: 1,
    cnb: 0,
    infants: 0,
    notes: ''
  });

  // Services State
  const [services, setServices] = useState({
    hotels: [],
    tickets: [],
    visas: [],
    transport: [],
    ziyarat: []
  });

  // Exchange Rates
  const [exchangeRates, setExchangeRates] = useState({
    PKR: 1,
    SAR: 62,
    USD: 278,
    AED: 75.8,
    TRY: 8.5
  });

  // Pricing State
  const [pricing, setPricing] = useState({
    markupPercentage: 15,
    useCustomSelling: false,
    customSellingAmount: 0,
    discountPercentage: 0,
    showProfitToClient: false,
    hideInternalCosts: true
  });

  // Helper functions
  const getTotalPersons = () => {
    return parseInt(packageInfo.adults) + parseInt(packageInfo.cwb) + 
           parseInt(packageInfo.cnb) + parseInt(packageInfo.infants || 0);
  };

  const convertToPKR = (amount, currency) => {
    return amount * exchangeRates[currency];
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateHotelCost = (hotel) => {
    const nights = calculateNights(hotel.checkIn, hotel.checkOut);
    return convertToPKR(hotel.costPerRoom, hotel.currency) * nights * hotel.numRooms;
  };

  // Calculate functions
  const getTotalInternalCost = () => {
    let total = 0;
    
    services.hotels.forEach(h => {
      total += calculateHotelCost(h);
    });
    
    services.tickets.forEach(t => {
      const adults = parseInt(packageInfo.adults) * convertToPKR(t.adultFare, t.currency);
      const children = parseInt(packageInfo.cwb + packageInfo.cnb) * convertToPKR(t.childFare, t.currency);
      const infants = parseInt(packageInfo.infants || 0) * convertToPKR(t.infantFare, t.currency);
      total += adults + children + infants + convertToPKR(t.taxes, t.currency);
    });
    
    services.visas.forEach(v => {
      total += getTotalPersons() * convertToPKR(v.cost, v.currency);
    });
    
    services.transport.forEach(tr => {
      total += convertToPKR(tr.costPerPerson, tr.currency) * getTotalPersons();
    });
    
    services.ziyarat.forEach(z => {
      total += convertToPKR(z.costPerPerson, z.currency) * getTotalPersons();
    });
    
    return total;
  };

  const getTotalSellingPrice = () => {
    const cost = getTotalInternalCost();
    if (pricing.useCustomSelling) {
      return pricing.customSellingAmount;
    }
    const withMarkup = cost * (1 + pricing.markupPercentage / 100);
    return withMarkup * (1 - pricing.discountPercentage / 100);
  };

  const getProfit = () => {
    return getTotalSellingPrice() - getTotalInternalCost();
  };

  const getProfitPercentage = () => {
    const cost = getTotalInternalCost();
    return cost > 0 ? ((getProfit() / cost) * 100).toFixed(2) : 0;
  };

  const getPerPersonCost = () => {
    return (getTotalInternalCost() / getTotalPersons()).toFixed(0);
  };

  const getPerPersonSelling = () => {
    return (getTotalSellingPrice() / getTotalPersons()).toFixed(0);
  };

  // Logo Upload Handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany({ ...company, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Service management functions
  const addHotel = () => {
    const newHotel = {
      id: Date.now(),
      hotelName: 'New Hotel',
      city: '',
      checkIn: packageInfo.startDate,
      checkOut: packageInfo.endDate,
      roomType: 'Deluxe',
      mealPlan: 'Breakfast',
      sharingType: 'Triple',
      numRooms: 1,
      costPerRoom: 0,
      currency: 'PKR',
      sellingPerRoom: 0,
      showToClient: true,
      showBreakup: true,
      internalNotes: '',
    };
    setServices({ ...services, hotels: [...services.hotels, newHotel] });
  };

  const updateHotel = (id, field, value) => {
    setServices({
      ...services,
      hotels: services.hotels.map(h => h.id === id ? { ...h, [field]: value } : h)
    });
  };

  const deleteHotel = (id) => {
    setServices({ ...services, hotels: services.hotels.filter(h => h.id !== id) });
  };

  const addTicket = () => {
    setServices({
      ...services,
      tickets: [...services.tickets, {
        id: Date.now(),
        airlineName: 'New Airline',
        sector: '',
        departureDate: packageInfo.startDate,
        returnDate: packageInfo.endDate,
        flightType: 'Direct',
        baggage: '20 KG',
        ticketClass: 'Economy',
        refundable: true,
        adultFare: 0,
        childFare: 0,
        infantFare: 0,
        taxes: 0,
        currency: 'PKR',
        showToClient: true,
        showBreakup: true,
        notes: ''
      }]
    });
  };

  const deleteTicket = (id) => {
    setServices({ ...services, tickets: services.tickets.filter(t => t.id !== id) });
  };

  const updateTicket = (id, field, value) => {
    setServices({
      ...services,
      tickets: services.tickets.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const addVisa = () => {
    setServices({
      ...services,
      visas: [...services.visas, {
        id: Date.now(),
        visaType: 'Umrah Visa',
        duration: '30 days',
        processingTime: '3-5 days',
        cost: 0,
        currency: 'PKR',
        showToClient: true,
        notes: ''
      }]
    });
  };

  const deleteVisa = (id) => {
    setServices({ ...services, visas: services.visas.filter(v => v.id !== id) });
  };

  const updateVisa = (id, field, value) => {
    setServices({
      ...services,
      visas: services.visas.map(v => v.id === id ? { ...v, [field]: value } : v)
    });
  };

  const addTransport = () => {
    setServices({
      ...services,
      transport: [...services.transport, {
        id: Date.now(),
        transportType: 'Ground Transport',
        vehicleType: 'Coach',
        route: '',
        pickupLocation: '',
        dropoffLocation: '',
        costPerPerson: 0,
        currency: 'PKR',
        showToClient: true,
        notes: ''
      }]
    });
  };

  const deleteTransport = (id) => {
    setServices({ ...services, transport: services.transport.filter(t => t.id !== id) });
  };

  const updateTransport = (id, field, value) => {
    setServices({
      ...services,
      transport: services.transport.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const addZiyarat = () => {
    setServices({
      ...services,
      ziyarat: [...services.ziyarat, {
        id: Date.now(),
        ziyaratType: 'Ziyarat Package',
        includedPlaces: '',
        timing: '',
        costPerPerson: 0,
        currency: 'PKR',
        showToClient: true,
        notes: ''
      }]
    });
  };

  const deleteZiyarat = (id) => {
    setServices({ ...services, ziyarat: services.ziyarat.filter(z => z.id !== id) });
  };

  const updateZiyarat = (id, field, value) => {
    setServices({
      ...services,
      ziyarat: services.ziyarat.map(z => z.id === id ? { ...z, [field]: value } : z)
    });
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block; }
          body { background: white; }
        }
        .no-print { display: block; }
        .print-only { display: none; }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {company.logo && (
                <img src={company.logo} alt={company.name} className="h-12 w-12 object-contain rounded" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{company.name}</h1>
                <p className="text-xs text-slate-400">Professional Travel Quotation System</p>
              </div>
            </div>

            <div className="flex gap-2">
              {['dashboard', 'profile', 'preview'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-2 no-print"
              >
                <Download className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 no-print">
        {activeTab === 'profile' && (
          <ProfileManager 
            company={company} 
            setCompany={setCompany}
            handleLogoUpload={handleLogoUpload}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Services */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Package Info Card */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Package Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400 block mb-2">Package Name</label>
                      <input
                        type="text"
                        value={packageInfo.name}
                        onChange={(e) => setPackageInfo({ ...packageInfo, name: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 block mb-2">Package Type</label>
                      <select
                        value={packageInfo.type}
                        onChange={(e) => setPackageInfo({ ...packageInfo, type: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option>Umrah</option>
                        <option>Hajj</option>
                        <option>Holiday</option>
                        <option>Group Tour</option>
                        <option>Corporate Tour</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400 block mb-2">Start Date</label>
                      <input
                        type="date"
                        value={packageInfo.startDate}
                        onChange={(e) => setPackageInfo({ ...packageInfo, startDate: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 block mb-2">End Date</label>
                      <input
                        type="date"
                        value={packageInfo.endDate}
                        onChange={(e) => setPackageInfo({ ...packageInfo, endDate: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-2 bg-slate-700/50 p-4 rounded-lg">
                    {[
                      { label: 'Adults', key: 'adults' },
                      { label: 'CWB', key: 'cwb' },
                      { label: 'CNB', key: 'cnb' },
                      { label: 'Infants', key: 'infants' },
                      { label: 'Duration', key: 'duration' },
                      { label: 'Total', key: 'total' }
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-xs text-slate-400 block mb-1">{field.label}</label>
                        {field.key === 'total' ? (
                          <div className="bg-blue-600 rounded px-2 py-2 text-white font-bold text-center">
                            {getTotalPersons()}
                          </div>
                        ) : field.key === 'duration' ? (
                          <div className="bg-blue-600 rounded px-2 py-2 text-white font-bold text-center">
                            {calculateNights(packageInfo.startDate, packageInfo.endDate)} N
                          </div>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            value={packageInfo[field.key]}
                            onChange={(e) => setPackageInfo({ ...packageInfo, [field.key]: parseInt(e.target.value) })}
                            className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-2 text-white text-center focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Internal Notes (Not shown to client)</label>
                    <textarea
                      value={packageInfo.notes}
                      onChange={(e) => setPackageInfo({ ...packageInfo, notes: e.target.value })}
                      placeholder="Add any internal notes..."
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Hotels Section */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Home className="w-6 h-6 text-purple-400" />
                    Hotels ({services.hotels.length})
                  </h2>
                  <button
                    onClick={addHotel}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Hotel
                  </button>
                </div>

                <div className="space-y-4">
                  {services.hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onUpdate={updateHotel}
                      onDelete={deleteHotel}
                      calculateHotelCost={calculateHotelCost}
                      calculateNights={calculateNights}
                    />
                  ))}
                </div>
              </div>

              {/* Tickets Section */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Plane className="w-6 h-6 text-blue-400" />
                    Flight Tickets ({services.tickets.length})
                  </h2>
                  <button
                    onClick={addTicket}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Ticket
                  </button>
                </div>

                <div className="space-y-4">
                  {services.tickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onUpdate={updateTicket}
                      onDelete={deleteTicket}
                    />
                  ))}
                </div>
              </div>

              {/* Visa Section */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Passport className="w-6 h-6 text-green-400" />
                    Visa Services ({services.visas.length})
                  </h2>
                  <button
                    onClick={addVisa}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Visa
                  </button>
                </div>

                <div className="space-y-4">
                  {services.visas.map((visa) => (
                    <VisaCard
                      key={visa.id}
                      visa={visa}
                      onUpdate={updateVisa}
                      onDelete={deleteVisa}
                    />
                  ))}
                </div>
              </div>

              {/* Transport Section */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-orange-400" />
                    Transport Services ({services.transport.length})
                  </h2>
                  <button
                    onClick={addTransport}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Transport
                  </button>
                </div>

                <div className="space-y-4">
                  {services.transport.map((trans) => (
                    <TransportCard
                      key={trans.id}
                      transport={trans}
                      onUpdate={updateTransport}
                      onDelete={deleteTransport}
                    />
                  ))}
                </div>
              </div>

              {/* Ziyarat Section */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPinIcon className="w-6 h-6 text-red-400" />
                    Ziyarat Services ({services.ziyarat.length})
                  </h2>
                  <button
                    onClick={addZiyarat}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Ziyarat
                  </button>
                </div>

                <div className="space-y-4">
                  {services.ziyarat.map((ziyarat) => (
                    <ZiyaratCard
                      key={ziyarat.id}
                      ziyarat={ziyarat}
                      onUpdate={updateZiyarat}
                      onDelete={deleteZiyarat}
                    />
                  ))}
                </div>
              </div>

              {/* Exchange Rates Section */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Exchange Rates (vs PKR)
                </h2>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(exchangeRates).map(([currency, rate]) => (
                    <div key={currency}>
                      <label className="text-xs text-slate-400 block mb-2">{currency}</label>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setExchangeRates({ ...exchangeRates, [currency]: parseFloat(e.target.value) })}
                        disabled={currency === 'PKR'}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Settings */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Pricing Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-slate-300 w-40">Markup %</label>
                    <input
                      type="number"
                      value={pricing.markupPercentage}
                      onChange={(e) => setPricing({ ...pricing, markupPercentage: parseFloat(e.target.value) })}
                      className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400">{pricing.markupPercentage}%</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-slate-300 w-40">Discount %</label>
                    <input
                      type="number"
                      value={pricing.discountPercentage}
                      onChange={(e) => setPricing({ ...pricing, discountPercentage: parseFloat(e.target.value) })}
                      className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400">{pricing.discountPercentage}%</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pricing.useCustomSelling}
                        onChange={(e) => setPricing({ ...pricing, useCustomSelling: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">Custom Selling Price (PKR)</span>
                    </label>
                    <input
                      type="number"
                      value={pricing.customSellingAmount}
                      onChange={(e) => setPricing({ ...pricing, customSellingAmount: parseFloat(e.target.value) })}
                      disabled={!pricing.useCustomSelling}
                      className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={pricing.showProfitToClient}
                        onChange={(e) => setPricing({ ...pricing, showProfitToClient: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">Show Profit to Client</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pricing.hideInternalCosts}
                        onChange={(e) => setPricing({ ...pricing, hideInternalCosts: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">Hide Internal Costs (Client View)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Summary */}
            <SummaryPanel 
              totalInternalCost={getTotalInternalCost()}
              totalSellingPrice={getTotalSellingPrice()}
              profit={getProfit()}
              profitPercentage={getProfitPercentage()}
              perPersonCost={getPerPersonCost()}
              perPersonSelling={getPerPersonSelling()}
              company={company}
              pricing={pricing}
              onPrint={handlePrint}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="bg-white text-black p-12 rounded-2xl border-4 border-slate-300 shadow-2xl">
            <PrintTemplate 
              company={company}
              packageInfo={packageInfo}
              services={services}
              exchangeRates={exchangeRates}
              getTotalPersons={getTotalPersons}
              calculateNights={calculateNights}
              convertToPKR={convertToPKR}
              calculateHotelCost={calculateHotelCost}
              getTotalInternalCost={getTotalInternalCost}
              getTotalSellingPrice={getTotalSellingPrice}
              getProfit={getProfit}
              getProfitPercentage={getProfitPercentage}
              pricing={pricing}
            />
          </div>
        )}
      </div>

      {/* Print Template (Hidden) */}
      <div className="print-only" ref={printRef}>
        <PrintTemplate 
          company={company}
          packageInfo={packageInfo}
          services={services}
          exchangeRates={exchangeRates}
          getTotalPersons={getTotalPersons}
          calculateNights={calculateNights}
          convertToPKR={convertToPKR}
          calculateHotelCost={calculateHotelCost}
          getTotalInternalCost={getTotalInternalCost}
          getTotalSellingPrice={getTotalSellingPrice}
          getProfit={getProfit}
          getProfitPercentage={getProfitPercentage}
          pricing={pricing}
        />
      </div>
    </div>
  );
};

// Hotel Card Component
const HotelCard = ({ hotel, onUpdate, onDelete, calculateHotelCost, calculateNights }) => {
  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={hotel.hotelName}
          onChange={(e) => onUpdate(hotel.id, 'hotelName', e.target.value)}
          className="flex-1 bg-transparent text-white font-semibold focus:outline-none border-b border-slate-600 focus:border-purple-500"
          placeholder="Hotel Name"
        />
        <button
          onClick={() => onDelete(hotel.id)}
          className="text-red-400 hover:text-red-300 ml-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3 text-sm">
        <input
          type="text"
          placeholder="City"
          value={hotel.city}
          onChange={(e) => onUpdate(hotel.id, 'city', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          value={hotel.checkIn}
          onChange={(e) => onUpdate(hotel.id, 'checkIn', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          value={hotel.checkOut}
          onChange={(e) => onUpdate(hotel.id, 'checkOut', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder="Nights"
          value={calculateNights(hotel.checkIn, hotel.checkOut)}
          disabled
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white cursor-not-allowed opacity-70"
        />
      </div>

      <div className="grid grid-cols-5 gap-3 mb-3 text-sm">
        <select
          value={hotel.roomType}
          onChange={(e) => onUpdate(hotel.id, 'roomType', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>Deluxe</option>
          <option>Suite</option>
          <option>Standard</option>
          <option>Economy</option>
        </select>
        <select
          value={hotel.mealPlan}
          onChange={(e) => onUpdate(hotel.id, 'mealPlan', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>Breakfast</option>
          <option>Half Board</option>
          <option>Full Board</option>
          <option>No Meal</option>
        </select>
        <select
          value={hotel.sharingType}
          onChange={(e) => onUpdate(hotel.id, 'sharingType', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>Quad</option>
          <option>Triple</option>
          <option>Double</option>
          <option>Single</option>
        </select>
        <input
          type="number"
          placeholder="Rooms"
          value={hotel.numRooms}
          onChange={(e) => onUpdate(hotel.id, 'numRooms', parseInt(e.target.value))}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <select
          value={hotel.currency}
          onChange={(e) => onUpdate(hotel.id, 'currency', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>PKR</option>
          <option>SAR</option>
          <option>USD</option>
          <option>AED</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
        <div>
          <label className="text-xs text-slate-400">Cost/Room/Night ({hotel.currency})</label>
          <input
            type="number"
            value={hotel.costPerRoom}
            onChange={(e) => onUpdate(hotel.id, 'costPerRoom', parseFloat(e.target.value))}
            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Selling/Room/Night ({hotel.currency})</label>
          <input
            type="number"
            value={hotel.sellingPerRoom}
            onChange={(e) => onUpdate(hotel.id, 'sellingPerRoom', parseFloat(e.target.value))}
            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Total Cost (PKR)</label>
          <div className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white font-bold">
            {calculateHotelCost(hotel).toLocaleString('en-PK', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center text-sm">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={hotel.showToClient}
            onChange={(e) => onUpdate(hotel.id, 'showToClient', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Show to Client
        </label>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={hotel.showBreakup}
            onChange={(e) => onUpdate(hotel.id, 'showBreakup', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Show Breakup
        </label>
      </div>
    </div>
  );
};

// Ticket Card Component
const TicketCard = ({ ticket, onUpdate, onDelete }) => {
  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={ticket.airlineName}
          onChange={(e) => onUpdate(ticket.id, 'airlineName', e.target.value)}
          className="flex-1 bg-transparent text-white font-semibold focus:outline-none border-b border-slate-600 focus:border-blue-500"
          placeholder="Airline Name"
        />
        <button
          onClick={() => onDelete(ticket.id)}
          className="text-red-400 hover:text-red-300 ml-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3 text-sm">
        <input
          type="text"
          placeholder="Sector (KHI-JED-KHI)"
          value={ticket.sector}
          onChange={(e) => onUpdate(ticket.id, 'sector', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <select
          value={ticket.flightType}
          onChange={(e) => onUpdate(ticket.id, 'flightType', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>Direct</option>
          <option>Transit</option>
          <option>Via</option>
        </select>
        <input
          type="date"
          value={ticket.departureDate}
          onChange={(e) => onUpdate(ticket.id, 'departureDate', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          value={ticket.returnDate}
          onChange={(e) => onUpdate(ticket.id, 'returnDate', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-5 gap-3 mb-3 text-sm">
        <select
          value={ticket.ticketClass}
          onChange={(e) => onUpdate(ticket.id, 'ticketClass', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>Economy</option>
          <option>Premium Economy</option>
          <option>Business</option>
          <option>First</option>
        </select>
        <input
          type="text"
          placeholder="Baggage"
          value={ticket.baggage}
          onChange={(e) => onUpdate(ticket.id, 'baggage', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer justify-center bg-slate-600 border border-slate-500 rounded px-3 py-2">
          <input
            type="checkbox"
            checked={ticket.refundable}
            onChange={(e) => onUpdate(ticket.id, 'refundable', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">Refundable</span>
        </label>
        <select
          value={ticket.currency}
          onChange={(e) => onUpdate(ticket.id, 'currency', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>PKR</option>
          <option>SAR</option>
          <option>USD</option>
          <option>AED</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3 text-sm">
        <input
          type="number"
          placeholder={`Adult Fare (${ticket.currency})`}
          value={ticket.adultFare}
          onChange={(e) => onUpdate(ticket.id, 'adultFare', parseFloat(e.target.value) || 0)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder={`Child Fare (${ticket.currency})`}
          value={ticket.childFare}
          onChange={(e) => onUpdate(ticket.id, 'childFare', parseFloat(e.target.value) || 0)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder={`Infant Fare (${ticket.currency})`}
          value={ticket.infantFare}
          onChange={(e) => onUpdate(ticket.id, 'infantFare', parseFloat(e.target.value) || 0)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder={`Taxes (${ticket.currency})`}
          value={ticket.taxes}
          onChange={(e) => onUpdate(ticket.id, 'taxes', parseFloat(e.target.value) || 0)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3 items-center text-sm">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={ticket.showToClient}
            onChange={(e) => onUpdate(ticket.id, 'showToClient', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Show to Client
        </label>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={ticket.showBreakup}
            onChange={(e) => onUpdate(ticket.id, 'showBreakup', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Show Breakup
        </label>
      </div>
    </div>
  );
};

// Visa Card Component
const VisaCard = ({ visa, onUpdate, onDelete }) => {
  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={visa.visaType}
          onChange={(e) => onUpdate(visa.id, 'visaType', e.target.value)}
          className="flex-1 bg-transparent text-white font-semibold focus:outline-none border-b border-slate-600 focus:border-green-500"
          placeholder="Visa Type"
        />
        <button
          onClick={() => onDelete(visa.id)}
          className="text-red-400 hover:text-red-300 ml-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3 text-sm">
        <input
          type="text"
          placeholder="Duration"
          value={visa.duration}
          onChange={(e) => onUpdate(visa.id, 'duration', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Processing Time"
          value={visa.processingTime}
          onChange={(e) => onUpdate(visa.id, 'processingTime', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder="Cost"
          value={visa.cost}
          onChange={(e) => onUpdate(visa.id, 'cost', parseFloat(e.target.value) || 0)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <select
          value={visa.currency}
          onChange={(e) => onUpdate(visa.id, 'currency', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>PKR</option>
          <option>SAR</option>
          <option>USD</option>
          <option>AED</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-slate-300 cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={visa.showToClient}
          onChange={(e) => onUpdate(visa.id, 'showToClient', e.target.checked)}
          className="w-4 h-4 rounded"
        />
        Show to Client
      </label>
    </div>
  );
};

// Transport Card Component
const TransportCard = ({ transport, onUpdate, onDelete }) => {
  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={transport.transportType}
          onChange={(e) => onUpdate(transport.id, 'transportType', e.target.value)}
          className="flex-1 bg-transparent text-white font-semibold focus:outline-none border-b border-slate-600 focus:border-orange-500"
          placeholder="Transport Type"
        />
        <button
          onClick={() => onDelete(transport.id)}
          className="text-red-400 hover:text-red-300 ml-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3 text-sm">
        <select
          value={transport.vehicleType}
          onChange={(e) => onUpdate(transport.id, 'vehicleType', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>Coach</option>
          <option>Minibus</option>
          <option>Sedan</option>
          <option>SUV</option>
        </select>
        <input
          type="text"
          placeholder="Route"
          value={transport.route}
          onChange={(e) => onUpdate(transport.id, 'route', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Pickup"
          value={transport.pickupLocation}
          onChange={(e) => onUpdate(transport.id, 'pickupLocation', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Dropoff"
          value={transport.dropoffLocation}
          onChange={(e) => onUpdate(transport.id, 'dropoffLocation', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
        <input
          type="number"
          placeholder={`Cost/Person (${transport.currency})`}
          value={transport.costPerPerson}
          onChange={(e) => onUpdate(transport.id, 'costPerPerson', parseFloat(e.target.value) || 0)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <select
          value={transport.currency}
          onChange={(e) => onUpdate(transport.id, 'currency', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>PKR</option>
          <option>SAR</option>
          <option>USD</option>
          <option>AED</option>
        </select>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer justify-center bg-slate-600 border border-slate-500 rounded px-3 py-2">
          <input
            type="checkbox"
            checked={transport.showToClient}
            onChange={(e) => onUpdate(transport.id, 'showToClient', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span>Show to Client</span>
        </label>
      </div>
    </div>
  );
};

// Ziyarat Card Component
const ZiyaratCard = ({ ziyarat, onUpdate, onDelete }) => {
  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={ziyarat.ziyaratType}
          onChange={(e) => onUpdate(ziyarat.id, 'ziyaratType', e.target.value)}
          className="flex-1 bg-transparent text-white font-semibold focus:outline-none border-b border-slate-600 focus:border-red-500"
          placeholder="Ziyarat Type"
        />
        <button
          onClick={() => onDelete(ziyarat.id)}
          className="text-red-400 hover:text-red-300 ml-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
        <input
          type="text"
          placeholder="Included Places"
          value={ziyarat.includedPlaces}
          onChange={(e) => onUpdate(ziyarat.id, 'includedPlaces', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Timing"
          value={ziyarat.timing}
          onChange={(e) => onUpdate(ziyarat.id, 'timing', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder={`Cost/Person (${ziyarat.currency})`}
          value={ziyarat.costPerPerson}
          onChange={(e) => onUpdate(ziyarat.id, 'costPerPerson', parseFloat(e.target.value) || 0)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3 items-center text-sm">
        <select
          value={ziyarat.currency}
          onChange={(e) => onUpdate(ziyarat.id, 'currency', e.target.value)}
          className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>PKR</option>
          <option>SAR</option>
          <option>USD</option>
          <option>AED</option>
        </select>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={ziyarat.showToClient}
            onChange={(e) => onUpdate(ziyarat.id, 'showToClient', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Show to Client
        </label>
      </div>
    </div>
  );
};

export default TravelQuotationSystem;
