import React from 'react';
import classes from './AwesomeLists.module.css';
import Homepage from '../AwesomeHome/AwesomeHome';

const awesomeLists = ({ topic, subjects = [] }) => {
  if (topic === '') {
    return <Homepage />;
  }

  const sortedSubjects = [...subjects].sort((a, b) => {
    const aText = `${a.guest} ${a.description}`.toUpperCase();
    const bText = `${b.guest} ${b.description}`.toUpperCase();

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
      <div className={classes.LinkGrid}>
        {sortedSubjects.map((subject) => {
          const linkLabel = subject.description || subject.domain || 'Open link';
          const linkMeta = subject.twitter || 'Description';

          return (
            <article key={subject.id} className={classes.LinkCard}>
              <p className={classes.MetaLabel}>{linkMeta}</p>
              <a
                className={classes.LinkTitle}
                href={subject.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {linkLabel}
              </a>
              <div className={classes.CardFooter}>
                <p className={classes.Meta}>
                  {subject.episode ? `${subject.episode}. ` : ''}{subject.guest || 'Unknown guest'}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default awesomeLists;
