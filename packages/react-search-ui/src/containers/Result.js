import PropTypes from "prop-types";
import React, { Component } from "react";
import { Result } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result as ResultType } from "../types";

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

function getSnippet(result, value) {
  if (!result[value] || !result[value].snippet) return;
  return result[value].snippet;
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
  return Object.keys(result).reduce((acc, n) => {
    // Fallback to raw values here, because non-string fields
    // will not have a snippet fallback. Raw values MUST be html escaped.
    let value = result[n].snippet || htmlEscape(result[n].raw);
    value = Array.isArray(value) ? value.join(", ") : value;
    acc[n] = value;
    return acc;
  }, {});
}
export class ResultContainer extends Component {
  static propTypes = {
    // Props
    clickThroughTags: PropTypes.arrayOf(PropTypes.string),
    titleField: PropTypes.string,
    urlField: PropTypes.string,
    view: PropTypes.func,
    result: ResultType.isRequired,
    shouldTrackClickThrough: PropTypes.bool,
    // Actions
    trackClickThrough: PropTypes.func
  };

  static defaultProps = {
    clickThroughTags: [],
    shouldTrackClickThrough: true
  };

  handleClickLink = id => {
    const {
      clickThroughTags,
      shouldTrackClickThrough,
      trackClickThrough
    } = this.props;

    if (shouldTrackClickThrough) {
      trackClickThrough(id, clickThroughTags);
    }
  };

  render() {
    const { result, titleField, urlField, view } = this.props;
    const View = view || Result;

    return View({
      fields: formatResultFields(result),
      key: `result-${getRaw(result, "id")}`,
      onClickLink: () => this.handleClickLink(getRaw(result, "id")),
      title:
        getSnippet(result, titleField) ||
        htmlEscape(getRaw(result, titleField)),
      url: getRaw(result, urlField)
    });
  }
}

export default withSearch(ResultContainer);
