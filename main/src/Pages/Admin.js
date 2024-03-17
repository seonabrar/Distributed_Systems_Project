import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";


import candidateImage from "./candidate.png";

const WinnerTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontSize: "1.2rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
}));

export default function Admin({ role, contract, web3, currentAccount }) {
  const [electionState, setElectionState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState(null);


  const getCandidates = async () => {
    if (contract) {
      console.log(contract);
      const count = await contract.methods.candidatesCount().call();
      const temp = [];
      for (let i = 0; i < count; i++) {
        const candidate = await contract.methods.getCandidateDetails(i).call();
        temp.push({ name: candidate[0], votes: candidate[1] });
      }
      setCandidates(temp);
      setLoading(false);
      console.log(temp);
    }
  };

  const getElectionState = async () => {
    if (contract) {
      const state = await contract.methods.electionState().call();
      setElectionState(parseInt(state));
    }
  };

  const getWinner = async () => {
    if (contract) {
      const winnerId = await contract.methods.getWinner().call();
      const winnerDetails = await contract.methods.getCandidateDetails(winnerId).call();
      setWinner(winnerDetails[0]); // Set winner to the candidate name
    }
  };

  useEffect(() => {
    getElectionState();
    getCandidates();
    getWinner();
  }, [contract]);

  const handleEnd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = async () => {
    if (electionState === 0) {
      try {
        if (contract) {
          await contract.methods.startElection().send({ from: currentAccount });
          getElectionState();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (electionState === 1) {
      try {
        if (contract) {
          await contract.methods.endElection().send({ from: currentAccount });
          getElectionState();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setOpen(false);
  };

  const handleCandidateForm = async (event) => {
    event.preventDefault();
    try {
      await contract.methods.addCandidate(candidateName).send({ from: currentAccount });
      console.log("candidate added");
      getCandidates(); // Refresh candidates after adding a new one
    } catch (error) {
      console.log(error);
    }
    setCandidateName("");
  };

  const handleVoterForm = async (event) => {
    event.preventDefault();
    try {
      await contract.methods.addVoter(voterAddress).send({ from: currentAccount });
      console.log("voter added");
    } catch (error) {
      console.log(error);
    }
    setVoterAddress("");
  };

  const handleNameChange = (event) => {
    setCandidateName(event.target.value);
  };

  const handleAddressChange = (event) => {
    setVoterAddress(event.target.value);
  };

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          Loading...
        </Box>
      ) : (
        <Box>
          <Grid container sx={{ mt: 0 }} spacing={4}>
            <Grid item xs={12}>
              <Typography align="center" variant="h6" color="textSecondary">
                ELECTION STATUS :{" "}
                {electionState === 0 && "Not Started"}
                {electionState === 1 && "In Progress"}
                {electionState === 2 && "Ended"}
              </Typography>
              <Divider />
            </Grid>
            {electionState !== 2 && (
              <Grid item xs={12} sx={{ display: "flex" }}>
                <Button
                  variant="contained"
                  sx={{ width: "40%", margin: "auto" }}
                  onClick={handleEnd}
                >
                  {electionState === 0 && "Start Election"}
                  {electionState === 1 && "End Election"}
                </Button>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography align="center" variant="h6">
                {electionState === 0 && "ADD VOTERS / CANDIDATES"}
                {electionState === 1 && "SEE LIVE RESULTS"}
                {electionState === 2 && "FINAL ELECTION RESULT"}
              </Typography>
              <Divider />
            </Grid>

            

            {electionState === 0 && (
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="form"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "2rem",
                      width: "40%",
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleVoterForm}
                  >
                    <Stack spacing={2}>
                      <TextField
                        id="outlined-basic"
                        label="Voters Address"
                        variant="outlined"
                        value={voterAddress}
                        onChange={handleAddressChange}
                      />
                      <Button variant="contained" type="submit">
                        Add Voter
                      </Button>
                    </Stack>
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "2rem",
                      width: "40%",
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleCandidateForm}
                  >
                    <Stack spacing={2}>
                      <TextField
                        id="outlined-basic"
                        label="Candiate Name"
                        variant="outlined"
                        value={candidateName}
                        onChange={handleNameChange}
                      />
                      <Button variant="contained" type="submit">
                        Add Candiates
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </Grid>

            )}
            {electionState === 2 && (
              <Grid item xs={12}>
                <WinnerTypography align="center" variant="h6">
                {winner !== null ? (
                <>
                <span role="img" aria-label="trophy">🏆</span> Winner: {winner}
                </>
                ) : (
                  "Not determined"
                  )}
                  </WinnerTypography>
              </Grid>
            )
            }

            {electionState > 0 && (
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
                        <CardActions sx={{ justifyContent: "center" }}>
                          {candidate.votes && (
                            <Typography align="center" variant="">
                              <strong>{candidate.votes}</strong> votes
                            </Typography>
                          )}
                        </CardActions>
                      </Card>
                    </Box>
                  ))}
              </Grid>
            )
            
            }
          </Grid>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {electionState === 0 && "Do you want to start the election?"}
                {electionState === 1 && "Do you want to end the election?"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAgree} color="primary" autoFocus>
            Agree
          </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}
