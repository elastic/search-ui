import React from "react";

import { appendClassName } from "./view-helpers";
import type {
  AutocompletedResult,
  AutocompletedResultSuggestion,
  AutocompletedSuggestion,
  AutocompletedSuggestions,
  AutocompleteResult,
  AutocompleteSuggestion
} from "@elastic/search-ui";

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

function getSnippet(result, value) {
  if (!result[value] || !result[value].snippet) return;
  return result[value].snippet;
}

function getSuggestionTitle(suggestionType, autocompleteSuggestions) {
  if (autocompleteSuggestions.sectionTitle) {
    return autocompleteSuggestions.sectionTitle;
  }

  if (
    autocompleteSuggestions[suggestionType] &&
    autocompleteSuggestions[suggestionType].sectionTitle
  ) {
    return autocompleteSuggestions[suggestionType].sectionTitle;
  }
}

function getSuggestionDisplayField(
  suggestionType: string,
  autocompleteSuggestions: AutocompleteSuggestion
): string {
  if (autocompleteSuggestions.queryType === "results") {
    return autocompleteSuggestions.displayField as string;
  }
  if (
    autocompleteSuggestions[suggestionType] &&
    autocompleteSuggestions[suggestionType].queryType === "results"
  ) {
    return autocompleteSuggestions[suggestionType].displayField;
  }
}

export type SearchBoxAutocompleteViewProps = {
  allAutocompletedItemsCount: number;
  autocompleteResults?: boolean | AutocompleteResult;
  autocompletedResults: AutocompletedResult[];
  autocompletedSuggestions: AutocompletedSuggestions;
  autocompletedSuggestionsCount: number;
  autocompleteSuggestions?: boolean | AutocompleteSuggestion;
  getItemProps: (value: {
    key: string;
    index: number;
    item: AutocompletedSuggestion;
  }) => any;
  getMenuProps: (value: { className: string }) => any;
  className?: string;
};

function Autocomplete({
  autocompleteResults,
  autocompletedResults,
  autocompleteSuggestions,
  autocompletedSuggestions,
  className,
  getItemProps,
  getMenuProps
}: SearchBoxAutocompleteViewProps) {
  let index = 0;
  return (
    <div
      {...getMenuProps({
        className: appendClassName(
          "sui-search-box__autocomplete-container",
          className
        )
      })}
    >
      <div>
        {!!autocompleteSuggestions &&
          Object.entries(autocompletedSuggestions).map(
            ([suggestionType, suggestions]) => {
              return (
                <React.Fragment key={suggestionType}>
                  {getSuggestionTitle(
                    suggestionType,
                    autocompleteSuggestions
                  ) &&
                    suggestions.length > 0 && (
                      <div className="sui-search-box__section-title">
                        {getSuggestionTitle(
                          suggestionType,
                          autocompleteSuggestions
                        )}
                      </div>
                    )}
                  {suggestions.length > 0 && (
                    <ul className="sui-search-box__suggestion-list">
                      {suggestions.map(
                        (
                          suggestion:
                            | AutocompletedSuggestion
                            | AutocompletedResultSuggestion
                        ) => {
                          index++;
                          if (suggestion.queryType === "results") {
                            let displayField = null;
                            if (autocompleteSuggestions === true) {
                              displayField = Object.keys(suggestion.result)[0];
                            } else {
                              displayField = getSuggestionDisplayField(
                                suggestionType,
                                autocompleteSuggestions
                              );
                            }
                            const suggestionValue =
                              suggestion.result[displayField]?.raw?.toString();

                            return (
                              <li
                                {...getItemProps({
                                  key: suggestionValue,
                                  index: index - 1,
                                  item: {
                                    suggestion: suggestionValue
                                  }
                                })}
                                data-transaction-name="query suggestion"
                              >
                                <span>{suggestionValue}</span>
                              </li>
                            );
                          }

                          return (
                            <li
                              {...getItemProps({
                                key:
                                  suggestion.suggestion || suggestion.highlight,
                                index: index - 1,
                                item: {
                                  ...suggestion,
                                  index: index - 1
                                }
                              })}
                              data-transaction-name="query suggestion"
                            >
                              {suggestion.highlight ? (
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: suggestion.highlight
                                  }}
                                />
                              ) : (
                                <span>{suggestion.suggestion}</span>
                              )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </React.Fragment>
              );
            }
          )}
        {!!autocompleteResults &&
          !!autocompletedResults &&
          typeof autocompleteResults !== "boolean" &&
          autocompletedResults.length > 0 &&
          autocompleteResults.sectionTitle && (
            <div className="sui-search-box__section-title">
              {autocompleteResults.sectionTitle}
            </div>
          )}
        {!!autocompleteResults &&
          !!autocompletedResults &&
          autocompletedResults.length > 0 && (
            <ul className="sui-search-box__results-list">
              {autocompletedResults.map((result) => {
                index++;
                const titleField =
                  typeof autocompleteResults === "boolean"
                    ? null
                    : autocompleteResults.titleField;
                const titleSnippet = getSnippet(result, titleField);
                const titleRaw = getRaw(result, titleField);
                return (
                  <li
                    {...getItemProps({
                      key: result.id.raw,
                      index: index - 1,
                      item: result
                    })}
                  >
                    {titleSnippet ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: titleSnippet
                        }}
                      />
                    ) : (
                      <span>{titleRaw}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
      </div>
    </div>
  );
}

export default Autocomplete;
