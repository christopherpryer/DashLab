//html elements
myMap = document.getElementById('myMap')
myMap1 = document.getElementById('myMap1')
chart1 = document.getElementById('chart1')
chart2 = document.getElementById('chart2')

//static data read
Plotly.d3.csv('data/hackprinceton_test.csv', function(err, rows){

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    //main vars
    var cityName = unpack(rows, 'SiteCity'),
        cityExports = unpack(rows, 'total exports'),
        cityLat = unpack(rows, 'Lat'),
        cityLon = unpack(rows, 'Lon'),
        cityBeef = unpack(rows, 'beef'),
        cityPork = unpack(rows, 'pork'),
        cityPoultry = unpack(rows, 'poultry'),
        cityDairy = unpack(rows, 'dairy'),
        cityFreshFruit =unpack(rows, 'fruits fresh'),
        cityProcFruit = unpack(rows, 'fruits proc'),
        cityFreshVeg = unpack(rows, 'veggies fresh'),
        cityProcVeg = unpack(rows, 'veggies proc'),
        cityCorn = unpack(rows, 'corn'),
        cityWheat = unpack(rows, 'wheat'),
        cityCotton = unpack(rows, 'cotton'),
        color = [,"rgb(255,65,54)","rgb(133,20,75)","rgb(255,133,27)","lightgrey"],
        citySize = [],
        hoverText = [],
        shipStart = unpack(rows, 'ShipStart'),
        shipEnd = unpack(rows, 'ShipEnd'),
        scale = 300;

    //establish data scaling and presentation text
    for ( var i = 0 ; i < cityExports.length; i++) {
        var currentSize = cityExports[i] / scale;
        var currentText = cityName[i] + " Total Exports: " + cityExports[i];
        citySize.push(currentSize);
        hoverText.push(currentText);
    }

    //plotly site bubble map data
    var data = [{
        type: 'scattergeo',
        locationmode: 'USA-states',
        lat: cityLat,
        lon: cityLon,
        hoverinfo: 'text',
        text: hoverText,
        marker: {
            size: citySize,
            line: {
                color: 'black',
                width: 2
            },
        },
        name: 'Testing Trace'
    }];

    //site bubble map layout
    var layout = {
        autosize: false,
        width: 800,
        height: 500,
        title: '2014 US City Populations',
        showlegend: true,
        geo: {
            scope: 'usa',
            projection: {
                type: 'albers usa'
            },
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            subunitwidth: 1,
            countrywidth: 1,
            subunitcolor: 'rgb(255,255,255)',
            countrycolor: 'rgb(255,255,255)'
        },
    };

    //create new site bubble map plot (TODO is Plotly.Plot better suited for this?)
    Plotly.newPlot(myMap, data, layout, {showLink: false});

    //plotly event for clicking a site -- this will create a bar chart
    myMap.on('plotly_click', function(data){
      var isPlot = false;
      var wrapper = document.getElementById('chart1Wrapper');
      if ($(wrapper).css("visibility") == "hidden") {
        wrapper.style.visibility = 'visible'
      } else {
        isPlot = true;
      }
      var pn='',
      tn='';
      for(var i=0; i < data.points.length; i++){
        pn = data.points[i].pointNumber;
        tn = data.points[i].curveNumber;
      };
      var data2 = [
        {
          x: ['beef', 'pork', 'poultry', 'corn', 'wheat', 'dairy', 'cotton', 'processed veggies', 'fresh veggies', 'processed fruit', 'fresh fruit'],
          y: [cityBeef[pn], cityPork[pn], cityPoultry[pn], cityCorn[pn], cityWheat[pn],
        cityDairy[pn], cityCotton[pn], cityProcVeg[pn], cityFreshVeg[pn], cityProcFruit[pn], cityFreshFruit[pn]],
          type: 'bar'
        }
      ];

      //if the bar chart is there update it, if it isn't create it
      if (isPlot == false){
        Plotly.plot(chart1, data2, {showLink: false});
      } else {
        Plotly.newPlot(chart1, data2);
      }
    });

    //create empty arrays, iterate through state list and grab corresponding quantity and aggragate in new lists
    var allExports = unpack(rows, 'total exports');
    var allStates = unpack(rows, 'SiteState');
    var aggStates = [];
    var aggExports = [];
    for (var i=0; i < unpack(rows, 'SiteState').length; i++){
      if (aggStates.includes(allStates[i]) == true){
        aggExports[aggStates.indexOf(allStates[i])] = Number(aggExports[aggStates.indexOf(allStates[i])]) + Number(allExports[i]);
      } else {
        aggStates[i] = allStates[i];
        aggExports[i] = allExports[i];
      }
    };

    //state map data (TODO var naming)
    var data1 = [{
          type: 'choropleth',
          locationmode: 'USA-states',
          locations: aggStates,
          z: aggExports,
          text: aggStates,
          zmin: 0,
          zmax: 21000,
          colorscale: [
              [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
              [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
              [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
          ],
          colorbar: {
              title: 'Millions USD',
              thickness: 10
          },
          marker: {
              line:{
                  color: 'rgb(255,255,255)',
                  width: 2
              }
          }
      }];

      //state map layout
      var layout1 = {
          height: 500,
          width: 800,
          title: '2011 US Agriculture Exports by State',
          geo:{
              scope: 'usa',
              showlakes: true,
              lakecolor: 'rgb(255,255,255)'
          }
      };

      //create state map
      Plotly.newPlot(myMap1, data1, layout1, {showLink: false});

      //plotly click event on state
      myMap1.on('plotly_click', function(data){
        var isPlot = false;
        var wrapper = document.getElementById('chart1Wrapper');
        if ($(wrapper).css("visibility") == "hidden") {
          wrapper.style.visibility = 'visible'
        } else {
          isPlot = true;
        }
        var pn='',
        tn='';
        for(var i=0; i < data.points.length; i++){
          pn = data.points[i].pointNumber;
          tn = data.points[i].curveNumber;
        };

        //vars to dive into choro selection
        var state = allStates[pn];
        var cityCount = 0;
        var arrayOfData = [];
        var arrayOfCities = [];

        //grabs data from each necessary record and appends to arrays
        for(var i=0; i < cityName.length; i++){
          if (allStates[i] == state){
            cityCount++;
            arrayOfData.push([cityBeef[i], cityPork[i], cityPoultry[i], cityCorn[i], cityWheat[i],
          cityDairy[i], cityCotton[i], cityProcVeg[i], cityFreshVeg[i], cityProcFruit[i], cityFreshFruit[i]]);
            arrayOfCities.push(cityName[i])
          }
        };

        //var for plot
        var arrayOfTraces = [];

        //dynamically creates the structure for the plot
        for (var i=0; i < cityCount; i++){
          var trace = {
            x: ['beef', 'pork', 'poultry', 'corn', 'wheat', 'dairy', 'cotton', 'processed veggies', 'fresh veggies', 'processed fruit', 'fresh fruit'],
            y: arrayOfData[i],
            name: arrayOfCities[i],
            type: 'bar'
          }

          arrayOfTraces.push(trace)
        };

        //vars for the plot
        var data3 = arrayOfTraces;
        var layout2 = {barmode: 'group'};

        //if the bar chart is there update it, if it isn't create it (TODO this might be old, change if necessary - idk if there's a dif)
        if (isPlot == false){
          Plotly.plot(chart1, data3, layout2, {showLink: false});
        } else {
          Plotly.newPlot(chart1, data3, layout2);
        }
      });

      //bellow is for line chart along with range selector
      var selectorOptions = {
        buttons: [{
            step: 'month',
            stepmode: 'backward',
            count: 1,
            label: '1m'
        }, {
            step: 'month',
            stepmode: 'backward',
            count: 6,
            label: '6m'
        }, {
            step: 'year',
            stepmode: 'todate',
            count: 1,
            label: 'YTD'
        }, {
            step: 'year',
            stepmode: 'backward',
            count: 1,
            label: '1y'
        }, {
            step: 'all',
        }],
      };

      var layout3 = {
        title: 'Time series with range slider and selectors',
        xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {}
        },
        yaxis: {
            fixedrange: true
        }
      };

      var x = [];

      for(var i=0; i < shipStart.length; i++){
        x.push(new Date(shipStart[i]));
      };

      var data4 = [{
        x: x,
        y: cityExports,
        mode: 'lines',
        name: 'test'
      }];

      Plotly.newPlot(chart2, data4, layout3, {showLink: false});
});
