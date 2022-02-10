import React from "react";

import LayoutSidebar from "./LayoutSidebar";
import { appendClassName } from "../view-helpers";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
  bodyContent?: React.ReactNode;
  bodyFooter?: React.ReactNode;
  bodyHeader?: React.ReactNode;
  sideContent?: React.ReactNode;
}

function Layout({
  className,
  children,
  header,
  bodyContent,
  bodyFooter,
  bodyHeader,
  sideContent
}: LayoutProps) {
  return (
    <div className={appendClassName("sui-layout", className)}>
      <div className="sui-layout-header">
        <div className="sui-layout-header__inner">{header}</div>
      </div>
      <div className="sui-layout-body">
        <div className="sui-layout-body__inner">
          <LayoutSidebar className="sui-layout-sidebar">
            {sideContent}
          </LayoutSidebar>
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

export default Layout;
