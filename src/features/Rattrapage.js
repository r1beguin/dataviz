import React from "react";


import {Box, Text} from "grommet";


const Rattrapage = () => {

    const [totalRecovered, settotalRecovered] = React.useState()

    React.useEffect(() => {

        //Appels (fetch) api ici

    })


    return(
        <Box align="center" fill pad="small">
            <Text>Rattrapage Dataviz</Text>

            <Text margin="medium" weight="bold" color="accent">Exercice 1</Text>
            <Text margin="small">Grace à cette API :https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-personnes-vaccinees-contre-la-covid-19/#_</Text>
            <Text margin="small">(appel api grâce à fetch + traitement de la donnée JSON)</Text>
            <Text margin="small">Afficher ci-dessous l'évolution du nombre de vaccinés entre 11 janvier et le 26 janvier grâce à un graph rechart</Text>

            <Box margin="medium">
               <Text color="ok">.... A compléter ...</Text>
            </Box>
            
            <Text margin="medium" weight="bold" color="accent">Exercice 2</Text>
            <Text margin="small">Depuis cette page wikipédia :https://fr.wikipedia.org/wiki/Liste_de_films_fran%C3%A7ais_sortis_en_2019</Text>
            <Text margin="small">Représenter de la manière de votre choix la proportion des films sortis en 2019 en France en fonction de leurs genre</Text>
            <Text margin="small">(écrire un script python de scraping et utiliser le fichier JSON généré par ce script)</Text>

            <Box margin="medium">
               <Text color="ok">.... A compléter ...</Text>
            </Box>
            
           
            <Text margin="medium" weight="bold" color="accent">Exercice 3: Question de cours</Text>
            <Text margin="small">Rappeler quels sont les 3+3v du BigData, les détailler et représenter ces informations de la manière de votre choix</Text>

            <Box margin="medium">
               <Text color="ok">.... A compléter ...</Text>
            </Box>
            

        </Box>
    )
}


export default Rattrapage;