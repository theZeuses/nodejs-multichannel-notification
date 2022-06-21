import { EmailRequest} from 'notifme-sdk';
import { resetPasswordEmailDigestJob } from '@jobs/ResetPasswordEmailDigestJob';
import { BaseNotification } from './BaseNotification';
import generateView from '@views/notifications/PasswordResetRequestView';
import { JobOptions } from 'bull';

export class PasswordResetRequestNotification extends BaseNotification {
    protected get queue() : "redis" | "none" {
        return "redis";
    }
    protected get channels(){
        return ["mail"];
    }
    protected async jobProducer(data: any, options?: JobOptions){
        await resetPasswordEmailDigestJob.produce(data, options);
    }
    protected MailFormat(receiver: any, payload?: any) : Partial<EmailRequest> {
        return {
            subject: "Password Reset Request",
            html: generateView(payload)
        }
    }
}