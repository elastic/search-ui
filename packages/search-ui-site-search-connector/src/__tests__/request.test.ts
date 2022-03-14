import request from "../request";
import type { SearchResponse } from "../types";

const responseJson: SearchResponse = {};

function fetchResponse(response: SearchResponse, statusCode: number) {
  return Promise.resolve({
    status: statusCode,
    json: () => {
      if (response) {
        return Promise.resolve(response);
      } else {
        throw new Error("Couldn't parse");
      }
    }
  });
}

beforeEach(() => {
  global.Headers = jest.fn();
  global.fetch = jest.fn().mockReturnValue(fetchResponse(responseJson, 200));
});

function respondWithSuccess(json?: SearchResponse) {
  global.fetch = jest.fn().mockReturnValue(fetchResponse(json, 200));
}

function respondWithError(json?: SearchResponse) {
  global.fetch = jest.fn().mockReturnValue(fetchResponse(json, 401));
}

function subject() {
  return request("engine", "GET", "test", {});
}

it("will return json on successful request with json", async () => {
  respondWithSuccess(responseJson);
  const response = await subject();
  expect(response).toEqual(responseJson);
});

it("will return undefined on successful request without json", async () => {
  respondWithSuccess();
  const response = await subject();
  expect(response).toBeUndefined();
});

it("will throw with status on unsuccessful request without json", async () => {
  respondWithError();
  let error: Error;

  try {
    error = await subject();
  } catch (e) {
    error = e;
  }

  expect(error.message).toEqual("401");
});

it("will throw with message on unsuccessful request with json and message", async () => {
  respondWithError({
    errors: { some_parameter: ["I am a server error message"] }
  });
  let error: Error;

  try {
    error = await subject();
  } catch (e) {
    error = e;
  }

  expect(error.message).toEqual(
    '{"some_parameter":["I am a server error message"]}'
  );
});

it("will throw with message on unsuccessful request with json but no message", async () => {
  respondWithError({});
  let error: Error;

  try {
    error = await subject();
  } catch (e) {
    error = e;
  }

  expect(error.message).toEqual("401");
});
