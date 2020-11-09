import React from 'react';

import { Box, Text, Meter, Stack, Chart, Tabs, Tab, Select,Drop, ResponsiveContext} from "grommet";
import dataRaw from '../../data.json';



const RangeChart = ({ color, label, value, max }) => {
    const [over, setOver] = React.useState(false);
  const ref = React.useRef();
    
    return(
    <Box flex={false} width="10px" align="center" ref={ref}
    onMouseOver={() => setOver(true)}
    onMouseLeave={() => setOver(false)}
    onFocus={() => setOver(true)}
    onBlur={() => setOver(false)}>
 
      <Chart
        bounds={[[0, 2], [0, max]]}
        type="bar"
        values={[{ value: [1, value] }]}
        color={color}
        
        size={{ height: 'medium', width: 'xxsmall' }}
      />
        {ref.current && over && (
      <Drop
          plain
          align={{ left: 'right' }}
          target={ref.current}
          margin={{ horizontal: 'small' }}
          // trapFocus set to false allows tabbing through the buttons
          trapFocus={false}
        >
          <Box pad="small" background="brand">
            <Text color="white">{label}</Text>
            <Text >{value}</Text>
          </Box>
        </Drop>
        )}
   
    </Box>
  )};

const Car = () => {
    const [data, setData]= React.useState(dataRaw)
    const [index, setIndex] = React.useState(0);
    const [ranges, setRanges] = React.useState([]);
    const [accel, setAccel] = React.useState([]);
    const [efficiency, setEfficiency] = React.useState([]);
    const [charge, setCharge] = React.useState([]);
    const [speed, setSpeed] = React.useState([]);

    const size = React.useContext(ResponsiveContext);


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
        <Box align="center" margin="medium" >
         <Box direction={size !== "small" ? 'row' : 'column'} gap="small" margin="small" height="medium">
            <Box  justify="center" align="center">
                <Text size={size}>EVs</Text>
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
            <Box align="center" justify="center" gap="medium" margin="small">
               <Box align="center" justify="center" margin="small">
                    <Text size={size}>Stats</Text>
                    <Text size={size}>{data[index].model}</Text>
               </Box>
                <Box fill  direction="row" align="center">
                    <Box align="center" gap="small" justify="center">
                        <Text size={size}>0 to 100km/h</Text>
                        <Stack anchor="center" >
                            <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (2/parseInt(data[index].acceleration.replace( /^\D+/g, '')))*100 }]} />
                            <Box align="center" justify="center">
                                <Text size="small">{data[index].acceleration}</Text>
                            </Box>
                        </Stack>
                    </Box>
                    <Box align="center" gap="small">
                        <Text size={size}>Topspeed</Text>
                        <Stack anchor="center" >
                            <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (parseInt(data[index].topspeed.replace( /^\D+/g, ''))/410)*100 }]} />
                            <Box align="center">
                                <Text size="small">{data[index].topspeed}</Text>
                            </Box>
                        </Stack>
                    </Box>
                    <Box align="center" gap="small">
                        <Text size={size}>Efficiency</Text>
                        <Stack anchor="center" >
                            <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (100/parseInt(data[index].efficiency.replace( /^\D+/g, '')))*100 }]} />
                            <Box align="center">
                                <Text size="small">{data[index].efficiency}</Text>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
                <Box gap="medium"   direction="row" align="center" >

                    <Box align="center" gap="small" >
                        <Text size={size}>Range</Text>
                        <Stack anchor="center" >
                            <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (parseInt(data[index].range.replace( /^\D+/g, ''))/1000)*100 }]} />
                            <Box align="center">
                                <Text size="small">{data[index].range}</Text>
                            </Box>
                        </Stack>
                    </Box>
                    <Box align="center" gap="small">
                        <Text size={size}>FastCharge</Text>
                        <Stack anchor="center" >
                            <Meter size= "xsmall" thickness="small" type="circle" values={[{"value": (parseInt(data[index].charge.replace( /^\D+/g, ''))/1000)*100 }]} />
                            <Box align="center">
                                <Text size="small">{data[index].charge}</Text>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Box> 
        <Text margin="small">Ranking</Text>
        <Box fill="horizontal" pad="small" align="center" justify="center">
        <Tabs margin="small" >
            <Tab title="Range (km)">
                <Box margin="small" direction="row" gap="0px" overflow="auto"  width="xlarge">
                    
                    {ranges.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={1000} color={ranges[i].model===data[index].model && 'red'}/>
                    )})}
                </Box>
            </Tab>
            <Tab title="Topspeed (km/h)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium"  width="xlarge">
                    
                    {speed.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={410} color={speed[i].model===data[index].model && 'red'}  />
                    )})}
                </Box>
            </Tab>
            <Tab title="0 to 100 (sec)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium"  width="xlarge">
                    
                    {accel.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={25} color={accel[i].model===data[index].model && 'red'}  />
                    )})}
                </Box>
            </Tab>
            <Tab title="Efficiency (Wh/km)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium"  width="xlarge">
                    
                    {efficiency.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={275} color={efficiency[i].model===data[index].model && 'red'}  />
                    )})}
                </Box>
            </Tab>
            <Tab title="FastCharge (km/h)">
                <Box margin="small" direction="row" gap="0px" overflow="auto" height="medium"  width="xlarge">
                    
                    {charge.map((item,i) => {
                        return (
                        <RangeChart label={item.model} value={item.value} max={1420} color={charge[i].model===data[index].model && 'red'}  />
                    )})}
                </Box>
            </Tab>
        </Tabs>
        
        </Box>
        </Box>
    )
}

export default Car;