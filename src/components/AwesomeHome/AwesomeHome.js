import classes from './AwesomeHome.module.css';

const Homepage = () => {
  return (
    <div className={classes.HomePage}>
      <h2>Dialectic Links Overview</h2>

      <section>
        <h3>Goal</h3>
        <p>
          This site is a focused link index for the Dialectic Podcast. It helps listeners quickly explore resources
          mentioned across episodes.
        </p>
        <p>
          It is based on the original Awesome Search / Awesome Lists project:{' '}
          <a href='https://github.com/lockys/NewAwesomeSearch' target='_blank' rel='noreferrer'>
            lockys/NewAwesomeSearch
          </a>.
        </p>
      </section>

      <section>
        <h3>How It Works</h3>
        <ul>
          <li>Loads Dialectic Podcast links from `filter_links.csv`.</li>
          <li>Uses episode, guest, and metadata fields to group links into broad categories.</li>
          <li>Supports semantic-style search across guest, description, category, and domain.</li>
        </ul>
      </section>

      <section>
        <h3>How To Use</h3>
        <ul>
          <li>Select a category on the right to browse Dialectic-related resources.</li>
          <li>Use the search bar to quickly find links by keyword.</li>
          <li>Click any card title to open the original link.</li>
        </ul>
      </section>
    </div>
  );
};

export default Homepage;
