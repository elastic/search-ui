import PropTypes from "prop-types";
import React from "react";
import Downshift from "downshift";

function SearchBox(props) {
  const {
    autocomplete,
    autocompleteItems = [],
    isFocused,
    inputProps,
    onChange,
    onSelectAutocomplete,
    onSubmit,
    value
  } = props;
  const focusedClass = isFocused ? "focus" : "";

  // TODO Remove inline styles
  return (
    <form onSubmit={onSubmit}>
      <Downshift
        inputValue={value}
        onChange={onSelectAutocomplete}
        onInputValueChange={onChange}
        itemToString={item => (item ? item.value : "")}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          highlightedIndex,
          selectedItem
        }) => {
          let index = 0;
          return (
            <div
              className="sui-search-box"
              style={{ position: "relative", overflow: "visible" }}
            >
              <input
                {...getInputProps({
                  placeholder: "Search your documents",
                  ...inputProps,
                  className: `sui-search-box__text-input ${focusedClass}`
                })}
              />
              <ul
                {...getMenuProps({
                  style: {
                    position: "absolute",
                    top: "100%",
                    width: "100%"
                  }
                })}
              >
                {autocomplete && isOpen
                  ? autocompleteItems.map((section, i) => {
                      return (
                        <div key={i}>
                          {section.title && <div>{section.title}</div>}
                          <ul>
                            {section.items.map(item => {
                              index++;
                              return (
                                // eslint-disable-next-line react/jsx-key
                                <li
                                  {...getItemProps({
                                    key: item.id,
                                    index: index - 1,
                                    item,
                                    style: {
                                      backgroundColor:
                                        highlightedIndex === index - 1
                                          ? "lightgray"
                                          : "white",
                                      fontWeight:
                                        selectedItem === item
                                          ? "bold"
                                          : "normal"
                                    }
                                  })}
                                >
                                  {item.snippet ? (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: item.snippet
                                      }}
                                    />
                                  ) : (
                                    <span>{item.raw}</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })
                  : null}
              </ul>
              <input
                type="submit"
                value="Search"
                className="button sui-search-box__submit"
              />
            </div>
          );
        }}
      </Downshift>
    </form>
  );
}

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  autocomplete: PropTypes.bool,
  autocompleteItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          raw: PropTypes.string,
          snippet: PropTypes.string,
          value: PropTypes.any
        })
      )
    })
  ),
  onSelectAutocomplete: PropTypes.func,
  inputProps: PropTypes.object,
  isFocused: PropTypes.bool
};

export default SearchBox;
