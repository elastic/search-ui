import PropTypes from "prop-types";
import { Component } from "react";
import { Result } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result as ResultType } from "../types";

export class ResultContainer extends Component {
  static propTypes = {
    // Props
    className: PropTypes.string,
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
    const {
      className,
      result,
      titleField,
      urlField,
      view,
      // eslint-disable-next-line no-unused-vars
      trackClickThrough,
      // eslint-disable-next-line no-unused-vars
      shouldTrackClickThrough,
      // eslint-disable-next-line no-unused-vars
      clickThroughTags,
      ...rest
    } = this.props;
    const View = view || Result;

    return View({
      className,
      result: result,
      key: `result-${result.id.raw}`,
      onClickLink: () => this.handleClickLink(result.id.raw),
      titleField,
      urlField,
      ...rest
    });
  }
}

export default withSearch(({ trackClickThrough }) => ({ trackClickThrough }))(
  ResultContainer
);
