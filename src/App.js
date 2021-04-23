import React from "react";
import { Grommet, Box } from "grommet";


import Car from "./features/Car/Car"
import Rattrapage from "./features/Rattrapage"

const theme = {
  global: {
    colors: {
      brand: '#5832A0',
      back: "#292929",
      card: "#bfdbf7",
      accent: "#994650",
      ok: '#00C781',
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

function App() {
  return (
    <Grommet theme={theme} full>
      <Box fill overflow="auto" align="center" justify="center" background="back" gap="medium">
        <Rattrapage />
        
      </Box>
    </Grommet>
  );
}

export default App;
