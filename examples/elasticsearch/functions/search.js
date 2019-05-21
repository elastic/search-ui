/*
  This is a Netlify Function that proxies our Elasticsearch instance.
*/
import fetch from "node-fetch";

exports.handler = function(event, context, callback) {
  const host = process.env.ELASTICSEARCH_HOST;

  fetch(`${host}/national-parks/_search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: event.body
  })
    .then(response => response.text().then(body => [response, body]))
    .then(([response, body]) => {
      callback(null, {
        statusCode: response.status,
        body: body
      });
    })
    .catch(() => {
      callback(null, {
        statusCode: 500,
        body: "An error occurred"
      });
    });
};
