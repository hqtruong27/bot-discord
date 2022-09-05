import { CronJob } from 'cron'
import DiscordService from '../services/discordService'

export default class BackgroundTask {
    static schedule = (cronExpression, callback) => {
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

BackgroundTask.schedule(
    '0 8 * * *',
    async () => await DiscordService.sendRandomQuotesToChannel()
)