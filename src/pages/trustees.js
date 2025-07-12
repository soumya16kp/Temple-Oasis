import { useEffect, useState } from 'react';
import './trustees.css';
import userService from '../appwrite/userService';

function TrusteeCard({ Name, Position, Email, Mobile, Image }) {
  return (
    <div className="trustee-card">
      {Image && (
        <img
          src={Image}
          alt={Name}
          className="trustee-photo"
        />
      )}
      <h3 className="trustee-name">{Name}</h3>
      {Position && <p className="trustee-role">{Position}</p>}
      <div className="trustee-contact">
        <p><strong>Email:</strong> {Email}</p>
        {Mobile && <p><strong>Phone:</strong> {Mobile}</p>}
      </div>
    </div>
  );
}

function Trustees() {
  const [trusteesData, setTrusteesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrustees() {
      try {
        const data = await userService.listUsers();
        const processed = (data.documents || []).map(doc => ({
          ...doc,
          Image: doc.Image ? userService.getFilePreview(doc.Image) : null
        }));

        setTrusteesData(processed);
      } catch (error) {
        console.error('Error fetching trustees:', error);
        setTrusteesData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrustees();
  }, []);

  return (
    <section className="trustees-page">
      <h2>Meet Our Trustees</h2>
      {loading ? (
        <p>Loading trustees...</p>
      ) : trusteesData.length === 0 ? (
        <p>No trustees found.</p>
      ) : (
        <div className="trustee-grid">
          {trusteesData.map((trustee) => (
            <TrusteeCard key={trustee.Email} {...trustee} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Trustees;
