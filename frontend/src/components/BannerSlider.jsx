import React, { useState, useEffect } from 'react';

const BannerSlider = () => {
  const banners = [
    '/images/banner1.jpg',
    '/images/banner2.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Next
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  // Prev
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  return (
    <div style={styles.sliderContainer}>

      {/* Slider images */}
      <div
        style={{
          ...styles.imageWrapper,
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {banners.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Banner ${index + 1}`}
            style={styles.image}
          />
        ))}
      </div>

      {/* Button left */}
      <button
        onClick={prevSlide}
        style={{ ...styles.navButton, left: '20px' }}
      >
        &#10094;
      </button>

      {/* Button right */}
      <button
        onClick={nextSlide}
        style={{ ...styles.navButton, right: '20px' }}
      >
        &#10095;
      </button>

      {/* Dots */}
      <div style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              ...styles.dot,
              backgroundColor:
                currentIndex === index
                  ? '#d4a373'
                  : 'rgba(255,255,255,0.7)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  sliderContainer: {
    position: 'relative',
    width: '100%',
    height: '500px',
    overflow: 'hidden',
    background: '#fff',
  },

  imageWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    transition: 'transform 0.7s ease',
  },

  image: {
    width: '100%',
    minWidth: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',

    // XÓA TOÀN BỘ HIỆU ỨNG TỐI
    filter: 'none',
    opacity: 1,
  },

  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',

    // KHÔNG CÒN NỀN ĐEN
    background: 'rgba(255,255,255,0.15)',

    color: '#fff',
    border: '1px solid rgba(255,255,255,0.8)',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    cursor: 'pointer',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    fontSize: '22px',
    zIndex: 10,
    backdropFilter: 'blur(4px)',
  },

  dotsContainer: {
    position: 'absolute',
    bottom: '18px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    zIndex: 10,
  },

  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: '0.3s',
  },
};

export default BannerSlider;