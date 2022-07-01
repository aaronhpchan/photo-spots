/* Render Map */
mapboxgl.accessToken = mapBoxToken; // mapBoxToken variable comes from details.ejs file
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: spot.geometry.coordinates, // mapBoxToken variable comes from details.ejs file; starting position [lng, lat]
    zoom: 12 // starting zoom
});

// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: 'rgb(168 85 247)' })
    .setLngLat(spot.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h2 class="text-base font-semibold">${spot.title}</h2><p>${spot.location}<p>`)) // add popup
    .addTo(map);

/* Image Carousel */
const slides = document.querySelectorAll('.slide');
slides.forEach((slide, i) => {
    slide.style.transform = `translate(${i * 100}%)`;
});

const nextSlide = document.querySelector('.btn-next');
const prevSlide = document.querySelector('.btn-prev');
let curSlide = 0; // current slide counter
let maxSlide = slides.length - 1;

nextSlide.onclick = () => {
    // check if current slide is the last and reset current slide
    curSlide === maxSlide ? curSlide = 0 : curSlide++;
    // move slide by -100%
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });
};
prevSlide.onclick = () => {
    // check if current slide is the first and reset current slide to last
    curSlide === 0 ? curSlide = maxSlide : curSlide--;
    // move slide by 100%
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });
};

