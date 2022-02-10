import React, { Component } from "react";
import { withSearch } from "..";
import {
  PagingInfoContainerProps,
  PagingInfo,
  PagingInfoViewProps,
  PagingInfoContainerContext
} from "@elastic/react-search-ui-views";

export class PagingInfoContainer extends Component<PagingInfoContainerProps> {
  render() {
    const {
      className,
      pagingStart,
      pagingEnd,
      resultSearchTerm,
      totalResults,
      view,
      ...rest
    } = this.props;

    const View = view || PagingInfo;
    const viewProps: PagingInfoViewProps = {
      className,
      searchTerm: resultSearchTerm,
      start: pagingStart,
      end: pagingEnd,
      totalResults: totalResults,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch<PagingInfoContainerProps, PagingInfoContainerContext>(
  ({ pagingStart, pagingEnd, resultSearchTerm, totalResults }) => ({
    pagingStart,
    pagingEnd,
    resultSearchTerm,
    totalResults
  })
)(PagingInfoContainer);
