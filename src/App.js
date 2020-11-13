import React from "react";
import { Grommet, Box, Text } from "grommet";


import Car from "./features/Car/Car";


const theme = {
  global: {
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
      <Box  align="center" justify="center" background="dark-2" gap="medium">
        <Car />
        
      </Box>
    </Grommet>
  );
}

export default App;
