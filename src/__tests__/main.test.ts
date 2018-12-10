import asyncMapInBatches from "../index";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const testFromInput = async ({
  INPUT_SIZE,
  BATCH_SIZE,
  testBatch = true
}: any) => {
  const inputArray = Array.from({ length: INPUT_SIZE }, (v, i) => {
    return `${i}`;
  });
  const expectedOutput = inputArray;
  let callCount = 0;
  let onBatchCallCount = 0;
  const asyncMapIterator = jest.fn().mockImplementation(async i => {
    callCount++;
    await delay(i);
    return `${i}`;
  });
  //
  const onBatch = jest
    .fn()
    .mockImplementation((batchNumber: number, batchCount: number) => {
      onBatchCallCount++;
    });

  const output = await asyncMapInBatches(
    INPUT_SIZE,
    asyncMapIterator,
    BATCH_SIZE,
    testBatch ? onBatch : undefined
  );
  expect(output).toEqual(expectedOutput);
  expect(callCount).toEqual(INPUT_SIZE);
  if (testBatch) {
    expect(onBatchCallCount).toEqual(
      Math.ceil(INPUT_SIZE / (BATCH_SIZE ? BATCH_SIZE : 20))
    );
  }
};

const testAsyncOnBatchFromInput = async ({ INPUT_SIZE, BATCH_SIZE }: any) => {
  const inputArray = Array.from({ length: INPUT_SIZE }, (v, i) => {
    return `${i}`;
  });
  const expectedOutput = inputArray;
  let callCount = 0;
  let onBatchCallCount = 0;
  const asyncMapIterator = jest.fn().mockImplementation(async i => {
    callCount++;
    await delay(i);
    return `${i}`;
  });
  const onBatch = jest
    .fn()
    .mockImplementation(async (batchNumber: number, batchCount: number) => {
      await delay(batchCount);
      onBatchCallCount++;
    });

  const output = await asyncMapInBatches(
    INPUT_SIZE,
    asyncMapIterator,
    BATCH_SIZE,
    onBatch
  );
  expect(output).toEqual(expectedOutput);
  expect(callCount).toEqual(INPUT_SIZE);
  expect(onBatchCallCount).toEqual(
    Math.ceil(INPUT_SIZE / (BATCH_SIZE ? BATCH_SIZE : 20))
  );
};

describe("asyncMapInBatches", () => {
  test("exports", () => {
    expect(asyncMapInBatches).toBeTruthy();
  });
  test("works 1", async () => {
    const INPUT_SIZE = 50;
    const BATCH_SIZE = 10;
    await testFromInput({ INPUT_SIZE, BATCH_SIZE });
  });
  test("works 2", async () => {
    const INPUT_SIZE = 51;
    const BATCH_SIZE = 12;
    await testFromInput({ INPUT_SIZE, BATCH_SIZE });
  });
  test("works without batchSize", async () => {
    const INPUT_SIZE = 51;
    await testFromInput({ INPUT_SIZE, BATCH_SIZE: undefined });
  });
  test("works without onBatch", async () => {
    const INPUT_SIZE = 51;
    await testFromInput({ INPUT_SIZE, BATCH_SIZE: 10, testBatch: false });
  });
  test("works with async onBatch", async () => {
    const INPUT_SIZE = 51;
    await testAsyncOnBatchFromInput({
      INPUT_SIZE,
      BATCH_SIZE: 10
    });
  });
  test("works with async onBatch on edge case", async () => {
    const INPUT_SIZE = 50;
    await testAsyncOnBatchFromInput({
      INPUT_SIZE,
      BATCH_SIZE: 10
    });
  });
});
