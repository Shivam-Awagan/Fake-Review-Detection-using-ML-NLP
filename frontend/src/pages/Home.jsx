import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home({ setHasStarted }) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setHasStarted(true);              // unlock phase-2 pages
    navigate("/single-analysis");       // simulate next step
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundImage: "url('/bg-login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      
      {/* HERO SECTION */}
      <Box
        sx={{
          minHeight: "70vh",
          background: "linear-gradient(135deg, rgba(53,57,65,0.85), rgba(42,82,152,0.85))",
          color: "white",
          display: "flex",
          alignItems: "center",
          px: { xs: 3, md: 8 },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          
          {/* LEFT SIDE CONTENT */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Fake Review Detection System
            </Typography>

            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              Detect misleading, spam, and fake reviews using Machine Learning
              and Natural Language Processing to build trust in online platforms.
            </Typography>

            <Typography variant="body1" sx={{ opacity: 0.85 }}>
              Click <b>Get Started</b> to begin analyzing reviews.
            </Typography>
          </Grid>

          {/* MARKED SECTION — ONLY BUTTON */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                px: 4,
              }}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </Grid>

        </Grid>
      </Box>

      {/* FEATURES SECTION */}
      <Box sx={{ px: { xs: 3, md: 8 }, py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight={600} mb={6} color="white">
          Key Features
        </Typography>

        <Grid container spacing={4}>
          <FeatureCard
            title="Single Review Analysis"
            description="Instantly detect whether a given review is fake or genuine using trained ML models."
          />
          <FeatureCard
            title="Live URL Review Analysis"
            description="Analyze multiple reviews extracted from a product URL in one click."
          />
          <FeatureCard
            title="Machine Learning Powered"
            description="Uses NLP techniques like tokenization, vectorization, and classification models."
          />
          <FeatureCard
            title="Real-World Ready"
            description="Designed for integration with e-commerce platforms and review moderation systems."
          />
        </Grid>
      </Box>

      {/* USE CASES */}
      <Box sx={{ py: 8, px: { xs: 3, md: 8 } }}>
        <Typography variant="h4" textAlign="center" fontWeight={600} mb={6} color="white">
          Real-World Applications
        </Typography>

        <Grid container spacing={4}>
          <UseCaseCard title="E-commerce Platforms" text="Amazon, Flipkart, Meesho" />
          <UseCaseCard title="Hotel & Travel Reviews" text="TripAdvisor, Booking.com" />
          <UseCaseCard title="Food Delivery Apps" text="Zomato, Swiggy" />
          <UseCaseCard title="Brand Reputation Analysis" text="Marketing & Analytics Teams" />
        </Grid>
      </Box>

    </Box>
  );
}

/* Reusable Components */

const FeatureCard = ({ title, description }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper
      elevation={4}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        background: "rgba(0,0,0,0.55)",
        color: "white",
        backdropFilter: "blur(17px)",
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.85 }}>
        {description}
      </Typography>
    </Paper>
  </Grid>
);

const UseCaseCard = ({ title, text }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper
      elevation={2}
      sx={{
        p: 3,
        textAlign: "center",
        borderRadius: 3,
        background: "rgba(0,0,0,0.55)",
        color: "white",
        backdropFilter: "blur(17px)",
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" mt={1} sx={{ opacity: 0.85 }}>
        {text}
      </Typography>
    </Paper>
  </Grid>
);

export default Home;
