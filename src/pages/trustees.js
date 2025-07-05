import React from 'react';
import './trustees.css';


function TrusteeCard({ name, role, email, phone, image }) {
  return (
    <div className="trustee-card">
      <img src={image} alt={name} className="trustee-photo" />
      <h3 className="trustee-name">{name}</h3>
      {role && <p className="trustee-role">{role}</p>}
      <div className="trustee-contact">
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
      </div>
    </div>
  );
}

// 🧩 Trustees Page
function Trustees() {
  const trusteesData = [
    {
      name: "Shri Ram Sharma",
      role: "Chairman",
      email: "ram.sharma@example.com",
      phone: "+91 98765 43210",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    {
      name: "Smt. Lata Devi",
      role: "Vice Chairperson",
      email: "lata.devi@example.com",
      phone: "+91 98765 12345",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Dr. Mohan Das",
      role: "Treasurer",
      email: "mohan.das@example.com",
      phone: "+91 98222 33445",
      image: "https://randomuser.me/api/portraits/men/48.jpg",
    },
  ];

  return (
    <section className="trustees-page">
      <h2>Meet Our Trustees</h2>
      <div className="trustee-grid">
        {trusteesData.map((trustee) => (
          <TrusteeCard key={trustee.email} {...trustee} />
        ))}
      </div>
    </section>
  );
}

export default Trustees;
