import { Handler } from 'aws-lambda';

import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME = 'Person';

export const createPersonHandler: Handler = async (event) => {
    return {
        body: JSON.stringify('person created'),
        statusCode: 200,
    };
};
