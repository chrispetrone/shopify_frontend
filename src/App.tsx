import React from 'react';
import './App.css';
import axios from "axios";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

interface AppProps { }
interface History {
  prompt: String,
  response: String
}
interface AppState { value: String, history: Array<History> }
class App extends React.Component<AppProps, AppState> {

  constructor(props: any) {
    super(props);

    this.state = { value: "Input Text Here", history: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  handleChange(event: any): any {
    this.setState({ value: event.target.value });
  }
  handleSubmit() {
    console.log("submit", this.state.value)
    const input = this.state.value || "";
    const data = {
      prompt: input,
      temperature: 0.7,
      max_tokens: 64
    };
    const key: String = `${process.env.REACT_APP_OPENAI_KEY}` || "NO KEY";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`

    }
    axios.post(
      "https://api.openai.com/v1/engines/text-curie-001/completions",
      data,
      { headers }
    ).then(resp => {
      console.log(resp)
      this.handleResponse(resp.data.choices[0].text)
    }).catch(error => {
      console.log("key: ", key)
      console.log(error.response)
    });

  }

  handleResponse(text: String) {
    console.log(text)
    this.state.history.unshift({
      prompt: this.state.value,
      response: text
    })
    this.forceUpdate();
  }


  submitText = (event: any) => {
    console.log(event);
  }
  render() {
    return (
      <Box>
        <Stack
          spacing={2}
          alignItems="center"
          direction="column">
          <div>
            <h1>
              AI Text Auto-Generation
            </h1>
          </div>
          <Grid container width={0.5}>
            <TextField
              id="outlined-textarea"
              placeholder="Enter Text Prompt"
              label="Enter Text Prompt"
              multiline
              onChange={this.handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  this.handleSubmit()
                }
              }}
              rows={4}
              sx={{ width: 1 }}
              margin="normal"
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              value="Submit"
              variant="contained"
              onClick={(event: any) => {
                this.handleSubmit()
              }}>
              Submit
            </Button>
          </Grid>
          <Grid item>
            <h4>Responses</h4>
          </Grid>
          {this.state.history.map((e, i) =>
            <Card sx={{ bgcolor: "lightgray", width: 0.5 }} key={i}>
              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <p><b>Prompt:</b></p>
                </Grid>
                <Grid item xs={10}>
                  <p>{this.state.history[i].prompt}</p>
                </Grid>
                <Grid item xs={2}>
                  <p><b>Response:</b></p>
                </Grid>
                <Grid item xs={10}>
                  <p>{this.state.history[i].response}</p>
                </Grid>
              </Grid>
            </Card>
          )}
        </Stack >
      </Box >
    );
  }
}

export default App;
