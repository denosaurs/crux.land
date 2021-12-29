import { ApiFactory, DynamoDB } from "./deps.ts";
import {
  DYNAMO_ACCESS_KEY_ID,
  DYNAMO_REGION,
  DYNAMO_SECRET_ACCESS_KEY,
  DYNAMO_USER_TABLE,
} from "../util/constants.ts";

export const client = new ApiFactory({
  region: DYNAMO_REGION,
  credentials: {
    awsAccessKeyId: DYNAMO_ACCESS_KEY_ID,
    awsSecretKey: DYNAMO_SECRET_ACCESS_KEY,
  },
}).makeNew(DynamoDB);

try {
  await client.describeTable({
    TableName: DYNAMO_USER_TABLE,
  });
  console.log("Table already exists");
} catch (err) {
  console.log("Table not found");
  if (err.name === "ResourceNotFoundException") {
    console.log("Creating table");
    await client.createTable({
      TableName: DYNAMO_USER_TABLE,
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });
  } else {
    console.log("Unexpected error");
    console.log(JSON.stringify(err, undefined, 2));
  }
}
