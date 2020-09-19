import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./MapBox.css";
import { Box, Text } from "grommet";

const MapBox = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch(
      "https://opendata.paris.fr/api/records/1.0/search/?dataset=referentiel-archeologique-de-paris&q=&facet=code_postal&facet=nature_operation&facet=responsable_operation&facet=date_operation&facet=prehistoire&facet=protohistoire&facet=antiquite&facet=moyen_age&facet=temps_modernes&facet=epoque_contemporaine"
    )
      .then((response) => response.json())
      .then((data) => setData(data.records));
  }, []);

  return (
    <Box height="medium" width="large" margin="small">
      <Map center={[48.8, 2.33]} zoom={11}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {data.map((item) => (
          <Marker position={item.fields.geo_point_2d}>
            <Popup>
              <Box margin="small" overflow="scroll" height="small">
                <Text size="small">{item.fields.synthese}</Text>
              </Box>
            </Popup>
          </Marker>
        ))}
      </Map>
    </Box>
  );
};

export default MapBox;
