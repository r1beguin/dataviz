import React from 'react';

import { Box, Text, Meter, Stack, Chart, Tabs, Tab, Select} from "grommet";

import dataRaw from '../../data.json';


const RangeChart = ({ color, label, value, max }) => (
    <Box flex={false} width="20px" align="center">
        <Text  size="0.5em">{value}</Text>
      <Chart
        bounds={[[0, 2], [0, max]]}
        type="bar"
        values={[{ value: [1, value] }]}
        color={color}
        round
        size={{ height: 'small', width: 'xxsmall' }}
      />
      <Box  margin={{top: "xlarge"}} justify="start" align="center">
        <Text size="0.8em" truncate wordBreak="keep-all" style={{transform: `rotate(90deg)`}}>{label}</Text>
        
      </Box>
    </Box>
  );

const Car = () => {
    const [data, setData]= React.useState(dataRaw)
    const [index, setIndex] = React.useState(0);
    const [ranges, setRanges] = React.useState([]);
    const [accel, setAccel] = React.useState([]);
    const [efficiency, setEfficiency] = React.useState([]);
    const [charge, setCharge] = React.useState([]);
    const [speed, setSpeed] = React.useState([]);

    const compare = (a,b) => {
        let comparison = 0;
        if (a.value < b.value) {
          comparison = 1;
        } else if (a.value > b.value) {
          comparison = -1;
        }
        return comparison;
        
    }
    const compareAlphabet = (a,b) => {
        let comparison = 0;
        if (a.model > b.model) {
          comparison = 1;
        } else if (a.model < b.model) {
          comparison = -1;
        }
        return comparison;
        
    }
    
    const[options, setOptions] = React.useState([]);
    const[defaultOptions, setDefaultOptions] = React.useState([]);
    const [value, setValue] = React.useState('');

    React.useEffect(() =>{
        
        setData(data.sort(compareAlphabet));
        const newOptions = [];
        data.map((item,i) => newOptions.push(i+ " : " +item.model));
        setOptions(newOptions);
        setDefaultOptions(newOptions);

        const newArr = [];
        data.map(item => newArr.push({"model" : item.model, "value": parseInt(item.range.replace( /^\D+/g, ''))}))
        setRanges(newArr.sort(compare));

        const newArr2 = [];
        data.map(item => newArr2.push({"model" : item.model, "value": parseInt(item.topspeed.replace( /^\D+/g, ''))}))
        setSpeed(newArr2.sort(compare))

        const newArr3 = [];
        data.map(item => newArr3.push({"model" : item.model, "value": parseInt(item.acceleration.replace( /^\D+/g, ''))}))
        setAccel(newArr3.sort(compare))

        const newArr4 = [];
        data.map(item => newArr4.push({"model" : item.model, "value": parseInt(item.efficiency.replace( /^\D+/g, ''))}))
        setEfficiency(newArr4.sort(compare))
        
        const newArr5 = [];
        data.map(item => newArr5.push({"model" : item.model, "value":  parseInt(item.charge.replace( /^\D+/g, ''))}))
        setCharge(newArr5.sort(compare))

    }, [data])

  
    return(
        <Box align="center" margin="medium">
         <Box direction="row" gap="small" margi="small">
            <Box>
                <Text>Voitures électriques</Text>
                {/* <Box margin="small" gap="small" height="medium" overflow="auto">
                    {data.map((item,i) => (
                        <Text onClick={()=> setIndex(i)} color={index===i && 'red'}>{item.model}</Text>
                    ))}
                </Box> */}
                <Select
          size="medium"
          placeholder="Select"
          value={value}
          options={options}
          onChange={({ option }) => {
              setValue(option);
              console.log(parseInt(option.match(/^([\D]){1,3}/g)))
              setIndex(parseInt(option.match(/^([\d]){1,3}/g)))
            }}
          onClose={() => setOptions(defaultOptions)}
          onSearch={text => {
            // The line below escapes regular expression special characters:
            // [ \ ^ $ . | ? * + ( )
            const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

            // Create the regular expression with modified value which
            // handles escaping special characters. Without escaping special
            // characters, errors will appear in the console
            const exp = new RegExp(escapedText, 'i');
            setOptions(defaultOptions.filter(o => exp.test(o)));
          }}
        />
            </Box>
            <Box align="center">
                <Text>Stats</Text>
                    <Text>{data[index].model}</Text>
                <Box margin="small" gap="small"  direction="row" align="center">
                    <Box align="center" gap="small">
                        <Text>0 à 100km/h</Text>
                    <Stack anchor="center" >
                        <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (2/parseInt(data[index].acceleration.replace( /^\D+/g, '')))*100 }]} />
                        <Box align="center">
                            <Text >{data[index].acceleration}</Text>
                        </Box>
                    </Stack>
                    </Box>
                    <Box align="center" gap="small">
                        <Text>Vitesse max</Text>
                    <Stack anchor="center" >
                        <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (parseInt(data[index].topspeed.replace( /^\D+/g, ''))/410)*100 }]} />
                        <Box align="center">
                            <Text >{data[index].topspeed}</Text>
                        </Box>
                    </Stack>
                    </Box>
                    <Box align="center" gap="small">
                        <Text>Efficience</Text>
                    <Stack anchor="center" >
                        <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (100/parseInt(data[index].efficiency.replace( /^\D+/g, '')))*100 }]} />
                        <Box align="center">
                            <Text >{data[index].efficiency}</Text>
                        </Box>
                    </Stack>
                    </Box>
                    </Box>
                    <Box margin="small" gap="small"  direction="row" align="center">

                    <Box align="center" gap="small">
                        <Text>Autonomie</Text>
                    <Stack anchor="center" >
                        <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (parseInt(data[index].range.replace( /^\D+/g, ''))/1000)*100 }]} />
                        <Box align="center">
                            <Text >{data[index].range}</Text>
                        </Box>
                    </Stack>
                    </Box>
                    <Box align="center" gap="small">
                        <Text>Charge rapide</Text>
                    <Stack anchor="center" >
                        <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (parseInt(data[index].charge.replace( /^\D+/g, ''))/1000)*100 }]} />
                        <Box align="center">
                            <Text >{data[index].charge}</Text>
                        </Box>
                    </Stack>
                    </Box>
                </Box>
            </Box>
        </Box> 
        <Text margin="small">Classements</Text>
        <Tabs>
            <Tab title="Autonomies (km)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium" width="xlarge">
                    
                    {ranges.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={1000} color={ranges[i].model===data[index].model && 'red'}/>
                    )})}
                </Box>
            </Tab>
            <Tab title="Vitesse max (km/h)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium"  width="xlarge">
                    
                    {speed.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={410} color={speed[i].model===data[index].model && 'red'}  />
                    )})}
                </Box>
            </Tab>
            <Tab title="0 à 100 (sec)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium"  width="xlarge">
                    
                    {accel.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={25} color={accel[i].model===data[index].model && 'red'}  />
                    )})}
                </Box>
            </Tab>
            <Tab title="Efficience (Wh/km)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium"  width="xlarge">
                    
                    {efficiency.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={275} color={efficiency[i].model===data[index].model && 'red'}  />
                    )})}
                </Box>
            </Tab>
            <Tab title="Charge (km/h)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium"  width="xlarge">
                    
                    {charge.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={1420} color={charge[i].model===data[index].model && 'red'}  />
                    )})}
                </Box>
            </Tab>
        </Tabs>
        </Box>
    )
}

export default Car;