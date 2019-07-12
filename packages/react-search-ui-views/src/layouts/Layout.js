import PropTypes from "prop-types";
import React from "react";

import SidebarToggle from "./SidebarToggle";
import { appendClassName } from "../view-helpers";

function Layout({
  className,
  children,
  header,
  bodyContent,
  bodyFooter,
  bodyHeader,
  sideContent
}) {
  return (
    <div className={appendClassName("sui-layout", className)}>
      <div className="sui-layout-header">
        <div className="sui-layout-header__inner">{header}</div>
      </div>
      <div className="sui-layout-body">
        <div className="sui-layout-body__inner">
          <SidebarToggle content={sideContent}>
            {({ renderToggleButton, renderToggleClass }) => (
              <>
                {renderToggleButton("Show Filters")}
                <div className={renderToggleClass("sui-layout-sidebar")}>
                  {renderToggleButton("Done Filtering")}
                  {sideContent}
                </div>
              </>
            )}
          </SidebarToggle>
          <div className="sui-layout-main">
            <div className="sui-layout-main-header">
              <div className="sui-layout-main-header__inner">{bodyHeader}</div>
            </div>
            <div className="sui-layout-main-body">
              {children || bodyContent}
            </div>
            <div className="sui-layout-main-footer">{bodyFooter}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Layout.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  header: PropTypes.node,
  bodyContent: PropTypes.node,
  bodyFooter: PropTypes.node,
  bodyHeader: PropTypes.node,
  sideContent: PropTypes.node
};

export default Layout;
