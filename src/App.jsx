/********************************************************************************
 * src/App.jsx
 * Mumbai - Listing & Bidding Prototype (PDF Preview)
 * NOTE: This is the main app file. To run:
 * 1) Create a Vite React project: `npm create vite@latest mumbai-prototype -- --template react`
 * 2) Replace src/App.jsx with this file, and src/main.jsx with the provided main.jsx (or keep Vite's)
 * 3) Put the sample PDFs in public/sample-docs/
 * 4) npm install && npm run dev
 *******************************************************************************/
import React, { useEffect, useState } from "react";

const MOCK_RERA_PROJECT = {
  id: "MUM-RERA-1234",
  name: "Seaside Residency",
  promoter: "Seaside Builders",
  reraLink: "https://maharera.mahaonline.gov.in/project/1234",
};

function formatCurrency(n) {
  return `₹${Number(n).toLocaleString()}`;
}

function Badge({ children, color = "bg-blue-500" }) {
  return (
    <span className={`inline-block text-white px-2 py-1 rounded-md text-xs ${color}`}>
      {children}
    </span>
  );
}

function PDFModal({ url, onClose, title }) {
  if (!url) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-11/12 h-5/6 rounded shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-medium">{title || 'PDF Preview'}</div>
          <div>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="h-full">
          <iframe title="pdf-preview" src={url} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

function MockDoc({ doc, onPreview }) {
  return (
    <div className="p-3 border rounded-md flex items-start gap-3">
      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
        PDF
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{doc.name}</div>
            <div className="text-xs text-gray-600">{doc.meta}</div>
          </div>
          <div className="flex items-center gap-2">
            {doc.certified ? <Badge color="bg-green-600">IGR Certified</Badge> : <Badge color="bg-gray-500">Uploaded</Badge>}
            {doc.file ? (
              <button className="text-sm text-blue-600 underline" onClick={() => onPreview(doc.file, doc.name)}>Preview</button>
            ) : <div className="text-xs text-gray-400">No file</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // seeded sample listings
  const SAMPLE_LISTINGS = [
    {
      id: "L-1001",
      title: "2BHK - Bandra West (Sea View)",
      address: "Tulsi Park, Bandra West, Mumbai",
      cts: "CTS-1023/3",
      sro: "SRO-Mumbai-I",
      buyNow: 25000000,
      bidEnabled: true,
      minBidIncrementPct: 1,
      docs: [
        { id: 1, name: "Sale Deed (2020)", meta: "SRO: SRO-Mumbai-I | Doc#: 1023/2020", certified: true, file: "/sample-docs/sample-sale-deed.pdf" },
        { id: 2, name: "Encumbrance Certificate (EC)", meta: "EC till 2025", certified: false, file: "/sample-docs/sample-ec.pdf" },
      ],
      city: "Mumbai",
      rera_project: MOCK_RERA_PROJECT,
      seller: { name: "Amit Sharma", reraBroker: true },
      bids: [],
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "L-1002",
      title: "3BHK - Andheri East",
      address: "Ram Mandir Rd, Andheri East, Mumbai",
      cts: "CTS-2120/5",
      sro: "SRO-Mumbai-II",
      buyNow: 38000000,
      bidEnabled: true,
      minBidIncrementPct: 1,
      docs: [
        { id: 3, name: "Sale Deed (2018)", meta: "SRO: SRO-Mumbai-II | Doc#: 2120/2018", certified: true, file: "/sample-docs/sample-sale-deed.pdf" },
        { id: 4, name: "Society NOC", meta: "Issued: 2021-04-12", certified: false, file: "/sample-docs/sample-soc-noc.pdf" },
      ],
      city: "Mumbai",
      rera_project: null,
      seller: { name: "Priya Kapur", reraBroker: false },
      bids: [],
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "L-1003",
      title: "Studio - Lower Parel",
      address: "Senapati Bapat Marg, Lower Parel, Mumbai",
      cts: "CTS-883/1",
      sro: "SRO-Mumbai-III",
      buyNow: 12500000,
      bidEnabled: false,
      minBidIncrementPct: 1,
      docs: [
        { id: 5, name: "Sale Deed (2015)", meta: "SRO: SRO-Mumbai-III | Doc#: 883/2015", certified: true, file: "/sample-docs/sample-sale-deed.pdf" },
      ],
      city: "Mumbai",
      rera_project: null,
      seller: { name: "Ramesh & Co.", reraBroker: true },
      bids: [],
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ];

  const [listings, setListings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("listings_v2")) || SAMPLE_LISTINGS;
    } catch (e) {
      return SAMPLE_LISTINGS;
    }
  });

  const [selectedListingId, setSelectedListingId] = useState(null);
  const [view, setView] = useState("browse"); // browse | create | detail | wallet
  const [wallet, setWallet] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mock_wallet_v2")) || { balance: 500000 }; // ₹5L seed
    } catch {
      return { balance: 500000 };
    }
  });

  const [pdfPreview, setPdfPreview] = useState({ url: null, title: null });

  useEffect(() => {
    localStorage.setItem("listings_v2", JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem("mock_wallet_v2", JSON.stringify(wallet));
  }, [wallet]);

  // Form states for create (kept simple)
  const [form, setForm] = useState({
    title: "",
    address: "",
    cts: "",
    sro: "",
    buyNow: 0,
    bidEnabled: true,
    minBidIncrementPct: 1,
    docs: [],
  });

  function createListing() {
    const newListing = {
      id: Date.now().toString(),
      ...form,
      city: "Mumbai",
      rera_project: null,
      seller: { name: "Demo Seller", reraBroker: false },
      bids: [],
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setListings((s) => [newListing, ...s]);
    setView("browse");
    alert("Listing created (mock). Add certified docs later.");
  }

  function placeBid(listingId, amount) {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;
    if (!listing.bidEnabled) return alert("Bidding not enabled for this listing");
    if (amount >= listing.buyNow) {
      alert("This bid meets or exceeds Buy-Now. Use Buy-Now flow to instantly buy.");
      return;
    }
    if (wallet.balance < amount * 0.02) {
      alert("Insufficient mock wallet balance for EMD (2% simulated). Top up or reduce bid.");
      return;
    }
    const emd = Math.round(amount * 0.02);
    setWallet((w) => ({ ...w, balance: w.balance - emd }));

    const bid = {
      id: Date.now().toString(),
      bidder: { name: "Buyer Demo", kycDone: true },
      amount,
      emd,
      time: new Date().toISOString(),
      status: "open",
    };
    setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, bids: [bid, ...l.bids] } : l)));
    alert("Bid placed (EMD simulated). Seller can accept the bid in demo mode.");
  }

  function buyNow(listingId) {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;
    if (wallet.balance < listing.buyNow * 0.02) {
      alert("Insufficient mock wallet balance for simulated EMD (2%). Top up to proceed.");
      return;
    }
    const emd = Math.round(listing.buyNow * 0.02);
    setWallet((w) => ({ ...w, balance: w.balance - emd }));
    const sale = {
      id: "sale-" + Date.now().toString(),
      price: listing.buyNow,
      buyer: { name: "Buyer Demo" },
      seller: listing.seller,
      commissionPercent: 0.5,
      platformCommission: +(listing.buyNow * 0.005).toFixed(0),
      time: new Date().toISOString(),
    };
    setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, status: "sold", sale } : l)));
    alert(`Buy-Now executed (simulated). Commission (0.5%): ${formatCurrency(sale.platformCommission)}`);
  }

  function acceptBid(listingId, bidId) {
    const listing = listings.find((l) => l.id === listingId);
    const bid = listing.bids.find((b) => b.id === bidId);
    if (!bid) return;
    const sale = {
      id: "sale-" + Date.now().toString(),
      price: bid.amount,
      buyer: bid.bidder,
      seller: listing.seller,
      commissionPercent: 0.5,
      platformCommission: +(bid.amount * 0.005).toFixed(0),
      time: new Date().toISOString(),
    };
    setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, status: "sold", sale } : l)));
    alert(`Seller accepted bid. (Simulated). Platform commission would be ${formatCurrency(sale.platformCommission)}.`);
  }

  function topUp(amount) {
    setWallet((w) => ({ ...w, balance: w.balance + amount }));
    alert(`Mock wallet topped up: ${formatCurrency(amount)}`);
  }

  function handlePreview(file, title) {
    // file is expected to be in public/sample-docs or a full URL
    setPdfPreview({ url: file, title });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PDFModal url={pdfPreview.url} title={pdfPreview.title} onClose={() => setPdfPreview({ url: null, title: null })} />

      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mumbai - Listing & Bidding Prototype (PDF Preview)</h1>
            <div className="text-sm text-gray-600">Demo flows: listing, title evidence (mocked), bids, buy-now, simulated wallet</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Mock Wallet Balance</div>
              <div className="font-medium">{formatCurrency(wallet.balance)}</div>
            </div>
            <div>
              <button className="px-3 py-2 bg-indigo-600 text-white rounded-md" onClick={() => topUp(100000)}>
                +TopUp ₹1L
              </button>
            </div>
            <div className="p-2 bg-white rounded shadow text-xs">
              <div>Mumbai (Pilot)</div>
              <div className="text-green-600 text-xs">RERA Broker: ACTIVE</div>
            </div>
          </div>
        </header>

        <nav className="flex gap-3 mb-6">
          <button className={`px-3 py-2 rounded ${view === "browse" ? "bg-white shadow" : "bg-gray-100"}`} onClick={() => setView("browse")}>Browse</button>
          <button className={`px-3 py-2 rounded ${view === "create" ? "bg-white shadow" : "bg-gray-100"}`} onClick={() => setView("create")}>Create Listing</button>
          <button className={`px-3 py-2 rounded ${view === "wallet" ? "bg-white shadow" : "bg-gray-100"}`} onClick={() => setView("wallet")}>Wallet</button>
        </nav>

        {view === "create" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Create Listing (mock)</h2>
            <div className="grid grid-cols-2 gap-4">
              <input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input className="border p-2 rounded" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <input className="border p-2 rounded" placeholder="CTS" value={form.cts} onChange={(e) => setForm({ ...form, cts: e.target.value })} />
              <input className="border p-2 rounded" placeholder="SRO" value={form.sro} onChange={(e) => setForm({ ...form, sro: e.target.value })} />
              <div className="col-span-2">
                <label className="block text-sm text-gray-600">BuyNow Price</label>
                <input type="number" className="border p-2 rounded w-full" value={form.buyNow} onChange={(e) => setForm({ ...form, buyNow: Number(e.target.value) })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600">Documents (you may paste public URL to PDF)</label>
                <div className="space-y-2">
                  {form.docs.map((d) => (
                    <MockDoc key={d.id} doc={d} onPreview={handlePreview} />
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setForm({ ...form, docs: [...form.docs, { id: Date.now(), name: 'New Doc ' + Date.now(), meta: 'Uploaded mock', certified: false, file: null }] })}>Add Mock Doc</button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={createListing}>Create Listing</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "wallet" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Mock Wallet</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500">Balance</div>
                <div className="text-2xl font-medium">{formatCurrency(wallet.balance)}</div>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => topUp(50000)}>+₹50k</button>
                  <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={() => topUp(100000)}>+₹1L</button>
                </div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500">Recent Activity (simulated)</div>
                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  <li>TopUp +₹1L</li>
                  <li>EMD deducted for bid - ₹10,000</li>
                  <li>BuyNow executed (simulated) - ₹25,00,000</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {view === "browse" && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-3">Active Listings</h2>
              <div className="space-y-4">
                {listings.length === 0 && <div className="p-4 bg-white rounded shadow text-gray-600">No listings yet. Create one with the "Create Listing" tab.</div>}
                {listings.map((l) => (
                  <div key={l.id} className="bg-white p-4 rounded shadow flex gap-4">
                    <div className="w-40 bg-gray-100 rounded p-3">Image</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-lg font-semibold">{l.title}</div>
                          <div className="text-sm text-gray-600">{l.address}</div>
                          <div className="mt-2 flex items-center gap-2">
                            {l.rera_project ? <Badge>RERA Project</Badge> : <Badge color="bg-gray-500">Resale</Badge>}
                            <Badge color="bg-yellow-600">{l.city}</Badge>
                            <div className="text-sm text-gray-700">Seller: {l.seller.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Buy-Now</div>
                          <div className="text-xl font-bold">{formatCurrency(l.buyNow)}</div>
                          <div className="mt-2 flex gap-2">
                            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => { setSelectedListingId(l.id); setView('detail'); }}>View</button>
                            {l.status === 'active' && <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => { setSelectedListingId(l.id); setView('detail'); }}>Bid / Buy</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold mb-2">Prototype Notes</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>Documents are actual sample PDFs in <code>/public/sample-docs/</code>.</li>
                <li>Money flows: simulated wallet only (no real payments).</li>
                <li>Platform commission is calculated at 0.5% for demo.</li>
                <li>Use "Create Listing" to add test listings (paste public URL for PDF files).</li>
              </ul>
            </aside>
          </div>
        )}

        {view === "detail" && selectedListingId && (() => {
          const l = listings.find((x) => x.id === selectedListingId);
          if (!l) return <div>Listing not found</div>;
          return (
            <div className="mt-6 bg-white p-6 rounded shadow">
              <div className="flex gap-6">
                <div className="w-2/3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">{l.title}</h2>
                      <div className="text-sm text-gray-600">{l.address} • {l.cts} • {l.sro}</div>
                      <div className="mt-3 flex items-center gap-2">
                        {l.rera_project ? (
                          <a className="flex items-center gap-2" href={l.rera_project.reraLink} target="_blank" rel="noreferrer">
                            <Badge color="bg-green-700">RERA</Badge>
                            <div className="text-sm text-gray-700">{l.rera_project.name}</div>
                          </a>
                        ) : <Badge color="bg-gray-500">Resale</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Buy-Now</div>
                      <div className="text-3xl font-bold">{formatCurrency(l.buyNow)}</div>
                      <div className="text-xs text-gray-600">Platform commission: 0.5%</div>
                    </div>
                  </div>

                  <section className="mt-6">
                    <h3 className="font-semibold mb-3">Title Evidence (sample PDFs)</h3>
                    <div className="space-y-3">
                      {l.docs.map((d) => <MockDoc key={d.id} doc={d} onPreview={handlePreview} />)}
                    </div>
                    <div className="mt-3 text-sm text-gray-600">Note: IGR-certified badge is simulated. Preview opens the sample PDF hosted in the project's public directory.</div>
                  </section>

                  <section className="mt-6">
                    <h3 className="font-semibold mb-3">Bids</h3>
                    {l.bids.length === 0 && <div className="text-sm text-gray-500">No bids yet.</div>}
                    <div className="space-y-2">
                      {l.bids.map((b) => (
                        <div key={b.id} className="p-3 border rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium">{formatCurrency(b.amount)}</div>
                            <div className="text-xs text-gray-600">EMD (mock): {formatCurrency(b.emd)} • {new Date(b.time).toLocaleString()}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => acceptBid(l.id, b.id)}>Accept (simulate)</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                </div>

                <aside className="w-1/3 space-y-4">
                  <div className="p-4 border rounded">
                    <div className="text-sm text-gray-600">Quick Actions</div>
                    <div className="mt-3 flex flex-col gap-2">
                      <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={() => {
                        const bidStr = prompt('Enter your bid amount (must be < BuyNow):');
                        if (!bidStr) return;
                        const amt = Number(bidStr);
                        if (isNaN(amt) || amt <= 0) return alert('Invalid amount');
                        placeBid(l.id, amt);
                      }}>Place Bid (simulated)</button>

                      <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => { if (confirm('Simulate Buy-Now? This will deduct mock EMD from wallet.')) buyNow(l.id); }}>Buy Now</button>

                      <div className="text-xs text-gray-500 mt-2">EMD simulated at 2% for demo purposes. No real funds move.</div>
                    </div>
                  </div>

                  <div className="p-4 border rounded">
                    <div className="text-sm text-gray-600">Sale Simulation</div>
                    {l.status === 'sold' ? (
                      <div className="text-sm">
                        <div>Sold price: {formatCurrency(l.sale.price)}</div>
                        <div>Buyer: {l.sale.buyer.name}</div>
                        <div>Platform commission (0.5%): {formatCurrency(l.sale.platformCommission)}</div>
                      </div>
                    ) : <div className="text-sm text-gray-500">Not sold</div>}
                  </div>

                  <div className="p-4 border rounded">
                    <div className="text-sm text-gray-600">Legal / Closing (prototype)</div>
                    <ul className="text-sm text-gray-700 space-y-1 mt-2">
                      <li>Seller must supply EC / Sale Deed / Tax Receipts.</li>
                      <li>Title search & certified copies are recommended prior to closing.</li>
                      <li>Final sale deed & registration handled offline in pilot.</li>
                    </ul>
                  </div>

                </aside>

              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => setView('browse')}>Back</button>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
