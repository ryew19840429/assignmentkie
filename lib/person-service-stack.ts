import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import cdk = require('aws-cdk-lib');
import * as sns from 'aws-cdk-lib/aws-sns';
export class PersonServiceStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const topic = new sns.Topic(this, 'person-created', {
            topicName: 'person-created-topic',
            displayName: 'Person Created SNS Topic',
        });

        const table = new Table(this, 'Person', {
            tableName: 'Person',
            partitionKey: { name: 'phoneNumber', type: AttributeType.NUMBER },
        });

        const createPersonLambda = new NodejsFunction(this, 'createPersonHandler', {
            runtime: Runtime.NODEJS_14_X,
            timeout: cdk.Duration.seconds(300),
            entry: path.join(__dirname, `/../src/domain/person/functions/create-person.ts`),
            handler: 'createPersonHandler',
            bundling: {
                externalModules: ['aws-sdk'],
                nodeModules: ['aws-sdk'],
            },
            environment: {
                AWS_HOST: process.env.AWS_HOST ?? '',
                TABLE_NAME: table.tableName,
                SNS_TOPIC_ARN: topic.topicArn,
                REGION: 'eu-west-1',
            },
        });

        table.grantReadWriteData(createPersonLambda);

        const api = new apigateway.LambdaRestApi(this, 'person-api', {
            handler: createPersonLambda,
            proxy: false,
        });

        const person = api.root.addResource('person');

        person.addMethod('PUT', new apigateway.LambdaIntegration(createPersonLambda));
    }
}
