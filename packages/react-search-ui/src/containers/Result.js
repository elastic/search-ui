import PropTypes from "prop-types";
import { Component } from "react";
import { Result } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result as ResultType } from "../types";

function getFieldType(result, field, type) {
  if (!result[field] || !result[field][type]) return;
  return result[field][type];
}

function getRaw(result, field) {
  return getFieldType(result, field, 'raw');
}

function getSnippet(result, field) {
  return getFieldType(result, field, 'snippet');
}

function htmlEscape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getSafe(result, field) {
  // Fallback to raw values here, because non-string fields
  // will not have a snippet fallback. Raw values MUST be html escaped.
  let safeField = getSnippet(result, field) || htmlEscape(getRaw(result, field));
  return Array.isArray(safeField) ? safeField.join(", ") : safeField;
}

/*
  Our `Result` component expects result fields to be formatted in an object
  like:
  {
    field1: "value1",
    field2: "value2"
  }
*/
function getSafeResult(result) {
  return Object.keys(result).reduce((acc, field) => {
    return { ...acc, [field]: getSafe(result, field) };
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

    const safeResult = getSafeResult(result)

    return View({
      fields: safeResult,
      result: result,
      key: `result-${getRaw(result, 'id')}`,
      onClickLink: () => this.handleClickLink(getRaw(result, 'id')),
      title: getSafe(result, titleField),
      titleField,
      url: getRaw(result, urlField),
      urlField
    });
  }
}

export default withSearch(ResultContainer);
