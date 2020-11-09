import React from 'react';

import {Box, Button, Text, TextInput, ResponsiveContext} from "grommet";
import { XAxis, YAxis, CartesianGrid,ScatterChart, Scatter, Legend, Tooltip, ResponsiveContainer} from "recharts";

import * as tf from '@tensorflow/tfjs';

import * as tfvis from '@tensorflow/tfjs-vis'

import dataRaw from '../../train.json';
import dataModel from '../../my-model-1.json';


function createModel() {
    // Create a sequential model
    const model = tf.sequential(); 
    
    // Add a single input layer
    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));

    // Add an output layer
    model.add(tf.layers.dense({units: 1, useBias: true}));
  
    return model;
  }

  function convertToTensor(data) {
    // Wrapping these calculations in a tidy will dispose any 
    // intermediate tensors.
    
    return tf.tidy(() => {
      // Step 1. Shuffle the data    
      tf.util.shuffle(data);
  
      // Step 2. Convert data to Tensor
      const inputs = data.map(d => d.battery)
      const labels = data.map(d => d.range);
  
      const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
  
      //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
      const inputMax = inputTensor.max();
      const inputMin = inputTensor.min();  
      const labelMax = labelTensor.max();
      const labelMin = labelTensor.min();
  
      const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
      const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
  
      return {
        inputs: normalizedInputs,
        labels: normalizedLabels,
        // Return the min/max bounds so we can use them later.
        inputMax,
        inputMin,
        labelMax,
        labelMin,
      }
    });  
  }
  async function trainModel(model, inputs, labels) {
    // Prepare the model for training.  
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });
    
    const batchSize = 32;
    const epochs = 1000;
    
    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
    //   callbacks: tfvis.show.fitCallbacks(
    //     { name: 'Training Performance' },
    //     ['loss', 'mse'], 
    //     { height: 200, callbacks: ['onEpochEnd'] }
    //   )
    });
  }

  function testModel(model, inputData, normalizationData) {
    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  
    
    // Generate predictions for a uniform range of numbers between 0 and 1;
    // We un-normalize the data by doing the inverse of the min-max scaling 
    // that we did earlier.
    const [xs, preds] = tf.tidy(() => {
      
      const xs = tf.linspace(0, 1, 50);      
      const preds = model.predict(xs.reshape([50, 1]));      
      
      const unNormXs = xs
        .mul(inputMax.sub(inputMin))
        .add(inputMin);
      
      const unNormPreds = preds
        .mul(labelMax.sub(labelMin))
        .add(labelMin);
      
      // Un-normalize the data
      return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });
    
   
    const predictedPoints = Array.from(xs).map((val, i) => {
      return {x: val, y: Math.abs(preds[i])}
    });
    
    const originalPoints = inputData.map(d => ({
      x: d.battery, y: d.range,
    }));
    
    
    // tfvis.render.scatterplot(
    //   {name: 'Model Predictions vs Original Data'}, 
    //   {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
    //   {
    //     xLabel: 'battery',
    //     yLabel: 'range',
    //     height: 1000
    //   }
    // );
    return [predictedPoints, originalPoints]
  }

  function predictOutput(model, data, tensorData, input){
    const {inputMax, inputMin, labelMin, labelMax} = tensorData;  
    const output = tf.tidy(() => {
        const result = model.predict(tf.tensor2d([input], [1,1]).sub(inputMin).div(inputMax.sub(inputMin)))
        
        const unNormPreds = result
        .mul(labelMax.sub(labelMin))
        .add(labelMin);

               return unNormPreds.dataSync();

    })
    

    return output[0];
  }

const RangePredictor = () => {
    const [data, setData] = React.useState(dataRaw);
    const [train, setTrain] = React.useState(true);
    const [save, setSave] = React.useState(false);
    const [input, setInput] =React.useState();
    const [output, setOutput] =React.useState();
    const [predict, setPredict] = React.useState(false);
    const [model, setModel] = React.useState(dataModel);
    const [graphData, setGraphData] = React.useState();
    const [showGraph, setShowGraph] =React.useState(false);
    

    React.useEffect(()=>{
        if (train){
            const values = data.map(d => ({
                x: d.battery,
                y: d.range,
            }))
            // tfvis.render.scatterplot(
            //     {name: 'battery v range'},
            //     {values}, 
            //     {
            //       xLabel: 'battery',
            //       yLabel: 'range',
            //       height: 1000
            //     }
            //   );
    
            const m = createModel();
    
            
            //tfvis.show.modelSummary({name: 'Model Summary'}, model);
            // Convert the data to a form we can use for training.
            const tensorData = convertToTensor(data);
            const {inputs, labels} = tensorData;
    
            async function train() {
                return await trainModel(m, inputs, labels);
            }
            // Train the model  
            train();
            console.log('Done Training');
            setGraphData(testModel(m, data, tensorData));
            setShowGraph(true)
            setModel(m);
           setTrain(false)
            
           }else {
                // async function loadModel() {
                //     return await tf.loadGraphModel(dataModel);
                // }
                // const m=loadModel();
                // setModel(m);
           }
    
        // if (save){
        //     console.log("save...");
        //     async function save() {
        //         await model.save('localStorage://my-model-1');
        //     }
        //     save();
        //     setSave(false)
        // }
        if (predict===true){
            const tensorData = convertToTensor(data);
         setOutput(predictOutput(model, data, tensorData, input))
    //         console.log("prediction from : " + input)
    //         const result = model.predict(tf.tensor2d([input], [1,1]))
        
    //         const {labelMin, labelMax} = tensorData;
    //         console.log(tensorData)
    //         const unNormPreds = result
    //         .mul(labelMax.sub(labelMin))
    //         .add(labelMin);
    //         setOutput("result : " + unNormPreds.dataSync())
    //         setPredict(false)
       }
    }, [data, input, model, predict, save, train])

    const size = React.useContext(ResponsiveContext);
   
   
    return (
        <Box margin="medium" gap="medium" align="center" justify="center">
            <Text>Predict EVs range</Text>
            {showGraph && (
               <Box direction={size === "small" ? ("column-reverse") : ("row")} align="center" justify="center" gap="small">
                   <Button label="Retrain" onClick={() => setTrain(true)}></Button>

                        <ScatterChart
                        width={size === "small" ? 400 : size ==="medium" ? 600 : 800}
                        height={250}
                        margin={{
                        top: 20, right: 20, bottom: 20, left: 20,
                        }}
                    >
                        <CartesianGrid />
                        <XAxis type="number" dataKey="x" name="battery" unit="kwh" />
                        <YAxis type="number" dataKey="y" name="range" unit="km" />
                        <Legend />
                        <Scatter name="Predicted data" data={graphData[0]} fill="#8884d8" />
                        <Scatter name="Original data" data={graphData[1]} fill="#82ca9d" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />

                    </ScatterChart>
                
                </Box>
            )}
            
            {/* <Button label="save" onClick={()=> setSave(true)} /> */}

            <TextInput placeholder="Enter battery size"  onChange={e => setInput(parseInt(e.target.value))} />
            <Button label="Predict" onClick={()=> setPredict(true)} />
            {output && (
                <Text>{ output.toString().match(/^\d*/g)} km</Text>
            )}
            
            <Box height="medium"/>
                   
        </Box>
    )
}

export default RangePredictor;