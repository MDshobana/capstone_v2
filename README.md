## SkillSphere Backend
## Overview
SkillSphere backend provides APIs for:

Jobs & Applications\
Courses & Enrollment\
Quiz & Assignments\
AI Chat (OpenAI)\
Payments (Razorpay)

Built with Node.js, Express, MongoDB and fully tested.

## Tech Stack

Node.js\
Express.js\
MongoDB (Mongoose)\
JWT Authentication\
Multer + Cloudinary\
Vitest + Supertest


## Testin
Fully tested backend\
Uses Vitest + Supertest\
In-memory DB with MongoMemoryServer\
External services mocked\
Run tests -> npm run test

## Test Report
After running tests, a report is generated:\
test-results.xml

## Location:
/server/test-results.xml

## Coverage Report
Run coverage -> npm run coverage

## Output
/coverage/index.html

## Open in browser to see:

Lines coverage\
Functions coverage\
Branch coverage


## Mocked Services
To ensure isolated testing:

OpenAI \
Razorpay \
Cloudinary \
Multer (file uploads) 


## Authentication
Test mode bypass:\
req.user = {  id: "507f1f77bcf86cd799439011",  role: "student"};

## API Documentation
Swagger UI is available at:\
https://api.mylearningportal.site/api-docs

## Run Locally
cd client\ 
npm install -> npm run dev
cd server\ 
npm install-> node server.js

## Test Status
All tests passing\
Full API coverage\
External APIs mocked

## Features
Role-based access\
File upload support\
External API integrations

## CI/CD Pipe line
deploy.yml \
gitHub actions 


## Future Improvements

Coverage badge\
Swagger auto-generation


## Application URL
https://mylearningportal.site

