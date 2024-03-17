import React from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./StartPage.png";

const CoverLayoutRoot = styled("section")(({ theme }) => ({
  color: theme.palette.common.white,
  position: "relative",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    height: "92vh",
    minHeight: 400,
    maxHeight: 1600,
  },
}));

const Background = styled(Box)({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: -2,
  backgroundSize: "cover", // Add this line
});

const HighlightedText = styled(Typography)({
  backgroundColor: "#093945", // Background color #093945
  borderRadius: 4, // Optional: Add border radius for rounded corners
  p: 2, // Optional: Add padding for spacing
});

const CoverPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("home button clicked");
    navigate("/home");
    window.location.reload();
  };

  return (
    <CoverLayoutRoot>
      <Container
        sx={{
          mt: 3,
          mb: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <HowToVoteIcon style={{ fontSize: 64 }} />
        <HighlightedText
          color="inherit"
          align="center"
          variant="h2"
          marked="center"
        >
          Blockchain-Based Voting System
        </HighlightedText>
        <HighlightedText
          color="inherit"
          align="center"
          variant="body1"
          sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
        >
          Welcome to the future of voting! Our blockchain-based voting system ensures transparency, security, and integrity in every vote. Join us in shaping the future of democracy.
        </HighlightedText>
        <Button
          color="primary"
          variant="contained"
          size="large"
          sx={{ minWidth: 200 }}
          onClick={handleClick}
        >
          Get Started
        </Button>
        <Background sx={{ backgroundImage: `url(${backgroundImage})`, backgroundColor: "#7fc7d9", backgroundPosition: "center" }} />
      </Container>
    </CoverLayoutRoot>
  );
}

CoverPage.propTypes = {
  children: PropTypes.node,
};

export default CoverPage;
