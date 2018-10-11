type AsyncMapIterator<V> = (i: number) => Promise<V>;

// asyncMapInBatches
async function asyncMapInChunks<V>(
  operationCount: number,
  asyncMap: AsyncMapIterator<V>,
  batchSize: number = 20,
  onBatch: (batchNumber: number, batchCount: number) => void = () => {}
): Promise<Array<V>> {
  const batchCount = Math.ceil(operationCount / batchSize);
  let result = [] as Array<V>;
  for (let i = 0; i < batchCount; i += 1) {
    const currentBatchOperations = [];
    onBatch(i, batchCount);
    for (let j = 0; j < batchSize; j += 1) {
      const operationIndex = i * batchSize + j;
      if (operationIndex >= operationCount) {
        break;
      }
      currentBatchOperations.push(asyncMap(operationIndex));
    }
    const currentBatchOperationsResults = await Promise.all(
      currentBatchOperations
    );
    result = result.concat(currentBatchOperationsResults);
  }
  return result;
}
export default asyncMapInChunks;
