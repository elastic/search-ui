import React, { Component } from "react";
import { withSearch } from "..";
import { PagingInfo } from "@elastic/react-search-ui-views";
import { SearchContextState } from "../withSearch";
import { BaseContainerProps, Rename } from "../types";

type PagingInfoContainerContext = Pick<SearchContextState, "pagingStart" | "pagingEnd" | "resultSearchTerm" | "totalResults">;

export type PagingInfoViewProps = Rename<BaseContainerProps & PagingInfoContainerContext, {
  pagingStart: "start",
  resultSearchTerm: "searchTerm",
  pagingEnd: "end"
}>
  

type PagingContainerProps = BaseContainerProps & PagingInfoContainerContext & {
  view?: React.ComponentType<PagingInfoViewProps>,
};

export class PagingInfoContainer extends Component<PagingContainerProps> {

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

export default withSearch<PagingContainerProps, PagingInfoContainerContext>(
  ({ pagingStart, pagingEnd, resultSearchTerm, totalResults }) => ({
    pagingStart,
    pagingEnd,
    resultSearchTerm,
    totalResults
  })
)(PagingInfoContainer);
