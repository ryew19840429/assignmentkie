import { APIGatewayEvent, APIGatewayProxyEvent, Context } from 'aws-lambda';
import AWS = require('aws-sdk');
import AWSMock = require('aws-sdk-mock');
import { PutItemInput } from 'aws-sdk/clients/dynamodb';
import { createPersonHandler } from '../../../../../src/domain/person/functions/create-person';
import { PersonService } from '../../../../../src/domain/person/services/person.services';

const putPersonSpy = jest.spyOn(PersonService, 'putPerson');

const mockContext: Context = {
    awsRequestId: 'dummyAwsRequestId',
} as Context;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCallback = {} as any;

beforeEach(() => {
    process.env.AWS_REGION = 'eu-west-1';
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('CreatePersonHandler', () => {
    test('method: handlerResponse when body is empty', async () => {
        AWSMock.setSDKInstance(AWS);
        // eslint-disable-next-line @typescript-eslint/ban-types
        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => {
            callback(null, {});
        });

        const mockEvent: APIGatewayEvent = {
            body: '',
        } as APIGatewayEvent;
        const response = await createPersonHandler(mockEvent, mockContext, mockCallback);
        expect(response).toStrictEqual({ statusCode: 400, body: '"no person data given"' });
    });

    test('method: handlerResponse when phone number is missing', async () => {
        AWSMock.setSDKInstance(AWS);
        // eslint-disable-next-line @typescript-eslint/ban-types
        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => {
            callback(null, {});
        });

        const mockEvent: APIGatewayEvent = {
            body: '{"firstName":"john","lastName":"joe","address":"somewhere out there"}',
        } as APIGatewayEvent;
        const response = await createPersonHandler(mockEvent, mockContext, mockCallback);
        expect(response).toStrictEqual({ statusCode: 400, body: '"phone number is required"' });
    });
});
