# :no_entry: [DEPRECATED] Active at https://github.com/vellum-ai/vellum-client-node

# Vellum Node.js Library

The Vellum Node.js library provides convenient access to the Vellum Predict API from Node.js applications. Most of the code in this library is generated from our OpenAPI specification.

**Important note: this library is meant for server-side usage only, as using it in client-side browser code will expose your secret API key.

## Installation

```bash
$ npm install vellum-client-node
```

## Usage

### Setup
You'll need an API key from your Vellum account to use this library. You can create an API key from within your account [here](https://app.vellum.ai/api-keys). 
We recommend setting it as an environment variable.

### Generating text
Here is how you can generate text completions using Vellum's API.

```typescript
const { GenerateApi, GenerateApiApiKeys } = require("vellum-client-node");

const generate = new GenerateApi();
generate.setApiKey(GenerateApiApiKeys.apiKeyAuth, process.env.VELLUM_API_KEY);

const generation = await generate.generate(
  {
    deploymentName: "my-deployment",
    requests: [
      {
        inputValues: {"question": "Could I please get a refund?"},
      },
    ],
  },
)
console.log(generation.body.results[0].data.completions[0].text);
```

### Submitting Actuals
Submitting actuals is how you provide feedback to Vellum about the quality of the
generated text. This feedback can be used to measure model quality and improve it over time.

```typescript
const { SubmitCompletionActualsApi, SubmitCompletionActualsApiApiKeys } = require("vellum-client-node");

const actuals = new SubmitCompletionActualsApi();
actuals.setApiKey(SubmitCompletionActualsApiApiKeys.apiKeyAuth, process.env.VELLUM_API_KEY);

const actualsResult = await actuals.submitCompletionActuals(
  {
    deploymentName: "my-deployment",
    actuals: [
      {
        id: "<id-returned-from-generate-endpoint>",
        quality: 1.0,  // 0.0 is bad, 1.0 is good
        text: "Sorry, we do not offer refunds."
      },
    ],
  },
)
console.log(actualsResult.body.results[0]);
```
**Note:** If you don't want to keep track of the ids that Vellum generates, you can include an `externalId`
key in the initial `generate` request. You can then include this `externalId` when submitting actuals.
If you use this approach, be sure that the ids you provide truly are unique, or you may get unexpected
results.


### Uploading Documents to Search Across
Documents can be uploaded to Vellum via either the UI or this API. Once uploaded and indexed,
Vellum's Search allows you to perform semantic searches against them.
Here is an example of how to upload a document from a local file:

```typescript
const fs = require('fs');
const {UploadDocumentApi, UploadDocumentApiApiKeys} = require("vellum-client-node");

const uploadDocumentsApi = new UploadDocumentApi();
uploadDocumentsApi.setApiKey(UploadDocumentApiApiKeys.apiKeyAuth, process.env.VELLUM_API_KEY);

const fileBuffer = await fs.createReadStream('/path/to/your/file.txt')

const uploadDocumentResult = await uploadDocumentsApi.uploadDocument(
        // Document label
        "Human-friendly label for your document",
        // File to upload
        fileBuffer,
        // The names of indexes that you'd like this document to be added to
        ["<your-index-name>"],
        // Optionally include a unique ID from your system to this document later
        // Useful if you want to perform updates later
        "<your-external-id>",
        // Optionally include keywords to associate with the document that can be used in hybrid search
        []
    )
;

console.log(uploadDocumentResult.body.documentId);
```


### Performing a Search
Vellum's Search allows you to upload documents and then perform semantic searches against them.
Here is an example of how to perform a search:

```typescript
const { SearchApi, SearchApiApiKeys } = require("vellum-client-node");

const search = new SearchApi();
search.setApiKey(SearchApiApiKeys.apiKeyAuth,  process.env.VELLUM_API_KEY);

const searchResult = await search.search({
    indexName: "help-center-docs",
    query: "What is fine tuning?",
    options: { limit: 3 },
});

console.log(searchResult.body.results);
```


### Error handling

API requests can potentially return errors due to invalid inputs or other issues. These errors can be handled with a `try...catch` statement, and the error details can be found in either `error.response` or `error.message`:

```typescript
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
