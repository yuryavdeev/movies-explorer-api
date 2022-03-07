# API приложения movies-explorer-api    
This work is a backend for a movie storage application implemented using the Express framework.    

## Functionality    
- validation of incoming requests,    
- JWT validation,    
- routing, including using dynamic routes, and processing incoming requests,    
- centralized error handling (errors/err.js).    
      
## Peculiarities        
- app.js implements an express server, it is launched on port 3000 by the "npm start" command, but now server cannot be started due to lack of hosting,    
- the application is connected to the MongoDB server,    
- implemented hot reload using the nodemon package when running the application with the "npm run dev" command,    
- the scheme and model for the user and the movie are created,    
- requests are validated at the schema level, as well as when switching to routes - using Joi and the celebrate library,    
- all routes, except for the registration page and login page, are protected by authorization (middlewares/auth.js) with checking the presence and matching of JWT cookies in the request,    
- JWT is stored in cookies during authorization (httpOnly = true)    

## Технологии        
- REST API    
- Node.js    
- Express    
- MongoDB    
- JWT    

## Application launch        
To launch the application, you have to perform the following sequence of actions:    
1. Install the application locally (git clone),    
2. Update installed packages (npm install),    
3. Start the server (npm run dev)      
After that, the server can be checked using the API testing tools - Postman or analogues. 






