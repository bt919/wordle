import awsLambdaFastify from "@fastify/aws-lambda";
const app = require("./index");

const proxy = awsLambdaFastify(app);

export default proxy;
