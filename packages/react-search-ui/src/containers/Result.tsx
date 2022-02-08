import React from "react";
import { Component } from "react";
import { Result } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { BaseContainerProps } from "../types";
import { SearchContextState } from "../withSearch";
import { SearchResult } from "@elastic/search-ui";

type ResultContainerContext = Pick<SearchContextState, "trackClickThrough">;

type ResultContainerProps = BaseContainerProps &
  ResultContainerContext & {
    view?: React.ComponentType<ResultViewProps>;
    clickThroughTags?: string[];
    titleField?: string;
    urlField?: string;
    thumbnailField?: string;
    result: SearchResult;
    shouldTrackClickThrough?: boolean;
  };

export type ResultViewProps = BaseContainerProps &
  Pick<
    ResultContainerProps,
    "result" | "titleField" | "urlField" | "thumbnailField"
  > & {
    key?: string;
    onClickLink: () => void;
  };

export class ResultContainer extends Component<ResultContainerProps> {
  static defaultProps = {
    clickThroughTags: [],
    shouldTrackClickThrough: true
  };

  handleClickLink = (id) => {
    const { clickThroughTags, shouldTrackClickThrough, trackClickThrough } =
      this.props;

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
      thumbnailField,
      view,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      trackClickThrough,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      shouldTrackClickThrough,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      clickThroughTags,
      ...rest
    } = this.props;
    const View = view || Result;
    const id = result.id.raw;

    const viewProps: ResultViewProps = {
      className,
      result: result,
      key: `result-${id}`,
      onClickLink: () => this.handleClickLink(id),
      titleField,
      urlField,
      thumbnailField,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch<ResultContainerProps, ResultContainerContext>(
  ({ trackClickThrough }) => ({ trackClickThrough })
)(ResultContainer);
