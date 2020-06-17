/*
  This is a Netlify Function that proxies our Elasticsearch instance.
*/
import fetch from "node-fetch";
import https from "https";

// Don't do this in production, this is in place to aid with demo environments which have self-signed certificates.
const agent = new https.Agent({
  rejectUnauthorized: false
});

exports.handler = function(event, context, callback) {
  const host = process.env.ELASTICSEARCH_HOST;

  fetch(`${host}/national-parks/_search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: event.body,
    agent
  })
    .then(response => response.text().then(body => [response, body]))
    .then(([response, body]) => {
      callback(null, {
        statusCode: response.status,
        body: body
      });
    })
    .catch(e => {
      callback(null, {
        statusCode: 500,
        body: `An error occurred: ${e}`
      });
    });
};
