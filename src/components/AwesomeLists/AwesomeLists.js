import React from 'react';
import classes from './AwesomeLists.module.css';
import Homepage from '../AwesomeHome/AwesomeHome';

const awesomeLists = ({ topic, subjects = [] }) => {
  if (topic === '') {
    return <Homepage />;
  }

  const sortedSubjects = [...subjects].sort((a, b) => {
    const aText = `${a.guest} ${a.type}`.toUpperCase();
    const bText = `${b.guest} ${b.type}`.toUpperCase();

    if (aText < bText) {
      return -1;
    }

    if (aText > bText) {
      return 1;
    }

    return 0;
  });

  return (
    <div className={classes.AwesomeLists}>
      <div className='alert alert-success'>
        Category view is sorted by guest and link type.
      </div>
      <h1>{topic}</h1>

      <div className={classes.LinkGrid}>
        {sortedSubjects.map((subject) => {
          return (
            <article key={subject.id} className={classes.LinkCard}>
              <h3>{subject.type || subject.episodeTitle}</h3>
              <p className={classes.Meta}>Guest: {subject.guest}</p>
              <p className={classes.Meta}>Episode {subject.episode}</p>
              <p className={classes.Domain}>{subject.domain || 'Unknown source'}</p>
              <a href={subject.url} target='_blank' rel='noopener noreferrer'>
                Open link
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default awesomeLists;
