import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import L from 'leaflet';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';
import TotalInfo from '../components/main/TotalInfo';
import CountryInfo from '../components/main/CountryInfo';

const LOCATION = {
  lat: 0,
  lng: 0,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

let markers = null;

const IndexPage = () => {

  const [totalCases,setTotalCases] = useState({caption:{text:'Total Cases',value:''},data:[]});
  const [totalDeaths,setTotalDeaths] = useState({caption:{text:'Total Deaths',value:''},data:[]});
  const [totalRecovered,setTotalRecovered] = useState({caption:{text:'Total Recovered',value:''},data:[]});
  const [countryInformation,setCountryInformation] = useState({});

  useEffect(()=>{
    console.log('USe effect');  
    axios.get('https://corona.lmao.ninja/v2/all')
    .then(totalData=>{
      axios.get('https://corona.lmao.ninja/v2/countries')
      .then(countryData=>{
        const dataTest = getTotalCasesData(countryData.data);
        console.log(totalData);
        setTotalCases({caption:{text:'Total Cases',value:totalData.data.cases},data:getTotalCasesData(countryData.data)});
      })
    })
  },[]);
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   */
  async function mapEffect({ leafletElement: map } = {}) {
    console.log('Map effect');  
    clearLayers(map);
    let response;
    try {
      response = await axios.get('https://corona.lmao.ninja/v2/countries');
    } catch(e) {
      console.log(`Fetching data error: ${e.message}`);
      return;
    }
    const { data = [] } = response;    
    const geoJSON = getGeoJSON(data);
    const geoJsonLayers = getLeafletGeoJSON(geoJSON);
    markers = geoJsonLayers;
    geoJsonLayers.addTo(map);
  }

  const clearLayers = (map) => {
    if(markers){
      map.removeLayer(markers);
    }
  }

  const getLeafletGeoJSON = geoJSON => {
    return new L.geoJSON(geoJSON,{
      pointToLayer: (feature={},latLng) =>{
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;
        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties;
        casesString = getShortNum(cases);
        updatedFormatted = getdateFromMilliseconds(updated);

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;

        return L.marker(latLng,{
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });

      }
    });
  }

  const getShortNum = num => {
    return num>1000? `${String(num).slice(0,-3)}k` : `${num}`;
  }

  const getdateFromMilliseconds = milliseconds => {
    return milliseconds>0? new Date(milliseconds).toLocaleString() : '';  
  }

  const getGeoJSON = (data) => {
    //Specification:  https://geojson.org/
    if(Array.isArray(data)&&data.length>0){
      return {
        type: 'FeatureCollection',
        features: data.map(country=>{
          const { countryInfo = {} } = country;
          const { lat, long: lng } = countryInfo;
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [ lng, lat ]
            },
            properties: {
              ...country
            }
          }
        })
      }
    } else return {};
  }

  const getTotalCasesData = data => {
    if(Array.isArray(data)&&data.length>0){
      return data.map(element=>{
        return {
          text: element.country,
          value: element.cases
        }
      })
    } else return [];
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Coronavirus map</title>
      </Helmet>

      <Map {...mapSettings}>
      </Map>

      <Container type="content" className="total-info">
        <TotalInfo data={totalCases}></TotalInfo>
      </Container>
      <Container type="content" className="total-deaths">
        <TotalInfo></TotalInfo>
      </Container>
      <Container type="content" className="total-recovered">
        <TotalInfo></TotalInfo>
      </Container>
      <Container type="content" className="country-info">
        <CountryInfo></CountryInfo>
      </Container>
    </Layout>
  );
};

export default IndexPage;
