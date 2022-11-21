import { APIGatewayEvent, Context } from 'aws-lambda';
import { createPersonHandler } from '../../../../../src/domain/person/functions/create-person';
import { PersonService } from '../../../../../src/domain/person/services/person.services';
const putPersonSpy = jest.spyOn(PersonService, 'putPerson').mockImplementation(jest.fn());

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
        const mockEvent: APIGatewayEvent = {
            body: '',
        } as APIGatewayEvent;
        const response = await createPersonHandler(mockEvent, mockContext, mockCallback);
        expect(response).toStrictEqual({ statusCode: 400, body: '"no person data given"' });
    });

    test('method: handlerResponse when phone number is missing', async () => {
        const mockEvent: APIGatewayEvent = {
            body: '{"firstName":"john","lastName":"joe","address":"somewhere out there"}',
        } as APIGatewayEvent;
        const response = await createPersonHandler(mockEvent, mockContext, mockCallback);
        expect(response).toStrictEqual({ statusCode: 400, body: '"phone number is required"' });
    });

    test('method: handlerResponse when full person data is given', async () => {
        const mockEvent: APIGatewayEvent = {
            body: '{"firstName":"john","lastName":"joe","address":"somewhere out there", "phoneNumber": 123456}',
        } as APIGatewayEvent;
        const response = await createPersonHandler(mockEvent, mockContext, mockCallback);
        expect(response).toStrictEqual({ body: '"person created with phone number: 123456"', statusCode: 200 });
        expect(putPersonSpy).toBeCalled();
    });
});
