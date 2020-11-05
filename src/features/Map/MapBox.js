import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./MapBox.css";
import {
  Box,
  Button,
  RangeInput,
  Text,
  RadioButtonGroup,
  ResponsiveContext,
} from "grommet";
import { exportComponentAsPNG } from "react-component-export-image";
import ReactLeafletSearch from "react-leaflet-search";


const MapBox = () => {
  const [data, setData] = React.useState([]);
  const [tile, setTile] = React.useState(3);
  const [composing, setComposing] = React.useState(50);
  const [maps] = React.useState([
    {
      name: "osm",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
  ]);
  const [showInfo, setShowInfo] = React.useState(false);

  const size = React.useContext(ResponsiveContext);
  const componentRef = React.useRef();

  React.useEffect(() => {
    // Coder ici l'appel à l'api de votre choix, exemple :
    fetch(
"https://www.data.gouv.fr/fr/datasets/r/6a55e26f-f730-478c-b33d-4401b8e5bdf4"    )
      .then((response) => response.json())
      .then((data) => setData(data.features));
  }, []);

  return (
    <>
      {size === "small" && (
        <Box
          direction="row"
          margin="small"
          gap="small"
          align="center"
          style={{ height: "40%" }}
        >
          <Box>
            <Button
              onClick={() => setShowInfo(!showInfo)}
              label="Montrer marqueurs"
              color={tile === 0 && "red"}
            ></Button>
          </Box>
        </Box>
      )}
      <Box align="center" direction="row" fill>
        {size !== "small" && (
          <Box
            margin="small"
            gap="small"
            align="center"
            style={{ width: "20%" }}
          >
            <Button
              onClick={() => setShowInfo(!showInfo)}
              label="Montrer marqueurs"
              color={tile === 0 && "red"}
            ></Button>
          </Box>
        )}

        <Box fill>
          <Map
            center={[48.847, 2.343]}
            zoom={12}
            ref={componentRef}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url={maps[0].url} />

            <ReactLeafletSearch
              position="topleft"
              inputPlaceholder="Custom placeholder"
              showMarker={false}
              zoom={12}
              closeResultsOnClick={true}
              openSearchOnLoad={false}
            ></ReactLeafletSearch>

            {showInfo && (
              // Coder ici l'affichage de vos marqueurs (remplacer dans les <></> qui suivent)
              data.map((item) => (
                <Marker position={ [item.geometry.coordinates[1], item.geometry.coordinates[0] ] } >
                  <Popup>
                    <Box margin="small" overflow="scroll" height="small">
                      {/* <Text size="small">{ CHEMIN JSON INFO}</Text> */}
                    </Box>
                  </Popup>
                </Marker>
              ))

              // remplacer (<></>) par votre code
              
            )}
          </Map>
        </Box>
      </Box>
    </>
  );
};

export default MapBox;
