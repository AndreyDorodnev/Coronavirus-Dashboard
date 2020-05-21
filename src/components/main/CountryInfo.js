import React from 'react';

export default props => {
    return (
        <React.Fragment>
            <div className="information">
                {
                    props.data?
                    (
                        <div className="info">
                            <p className="header">{`Country: ${props.data.country}`}</p>
                            <p>{`Continent: ${props.data.continent}`}</p>
                            <p>{`Population: ${props.data.population}`}</p>
                            <p>{`Tests: ${props.data.tests}`}</p>
                            <p>{`Cases: ${props.data.cases}`}</p>
                            <p>{`Deaths: ${props.data.deaths}`}</p>
                            <p>{`Recovered: ${props.data.recovered}`}</p>
                        </div>
                    ):
                    (
                        <div className="info">
                            <p>No country selected</p>
                        </div>
                    )
                }

            </div>
        </React.Fragment>
    )
}