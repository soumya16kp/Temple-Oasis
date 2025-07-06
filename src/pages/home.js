import { FiInfo, FiUsers, FiImage, FiHeart } from "react-icons/fi";
import "./home.css";
import herobackground from '../images/Flux_Dev_a_stunning_illustration_of_A_peaceful_temple_at_sunri_1.jpg';
function HomePage() {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${herobackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1>
          Welcome to <span className="highlight">Divine Oasis</span>
        </h1>
        <p>
          A sanctuary of peace, spirituality, and community. Discover tranquility and connect with timeless traditions.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn">Learn More →</button>
          <button className="secondary-btn">Support Us</button>
        </div>
      </section>

      {/* Inspirational Message */}
      <section className="quote-section">
        <div className="quote-header">
          <h3>🌟 A Moment of Inspiration</h3>
          <button className="new-quote-btn">New Quote</button>
        </div>
        <div className="quote-card error">
          ❗<strong> Error</strong>: Could not fetch an inspirational message at this time. Please try again later.
        </div>
      </section>

      {/* Explore Section */}
      <section className="explore-section"
      >
        <h2>Explore Divine Oasis</h2>
        <div className="explore-grid">
          <div className="explore-card">
            <FiInfo className="icon" />
            <h4>About Us</h4>
            <p>Discover our history and mission.</p>
            <a href="/about">Explore →</a>
          </div>
          <div className="explore-card">
            <FiUsers className="icon" />
            <h4>Our Trustees</h4>
            <p>Meet the dedicated individuals guiding our temple.</p>
            <a href="/trustees">Explore →</a>
          </div>
          <div className="explore-card">
            <FiImage className="icon" />
            <h4>Gallery</h4>
            <p>Browse through our sacred events and moments.</p>
            <a href="/gallery">Explore →</a>
          </div>
          <div className="explore-card">
            <FiHeart className="icon" />
            <h4>Contribute</h4>
            <p>Support us through donations or volunteering.</p>
            <a href="/contribution">Explore →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
