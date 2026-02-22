import React from 'react';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import classes from './AwesomeInput.module.css';

const awesomeInput = (props) => {
  return (
    <div className={classes.AwesomeInput}>
      <fieldset className='form-group'>
        <label htmlFor='subject'>
          <FontAwesomeIcon
            icon={faHome}
            className={classes.HomeIcon}
            onClick={(e) => {
              e.preventDefault();
              props.history.push('/');
              props.homeOnClick('');
            }}
          />
          <span style={{ color: 'var(--dialectic-blue-700)' }}>Awesome</span>
          <span style={{ color: 'var(--dialectic-blue-700)' }}>Search</span>
        </label>
        <input
          id='subject'
          type='text'
          placeholder='Search by guest, topic, type, or domain'
          className='form-control'
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
                return (
                  <li key={el.item.id}>
                    <span className={classes.ResultMeta}>{el.item.category} | {el.item.guest}</span>
                    <a href={el.item.url} target='_blank' rel='noopener noreferrer'>
                      {el.item.type || el.item.episodeTitle}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </fieldset>
    </div>
  );
};

export default withRouter(awesomeInput);
