# Serverless API Schema

[![Build Status](https://travis-ci.org/janis-commerce/sls-api-schema.svg?branch=master)](https://travis-ci.org/janis-commerce/sls-api-schema)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/sls-api-schema/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/sls-api-schema?branch=master)

An integration handler for Serverless and JANIS Views API Schema

# Installation

```
npm install @janiscommerce/sls-api-schema
```

# Usage

```js
'use strict';

const { SlsApiSchema } = require('@janiscommerce/sls-api-schema');

module.exports.handler = (...args) => SlsApiSchema.handler(...args);
```

# Function minimal configuration

```yml
functions:
  handler: path/to/your.handler
  events:
    - http:
        integration: lambda
        path: view/{entity}/{action}/schema
        method: GET
        package:
          include:
            - path/to/view-schemas/**
        request:
          parameters:
            paths:
              entity: true
              action: true
```