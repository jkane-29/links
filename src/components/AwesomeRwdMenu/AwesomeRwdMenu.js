import React from 'react';
import { Link } from 'react-router-dom';
import classes from './AwesomeRwdMenu.module.css';

const AwesomeRwdMenu = ({ topics, topicDescriptions, selectedTopic, topicOnClickHandler }) => {
  return (
    <div className={`menu ${classes.AwesomeRwdMenu}`}>
      {topics.map((topic) => {
        const description = topicDescriptions[topic];

        return (
          <Link
            key={topic}
            className={`menu-item ${classes.MenuItem} ${selectedTopic === topic ? classes.SelectedTopic : ''}`}
            to="/"
            onClick={() => {
              topicOnClickHandler(topic);
            }}
          >
            <span className={classes.TopicName}>{topic}</span>
            {description ? <span className={classes.TopicDescription}>Description: {description}</span> : null}
          </Link>
        );
      })}
    </div>
  );
};

export default AwesomeRwdMenu;
