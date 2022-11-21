import { Person, PersonEvent } from '../../../../../src/domain/person/models/person.model';
import { PersonService } from '../../../../../src/domain/person/services/person.services';
import AWS = require('aws-sdk');
import AWSMock = require('aws-sdk-mock');
import { PutItemInput } from 'aws-sdk/clients/dynamodb';
import { SNSClient } from '@aws-sdk/client-sns';

beforeEach(() => {
    process.env.AWS_REGION = 'eu-west-1';
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('PersonService', () => {
    test('method: handlerResponse', () => {
        const handlerResponseResult = PersonService.handlerResponse('test response', 200);
        expect(handlerResponseResult).toStrictEqual({ body: 'test response', statusCode: 200 });
    });

    test('method: putPerson', async () => {
        AWSMock.setSDKInstance(AWS);
        // eslint-disable-next-line @typescript-eslint/ban-types
        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => {
            callback(null, {});
        });
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const personMock: Person = {
            phoneNumber: 123456,
            firstName: 'john',
            lastName: 'doe',
            address: 'somewhere',
        };
        const putSpy = jest.spyOn(dynamodb, 'put');
        await PersonService.putPerson(personMock, 'testTableName', dynamodb);
        expect(putSpy).toBeCalledWith({
            Item: { address: 'somewhere', firstName: 'john', lastName: 'doe', phoneNumber: 123456 },
            TableName: 'testTableName',
        });
    });

    test('method: raisePersonCreatedEvent', async () => {
        const snsClient = new SNSClient({});
        const personEventMock: PersonEvent = {
            action: 'test action',
            phoneNumber: 123456,
        };
        const sendSpy = jest.spyOn(snsClient, 'send').mockImplementation(jest.fn());
        await PersonService.raisePersonCreatedEvent(personEventMock, snsClient, 'test:arn');
        expect(sendSpy).toBeCalled();
    });
});
