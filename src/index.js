const {Counter, Gauge, Histogram, Registry} = require("prom-client");
const globalRegister = new Registry();

const initHooks = ({init}, {services, getSchema, database, logger, env}) => {
    const PROMETHEUS_METRICS_ENDPOINT = env.PROMETHEUS_METRICS_ENDPOINT || '/metrics';

    init('app.before', async ({app}) => {
        const requestCount = new Counter({
            name: 'directus_request_count',
            help: 'The total number of http requests',
            registers: [globalRegister],
            labelNames: ['method', 'status']
        });

        const itemsRequestCount = new Counter({
            name: 'directus_items_request_count',
            help: 'The number of http requests to directus items',
            registers: [globalRegister],
            labelNames: ['method', 'status', 'collection']
        });

        const requestDuration = new Histogram({
            name: 'directus_request_duration_seconds',
            help: 'The total duration of http requests',
            registers: [globalRegister],
            labelNames: ['method', 'status']
        });

        const itemsRequestDuration = new Histogram({
            name: 'directus_items_request_duration_seconds',
            help: 'The total duration of http requests to directus items',
            registers: [globalRegister],
            labelNames: ['method', 'status', 'collection']
        });

        app.use('/', (req, res, next) => {
            const recordDuration = requestDuration.startTimer({
                method: req.method
            });

            const recordItemsDuration = itemsRequestDuration.startTimer({
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

                if (req.collection && !req.collection.startsWith('directus_')) {
                    itemsRequestCount.labels({
                        status,
                        method: req.method,
                        collection: req.collection
                    }).inc(1);

                    recordItemsDuration({
                        status,
                        collection: req.collection
                    });
                }
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
            registers: [globalRegister],
            labelNames: ['collection']
        });

        app.use(PROMETHEUS_METRICS_ENDPOINT, async (req, res, next) => {
            try {
                const allCollections = await collections.readByQuery();

                await Promise.all(allCollections
                    .map((c) => c.collection)
                    .map(async (collection) => {
                        try {
                            const count = await meta.totalCount(collection);
                            collectionSize.labels({collection}).set(count);
                        } catch (e) {
                            logger.debug(e);
                        }
                    }));
                res.set('Content-Type', globalRegister.contentType);
                res.send(await globalRegister.metrics());
            } catch (e) {
                console.error(e);
                next(e);
            }
        });
    });
};

module.exports = initHooks;
module.exports.globalRegister = globalRegister;