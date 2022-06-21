import Queue from "bull";
import { etherealMailer } from "./mailer";
import { handleError } from "./handleError";

const EmailQueue = new Queue("send new voucher", "redis://127.0.0.1:6379");
const options = {
  removeOnComplete: true, // removes job from queue on success
  removeOnFail: true, // removes job from queue on failure
};
export const voucherNotify = async (data: string) => {
  try {
    //console.log(data)
    const data2 = { code: data };
    EmailQueue.add(data2, options);
  } catch (error) {
    console.log(error);
  }
};
EmailQueue.on("global:completed", function (job, result) {
  console.log(`Job with id ${job.id} has been completed`);
});
EmailQueue.on("global:failed", async function (job, error) {
  console.log("Failed: Job-" + job.id);
});
EmailQueue.process(async (job, done) => {
  try {
    await job.progress(42);
    await etherealMailer(job.data.code);
  } catch (error) {
    handleError(error);
  } finally {
    done();
  }
});
