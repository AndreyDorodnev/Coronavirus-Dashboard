import React from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import L, { latLng } from 'leaflet';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
  lat: 38.9072,
  lng: -77.0369,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const IndexPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
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
    geoJsonLayers.addTo(map);
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
        {/* <Marker ref={markerRef} position={CENTER} /> */}
      </Map>

      <Container type="content" className="text-center home-start">
        <h2>Still Getting Started?</h2>
        <p>Run the following in your terminal!</p>
        <pre>
          <code>gatsby new [directory] https://github.com/colbyfayock/gatsby-starter-leaflet</code>
        </pre>
        <p className="note">Note: Gatsby CLI required globally for the above command</p>
      </Container>
    </Layout>
  );
};

export default IndexPage;
