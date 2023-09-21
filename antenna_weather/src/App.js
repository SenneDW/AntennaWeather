import './App.css';
import React, { useEffect, useState } from 'react'
function App() {
  function importAll(r) {
    return r.keys().map(r);
  }

  const svgFiles = importAll(require.context('./weather', false, /\.svg$/));
  const pngFiles = importAll(require.context('./direction', false, /\.png$/));


  const [weatherGrid, setWeatherGrid] = useState([])
  const [directionGrid, setDirectionGrid] = useState([])

  const [weatherTemperatureGrid, setWeatherTemperatureGrid] = useState([])

  const DIRECTIONS = ["E", "N", "NE", "NW", "S", "SE", "SW", "W"]


  const getWeather = async () => {

    let url = "http://api.weatherapi.com/v1/forecast.json"
    let params = new URLSearchParams()
    params.append('key', process.env.REACT_APP_API_KEY)
    params.append('days', 4)
    params.append('q', 'Gent')
    params.append('aqi', 'yes')
    url += `?${params.toString()}`

    fetch(url).then((resp) => {
      return resp.json()
    }).then((data) => {
      console.log(data);
      const forecastdays = data.forecast.forecastday
      for (let index = 0; index < forecastdays.length; index++) {
        const svgWeather = `${forecastdays[index].day.condition.icon.split("/").at(-1).split(".")[0]}`
        let pngDirection = `${forecastdays[index].hour[12].wind_dir}`
        switch (pngDirection) {
          case 'NNE':
            pngDirection = 'NE'
            break;
          case 'ENE':
            pngDirection = 'NE'
            break;
          case 'ESE':
            pngDirection = 'SE'
            break;
          case 'SSE':
            pngDirection = 'SE'
            break;
          case 'SSW':
            pngDirection = 'SW'
            break;
          case 'WSW':
            pngDirection = 'SW'
            break;
          case 'WNW':
            pngDirection = 'NW'
            break;
          case 'NNW':
            pngDirection = 'NW'
            break;
        }
        const date = Date.parse(forecastdays[index].date)
        const weekday = new Date(date).toLocaleDateString('nl-BE', {
          weekday: 'long',
        })

        let gridDayCondition = (
          <div className='allFlex'>
            <h1 className='weekDay'>{weekday}</h1>
            <p className='blueBackground'> <img className='weatherImage' src={svgFiles.find(file => file.includes(`/${svgWeather}.`))} /> </p>
          </div>
        )

        let gridDirection = (<div className='blueBackground'  >
          <p> <img className='directionImage' src={pngFiles[DIRECTIONS.indexOf(pngDirection)]} alt='wat' /> </p>
        </div>)

        let gridTemperature = (<div className='blueBackground' >
          <div className='divTemperature'>
            <p className='temperature min'>{Math.round(forecastdays[index].day.mintemp_c)} </p>
            <p className='temperature max'>{Math.round(forecastdays[index].day.maxtemp_c)} </p>
          </div>
        </div>)

        setWeatherGrid((weatherGrid) => [...weatherGrid, gridDayCondition])
        setDirectionGrid((directionGrid) => [...directionGrid, gridDirection])
        setWeatherTemperatureGrid((weatherTemperatureGrid) => [...weatherTemperatureGrid, gridTemperature])

      }
    }
    ).catch((err) => console.log(err))
  };

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <div className='background'>
      <div className='weather'>
        <div className='weekdaySvgFlex'>
          {weatherGrid}
        </div>
        <div className='pngFlex'>
          {directionGrid}
        </div>
        <div className='temperatureFlex'>
          {weatherTemperatureGrid}
        </div>
        <p className='weekoverzicht'>weekoverzicht</p>
      </div>
    </div>
  );
}
export default App;
