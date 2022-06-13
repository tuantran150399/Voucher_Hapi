import { MongoError, MongoClient } from "mongodb";
import { ClientSession } from "mongoose";

export async function commitWithRetry(session: ClientSession) {
  try {
    await session.commitTransaction();
    console.log("Transaction committed.");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else if (
      error instanceof MongoError &&
      error.hasErrorLabel("UnknownTransactionCommitResult")
    ) {
      console.log(
        "UnknownTransactionCommitResult, retrying commit operation ..."
      );
      await commitWithRetry(session);
    } else {
      console.log("Error during commit ...");
      throw error;
    }
  }
}
// export async function runTransactionWithRetry(txnFunc: (arg0: MongoClient, arg1: ClientSession) => any, client:MongoClient, session: ClientSession) {
//     try {
//       await txnFunc(client, session);
//     } catch (error) {
//       console.log('Transaction aborted. Caught exception during transaction.');

//       // If transient error, retry the whole transaction
//       if (error.hasErrorLabel('TransientTransactionError')) {
//         console.log('TransientTransactionError, retrying transaction ...');
//         await runTransactionWithRetry(txnFunc, client, session);
//       } else {
//         throw error;
//       }
//     }
//   }
