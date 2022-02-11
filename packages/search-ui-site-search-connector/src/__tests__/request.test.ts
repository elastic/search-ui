import request from "../request";

const responseJson = {};

function fetchResponse(response, statusCode) {
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

function respondWithSuccess(json) {
  global.fetch = jest.fn().mockReturnValue(fetchResponse(json, 200));
}

function respondWithError(json) {
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
  let error;

  try {
    error = await subject();
  } catch (e) {
    error = e;
  }

  expect(error.message).toEqual("401");
});

it("will throw with message on unsuccessful request with json and message", async () => {
  respondWithError({ error: "I am a server error message" });
  let error;

  try {
    error = await subject();
  } catch (e) {
    error = e;
  }

  expect(error.message).toEqual("I am a server error message");
});

it("will throw with message on unsuccessful request with json but no message", async () => {
  respondWithError({});
  let error;

  try {
    error = await subject();
  } catch (e) {
    error = e;
  }

  expect(error.message).toEqual("401");
});
