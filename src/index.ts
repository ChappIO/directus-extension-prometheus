import {defineHook} from '@directus/extensions-sdk';
import {Counter, Gauge, Histogram, Registry} from "prom-client";
import {NextFunction, Request, Response} from "express";

export default defineHook(({init}, {services, getSchema, database, env}) => {
    const PROMETHEUS_METRICS_ENDPOINT = env.PROMETHEUS_METRICS_ENDPOINT || '/metrics';
    const register = new Registry();

    init('app.before', async ({app}) => {
        const requestCount = new Counter({
            name: 'directus_request_count',
            help: 'The total number of http requests',
            registers: [register],
            labelNames: ['method', 'status']
        });
        const requestDuration = new Histogram({
            name: 'directus_request_duration_seconds',
            help: 'The total duration of http requests',
            registers: [register],
            labelNames: ['method', 'status']
        });
        app.use('/', (req: Request, res: Response, next: NextFunction) => {
            const recordDuration = requestDuration.startTimer({
                method: req.method
            });

            res.on('finish', () => {
                const status = res.statusCode?.toString() || '';
                requestCount.labels({
                    status,
                    method: req.method,
                }).inc(1);
                recordDuration({
                    status,
                });
            });
            next();
        });
    });

    init('middlewares.after', async ({app}) => {
        const accountability = {
            admin: true
        };
        const collections = new services.CollectionsService({
            knex: database,
            schema: await getSchema(),
            accountability,
        });
        const meta = new services.MetaService({
            knex: database,
            schema: await getSchema(),
            accountability,
        });

        const collectionSize = new Gauge({
            name: 'directus_collection_size',
            help: 'The total number of items in each collection',
            registers: [register],
            labelNames: ['collection']
        });

        app.use(PROMETHEUS_METRICS_ENDPOINT, async (_req: Request, res: Response, next: NextFunction) => {
            try {
                let jobs = [];

                // get collection count
                jobs.push(
                    ...(await collections.readByQuery())
                        .map((c: any) => c.collection)
                        .map(async (collection: string) => {
                            const count = await meta.totalCount(collection);
                            collectionSize.labels({collection}).set(count);
                        })
                )

                await Promise.all(jobs);
                res.set('Content-Type', register.contentType);
                res.send(await register.metrics());
            } catch (e) {
                console.error(e);
                next(e);
            }
        });
    });
});
