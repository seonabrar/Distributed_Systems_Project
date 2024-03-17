import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

// Remove the import statement for CandidateCard.js

// Import the candidate image directly into Vote.js
import candidateImage from "./candidate.png";

export default function Vote({ role, contract, web3, currentAccount }) {
  // const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [vote, setVote] = useState(null);
  const [electionState, setElectionState] = useState(0);
  const [open, setOpen] = useState(false);

  const getCandidates = async () => {
    if (contract) {
      const count = await contract.methods.candidatesCount().call();
      const temp = [];
      for (let i = 0; i < count; i++) {
        const candidate = await contract.methods.getCandidateDetails(i).call();
        temp.push({ name: candidate[0], votes: candidate[1] });
      }
      setCandidates(temp);
      // setLoading(false);
    }
  };

  const voteCandidate = async (candidate) => {
    try {
      if (contract) {
        await contract.methods.vote(candidate).send({ from: currentAccount });
        getCandidates();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getElectionState = async () => {
    if (contract) {
      const state = await contract.methods.electionState().call();
      setElectionState(parseInt(state));
    }
  };

  useEffect(() => {
    getElectionState();
    getCandidates();
  }, [contract]);

  const handleVoteChange = (event) => {
    setVote(event.target.value);
  };

  const handleVote = (event) => {
    event.preventDefault();
    voteCandidate(vote);
  };

  return (
    <Box>
      <form onSubmit={handleVote}>
        <Grid container sx={{ mt: 0 }} spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <Typography align="center" variant="h6">
              {electionState === 0 &&
                "Please Wait... Election has not started yet."}
              {electionState === 1 && "VOTE FOR YOUR FAVOURITE CANDIDATE"}
              {electionState === 2 &&
                "Election has ended. See the results below."}
            </Typography>
            <Divider />
          </Grid>
          {electionState === 1 && (
            <>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    sx={{
                      overflowY: "hidden",
                      overflowX: "auto",
                      display: "flex",
                      width: "98vw",
                      justifyContent: "center",
                    }}
                    value={vote}
                    onChange={handleVoteChange}
                  >
                    {candidates.map((candidate, index) => (
                      <FormControlLabel
                        key={index}
                        labelPlacement="top"
                        control={<Radio />}
                        value={index}
                        label={
                          <Card sx={{ maxWidth: 345, minWidth: 300 }}>
                            <CardHeader
                              title={
                                <Typography
                                  align="center"
                                  variant="subtitle1"
                                >
                                  {candidate.name}
                                </Typography>
                              }
                            />
                            <CardContent sx={{ padding: 0 }}>
                              <CardMedia
                                component="img"
                                alt="Candidate"
                                height="220"
                                image={candidateImage} // Use the imported candidate image
                              />
                            </CardContent>
                            <CardActions
                              sx={{ justifyContent: "center" }}
                            ></CardActions>
                          </Card>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <div style={{ margin: 20 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ width: "100%" }}
                  >
                    Vote
                  </Button>
                </div>
              </Grid>
            </>
          )}

          {electionState === 2 && (
            <Grid
              item
              xs={12}
              sx={{
                overflowY: "hidden",
                overflowX: "auto",
                display: "flex",
                width: "98vw",
                justifyContent: "center",
              }}
            >
              {candidates &&
                candidates.map((candidate, index) => (
                  <Box sx={{ mx: 2 }} key={index}>
                    <Card sx={{ maxWidth: 345, minWidth: 300 }}>
                      <CardHeader
                        title={
                          <Typography align="center" variant="subtitle1">
                            {candidate.name}
                          </Typography>
                        }
                      />
                      <CardContent sx={{ padding: 0 }}>
                        <CardMedia
                          component="img"
                          alt="Candidate"
                          height="220"
                          image={candidateImage} // Use the imported candidate image
                        />
                      </CardContent>
                      <CardActions
                        sx={{ justifyContent: "center" }}
                      ></CardActions>
                    </Card>
                  </Box>
                ))}
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  );
}
