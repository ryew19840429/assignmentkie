import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as PersonService from '../../lib/person-service-stack';

test('Resources are created', () => {
    const app = new cdk.App();
    const stack = new PersonService.PersonServiceStack(app, 'MyTestStack');

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DynamoDB::Table', {
        KeySchema: [
            {
                AttributeName: 'phoneNumber',
                KeyType: 'HASH',
            },
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'phoneNumber',
                AttributeType: 'N',
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
        },
        TableName: 'Person',
    });
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
        Name: 'person-api',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'index.createPersonHandler',
        Runtime: 'nodejs14.x',
        Environment: {
            Variables: {
                AWS_HOST: '',
                TABLE_NAME: {
                    Ref: 'Person2ADBFF2C',
                },
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            },
        },
        Timeout: 300,
    });
});
