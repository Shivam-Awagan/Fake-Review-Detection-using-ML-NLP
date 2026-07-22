import ReviewCard from "../components/ReviewCard";

function ReviewHistory() {
  const dummyData = [
    { text: "Great product", result: "Genuine", confidence: 92 }
  ];

  return (
    <div className="container">
      <h2>Review History</h2>
      {dummyData.map((r, i) => (
        <ReviewCard key={i} review={r} />
      ))}
    </div>
  );
}

export default ReviewHistory;
