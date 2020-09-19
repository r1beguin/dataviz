import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./MapBox.css";
import { Box, Button, Text } from "grommet";
import { exportComponentAsPNG } from "react-component-export-image";

const MapBox = () => {
  const [data, setData] = React.useState([]);
  const [tile, setTile] = React.useState("osm");

  const componentRef = React.useRef();

  React.useEffect(() => {
    fetch(
      "https://opendata.paris.fr/api/records/1.0/search/?dataset=referentiel-archeologique-de-paris&q=&facet=code_postal&facet=nature_operation&facet=responsable_operation&facet=date_operation&facet=prehistoire&facet=protohistoire&facet=antiquite&facet=moyen_age&facet=temps_modernes&facet=epoque_contemporaine"
    )
      .then((response) => response.json())
      .then((data) => setData(data.records));
  }, []);

  return (
    <Box height="medium" width="large" margin="small" align="center">
      <Box margin="small" direction="row" gap="small" align="center">
        <Button onClick={() => setTile("osm")} label="OSM"></Button>
        <Button onClick={() => setTile("ign")} label="Vue aérienne"></Button>
        <Button onClick={() => setTile("map")} label="Carte IGN"></Button>
      </Box>
      <Map
        center={[48.847, 2.343]}
        zoom={12}
        ref={componentRef}
        zoomControl={false}
        attributionControl={false}
      >
        {tile === "osm" ? (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        ) : tile === "ign" ? (
          <TileLayer url="https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg" />
        ) : (
          <TileLayer url="https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg" />
        )}

        {data.map((item) => (
          <Marker position={item.fields.geo_point_2d}>
            <Popup>
              <Box margin="small" overflow="scroll" height="small">
                <Text size="small">{item.fields.geo_point_2d}</Text>
                <Text size="small">{item.fields.synthese}</Text>
              </Box>
            </Popup>
          </Marker>
        ))}
      </Map>
      <Box margin="small" width="small">
        <Button
          onClick={() => exportComponentAsPNG(componentRef)}
          label="Exporter l'image"
        ></Button>
      </Box>
    </Box>
  );
};

export default MapBox;
