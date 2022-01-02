/** @jsx h */
import { h, tw } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";
import { CodeInline } from "../components/code_inline.tsx";
import { Endpoint } from "../components/endpoint.tsx";

export default function Api() {
  return (
    <Layout description>
      <div class={tw`flex flex-col lg:flex-row`}>
        <div class={tw`inset-y-0 left-0 w-full px-8`}>
          <div class={tw`text-lg font-medium mb-4`}>
            All endpoints are under the <CodeInline>/api</CodeInline> endpoint
          </div>
          <Endpoint method="GET" path="/get/:id">
            returns the file associated with the id, optionally takes a file
            extension
          </Endpoint>
          <Endpoint method="GET" path="/get/:alias@:tag">
            returns the file associated with the alias and tag, optionally takes
            a file extension
          </Endpoint>
          <Endpoint
            method="POST"
            path="/add"
            requestBody={{
              content_type: "application/json",
              content: {
                name: {
                  type: "string",
                  description: "The name of the script including extension",
                },
                content: {
                  type: "string",
                  description: "The file content base64-encoded",
                },
              },
            }}
          >
            upload a script.
          </Endpoint>
          <Endpoint
            method="POST"
            path="/alias/request"
            requestBody={{
              content_type: "application/json",
              content: {
                alias: {
                  type: "string",
                  description: "The name of the alias",
                },
                user: {
                  type: "number",
                  description: "The id of the user creating the alias",
                },
                secret: {
                  type: "string",
                  description: "The secret of the user creating the alias",
                },
              },
            }}
          >
            Create an alias
          </Endpoint>
          <Endpoint
            method="POST"
            path="/alias/release"
            requestBody={{
              content_type: "application/json",
              content: {
                alias: {
                  type: "string",
                  description: "The name of the alias to release with",
                },
                user: {
                  type: "number",
                  description: "The id of the user creating the alias",
                },
                secret: {
                  type: "string",
                  description: "The secret of the user creating the alias",
                },
                tag: {
                  type: "string",
                  description: "The tag to release the alias with",
                },
                script: {
                  type: "string",
                  description: "The id of the script to release",
                },
              },
            }}
          >
            Release an alias
          </Endpoint>
          <Endpoint
            method="POST"
            path="/alias/list"
            requestBody={{
              content_type: "application/json",
              content: {
                user: {
                  type: "number",
                  description: "The id of the user",
                },
              },
            }}
          >
            List all aliases belonging to a specific user
          </Endpoint>
          <div class={tw`text-xl font-medium mb-4 mt-10`}>
            The following endpoints require admin privileges
          </div>
          <Endpoint
            method="POST"
            path="/alias/requests"
            requestBody={{
              content_type: "application/json",
              content: {
                user: {
                  type: "number",
                  description: "The id of the admin user",
                },
                secret: {
                  type: "string",
                  description: "The secret of the admin user",
                },
              },
            }}
            responseBody={{
              content_type: "application/json",
              content: {
                // TODO
              },
            }}
          >
            Get a list of currently open alias requests
          </Endpoint>
          <Endpoint
            method="POST"
            path="/alias/approve"
            requestBody={{
              content_type: "application/json",
              content: {
                user: {
                  type: "number",
                  description: "The id of the admin user",
                },
                secret: {
                  type: "string",
                  description: "The secret of the admin user",
                },
                alias: {
                  type: "string",
                  description: "The name of the alias to approve",
                },
                owner: {
                  type: "number",
                  description: "The id of the user that owns the alias",
                },
              },
            }}
          >
            Approve a pending alias
          </Endpoint>
          <Endpoint
            method="POST"
            path="/alias/deny"
            requestBody={{
              content_type: "application/json",
              content: {
                user: {
                  type: "number",
                  description: "The id of the admin user",
                },
                secret: {
                  type: "string",
                  description: "The secret of the admin user",
                },
                alias: {
                  type: "string",
                  description: "The name of the alias to approve",
                },
                owner: {
                  type: "number",
                  description: "The id of the user that owns the alias",
                },
              },
            }}
          >
            Deny a pending alias
          </Endpoint>
        </div>
      </div>
    </Layout>
  );
}
