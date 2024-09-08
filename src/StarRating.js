import { useState } from 'react';
import PropTypes from 'prop-types';

const starRatingContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

StarRating.propTypes = {
  maxRating: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
  class: PropTypes.string,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
};

function StarRating({
  maxRating = 5,
  size = 24,
  color = '#fcc419',
  className = '',
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const handleMouseEnter = (index) => setTempRating(index + 1);
  const handleMouseLeave = () => setTempRating(null);

  const handleRating = (rating) => {
    setRating(rating);
    onSetRating(rating);
  };

  const starRatingFont = {
    fontSize: '16px',
    fontFamily: 'sans-serif',
    lineHeight: '1',
    color,
    margin: '0',
  };

  return (
    <div style={starRatingContainer} className={className}>
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          filled={i < (tempRating || rating)}
          key={i}
          onClick={() => handleRating(i + 1)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
          color={color}
          size={size}
        />
      ))}
      <p style={starRatingFont}>{rating}</p>
    </div>
  );
}

function Star({
  filled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  color,
  size,
}) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'block',
    cursor: 'pointer',
  };

  return (
    <span
      role="button"
      style={starStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {filled ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke={color}
          fill={filled ? color : 'none'}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke={color}
          fill="none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

export default StarRating;
