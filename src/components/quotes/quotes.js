import { useState, useEffect } from 'react';
import './quotes.css';  // We'll define this next

export default function Quotes() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://zenquotes.io/api/random');
      if (!res.ok) throw new Error('Failed to fetch quote');
      const data = await res.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (err) {
      setError('Could not fetch a new quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="quotes-card">
      <h2 className="quotes-title">Inspirational Quote</h2>

      {loading && <p className="quotes-loading">Loading...</p>}
      {error && <p className="quotes-error">{error}</p>}

      {!loading && !error && quote && (
        <blockquote className="quotes-text">
          “{quote}”
          <footer className="quotes-author">— {author}</footer>
        </blockquote>
      )}

      <button className="quotes-button" onClick={fetchQuote} disabled={loading}>
        {loading ? 'Fetching...' : 'New Quote'}
      </button>
    </div>
  );
}
