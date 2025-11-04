
import React, { useEffect, useRef } from 'react';
import './Background.css';

const TempleBackground = ({ children, particleCount = 30 }) => {
  const particlesRef = useRef(null);
  const sunRef = useRef(null);

  useEffect(() => {
    // Create floating particles
    const particlesContainer = particlesRef.current;
    
    if (particlesContainer) {
      // Clear existing particles
      particlesContainer.innerHTML = '';
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 20;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.setProperty('--random-x', Math.random() * 2 - 1);
        
        particlesContainer.appendChild(particle);
      }
    }

    // Add mouse move effect
    const handleMouseMove = (e) => {
      if (sunRef.current) {
        const x = (e.clientX / window.innerWidth) * 20 - 10;
        const y = (e.clientY / window.innerHeight) * 20 - 10;
        
        sunRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      }
    };

    // Add resize handler for responsiveness
    const handleResize = () => {
      // You can add any resize-specific logic here
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount]);

  return (
    <div className="temple-background">
      <div className="background-container">
        <div className="sky">
          <div className="sun" ref={sunRef}></div>
          <div className="particles" ref={particlesRef}></div>
        </div>
        <div className="mountains">
          <div className="mountain mountain-1"></div>
          <div className="mountain mountain-2"></div>
          <div className="mountain mountain-3"></div>
          <div className="temple"></div>
        </div>
        <div className="ground"></div>
      </div>
      
      <div className="content">
        {children || (
          <>
            <h1>Sacred Temple</h1>
            <p>Welcome to a place of peace, reflection, and spiritual growth. Our temple is dedicated to fostering inner harmony and connection with the divine.</p>
            <p>May your visit bring you clarity, peace, and renewed purpose.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TempleBackground;