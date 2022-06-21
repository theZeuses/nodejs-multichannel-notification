import { EmailRequest, NotificationStatus } from 'notifme-sdk';
import app_config from '@configs/app_config';
import { intersection } from "lodash";
import { sendEmail } from '@helpers/notifmeHelper';

type EmailData = {
    email?: string
}

type NotificationData = EmailData;

export abstract class BaseNotification {
    //generic properties to be handled by child classes
    /**
     * overload the getter returning array of channels through which this notification can be sent. Possible channel are mail
     * @date 2022-06-21
     * @returns {Array<string>} ["mail"]
     */
    protected get channels() : Array<string>{
        //if any custom logic
        return ["mail"];
    }
    
    /**
     * overload the getter returning queue broker name that will be used when the notification is submitted. can be either redis or none
     * @date 2022-06-21
     * @returns {string} "redis" | "none"
     */
    protected get queue() : "redis" | "none" {
        //if any custom logic
        return "none";
    }

    /**
     * overload the function to call the function which can add the job on queue for the notification. 
     * this function must be implemented if queue getter is returning anything other than none
     * @date 2022-06-21
     * @param {any} data EmailRequest
     * @param {[any]} [options] Options
     * @returns {Promise}
     */
    protected async jobProducer(data: any, options?: any){
        throw new Error('Since you are using queue, jobProducer function must be implemented');
    }

    /**
     * overload the function generate html view configuration of the e-mail
     * @date 2022-06-21
     * @param {any} receiver any
     * @param {any} payload any
     * @returns {Partial<EmailRequest>}
     */
    protected abstract MailFormat(receiver: any, payload?: any) : Partial<EmailRequest>;

    //base class specific functions to handle mail
    /**
     * generates mail configuration by combining overloaded values and default ones
     * @date 2022-06-21
     * @param {any} receiver any
     * @param {any} payload any
     * @returns {any}
     */
    protected GenerateMailFormat(receiver: any, payload?: any){
        return {
            from: app_config?.email_from ?? 'sender@goes.here',
            to: receiver.email,
            subject: "Subject Goes Here",
            ...this.MailFormat(receiver.receiver, payload)
        }
    }

    /**
     * send email notification to the receiver
     * @date 2022-06-21
     * @param {any} data Object
     * @returns {Promise}
     */
    async mail(data: {receiver?: EmailData, payload?: any, delay?: string, sync?: boolean, email?: string}){
        if(!data.receiver) data.receiver = {};
        if(!data.receiver.email){
            if(!data.email) throw new Error('Receiver object must contain email or email must be passed explicitly');
    
            data.receiver.email = data.email;
        }
        if(data.sync){
            return await sendEmail(this.GenerateMailFormat(data.receiver, data.payload) as EmailRequest);
        }else{
            return await this.processQueue({ channel: "mail", queue: this.queue, request: this.GenerateMailFormat(data.receiver, data.payload), delay: data.delay});
        }
    }

    /**
     * notify receiver through multiple channel 
     * @date 2022-06-21
     * @param {any} data object
     * @returns {Promise}
     */
    async notify(data: { receiver?: NotificationData, payload?: any, delay?: string, channels?: ["mail"] | string[], mediums?: {email?: string} }){
        try{
            if(!data.channels){
                data.channels = this.channels;
            }else{
                data.channels = intersection(data.channels, this.channels);
            }
            let response: {
                mail?: NotificationStatus
            } = {}; 
            await Promise.all(data.channels.map( async channel => {
                if(channel == 'mail'){
                    response.mail = await this.mail({receiver: data.receiver, delay: data.delay, payload: data.payload, email: data.mediums?.email});
                }
            }));

            return response;
        }catch(err){
            throw(err);
        }
    }

    /**
     * process the queue to send notifications
     * @date 2022-06-21
     * @param {any} data Object
     * @returns {Promise}
     */
    protected async processQueue(data: {channel: "mail", queue: "none" | "redis", request: any, delay?: string}) {
        if(data.queue == 'none'){
            return await sendEmail(data.request);
        }else if(data.queue == 'redis'){
            //TODO: make jobOptions based on delay and pass that to jobProducer
            //so that delayed notifications can be achieved
            await this.jobProducer(data.request); 
            return {
                status: "success",
                info: 'Request has been added to the queue'
            } as NotificationStatus;
        }
    }
}