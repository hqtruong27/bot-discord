export const apps = [{
    name: "app",
    script: "./app.js --node-args=\"--require dotenv/config --experimental-fetch --experimental-modules --es-module-specifier-resolution=node\"",
    env: {
        NODE_ENV: "development",
    },
    env_production: {
        NODE_ENV: "production",
    }
}]