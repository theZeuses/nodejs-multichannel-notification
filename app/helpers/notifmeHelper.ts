import NotifmeSdk, { EmailRequest, Notification, NotificationStatus } from 'notifme-sdk';
import { config } from '@configs/notifme';

var notifme: NotifmeSdk = new NotifmeSdk({});

export const initializeNotifme = () => {
    notifme = new NotifmeSdk(config);
}

export async function sendEmail(email: EmailRequest) : Promise<NotificationStatus> {
    try{
        return await notifme.send({email});
    }catch(err){
        throw(err);
    }
}

export async function send(notification_requests: Notification) : Promise<NotificationStatus> {
    try{
        return await notifme.send(notification_requests);
    }catch(err){
        throw(err);
    }
}

export default notifme;