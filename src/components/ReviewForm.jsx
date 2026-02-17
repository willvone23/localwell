import { useState } from "react";

export default function ReviewForm({ spotId, spotName, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !text.trim()) return;
    onSubmit({ spotId, spotName, rating, text: text.trim() });
    setSubmitted(true);
    setTimeout(() => {
      setRating(0);
      setText("");
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="review-form-success">
        <span style={{ fontSize: 24 }}>&#x2705;</span>
        <p>Review posted! It will appear in the feed.</p>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`review-star ${star <= (hover || rating) ? "review-star--active" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            {"\u2605"}
          </button>
        ))}
        {rating > 0 && (
          <span className="review-form__rating-label">{rating}/5</span>
        )}
      </div>
      <textarea
        className="review-form__textarea"
        placeholder="Share your experience..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={500}
      />
      <div className="review-form__footer">
        <span className="review-form__charcount">
          {text.length}/500
        </span>
        <button
          type="submit"
          className={`btn-primary review-form__submit ${rating === 0 || !text.trim() ? "btn-primary--disabled" : ""}`}
          disabled={rating === 0 || !text.trim()}
        >
          Post Review
        </button>
      </div>
    </form>
  );
}
