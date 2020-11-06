import React from "react";

import dataRaw from '../../data.json';

import {Box, Text, Meter, Chart} from "grommet";

const RangeChart = ({ color, value, max }) => (
    <Box flex={false} width="20px" align="center">
        
      <Chart
        bounds={[[0, 2], [0, max]]}
        type="bar"
        values={[{ value: [1, value] }]}
        color={color}
        round
        size={{ height: 'small', width: 'xxsmall' }}
      />
      <Text  size="0.5em">{value}</Text>
     
    </Box>
  );

const CarTest = () => {
    const [index, setIndex] = React.useState(0);

    const [ranges, setRanges] =React.useState([]);

    const compare = (a,b) => {
        let comparison = 0;
        if (a.value < b.value) {
          comparison = 1;
        } else if (a.value > b.value) {
          comparison = -1;
        }
        return comparison;     
    }


    React.useEffect(() => {

        const newArr = [];
        dataRaw.map((item,i) => newArr.push({ "value" : parseInt(item.range.replace( /^\D+/g, '')), "model" : item.model}));
        setRanges(newArr.sort(compare));
        
    }, [])


    return(
        <Box align="center" gap="small">
            <Text>Voiture électriques</Text>

            <Box direction="row">

            
            <Box height="medium" width="medium" overflow="auto">
                {dataRaw.map((item, i )=> (
                    <Text onClick={() => setIndex(i) }>{item.model}</Text>
                ))}
            </Box>

            <Box>
                <Text>{dataRaw[index].range}</Text>
                <Meter size ="xsmall" type="circle" values={[{ value : (parseInt(dataRaw[index].range.replace( /^\D+/g, ''))/970)*100 }]} />
            </Box>

            </Box>

            <Box margin="small" fill="horizontal" height="medium" direction="row">
                {ranges.map((item, i) => (
                    <RangeChart value={item.value} max={970} color={dataRaw[index].model === ranges[i].model && 'red' } />
                ))}
            </Box>
        
        </Box>
    )
}

export default CarTest;