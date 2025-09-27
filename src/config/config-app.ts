export const configLoader = () => {
    const env = process.env;
    return {
        port: env.APP_PORT,
        apiKey: env.API_KEY,
        environment: env.NODE_ENV,
        frontendDomain: env.FRONTEND_DOMAIN,
        backendDomain: env.BACKEND_DOMAIN ?? 'http://localhost:' + env.APP_PORT,
        db: {
            type: env.DB_TYPE,
            dbname: env.DB_NAME,
            username: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            port: env.DB_PORT,
            hostname: env.DB_HOST
        },
        payment: {
            loginKey: env.LOGINKEY,
            secretKey: env.SECRETKEY,
            endpoint: env.ENDPOINT
        }
    }
}