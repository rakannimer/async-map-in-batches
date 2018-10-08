## Async Map In Batches

## The Problem

Your code needs to do a lot of IO work to map some input to some other output after some async processing.

## This Solution

Iterate over an array and map it to a new one with an async iterator in batches.

## Install

```sh
  yarn add async-map-in-batches
```

## Usage

```typescript
import asyncMapInBatches from "async-map-in-batches";

// Given an array of elements
const inputArray = Array.from({ length: 100 }, (v, i) => i);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const outputArray = await asyncMapInBatches(inputArray, async i => {
  await delay(i);
  return { i };
});
// [{i: 0}, {i: 1}...{i: 100}]
```

## API

### Input :

- a: number (required)
- b: number (required)

### Output :

c : number
