import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from "./deps.ts";
import {
  DYNAMO_ACCESS_KEY_ID,
  DYNAMO_ALIAS_TABLE,
  DYNAMO_REGION,
  DYNAMO_SECRET_ACCESS_KEY,
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
      TableName: DYNAMO_ALIAS_TABLE,
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
        TableName: DYNAMO_ALIAS_TABLE,
        AttributeDefinitions: [{ AttributeName: "alias", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "alias", KeyType: "HASH" }],
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
