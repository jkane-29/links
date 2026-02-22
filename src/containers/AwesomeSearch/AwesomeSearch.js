import React, {Component} from 'react';
import AwesomeListMenu from '../../components/AwesomeLists/AwesomeListMenu';
import AwesomeRwdMenu from '../../components/AwesomeRwdMenu/AwesomeRwdMenu';
import AwesomeLists from '../../components/AwesomeLists/AwesomeLists';
import AwesomeInput from '../../components/AwesomeInput/AwesomeInput';
import AwesomeReadme from '../AwesomeReadme/AwesomeReadme';
import Spinner from '../../components/UI/Spinner/Spinner';
import Fuse from 'fuse.js';
import {Route, withRouter} from 'react-router-dom';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import classes from './AwesomeSearch.module.css';
import {MdDarkMode, MdLightMode} from 'react-icons/md';
import {buildLinkEntries, groupEntriesByCategory, parseCsv} from '../../utils/linkData';

class AwesomeSearch extends Component {
    state = {
        errorMessage: null,
        subjects: null,
        selectedSubject: '',
        subjectsArray: [],
        search: '',
        searchResult: [],
        showResult: false,
        showMenu: false,
    };

    getSubjectEntries = async () => {
        try {
            const csvPath = window.location.protocol === 'file:'
                ? './filter_links.csv'
                : `${process.env.PUBLIC_URL || ''}/filter_links.csv`;
            const response = await fetch(csvPath);
            if (!response.ok) {
                throw new Error(`Unable to read CSV: ${response.status}`);
            }

            const csv = await response.text();
            const rows = parseCsv(csv);
            const entries = buildLinkEntries(rows);
            const groupedEntries = groupEntriesByCategory(entries);

            this.setState({
                subjects: groupedEntries,
                subjectsArray: entries,
                errorMessage: '',
            });
        } catch (error) {
            this.setState({
                errorMessage: `There was an error. Unable to load link data: ${error}.`,
            });
        }
    };

    componentDidMount() {
        this.getSubjectEntries();
    }

    topicOnClickHandler = (topic) => {
        this.setState({selectedSubject: topic, showMenu: false});
    };

    searchInputOnChangeHandler = (event) => {
        const search = event.target.value;

        this.setState({
            search,
        });

        if (!search.trim()) {
            this.setState({searchResult: []});
            return;
        }

        const options = {
            includeScore: true,
            shouldSort: true,
            threshold: 0.34,
            ignoreLocation: true,
            minMatchCharLength: 2,
            keys: [
                {name: 'guest', weight: 0.23},
                {name: 'episodeTitle', weight: 0.2},
                {name: 'type', weight: 0.17},
                {name: 'category', weight: 0.14},
                {name: 'domain', weight: 0.1},
                {name: 'tags', weight: 0.08},
                {name: 'semanticText', weight: 0.08},
            ],
        };

        const fuse = new Fuse(this.state.subjectsArray, options);
        const result = fuse.search(search);

        this.setState({searchResult: result.slice(0, 20)});
    };

    searchInputOnFocusHandler = () => {
        this.setState({showResult: true});
    };

    searchInputOnCloseHandler = () => {
        this.setState({showResult: false});
    };

    setMdHandler = (md) => {
        this.setState({
            md,
        });
    };

    burgerButtonClickHandler = () => {
        this.setState((prevState) => {
            return {
                showMenu: !prevState.showMenu,
                showResult: false,
            };
        });
    };

    render() {
        if (this.state.errorMessage) {
            return <div className="alert alert-error">{this.state.errorMessage}</div>;
        }

        const topics = this.state.subjects
            ? Object.keys(this.state.subjects).sort((a, b) => a.localeCompare(b))
            : [];

        return (
            <div className={`${classes.AwesomeSearch} ${classes[this.props.theme]}`}>
                <div className="grid">
                    <div className="cell -12of12">
                        <AwesomeInput
                            searchOnchange={this.searchInputOnChangeHandler}
                            value={this.state.search}
                            searchResult={this.state.searchResult}
                            searchInputOnFocus={this.searchInputOnFocusHandler}
                            showResult={this.state.showResult}
                            homeOnClick={this.topicOnClickHandler}
                        />

                        <div
                            className={classes.BurgerButton}
                            onClick={this.burgerButtonClickHandler}
                        >
                            <FontAwesomeIcon icon={faBars}/>
                        </div>

                        <div
                            className="btn-group"
                            style={{float: 'right', fontSize: '2rem', cursor: 'pointer', verticalAlign: 'middle'}}
                        >
                            {!this.props.isDark ? <MdDarkMode
                                onClick={() => {
                                    localStorage.setItem('__isDark', 'true');
                                    this.props.onThemeChange(true);
                                }}
                            /> : <MdLightMode
                                onClick={() => {
                                    localStorage.setItem('__isDark', 'false');
                                    this.props.onThemeChange(false);
                                }}
                            />}
                        </div>
                    </div>
                </div>

                {this.state.subjects ? (
                    <div className="grid">
                        <div
                            className="cell -2of12"
                            style={{
                                width: '100%',
                            }}
                        >
                            {this.state.showMenu ? (
                                <AwesomeRwdMenu
                                    topics={topics}
                                    topicOnClickHandler={this.topicOnClickHandler}
                                />
                            ) : null}
                            <AwesomeListMenu
                                topics={topics}
                                topicOnClickHandler={this.topicOnClickHandler}
                            />
                        </div>
                        <div
                            className="cell -10of12"
                            style={{
                                width: '100%',
                            }}
                        >
                            <Route
                                path="/"
                                exact
                                render={() => {
                                    return (
                                        <AwesomeLists
                                            topic={this.state.selectedSubject}
                                            subjects={this.state.subjects[this.state.selectedSubject]}
                                        />
                                    );
                                }}
                            />
                            <Route
                                path="/:user/:repo"
                                render={(props) => {
                                    return (
                                        <AwesomeReadme
                                            key={props.match.params.repo}
                                            setMdHandler={this.setMdHandler}
                                            {...props}
                                        />
                                    );
                                }}
                            />
                        </div>

                        <Backdrop
                            show={this.state.showResult}
                            closeSearchModal={this.searchInputOnCloseHandler}
                        />
                    </div>
                ) : (
                    <Spinner/>
                )}
            </div>
        );
    }
}

export default withRouter(AwesomeSearch);
