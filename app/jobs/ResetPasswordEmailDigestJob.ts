import { Queue } from "bull";
import { resetPasswordQueue as queue } from "@queues/ResetPasswordQueue";
import { EmailRequest, NotificationStatus } from 'notifme-sdk';
import { sendEmail } from "@helpers/notifmeHelper";
import { BaseJob } from "./BaseJob";

class ResetPasswordEmailDigestJob extends BaseJob<EmailRequest>
{
    constructor(queue: Queue, job_name: string){
        super(queue, job_name);
    }

    protected async consumer(data: EmailRequest): Promise<NotificationStatus> {
        return await sendEmail(data);
    }
}

export const resetPasswordEmailDigestJob = new ResetPasswordEmailDigestJob(queue, 'reset-password-digest-email');