import { InputViewProps } from "@elastic/react-search-ui";
import React from "react";

function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps
}: InputViewProps) {
  return (
    <>
      <div className="sui-search-box__wrapper">
        <input {...getInputProps()} />
        {getAutocomplete()}
      </div>
      <input {...getButtonProps()} />
    </>
  );
}

export default SearchInput;
