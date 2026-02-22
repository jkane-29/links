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
        Category view is sorted by link description.
      </div>
      <h1>{topic}</h1>

      <div className={classes.LinkGrid}>
        {sortedSubjects.map((subject) => {
          const linkLabel = subject.type || subject.domain || 'Open link';

          return (
            <article key={subject.id} className={classes.LinkCard}>
              <a
                className={classes.LinkTitle}
                href={subject.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {linkLabel}
              </a>
              <p className={classes.Meta}>{subject.guest}</p>
              <p className={classes.Domain}>{subject.domain || 'Unknown source'}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default awesomeLists;
