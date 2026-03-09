import React from 'react';

const RentingVsBuying = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-20">
      <h1 className="text-3xl font-semibold text-center mb-8">Renting vs. Buying a Home</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Renting</h2>
          <img
            src="https://plus.unsplash.com/premium_photo-1661658492194-9f5478a44bb8?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Renting"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <ul className="list-disc pl-5">
            <li>No long-term commitment</li>
            <li>Lower upfront costs (security deposit instead of down payment)</li>
            <li>Flexibility to move easily</li>
            <li>Maintenance is often handled by the landlord</li>
            <li>No equity built over time</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Buying</h2>
          <img
            src="https://plus.unsplash.com/premium_photo-1661432432946-64cdda213bd1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Buying"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <ul className="list-disc pl-5">
            <li>Long-term investment, building equity over time</li>
            <li>Higher upfront costs (down payment, closing costs)</li>
            <li>Maintenance and repairs are your responsibility</li>
            <li>Stability in housing costs (fixed-rate mortgage)</li>
            <li>Potential for property value appreciation</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg">Consider your financial situation, lifestyle, and long-term goals when deciding whether to rent or buy.</p>
      </div>
    </div>
  );
};

export default RentingVsBuying;
