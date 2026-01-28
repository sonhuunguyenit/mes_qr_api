import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from "typeorm-transactional";
export function setupTransactionContext() {
  initializeTransactionalContext();
}

export { addTransactionalDataSource };
