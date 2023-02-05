# Vellum Node.js Library

The Vellum Node.js library provides convenient access to the Vellum Predict API from Node.js applications. Most of the code in this library is generated from our OpenAPI specification.

**Important note: this library is meant for server-side usage only, as using it in client-side browser code will expose your secret API key.

## Installation

```bash
$ npm install vellum-client-node
```

## Usage

You'll need an API key from your Vellum account to use this library. You can create an API key from within your account [here](https://app.vellum.ai/api-keys). 
We recommend setting it as an environment variable.

Here's an example of initializing the library with the API key
loaded from an environment variable and initiating a generation:

```javascript
const { GenerateApi, GenerateApiApiKeys } = require("vellum-client-node");

const generate = new GenerateApi();
generate.setApiKey(GenerateApiApiKeys.apiKeyAuth, process.env.VELLUM_API_KEY)

const generation = await generate.generate(
  {
    deploymentName: "my-deployment",
    inputValues: [{"input": "Hello, world!"}],
  },
)
console.log(generation.body.completions[0][0].text);
```

### Error handling

API requests can potentially return errors due to invalid inputs or other issues. These errors can be handled with a `try...catch` statement, and the error details can be found in either `error.response` or `error.message`:

```javascript
try {
  const generation = await generate.generate(
    {
      deploymentName: "my-deployment",
      inputValues: [{"input": "Hello, world!"}],
    },
  )
  console.log(generation.body.completions[0][0].text);
} catch (error) {
  if (error.response) {
    console.log(error.response.statusCode);
    console.log(error.response.body);
  } else {
    console.log(error.message);
  }
}
```
