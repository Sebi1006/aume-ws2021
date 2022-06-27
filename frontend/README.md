# Frontend Documentation

## Quick Start

### Install devDependencies

- Make sure your NodeJS and npm versions are up-to-date for `React 16.8.6`

- Install ESLint globally on your machine: `npm install --g eslint`

- Install dependencies: `npm install`

### Start mock backend

- Start the mock backend: `npm run apiMock`

### Start the frontend

- Start the server: `npm run start`

- Views are on `localhost:3000`

### Run unit tests

- Run tests (jest) with the following command: `npm test`

## Powerful Routing API for Electric Cars

The Chargetrip API is based on a GraphQL structure. GraphQL is a query language for your API and a server-side runtime for executing queries by using a type system you define for your data. We use this API to get the information about the electric cars a user can choose in the profile page.

[More information about the API](https://docs.chargetrip.com/#introduction)

The API is reached under the following web address: https://api.chargetrip.io/graphql

Authorisation is done by setting an x-client-id as a HTTP header. Once you have an x-client-id from your account manager, you can start using the full API. For our case we used the following test key: `"x-client-id": "5e8c22366f9c5f23ab0eff39"`

## Learn before you start

### Material Design

A Google material design framework. Rules and guidelines to design user-friendly, mature and mobile-first apps. We strongly recommend reading and understanding these design guidelines before designing the user interface.

- https://www.material.io

### Programming

You should learn the tools used in this project to understand how things work.

#### JavaScript

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
- https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array

#### React

- https://reactjs.org/tutorial/tutorial.html
- https://reactjs.org/docs/hello-world.html

#### Material UI

Material UI is an implementation of Material Design for React. It has layout components and UI widgets.

- https://material-ui.com/

#### Axios HTTP Client

- https://github.com/axios/axios

#### Patterns and tips for React development:

- https://reactpatterns.com

#### JSON Server for mock REST API

- https://github.com/typicode/json-server

You can run the json-server by calling `npm run apiMock`. The data is in `../data folder`

## File Structure

### Main artefacts

- `src/pages`: each page is a main navigation area
- `src/components`: general, reusable components
- `src/routes.js`: states the URL routes within the application
- `src/layouts/NavBar/index.js`: states the navigation "burger menu" items

### Examples

There are some example pages (just for demonstration purposes).

- `pages/dashboard`: example page showing some layout and widgets
- `pages/dashboard/LatestCycles.js`: example page showing how to access the backend
- `pages/profile`: example page on how to have a second menu item

### Structure

```
react-seed-project
├── .eslintrc
├── .gitignore
├── .prettierrc
├── jsconfig.json
├── package.json
├── README.md
├── public
├── docs
└── src
	├── apiClient
	├── components
	├── mixins
	├── layouts
	├── theme
	├── pages
	│	├── dashboard
	│	├── errors
	│	│   └── NotFoundPage.js
	├── App.js
	├── index.js
	└── routes.js
```
