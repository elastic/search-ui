import React from "react";

import {
  appendClassName,
  getUrlSanitizer,
  formatResult,
  getEscapedField,
  getRaw
} from "./view-helpers";
import type { SearchContextState, SearchResult } from "@elastic/search-ui";
import { BaseContainerProps } from "./types";

export type ResultContainerContext = Pick<
  SearchContextState,
  "trackClickThrough"
>;

export type ResultContainerProps = BaseContainerProps &
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

function Result({
  className,
  result,
  onClickLink,
  titleField,
  urlField,
  thumbnailField,
  ...rest
}: ResultViewProps) {
  const fields = formatResult(result);
  const title = getEscapedField(result[titleField]);
  const url = getUrlSanitizer(URL, location.href)(getRaw(result[urlField]));
  const thumbnail = getUrlSanitizer(
    URL,
    location.href
  )(getRaw(result[thumbnailField]));

  return (
    <li className={appendClassName("sui-result", className)} {...rest}>
      <div className="sui-result__header">
        {title && !url && (
          <span
            className="sui-result__title"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {title && url && (
          <a
            className="sui-result__title sui-result__title-link"
            dangerouslySetInnerHTML={{ __html: title }}
            href={url}
            onClick={onClickLink}
            target="_blank"
            rel="noopener noreferrer"
          />
        )}
      </div>

      <div className="sui-result__body">
        {thumbnail && (
          <div className="sui-result__image">
            <img src={thumbnail} alt="" />
          </div>
        )}
        <ul className="sui-result__details">
          {Object.entries(fields).map(
            ([fieldName, fieldValue]: [string, string]) => (
              <li key={fieldName}>
                <span className="sui-result__key">{fieldName}</span>{" "}
                <span
                  className="sui-result__value"
                  dangerouslySetInnerHTML={{ __html: fieldValue }}
                />
              </li>
            )
          )}
        </ul>
      </div>
    </li>
  );
}

export default Result;
