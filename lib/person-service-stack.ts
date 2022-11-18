import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class PersonServiceStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const table = new Table(this, 'Person', {
            partitionKey: { name: 'phoneNumber', type: AttributeType.NUMBER },
        });

        const getPersonLambda = new NodejsFunction(this, 'personLambdaHandler', {
            runtime: Runtime.NODEJS_14_X,
            entry: path.join(__dirname, `/../src/domain/person/functions/get-person.ts`),
            handler: 'getPerson',
            environment: {
                HELLO_TABLE_NAME: table.tableName,
            },
            bundling: {
                externalModules: ['aws-sdk'],
                nodeModules: ['aws-sdk'],
            },
        });

        const createPersonLambda = new NodejsFunction(this, 'createPersonHandler', {
            runtime: Runtime.NODEJS_14_X,
            entry: path.join(__dirname, `/../src/domain/person/functions/create-person.ts`),
            handler: 'createPersonHandler',
            environment: {
                HELLO_TABLE_NAME: table.tableName,
            },
            bundling: {
                externalModules: ['aws-sdk'],
                nodeModules: ['aws-sdk'],
            },
        });

        table.grantReadWriteData(getPersonLambda);

        const api = new apigateway.RestApi(this, 'api');

        const person = api.root.addResource('person');
        person.addMethod('GET', new apigateway.LambdaIntegration(getPersonLambda, { proxy: true }));
        person.addMethod('POST', new apigateway.LambdaIntegration(createPersonLambda, { proxy: true }));
    }
}
