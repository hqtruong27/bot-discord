import { CronJob } from 'cron'
import { discord } from '../discord'
export const BackgroundTask = {
    /**
     *
     * @param {String} cronTime
     * @param {Function} callback
     */
    schedule: (cronTime, callback) => {
        const job = new CronJob(
            cronTime,
            callback,
            null,
            false,
            'Asia/Bangkok'
        )

        job.start()
    }
}

BackgroundTask.schedule(
    '0 10 * * *',
    async () => await discord.sendRandomQuotesToChannel()
)