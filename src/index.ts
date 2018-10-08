type AsyncMapIterator<T, V> = (v: T, i: number) => Promise<V>;

// asyncMapInBatches
export async function asyncMapInChunks<T, V>(
  array: Array<T>,
  asyncMap: AsyncMapIterator<T, V>,
  batchSize: number = 20,
  onBatch: (batchNumber: number, batchCount: number) => void = () => {}
): Promise<Array<V>> {
  const operationCount = array.length;
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
      currentBatchOperations.push(
        asyncMap(array[operationIndex], operationIndex)
      );
    }
    const currentBatchOperationsResults = await Promise.all(
      currentBatchOperations
    );
    result = result.concat(currentBatchOperationsResults);
  }
  return result;
}
