interface BatchItem<T, R> {
  input: T;
  resolve: (result: R) => void;
  reject: (error: Error) => void;
}

export class BatchProcessor<T, R> {
  private batchSize: number;
  private batchTimeout: number;
  private currentBatch: BatchItem<T, R>[] = [];
  private timeoutId: NodeJS.Timeout | null = null;
  private processingFunction: (inputs: T[]) => Promise<R[]>;

  constructor(
    processingFunction: (inputs: T[]) => Promise<R[]>,
    batchSize: number = 10,
    batchTimeout: number = 100
  ) {
    this.processingFunction = processingFunction;
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
  }

  public async add(input: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.currentBatch.push({ input, resolve, reject });

      if (this.currentBatch.length >= this.batchSize) {
        this.processBatch();
      } else if (!this.timeoutId) {
        this.timeoutId = setTimeout(() => this.processBatch(), this.batchTimeout);
      }
    });
  }

  private async processBatch() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const batchToProcess = [...this.currentBatch];
    this.currentBatch = [];

    try {
      const inputs = batchToProcess.map(item => item.input);
      const results = await this.processingFunction(inputs);

      if (results.length !== batchToProcess.length) {
        throw new Error('Results length does not match inputs length');
      }

      batchToProcess.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batchToProcess.forEach(item => {
        item.reject(error as Error);
      });
    }
  }

  public clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.currentBatch = [];
  }
} 