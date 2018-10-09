import asyncMapInBatches from "../index";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const testFromInput = async ({
  INPUT_SIZE,
  BATCH_SIZE,
  testBatch = true
}: any) => {
  const inputArray = Array.from({ length: INPUT_SIZE }, (v, i) => {
    return i * 1;
  });
  const expectedOutput = inputArray.map((el, i) => `${el}_${i}`);
  let callCount = 0;
  let onBatchCallCount = 0;
  const asyncMapIterator = jest.fn().mockImplementation(async (el, i) => {
    callCount++;
    await delay(el);
    return `${el}_${i}`;
  });
  //
  const onBatch = jest
    .fn()
    .mockImplementation((batchNumber: number, batchCount: number) => {
      onBatchCallCount++;
    });
  const output = await asyncMapInBatches(
    inputArray,
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
});
