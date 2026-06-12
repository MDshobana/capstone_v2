## SkillSphere Backend
## Overview
SkillSphere backend provides APIs for:

Jobs & Applications
Courses & Enrollment
Quiz & Assignments
AI Chat (OpenAI)
Payments (Razorpay)

Built with Node.js, Express, MongoDB and fully tested.

## Tech Stack

Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Multer + Cloudinary
Vitest + Supertest


## Testing
Fully tested backend
Uses Vitest + Supertest
In-memory DB with MongoMemoryServer
External services mocked
Run tests
Shellnpm run testWeitere Zeilen anzeigen

## Test Report
After running tests, a report is generated:
test-results.xml

## Location:
/server/test-results.xml

## Used for:

## CI/CD pipelines
automation tools


## Coverage Report
Run coverage
Shellnpm run coverage``Weitere Zeilen anzeigen

## Output
/coverage/index.html

## Open in browser to see:

Lines coverage
Functions coverage
Branch coverage


## Mocked Services
To ensure isolated testing:

OpenAI 
Razorpay 
Cloudinary 
Multer (file uploads) 


## Authentication
Test mode bypass:
JavaScriptreq.user = {  id: "507f1f77bcf86cd799439011",  role: "student"};Weitere Zeilen anzeigen

## API Documentation
Swagger UI is available at:
https://mylearningportal.site/api-docs

## Provides interactive API testing interface

## Run Locally
Shellnpm installnpm start``Weitere Zeilen anzeigen

## Test Status
All tests passing
Full API coverage
External APIs mocked

## Features

REST API architecture
Role-based access
File upload support
External API integrations
Fully testable backend


## Future Improvements

CI/CD pipeline
Coverage badge
Swagger auto-generation


Ready for production-level development
