import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Badge from "components/Badge/Badge.js";

import styles from "assets/jss/material-dashboard-pro-react/components/timelineStyle.js";

const useStyles = makeStyles(styles);

export default function TagsTimeline(props) {
  const classes = useStyles();
  const { stories, simple } = props;
  const timelineClass =
    classes.timeline +
    " " +
    cx({
      [classes.timelineSimple]: simple,
    });
  return (
    <ul className={timelineClass}>
      {stories.map((prop, key) => {
        const panelClasses =
          classes.timelinePanel +
          " " +
          cx({
            [classes.timelinePanelInverted]: prop.inverted || simple,
            [classes.timelineSimplePanel]: simple,
          });
        const timelineBadgeClasses =
          classes.timelineBadge +
          " " +
          cx({
            [classes.timelineSimpleBadge]: simple,
          });
        return (
          <li className={classes.item} key={key}>
            {prop.badgeIcon ? (
              <div className={timelineBadgeClasses}>
                <img src={prop.badgeIcon} className={"thumbnail img-circle"} alt=""/>
                {/* <prop.badgeIcon className={classes.badgeIcon} /> */}
              </div>
            ) : null}
            <div className={panelClasses}>
              {prop.title ? (
                <div className={classes.timelineHeading}>
                  <Badge color={prop.titleColor}>{prop.title}</Badge>
                </div>
              ) : null}
              <div className={classes.timelineBody}>{prop.body}</div>
              {prop.footerTitle ? (
                <h6 className={classes.footerTitle}>{prop.footerTitle}</h6>
              ) : null}
              {prop.footer ? <hr className={classes.footerLine} /> : null}
              {prop.footer ? (
                <div className={classes.timelineFooter}>{prop.footer}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

TagsTimeline.propTypes = {
  stories: PropTypes.arrayOf(PropTypes.object).isRequired,
  simple: PropTypes.bool,
};
