'use client';

import { useMemo, useState } from 'react';
import LeadTable from '@/components/LeadTable';

const websiteBuilderPrompt = `Build a modern, responsive business website for a local store or brand.

Requirements:
- Framework: Next.js
- Styling: clean premium layout
- Pages: Home, About, Products/Services, Contact
- Features: WhatsApp button, phone call CTA, contact form, Google Maps embed, testimonials, mobile responsive design, SEO metadata
- Tone: professional and sales-focused
- Deliverables: production-ready code, clear components, deployment-ready for Vercel

Business details to customize:
- Business name: [INSERT BUSINESS NAME]
- Business type: [INSERT TYPE]
- City/Country: [INSERT LOCATION]
- Phone number: [INSERT PHONE]
- WhatsApp number: [INSERT WHATSAPP]
- Address: [INSERT ADDRESS]
- Brand colors: [INSERT COLORS]
- Services/products: [INSERT SERVICES]
- About paragraph: [INSERT ABOUT TEXT]

Also generate:
- strong homepage headline
- persuasive CTA sections
- FAQ section
- contact section
- footer with contact details
- basic SEO titles and descriptions`;

export default function HomePage() {
  const [form, setForm] = useState({
    city: 'Cairo',
    country: 'Egypt',
    keyword: 'brand shops',
    maxResults: 20,
    filterNoWebsiteOnly: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queryInfo, setQueryInfo] = useState(null);
  const [items, setItems] = useState([]);

  const noWebsiteCount = useMemo(
    () => items.filter((item) => item.hasWebsite === 'No').length,
    [items]
  );

  const withPhoneCount = useMemo(
    () => items.filter((item) => item.phoneNumber).length,
    [items]
  );

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Search failed.');
      }

      setItems(data.items || []);
      setQueryInfo(data);
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: items })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Export failed.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'store-leads.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Export failed.');
    }
  }

  return (
    <main className="container">
      <section className="hero">
        <h1>Store Lead Finder</h1>
        <p>
          Search for stores, brands, and local businesses, check whether they have a website,
          collect phone numbers and address details, and export the results to Excel. This is
          useful for web development outreach and lead generation.
        </p>
      </section>

      <form onSubmit={handleSearch} className="card">
        <div className="grid">
          <div className="field">
            <label>City</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Cairo"
              required
            />
          </div>

          <div className="field">
            <label>Country</label>
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="Egypt"
              required
            />
          </div>

          <div className="field">
            <label>Business Keyword</label>
            <input
              value={form.keyword}
              onChange={(e) => setForm({ ...form, keyword: e.target.value })}
              placeholder="brand shops"
              required
            />
          </div>

          <div className="field">
            <label>Max Results</label>
            <input
              type="number"
              min="1"
              max="60"
              value={form.maxResults}
              onChange={(e) => setForm({ ...form, maxResults: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search Leads'}
          </button>

          <button
            className="secondary"
            type="button"
            onClick={() => setForm({ ...form, filterNoWebsiteOnly: !form.filterNoWebsiteOnly })}
          >
            Filter No Website Only: {form.filterNoWebsiteOnly ? 'ON' : 'OFF'}
          </button>

          <button
            className="secondary"
            type="button"
            onClick={handleExport}
            disabled={!items.length}
          >
            Export to Excel
          </button>
        </div>

        {error ? <p className="status-no">{error}</p> : null}
      </form>

      {queryInfo ? (
        <div className="summary">
          <div className="badge">Query: {queryInfo.query}</div>
          <div className="badge">Found: {queryInfo.totalFound}</div>
          <div className="badge">Returned: {queryInfo.totalReturned}</div>
          <div className="badge">No Website: {noWebsiteCount}</div>
          <div className="badge">With Phone: {withPhoneCount}</div>
        </div>
      ) : null}

      <LeadTable items={items} />

      <div className="codebox">{websiteBuilderPrompt}</div>

      <p className="footer-note">
        Use public business data responsibly. Respect local privacy rules, platform terms, and do
        not send spam. A good workflow is to focus on public listings, contact stores politely,
        and offer a clear website improvement proposal.
      </p>
    </main>
  );
}
