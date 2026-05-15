import React from 'react';
import { Download, AlertCircle } from 'lucide-react';

const SummaryPanel = ({
  totalInternalCost,
  totalSellingPrice,
  profit,
  profitPercentage,
  perPersonCost,
  perPersonSelling,
  company,
  pricing,
  onPrint
}) => {
  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      {/* Internal Cost Card (For Agency Only) */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Internal Cost</p>
        <p className="text-4xl font-bold text-white mb-2">
          {totalInternalCost.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm text-slate-400">
          Per Person: {perPersonCost.toLocaleString('en-PK')} PKR
        </p>
        <div className="mt-3 p-3 bg-slate-700/50 rounded border border-slate-600">
          <p className="text-xs text-slate-400">With Markup: {pricing.markupPercentage}%</p>
          <p className="text-lg font-semibold text-blue-400">
            {(totalInternalCost * (1 + pricing.markupPercentage / 100)).toLocaleString('en-PK', {
              maximumFractionDigits: 0
            })} PKR
          </p>
        </div>
      </div>

      {/* Selling Price Card (What to Charge Client) */}
      <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur border border-green-700 rounded-2xl p-6">
        <p className="text-xs text-green-400 uppercase tracking-wider mb-2">Selling Price</p>
        <p className="text-4xl font-bold text-white mb-2">
          {totalSellingPrice.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm text-green-300">
          Per Person: {perPersonSelling.toLocaleString('en-PK')} PKR
        </p>
        {pricing.useCustomSelling && (
          <div className="mt-3 p-2 bg-green-700/30 rounded border border-green-600 text-xs text-green-300">
            Custom selling price applied
          </div>
        )}
        {pricing.discountPercentage > 0 && (
          <div className="mt-2 p-2 bg-amber-700/30 rounded border border-amber-600 text-xs text-amber-300">
            After {pricing.discountPercentage}% discount applied
          </div>
        )}
      </div>

      {/* Profit Card (Internal) */}
      <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur border border-blue-700 rounded-2xl p-6">
        <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">Your Profit</p>
        <p className="text-4xl font-bold text-white mb-2">
          {profit.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-3 bg-blue-700/30 rounded border border-blue-600">
            <p className="text-xs text-blue-400">Profit %</p>
            <p className="text-xl font-bold text-blue-300">{profitPercentage}%</p>
          </div>
          <div className="p-3 bg-blue-700/30 rounded border border-blue-600">
            <p className="text-xs text-blue-400">Per Person</p>
            <p className="text-lg font-bold text-blue-300">
              {((profit / (parseInt(pricing.customSellingAmount || totalSellingPrice))) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Warning if hiding costs from client */}
      {pricing.hideInternalCosts && (
        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-amber-300 font-semibold">Client View</p>
            <p className="text-xs text-amber-200">Internal costs hidden from quotation</p>
          </div>
        </div>
      )}

      {pricing.showProfitToClient && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-green-300 font-semibold">Profit Shown</p>
            <p className="text-xs text-green-200">Profit details visible to client</p>
          </div>
        </div>
      )}

      {/* Pricing Summary Box */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Pricing Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Cost:</span>
            <span className="font-semibold">
              {totalInternalCost.toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Markup:</span>
            <span className="font-semibold">{pricing.markupPercentage}%</span>
          </div>
          {pricing.discountPercentage > 0 && (
            <div className="flex justify-between text-amber-300">
              <span>Discount:</span>
              <span className="font-semibold">-{pricing.discountPercentage}%</span>
            </div>
          )}
          <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between text-green-300 font-bold">
            <span>Selling:</span>
            <span>{totalSellingPrice.toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR</span>
          </div>
          <div className="flex justify-between text-blue-300 font-bold">
            <span>Profit:</span>
            <span>
              {profit.toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR ({profitPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={onPrint}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
      >
        <Download className="w-6 h-6" />
        Generate Quotation
      </button>

      {/* Tips */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">💡 Pro Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Review costs before sending quotation</li>
          <li>Hide internal costs for professional quotations</li>
          <li>Update exchange rates daily</li>
          <li>Adjust markup per package type</li>
          <li>Print as PDF for email delivery</li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryPanel;
