import React from 'react';

const PrintTemplate = ({
  company,
  packageInfo,
  services,
  exchangeRates,
  getTotalPersons,
  calculateNights,
  convertToPKR,
  calculateHotelCost,
  getTotalInternalCost,
  getTotalSellingPrice,
  getProfit,
  getProfitPercentage,
  pricing
}) => {
  return (
    <div className="w-full bg-white text-black p-8" style={{ pageBreakAfter: 'always' }}>
      {/* Header */}
      <div className="mb-8 pb-4 border-b-4" style={{ borderColor: company.color }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {company.logo && (
              <img src={company.logo} alt={company.name} className="h-20 w-20 object-contain" />
            )}
            <div>
              <h1 className="text-3xl font-bold" style={{ color: company.color }}>
                {company.name}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                📞 {company.phone} | 📧 {company.email}
              </p>
              <p className="text-sm text-gray-600">
                🌐 {company.website} | 📍 {company.address}
              </p>
              <p className="text-sm text-gray-600">
                WhatsApp: {company.whatsapp}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: company.color }}>
              QUOTATION
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Date: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="mb-8 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 font-semibold">PACKAGE NAME</p>
          <p className="text-lg font-bold">{packageInfo.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-semibold">PACKAGE TYPE</p>
          <p className="text-lg font-bold">{packageInfo.type}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-semibold">TRAVEL PERIOD</p>
          <p className="text-sm">
            {new Date(packageInfo.startDate).toLocaleDateString()} to{' '}
            {new Date(packageInfo.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-semibold">DURATION</p>
          <p className="text-sm">{calculateNights(packageInfo.startDate, packageInfo.endDate)} Days & Nights</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-semibold">PASSENGERS</p>
          <p className="text-sm">
            Adults: {packageInfo.adults}, CWB: {packageInfo.cwb}, CNB: {packageInfo.cnb}, Infants: {packageInfo.infants}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-semibold">TOTAL PERSONS</p>
          <p className="text-lg font-bold" style={{ color: company.color }}>
            {getTotalPersons()}
          </p>
        </div>
      </div>

      {/* Services Details */}
      {(services.hotels.length > 0 || services.tickets.length > 0 || services.visas.length > 0 || 
        services.transport.length > 0 || services.ziyarat.length > 0) && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: company.color }}>
            SERVICE DETAILS
          </h2>

          {/* Hotels */}
          {services.hotels.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-700">Hotels</h3>
              {services.hotels.map((hotel) => (
                <div key={hotel.id} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{hotel.hotelName} - {hotel.city}</p>
                  <p className="text-gray-600">
                    {hotel.roomType} | {hotel.mealPlan} | {hotel.sharingType} |{' '}
                    {calculateNights(hotel.checkIn, hotel.checkOut)} nights | {hotel.numRooms} room(s)
                  </p>
                  <p className="text-gray-600">
                    Cost: {convertToPKR(hotel.costPerRoom, hotel.currency).toLocaleString('en-PK', {
                      maximumFractionDigits: 0
                    })} PKR/night | Total: {calculateHotelCost(hotel).toLocaleString('en-PK', {
                      maximumFractionDigits: 0
                    })} PKR
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tickets */}
          {services.tickets.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-700">Flights</h3>
              {services.tickets.map((ticket) => (
                <div key={ticket.id} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{ticket.airlineName} - {ticket.sector}</p>
                  <p className="text-gray-600">
                    {ticket.flightType} | {ticket.ticketClass} | Baggage: {ticket.baggage} |{' '}
                    {ticket.refundable ? 'Refundable' : 'Non-Refundable'}
                  </p>
                  <p className="text-gray-600">
                    Adult: {ticket.adultFare} {ticket.currency} | Child: {ticket.childFare}{' '}
                    {ticket.currency} | Infant: {ticket.infantFare} {ticket.currency}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Visas */}
          {services.visas.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-700">Visa Services</h3>
              {services.visas.map((visa) => (
                <div key={visa.id} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{visa.visaType}</p>
                  <p className="text-gray-600">
                    Duration: {visa.duration} | Processing: {visa.processingTime} | Cost: {visa.cost}{' '}
                    {visa.currency}/person
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Transport */}
          {services.transport.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-700">Transport Services</h3>
              {services.transport.map((trans) => (
                <div key={trans.id} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{trans.transportType}</p>
                  <p className="text-gray-600">
                    {trans.vehicleType} | {trans.route} | {trans.pickupLocation} →{' '}
                    {trans.dropoffLocation} | Cost: {trans.costPerPerson} {trans.currency}/person
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Ziyarat */}
          {services.ziyarat.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-700">Ziyarat Services</h3>
              {services.ziyarat.map((ziyarat) => (
                <div key={ziyarat.id} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{ziyarat.ziyaratType}</p>
                  <p className="text-gray-600">
                    {ziyarat.includedPlaces} | {ziyarat.timing} | Cost: {ziyarat.costPerPerson}{' '}
                    {ziyarat.currency}/person
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Section */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border-2" style={{ borderColor: company.color }}>
          <p className="text-xs text-gray-600 font-semibold mb-1">TOTAL PACKAGE COST</p>
          <p className="text-2xl font-bold" style={{ color: company.color }}>
            {getTotalInternalCost().toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR
          </p>
          <p className="text-xs text-gray-500 mt-1">Per Person: {(getTotalInternalCost() / getTotalPersons()).toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR</p>
        </div>

        <div className="p-4 rounded-lg border-2" style={{ borderColor: company.color }}>
          <p className="text-xs text-gray-600 font-semibold mb-1">SELLING PRICE</p>
          <p className="text-2xl font-bold" style={{ color: company.color }}>
            {getTotalSellingPrice().toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR
          </p>
          <p className="text-xs text-gray-500 mt-1">Per Person: {(getTotalSellingPrice() / getTotalPersons()).toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR</p>
        </div>

        {pricing.showProfitToClient && (
          <>
            <div className="p-4 rounded-lg bg-green-50 border-2 border-green-600">
              <p className="text-xs text-gray-600 font-semibold mb-1">PROFIT MARGIN</p>
              <p className="text-2xl font-bold text-green-600">
                {getProfit().toLocaleString('en-PK', { maximumFractionDigits: 0 })} PKR
              </p>
              <p className="text-xs text-gray-500 mt-1">{getProfitPercentage()}% Profit</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-600">
              <p className="text-xs text-gray-600 font-semibold mb-1">PROFIT PERCENTAGE</p>
              <p className="text-3xl font-bold text-blue-600">{getProfitPercentage()}%</p>
            </div>
          </>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2" style={{ color: company.color }}>
          TERMS & CONDITIONS
        </h3>
        <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
          <li>Quotation is valid for 7 days from the date of issuance.</li>
          <li>Prices are subject to change due to flight availability and exchange rate fluctuations.</li>
          <li>Passport must be valid for at least 6 months from the date of travel.</li>
          <li>All visas are subject to embassy approval.</li>
          <li>Cancellation charges apply as per terms of airlines and hotels.</li>
          <li>Travel insurance is recommended.</li>
          <li>50% advance payment required to confirm booking.</li>
          <li>Remaining balance due 30 days before departure.</li>
        </ul>
      </div>

      {/* Bank Details */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2" style={{ color: company.color }}>
          PAYMENT DETAILS
        </h3>
        <p className="text-sm text-gray-700 mb-1">{company.bankDetails}</p>
        <p className="text-sm text-gray-700">Tax ID: {company.taxId}</p>
      </div>

      {/* Footer */}
      <div className="border-t-4 pt-4 text-center" style={{ borderColor: company.color }}>
        <p className="text-sm font-semibold" style={{ color: company.color }}>
          {company.name}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          📞 {company.phone} | 📧 {company.email} | 📱 WhatsApp: {company.whatsapp}
        </p>
        <p className="text-xs text-gray-600">
          Instagram: {company.instagram} | Facebook: {company.facebook}
        </p>
        <p className="text-xs text-gray-500 mt-3 font-semibold">
          Thank you for choosing {company.name.split(' ')[0]}! 🙏
        </p>
        <p className="text-xs text-gray-400 mt-1">
          This quotation has been prepared specifically for your requirements. Please keep it confidential.
        </p>
      </div>
    </div>
  );
};

export default PrintTemplate;
