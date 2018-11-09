import PropTypes from "prop-types";
import React, { Component } from "react";
import { Result, Results } from "@elastic/react-search-components";

import { withSearch } from "..";
import { Result as ResultType } from "../types";

function htmlEscape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/*
  Our `Result` component expects result fields to be formatted in an object
  like:
  {
    field1: "value1",
    field2: "value2"
  }
*/
function formatResultFields(result) {
  return Object.keys(result.data).reduce((acc, n) => {
    // Fallback to raw values here, because non-string fields
    // will not have a snippet fallback. Raw values MUST be html escaped.
    let value = result.getSnippet(n) || htmlEscape(result.getRaw(n));
    value = Array.isArray(value) ? value.join(", ") : value;
    acc[n] = value;
    return acc;
  }, {});
}
export class ResultsContainer extends Component {
  static propTypes = {
    results: PropTypes.arrayOf(ResultType).isRequired,
    titleField: PropTypes.string,
    trackClickThrough: PropTypes.func,
    urlField: PropTypes.string
  };

  handleClickLink = id => {
    const { trackClickThrough } = this.props;
    !!trackClickThrough && trackClickThrough(id);
  };

  render() {
    const { results, titleField, urlField } = this.props;

    return (
      <Results>
        {results.map(result => (
          <Result
            fields={formatResultFields(result)}
            key={`result-${result.getRaw("id")}`}
            onClickLink={() => this.handleClickLink(result.getRaw("id"))}
            title={
              result.getSnippet(titleField) ||
              htmlEscape(result.getRaw(titleField))
            }
            url={result.getRaw(urlField)}
          />
        ))}
      </Results>
    );
  }
}

export default withSearch(ResultsContainer);
