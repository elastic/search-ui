import PropTypes from "prop-types";
import React from "react";

function getFieldType(result, field, type) {
  if (result[field]) return result[field][type];
}

function getRaw(result, field) {
  return getFieldType(result, field, "raw");
}

function getSnippet(result, field) {
  return getFieldType(result, field, "snippet");
}

function htmlEscape(str) {
  if (!str) return "";

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getEscapedField(result, field) {
  // Fallback to raw values here, because non-string fields
  // will not have a snippet fallback. Raw values MUST be html escaped.
  const safeField =
    getSnippet(result, field) || htmlEscape(getRaw(result, field));
  return Array.isArray(safeField) ? safeField.join(", ") : safeField;
}

function getEscapedFields(result) {
  return Object.keys(result).reduce((acc, field) => {
    return { ...acc, [field]: getEscapedField(result, field) };
  }, {});
}

function Result({ result, onClickLink, titleField, urlField }) {
  const fields = getEscapedFields(result);
  const title = getEscapedField(result, titleField);
  const url = getRaw(result, urlField);

  return (
    <li className="sui-result">
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
        <ul className="sui-result__details">
          {Object.keys(fields).map(key => (
            <li key={key}>
              <span className="sui-result__key">{key}</span>{" "}
              <span
                className="sui-result__value"
                dangerouslySetInnerHTML={{ __html: fields[key] }}
              />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

Result.propTypes = {
  result: PropTypes.object.isRequired,
  onClickLink: PropTypes.func.isRequired,
  titleField: PropTypes.string,
  urlField: PropTypes.string
};

export default Result;
