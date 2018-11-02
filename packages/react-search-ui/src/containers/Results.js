import PropTypes from "prop-types";
import React, { Component } from "react";

import { withSearch } from "..";
import { Result, Results } from "@elastic/react-search-components";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    acc[`${capitalizeFirstLetter(n)}`] = value;
    return acc;
  }, {});
}
export class ResultsContainer extends Component {
  static propTypes = {
    results: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.object.isRequired,
        getRaw: PropTypes.func.isRequired,
        getSnippet: PropTypes.func.isRequired
      })
    ).isRequired,
    titleField: PropTypes.string.isRequired,
    trackClickThrough: PropTypes.func.isRequired,
    urlField: PropTypes.string.isRequired
  };

  handleClickLink = id => {
    const { trackClickThrough } = this.props;
    trackClickThrough(id);
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
            title={result.getSnippet(titleField)}
            url={result.getRaw(urlField)}
          />
        ))}
      </Results>
    );
  }
}

export default withSearch(ResultsContainer);
