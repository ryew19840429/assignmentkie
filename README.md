# Assignmentkie

## Introduction
Hi! Thank you for the interesting assignment. Had fun learning CDK. Looking forward to discuss it more with you all!

## Local Development
The whole development was done using Localstack to make iteration quick and cost free. A docker-compose.yml is available in the localstack folder for reference. To get it up and running, simple use `docker-compose up`.

Upon deploying to localstack, you will get the actual api endpoint: 
`https://clgy3se17b.execute-api.localhost.localstack.cloud:4566/prod/`

To test out on postman, follow this example pattern:
`http://localhost:4566/restapis/clgy3se17b/prod/_user_request_/person`

## Architecture overview
For this assignment:
api gateway -> lambda -> dynamodb -> sns

For high throughput, probably:
api gateway -> lambda -> sns (so other services can use this api call event) -> sqs (to buffer inserts) -> lambda -> dynamodb -> sns

## Useful commands
* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npm run lint`    runs linting
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

`cdk` can be replaced with `cdklocal` for localstack deployement. More info here: https://github.com/localstack/aws-cdk-local

## Todos
* E2E testing: Would use Localstack as the test platform. A get person service will be added that can query the newly created person. Additionally a testing lambda subscribed to the SNS would also be needed to ensure that the SNS topic was raised after person was created.

## Extras
For my previous employer, I designed and developed a serverless ETL pipeline on AWS:
https://hoteltechreport.com/news/oaky-and-ota-insight-integration
