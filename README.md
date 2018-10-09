## Async Map In Batches

[![CircleCI][circleci-badge]][circleci-href]
[![NPM][npm-version-badge]][npm-href]
[![BundlePhobia][bundlephobia-badge]][bundlephobia-href]

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

### Input

- inputArray: Array<T> (required)
- asyncIterator: async (val:any, i:number) => V (required)
- batchSize: number (optional)
- onBatch: (batchNumber:number, batchCount: number) => void

### Output

outputArray: Array<V>

### Signature

```typescript
async function asyncMapInChunks<T, V>(
  array: Array<T>,
  asyncMap: AsyncMapIterator<T, V>,
  batchSize: number = 20,
  onBatch: (batchNumber: number, batchCount: number) => void = () => {}
): Promise<Array<V>>;
```

[circleci-href]: https://circleci.com/gh/rakannimer/async-map-in-batches
[circleci-badge]: https://img.shields.io/circleci/project/github/rakannimer/async-map-in-batches.svg
[npm-href]: https://www.npmjs.com/package/async-map-in-batches
[npm-version-badge]: https://img.shields.io/npm/v/async-map-in-batches.svg
[npm-license-badge]: https://img.shields.io/github/license/rakannimer/async-map-in-batches.svg
[bundlephobia-badge]: https://img.shields.io/bundlephobia/minzip/async-map-in-batches.svg
[bundlephobia-href]: https://bundlephobia.com/result?p=async-map-in-batches
