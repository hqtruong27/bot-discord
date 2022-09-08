import { CronJob } from 'cron'
export const BackgroundTask = {
    schedule: (cronExpression, callback) => {
        const job = new CronJob(
            cronExpression,
            callback,
            null,
            false,
            'Asia/Bangkok'
        )

        job.start()
    }
}