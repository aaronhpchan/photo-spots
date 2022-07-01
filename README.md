# Photo Spots - CRUD App

Photo Spots is a CRUD application which lets users discover and share good photo spots for taking pictures. 

## Live Website

[https://photo-spots.herokuapp.com/](https://photo-spots.herokuapp.com/)

## Features

- User Authentication and Authorization
- Cluster map for displaying places added by users
- Fuzzy search for searching photo spots by name
- Image upload and image delete
- Map rendering on details page
- Add comments for each photo spot

## Tools and Dependencies
- Node.js
- Express.js
- MongoDB and Mongoose
- EJS
- Tailwind CSS
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/) to host cloud database
- [Cloudinary](https://cloudinary.com/) to host images uploaded by users
- [Heroku](https://heroku.com/) for web hosting
- [Mapbox](https://www.mapbox.com/) for geocoding and to render maps and cluster map
- [Starability CSS](https://github.com/LunarLogic/starability) for animated star rating
- [Passport](https://github.com/jaredhanson/passport) for user authentication
- [Multer](https://github.com/jaredhanson/passport) for image upload
- [Joi](https://github.com/sideway/joi) for data validation

## Concepts 
- MVC architecture pattern

## List of Environment Variables
- ```DB_URL``` - Databse url
- ```CLOUD_NAME``` - Cloud name provided by Cloudinary
- ```API_KEY``` - API key provided by Cloudinary
- ```API_SECRET``` - API secret provided by Cloudinary
- ```MAPBOX_TOKEN``` - Access token provided by Mapbox