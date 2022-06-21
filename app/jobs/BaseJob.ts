import { Job, JobOptions, Queue } from "bull";

export abstract class BaseJob<IData>
{
    protected queue: Queue;
    protected job_name: string;
    protected defaultJobOpts: JobOptions = {
        removeOnComplete: true
    };

    /**
     * creates named job on given queue 
     * @date 2022-06-21
     * @param {any} queue Queue
     * @param {any} job_name string
     * @returns {Object}
     */
    constructor(queue: Queue, job_name: string){
        this.queue = queue;
        this.job_name = job_name;

        this.onCompleteListener();
        this.onErrorListener();
        this.consume();
    }

    /**
     * producer to add job on queue
     * @date 2022-06-21
     * @param {any} data:IData
     * @param {any} options?:JobOptions
     * @returns {any}
     */
    async produce(data: IData, options?: JobOptions){
        return await this.queue.add(this.job_name, data, {...this.defaultJobOpts, ...options});
    }

    /**
     * overload the function to call the function which will process the actual intended work on the data
     * @date 2022-06-21
     * @param {any} data:IData
     * @returns {Promise}
     */
    protected async consumer(data: IData): Promise<any> {
        throw new Error('Either consume or consumer must be overloaded');
    };

    /**
     * overload the function to define a custom consumer specific to job
     * @date 2022-06-21
     * @returns {Promise}
     */
    protected async consume(){
        return this.queue.process(this.job_name, async (job, done) => {
            try{
                done(null, await this.consumer(job.data));
            }catch(err){
                done(new Error("Failed"));
            }
        });
    }

    /**
     * overload this function to define a custom callback specific to job of on complete listener
     * @date 2022-06-21
     * @param {any} job:Job
     * @param {any} result:IData
     * @returns {Promise}
     */
    protected async onComplete(job: Job, result: IData){
        try{
            console.log(`${job.name} is successful with result: ${result}. Job id: ${job.id}. Ref Id: ${job.data.id}`);
            return;
        }catch(err){
            console.log(err);
        }
    }

    /**
     * overload this function to define a custom callback specific to job of on error listener
     * @date 2022-06-21
     * @param {any} error:Error
     * @returns {Promise}
     */
    protected async onError(error: Error){
        console.log(error.message);
    }

    /**
     * listens to on complete event
     * @date 2022-06-21
     * @returns {any}
     */
    protected onCompleteListener(){
        this.queue.on("completed", async (job, result) => {
            await this.onComplete(job, result);
        });
    }

    /**
     * listens to on error event
     * @date 2022-06-21
     * @returns {any}
     */
    protected onErrorListener(){
        this.queue.on("error", async (error) => {
            await this.onError(error);
        });
    }
}