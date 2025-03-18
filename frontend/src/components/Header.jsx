import React from "react";
import "./Headstyle.css";

export const SectionHeader = () => {
  return (
    <div className="section-header">
      <div className="nav-primary">
        <div className="div-flex">
          <div className="list">
            <div className="SHOP-item-margin">
              <div className="div-wrapper">
                <button className="button">
                  <div className="span-inline-block">
                    <div className="text-wrapper">SHOP</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="CATALOG-item-margin">
              <div className="div-wrapper">
                <button className="div">
                  <div className="span-inline-block-2">
                    <div className="text-wrapper">CATALOG</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="ABOUT-item-margin">
            <div className="item">
              <button className="button">
                <div className="span-inline-block-3">
                  <div className="text-wrapper">ABOUT</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="frame">
          <div className="text-wrapper-2">KWU</div>
        </div>

        <div className="div-flex-2">
          <div className="div-ml-margin-CART">
            <div className="div-wrapper">
              <button className="span-my-auto-wrapper">
                <div className="span-my-auto">
                  <div className="text-wrapper-3">CART (0)</div>
                </div>
              </button>
            </div>
          </div>

          <div className="div-ml-margin">
            <div className="div-wrapper">
              <div className="link">
                <div className="span-my-auto-2">
                  <div className="text-wrapper-3">LOGIN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
