// Complete Mumbai Bidding App with Tailwind setup guidance and rupee input logic
// This file replaces src/App.jsx in your Vercel/GitHub project.
// Supports Tailwind CSS (setup instructions below) and rupee inputs (e.g., enter 20000000 for ₹2 Cr)

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MumbaiListingApp() {
  const [listings, setListings] = useState([
    { id: 1, title: '2 BHK in Bandra West', price: 21000000, currentBid: null, bids: [], address: 'Pali Hill, Bandra West', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
    { id: 2, title: '3 BHK in Andheri East', price: 16000000, currentBid: null, bids: [], address: 'Marol, Andheri East', img: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed' },
    { id: 3, title: '1 BHK in Lower Parel', price: 12000000, currentBid: null, bids: [], address: 'Lower Parel, Mumbai', img: 'https://images.unsplash.com/photo-1501183638710-841dd1904471' },
  ]);

  const [confirmation, setConfirmation] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const formatRupees = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleBid = (listing) => setConfirmation({ type: 'bid', listing });
  const handleBuyNow = (listing) => setConfirmation({ type: 'buy', listing });

  const confirmBid = () => {
    const amount = parseInt(bidAmount);
    if (isNaN(amount) || amount <= 0) return alert('Enter valid rupee amount');
    const updated = listings.map((l) => {
      if (l.id === confirmation.listing.id) {
        const newBid = { amount, user: 'You', time: new Date().toLocaleTimeString() };
        return { ...l, currentBid: amount, bids: [newBid, ...l.bids] };
      }
      return l;
    });
    setListings(updated);
    setBidAmount('');
    setConfirmation(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-10 drop-shadow-sm">
        🏙️ Mumbai Property Listings
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((l) => (
          <motion.div key={l.id} whileHover={{ scale: 1.02 }}>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
              <img src={l.img} alt={l.title} className="w-full h-52 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{l.title}</h2>
                <p className="text-purple-700 font-bold text-lg">{formatRupees(l.price)}</p>
                {l.currentBid && (
                  <p className="text-blue-700 font-semibold">
                    Current Bid: {formatRupees(l.currentBid)}
                  </p>
                )}
                <p className="text-gray-600 text-sm mt-1">{l.address}</p>
                <div className="flex gap-3 mt-4">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg" onClick={() => handleBuyNow(l)}>Buy Now</button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" onClick={() => handleBid(l)}>Place Bid</button>
                </div>

                {l.bids.length > 0 && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recent Bids:</p>
                    <ul className="space-y-1 text-sm text-gray-600 max-h-24 overflow-y-auto">
                      {l.bids.map((b, i) => (
                        <li key={i}>
                          {b.user}: {formatRupees(b.amount)} <span className="text-xs text-gray-400">({b.time})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {confirmation && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <motion.div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
            <h3 className="text-xl font-bold text-purple-700 mb-4">
              {confirmation.type === 'buy' ? 'Confirm Purchase' : 'Place a Bid'}
            </h3>

            {confirmation.type === 'bid' ? (
              <>
                <p className="mb-4 text-gray-700">
                  Enter your bid amount (in ₹) for {confirmation.listing.title}
                </p>
                <input
                  type="number"
                  placeholder="Enter amount in rupees"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full" onClick={confirmBid}>
                  Submit Bid
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  Buying {confirmation.listing.title} for {formatRupees(confirmation.listing.price)}
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full" onClick={() => setConfirmation(null)}>
                  Confirm Purchase
                </button>
              </>
            )}

            <button className="bg-gray-300 mt-4 px-4 py-2 rounded-lg w-full" onClick={() => setConfirmation(null)}>
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

