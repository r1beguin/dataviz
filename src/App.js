import React from "react";
import { Grommet, Box, Text } from "grommet";

import MapBox from "./features/Map/MapBox";

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
      <Box fill align="center" justify="center">
        <Text>DataViz</Text>
        <MapBox />
      </Box>
    </Grommet>
  );
}

export default App;
