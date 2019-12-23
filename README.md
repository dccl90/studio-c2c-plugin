# Studio Click to Call Plugin

The primary purpose of this plugin is to demonstrate how you can orchestrate Click-to-Call flows from Studio, and route them to an agent in Flex. The code is intended as an example, and not for production environments.

## Assumptions
I have assumed that you already have the API calls to Studio working.

## How it works

### Studio Flow:
The Studio API request contains a parameter of targetWorker, which is the contact_uri for the worker initiating the call. The last transition in the flow is a redirect widget which sends the call to a function. The function URL has two parameters appended as a query string.

Example:
`https://your_runtime_domain.twil.io/click-to-call-task?targetWorker={{flow.data.targetWorker}}&executionSid={{flow.sid}}`

### Functions
There are three V1 functions that I have deployed. 
* The first function `click-to-call-task` creates the task and places the customer in a conference.
* The second function `click-to-call-callback` updates the task attributes with the worker and conference SIDs. It also moves the task into wrapup when the conference ends, and handles the deletion of the execution preventing it from becoming stuck.
* The third function `hold-call` handles placing the call on hold. 

## Setup

* Clone the repository.
* Deploy the Twilio functions via the console.
* Ensure you define the following environment variables for your functions FLOW_SID (Studio flow sid), RUNTIME_DOMAIN (Base functions URL), TWILIO_WORKFLOW_SID (Taskrouter workflow SID) and TWILIO_WORKSPACE_SID (Taskrouter workspace SID).
* Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd 

# If you use npm
npm install

mv public/appConfig.example.js public/appConfig.js
```

`Add your account SID to the appConfig.js file`

`Add your runtime domain to C2CPlugin.js`

## Development

To develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deploy

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example, `C2Cplugin.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.

# DISCLAIMER 
Please note: The plugin in this repo is released for use "AS IS" without any warranties of any kind, including, but not limited to their installation, use, or performance. Any use of this plugin is at your own risk.
