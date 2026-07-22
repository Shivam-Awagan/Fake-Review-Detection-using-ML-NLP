function ReviewCard({ review }) {
  return (
    <div style={styles.card}>
      <p><b>Review:</b> {review.text}</p>
      <p><b>Result:</b> {review.result}</p>
      <p><b>Confidence:</b> {review.confidence}%</p>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px"
  }
};

export default ReviewCard;
