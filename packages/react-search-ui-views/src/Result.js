import PropTypes from "prop-types";
import React from "react";

function Result({
  viewHelpers,
  className,
  result,
  onClickLink,
  titleField,
  urlField,
  ...rest
}) {
  const fields = viewHelpers.getEscapedFields(result);
  const title = viewHelpers.getEscapedField(result, titleField);
  const url = viewHelpers.getUrlSanitizer(URL, location)(
    viewHelpers.getRaw(result, urlField)
  );

  return (
    <li
      className={viewHelpers.appendClassName("sui-result", className)}
      {...rest}
    >
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
          {Object.entries(fields).map(([fieldName, fieldValue]) => (
            <li key={fieldName}>
              <span className="sui-result__key">{fieldName}</span>{" "}
              <span
                className="sui-result__value"
                dangerouslySetInnerHTML={{ __html: fieldValue }}
              />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

Result.propTypes = {
  viewHelpers: PropTypes.object.isRequired,
  result: PropTypes.object.isRequired,
  onClickLink: PropTypes.func.isRequired,
  className: PropTypes.string,
  titleField: PropTypes.string,
  urlField: PropTypes.string
};

export default Result;
