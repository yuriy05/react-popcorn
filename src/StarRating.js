import { useState } from 'react';

const starRatingContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const starRatingFont = {
  fontSize: '16px',
  fontFamily: 'sans-serif',
  lineHeight: 1,
};

function StarRating({ maxLength = 5 }) {
  const [rating, setRating] = useState(1);
  const [tempRating, setTempRating] = useState(0);

  const handleClick = (index) => setRating(index + 1);
  const handleMouseEnter = (index) => setTempRating(index + 1);
  const handleMouseLeave = () => setTempRating(null);

  return (
    <div style={starRatingContainer}>
      {Array.from({ length: maxLength }, (_, i) => (
        <Star
          filled={i < (tempRating || rating)}
          key={i}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
        />
      ))}
      <p style={starRatingFont}>{rating}</p>
    </div>
  );
}

function Star({ filled, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <svg
      className="star"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="#000"
      height={24}
      width={24}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      fill={filled ? 'yellow' : 'none'}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="{2}"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

export default StarRating;
