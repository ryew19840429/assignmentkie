import { Person, PersonEvent } from '../models/person.model';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const handlerResponse = (body: string, statusCode: number): APIGatewayProxyResult => {
    const bodyResponse = JSON.stringify(body);
    return {
        statusCode,
        body: bodyResponse,
    };
};

const putPerson = async (personToPut: Person, tableName: string, dynamoClient: DynamoDB.DocumentClient) => {
    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: {
            phoneNumber: personToPut.phoneNumber ?? null,
            firstName: personToPut.firstName ?? '',
            lastName: personToPut.lastName ?? '',
            address: personToPut.address ?? '',
        },
    };
    await dynamoClient.put(params).promise();
};

const raisePersonCreatedEvent = async (response: PersonEvent, snsClient: SNSClient, topicArn: string) => {
    const publishCommand = new PublishCommand({
        Message: JSON.stringify(response),
        TopicArn: topicArn,
    });
    await snsClient.send(publishCommand);
};

export const PersonService = {
    handlerResponse,
    putPerson,
    raisePersonCreatedEvent,
};
