import React from 'react';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import classes from './AwesomeInput.module.css';

const awesomeInput = (props) => {
  return (
    <div className={classes.AwesomeInput}>
      <fieldset className='form-group'>
        <div className={classes.SearchRow}>
          <label htmlFor='subject' className={classes.BrandLabel}>
            <FontAwesomeIcon
              icon={faHome}
              className={classes.HomeIcon}
              onClick={(e) => {
                e.preventDefault();
                props.history.push('/');
                props.homeOnClick('');
              }}
            />
            <span className={classes.BrandTitle}>Dialectic Links</span>
          </label>
          <div className={classes.SearchFieldWrap}>
            <input
              id='subject'
              type='text'
              placeholder='Search by guest, topic, description, or domain'
              className={`form-control ${classes.SearchField}`}
              onChange={props.searchOnchange}
              value={props.value}
              onFocus={props.searchInputOnFocus}
            ></input>
            {props.showResult ? (
              <div className={classes.SearchResult}>
                <ul>
                  {props.searchResult.length === 0 ? (
                    <span>Try a keyword like AI, investing, newsletter, or a guest name.</span>
                  ) : null}
                  {props.searchResult.map((el) => {
                    const linkLabel = el.item.description || el.item.domain || 'Open link';
                    const linkMeta = el.item.twitter || 'Description';

                    return (
                      <li key={el.item.id}>
                        <span className={classes.ResultMeta}>{linkMeta}</span>
                        <a className={classes.ResultTitle} href={el.item.url} target='_blank' rel='noopener noreferrer'>
                          {linkLabel}
                        </a>
                        <span className={classes.ResultSubMeta}>{el.item.guest}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default withRouter(awesomeInput);
