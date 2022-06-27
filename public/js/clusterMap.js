// https://docs.mapbox.com/mapbox-gl-js/example/cluster/

mapboxgl.accessToken = mapBoxToken; // mapBoxToken variable comes from index.ejs file
const map = new mapboxgl.Map({
    container: 'cluster-map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-98.4703457399514, 53.4604863996], // Manitoba, CA
    zoom: 3
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
 
map.on('load', () => {
    // Add a new source and set the 'cluster' option to true. 
    // GL-JS will add the point_count property to the source data.
    map.addSource('spots', {
        type: 'geojson', // Point to GeoJSON data.         
        data: spots, // spots variable comes from index.ejs file
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'spots',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 15px circles when point count is less than 5
            //   * Yellow, 20px circles when point count is between 5 and 10
            //   * Pink, 25px circles when point count is greater than or equal to 10
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                5,
                '#f1f075',
                10,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15, //px width
                5, //point count
                20, //px width
                10, //point count
                25 //px width
            ]
        }
    });
    
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'spots',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
    
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'spots',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
    
    // inspect a cluster on click
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('spots').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;
                
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });
    
    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        /* GeoJSON expects each object to have properties
           solution: make a virtual property in Mongoose and have it send back data with properties added to it */
        const { popUpText } = e.features[0].properties;
        
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpText)
            .addTo(map);
    });
    
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
});