import React, { useState } from 'react';
import useInspirationalQuote from '../../appwrite/quotesService';

export default function Quotes() {
  const [refetchKey, setRefetchKey] = useState(0);
  const { quote, loading, errorMsg } = useInspirationalQuote({ refetch: refetchKey });

  const handleNewQuote = () => {
    setRefetchKey(prev => prev + 1);
  };

  return (
    <div className="quote-wrapper">
      <div className="quote-header">
        <h3>🌟 A Moment of Inspiration</h3>
        <button
          className="new-quote-btn"
          onClick={handleNewQuote}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'New Quote'}
        </button>
      </div>

      {loading && (
        <div className="quote-card loading">
          ⏳ Fetching your quote...
        </div>
      )}

      {errorMsg && (
        <div className="quote-card error">
          ❗ <strong>Error</strong>: {errorMsg}
        </div>
      )}

      {quote && (
        <div className="quote-card">
          <p className="quote-content">"{quote.q}"</p>
          <p className="quote-author">— {quote.a}</p>
        </div>
      )}
    </div>
  );
}
