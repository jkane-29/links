import classes from './AwesomeHome.module.css';

const Homepage = () => {
  return (
    <div className={classes.HomePage}>
      <h2>Overview</h2>

      <section>
        <h3>Goal</h3>
        <p>
          This site is a link index for the Dialectic Podcast. It organizes and categories links mentioned in the podcast. I built it to serve as a source of inspiraiton and learning. 
        <p>
          It's based on the original Awesome Search / Awesome Lists project:{' '}
          <a href='https://github.com/lockys/NewAwesomeSearch' target='_blank' rel='noreferrer'>
            lockys/NewAwesomeSearch
          </a>.
        </p>
        <p>
          Made by{' '}
          <a href='https://jkane-29.github.io' target='_blank' rel='noreferrer'>
            Jack Kane
          </a>
          .
        </p>
      </section>

      <section>
        <h3>How It Works</h3>
        <ul>
          <li>Uses episode, guest, and metadata fields to group links into broad categories.</li>
          <li>Supports semantic-style search across guest, description, category, and domain.</li>
        </ul>
      </section>

      <section>
        <h3>How To Use</h3>
        <ul>
          <li>Select a category on the right to filter all links by group.</li>
          <li>Use the search bar to quickly find links by keyword.</li>
          <li>Click any card title to open the original link.</li>
        </ul>
      </section>
    </div>
  );
};

export default Homepage;
