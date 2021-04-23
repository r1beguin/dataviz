import React from "react";

import {Box, Text} from "grommet";
import {LineChart, CartesianGrid,XAxis,YAxis,Line, Tooltip} from "recharts";

import sales from '../../sales.json'

const PriceGraph = () => {



    return (

        <Box>
            <Text>EVs sales</Text>
            <LineChart width={730} height={250} data={sales.reverse()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year"/>
                <YAxis />
                <Tooltip />
                
                <Line type="monotone" dataKey="shares"  />
                
            
            </LineChart>
        </Box>
    )
}


export default PriceGraph;