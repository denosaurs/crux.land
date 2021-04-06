import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from "./deps.ts";
import {
  DYNAMO_ACCESS_KEY_ID,
  DYNAMO_REGION,
  DYNAMO_SECRET_ACCESS_KEY,
  DYNAMO_USER_TABLE,
} from "../util/constants.ts";

const client = new DynamoDBClient({
  region: DYNAMO_REGION,
  credentials: {
    accessKeyId: DYNAMO_ACCESS_KEY_ID,
    secretAccessKey: DYNAMO_SECRET_ACCESS_KEY,
  },
});

try {
  // @ts-ignore TS2339
  await client.send(
    new DescribeTableCommand({
      TableName: DYNAMO_USER_TABLE,
    }),
  );
  console.log("Table already exists");
} catch (err) {
  console.log("Table not found");
  if (err.name === "ResourceNotFoundException") {
    console.log("Creating table");
    // @ts-ignore TS2339
    await client.send(
      new CreateTableCommand({
        TableName: DYNAMO_USER_TABLE,
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      }),
    );
  } else {
    console.log("Unexpected error");
    console.log(JSON.stringify(err, undefined, 2));
  }
}
