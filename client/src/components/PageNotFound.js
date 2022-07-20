import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/PageNotFound.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";

function PageNotFound() {
  let location = useLocation();
  return (
    <div>
      <div className="errorContainer">
        <div className="error">
          <p>4</p>
          <FontAwesomeIcon icon={farQuestionCircle} className={"fa-spin"} />
          <p>4</p>
        </div>
        <div className="errorMessage">
          <p>
            OOPS, The page "{location.pathname}" you are looking for can't be
            found!
          </p>
          <p>
            Let's go <Link to="/">Home</Link> and try from there.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
