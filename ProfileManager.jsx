import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

const ProfileManager = ({ company, setCompany, handleLogoUpload }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 max-w-3xl">
      <h2 className="text-2xl font-bold text-white mb-8">Company Profile Settings</h2>

      {/* Logo Upload Section */}
      <div className="mb-8 pb-8 border-b border-slate-700">
        <label className="block text-slate-300 font-semibold mb-4">Company Logo</label>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
            ) : (
              <div className="text-center text-slate-400">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No Logo</p>
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all mb-3 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Logo
            </button>

            {company.logo && (
              <button
                onClick={() => setCompany({ ...company, logo: null })}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Remove Logo
              </button>
            )}

            <p className="text-xs text-slate-400 mt-3">
              Recommended: 200x200px PNG/JPG image for best results
            </p>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Company Name</label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">Brand Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={company.color}
                onChange={(e) => setCompany({ ...company, color: e.target.value })}
                className="w-20 h-12 rounded-lg cursor-pointer border border-slate-600"
              />
              <input
                type="text"
                value={company.color}
                onChange={(e) => setCompany({ ...company, color: e.target.value })}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Phone</label>
            <input
              type="tel"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="+92-300-1234567"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">WhatsApp</label>
            <input
              type="tel"
              value={company.whatsapp}
              onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="+92-300-1234567"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="info@company.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">Website</label>
            <input
              type="url"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="www.company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">Address</label>
          <input
            type="text"
            value={company.address}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="City, Country"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Instagram</label>
            <input
              type="text"
              value={company.instagram}
              onChange={(e) => setCompany({ ...company, instagram: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="@yourcompany"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">Facebook</label>
            <input
              type="text"
              value={company.facebook}
              onChange={(e) => setCompany({ ...company, facebook: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="yourcompany"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">Bank Details</label>
          <input
            type="text"
            value={company.bankDetails}
            onChange={(e) => setCompany({ ...company, bankDetails: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="Bank Name | Account Number"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">Tax ID / NTN</label>
          <input
            type="text"
            value={company.taxId}
            onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="Tax ID: 12345-6789"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-100">
        <p className="text-sm">💡 All details will appear in your quotations. Make sure all information is accurate before sending to clients.</p>
      </div>
    </div>
  );
};

export default ProfileManager;
