import { useEffect, useState } from 'react';
import Loading from '../components/loading';
import userService from '../appwrite/userService';
import './trustees.css';
import defaultUserProfile from '../images/sbcf-default-avatar.png'

function TrusteeCard({ Name, Position, Email, Mobile, Image }) {
  return (
    <div className="trustee-card">
      {(
        <img
          src={Image||defaultUserProfile}
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

  return loading ? (
  <Loading />
) : (
  <section className="trustees-page">
    <h2>Meet Our Trustees</h2>
    {trusteesData.length === 0 ? (
      <p>No trustees found</p>
    ) : (
      <div className="trustee-grid">
        {trusteesData
          .filter((trustee) => trustee.Rank === 2)
          .map((trustee) => (
            <TrusteeCard key={trustee.Email} {...trustee} />
          ))}
      </div>
    )}
  </section>
);

}

export default Trustees;
