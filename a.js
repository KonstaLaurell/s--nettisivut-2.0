document.addEventListener("DOMContentLoaded", function () {
    const fetchForecastButton = document.getElementById('result');
    const citySelect = document.getElementById('location');
  
    fetchForecastButton.addEventListener('click', function () {
        const selectedCity = citySelect.value;
  
        if (!selectedCity || selectedCity === "Select Location") {
            alert('Please select a valid city.');
            return;
        };
  
        const baseUrl = "https://opendata.fmi.fi/wfs";
        const params = {
            service: "WFS",
            version: "2.0.0",
            request: "getFeature",
            storedquery_id: "fmi::observations::weather::simple",
            place: selectedCity,
            parameters: "temperature,windspeedms,feelslike",
        };
        
        function constructUrl(base, params) {
            return base + "?" + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
        };
        
        const url = constructUrl(baseUrl, params);
        
        fetch(url)
        .then((response) => response.text())
        .then((data) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const namespaceResolver = xmlDoc.createNSResolver(xmlDoc.documentElement);
        
            const temperatureNode = xmlDoc.evaluate('//BsWfs:ParameterName[text()="temperature"]/following-sibling::BsWfs:ParameterValue', xmlDoc, namespaceResolver, XPathResult.ANY_TYPE, null).iterateNext();
            const windspeedNode = xmlDoc.evaluate('//BsWfs:ParameterName[text()="windspeedms"]/following-sibling::BsWfs:ParameterValue', xmlDoc, namespaceResolver, XPathResult.ANY_TYPE, null).iterateNext();
            const feelNode = xmlDoc.evaluate('//BsWfs:ParameterName[text()="feelslike"]/following-sibling::BsWfs:ParameterValue', xmlDoc, namespaceResolver, XPathResult.ANY_TYPE, null).iterateNext();
            console.log(temperatureNode)
            console.log(windspeedNode)
            console.log(feelNode)
            
            const sanitizeValue = (value) => (value === 'NaN' ? '0' : value);
        
            const temperature = temperatureNode ? sanitizeValue(temperatureNode.textContent) : 'Unavailable';
            const windspeed = windspeedNode ? sanitizeValue(windspeedNode.textContent) : 'Unavailable';
            const feel = feelNode ? sanitizeValue(feelNode.textContent) : 'Unavailable';
            console.log(temperature)
        
            const temperatureDiv = document.getElementById(`temper`);
            const windspeedDiv = document.getElementById(`wind`);
            const feelDiv = document.getElementById(`feel`);
            temperatureDiv.textContent = `${temperature}°C`;
            windspeedDiv.textContent = `${windspeed}`;
            feelDiv.textContent = `${feel}`;
        })
        
    })
});

  