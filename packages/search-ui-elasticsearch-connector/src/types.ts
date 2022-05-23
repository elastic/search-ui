export type ESRequestBody = any;
export type PostProcessRequestBodyFn = (
  requestBody: ESRequestBody
) => ESRequestBody;
