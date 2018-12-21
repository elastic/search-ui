import PropTypes from "prop-types";
import React from "react";

function Result({ fields, onClickLink, title, url }) {
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
  fields: PropTypes.object.isRequired,
  onClickLink: PropTypes.func.isRequired,
  title: PropTypes.string,
  url: PropTypes.string
};

export default Result;
