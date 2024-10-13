import React from 'react';
import { Grid, Button, Dropdown } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import JobSummaryCard from './JobSummaryCard.jsx';

export const FilterComponent = ({ filters, sortBy, onFilterChange, onSortChange }) => {
    const sortOptions = [
        { key: 'newest', text: 'Newest first', value: 'desc' },
        { key: 'oldest', text: 'Oldest first', value: 'asc' }
    ];

    const filterOptions = [
        { key: 'showActive', text: 'Active Jobs', value: 'showActive' },
        { key: 'showClosed', text: 'Closed Jobs', value: 'showClosed' },
        { key: 'showDraft', text: 'Draft Jobs', value: 'showDraft' },
        { key: 'showExpired', text: 'Expired Jobs', value: 'showExpired' },
        { key: 'showUnexpired', text: 'Unexpired Jobs', value: 'showUnexpired' }
    ];

    return (
        <div>
            <label htmlFor="filter-dropdown" style={{ fontWeight: 'bold' }}>Filter: </label>
            <Dropdown
                selection
                multiple
                options={filterOptions}
                value={Object.keys(filters).filter(key => filters[key])}
                onChange={(e, { value }) => onFilterChange(value)}
                placeholder='Choose filter'
                style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                }}
            />

            <label htmlFor="sort-dropdown" style={{ fontWeight: 'bold' }}>Sort by date: </label>
            <Dropdown
                selection
                options={sortOptions}
                value={sortBy.date}
                onChange={(e, { value }) => onSortChange(value)}
                placeholder='Sort by date'
                style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                }}
            />

            <Button onClick={() => onFilterChange('reset')}>Reset Filters</Button>
        </div>
    );
};

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData;
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");

        this.state = {
            loadJobs: [],
            allJobs: [], // Store all jobs fetched from API
            loaderData: loader,
            activePage: 1, // Track the active page for pagination
            totalPages: 1,
            jobsPerPage: 4, // Number of jobs per page (adjust as needed)
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
        };

        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    init() {
        let loaderData = Object.assign({}, this.state.loaderData);
        loaderData.isLoading = false;
        this.setState({ loaderData });
    }

    componentDidMount() {
        this.init();
        this.loadData();
    }

    handleFilterChange(selectedFilters) {
        if (selectedFilters === 'reset') {
            this.setState({
                filter: {
                    showActive: true,
                    showClosed: false,
                    showDraft: true,
                    showExpired: true,
                    showUnexpired: true
                }
            }, this.loadData);
        } else {
            const newFilter = {
                showActive: false,
                showClosed: false,
                showDraft: false,
                showExpired: false,
                showUnexpired: false
            };

            selectedFilters.forEach(filter => {
                newFilter[filter] = true;
            });

            this.setState({ filter: newFilter }, this.loadData);
        }
    }

    handleSortChange(sortOrder) {
        this.setState({ sortBy: { date: sortOrder } }, this.loadData);
    }

    handlePageChange(direction) {
        const { activePage, totalPages } = this.state;

        if (direction === 'next' && activePage < totalPages) {
            this.setState(prevState => ({ activePage: prevState.activePage + 1 }), this.loadData);
        } else if (direction === 'prev' && activePage > 1) {
            this.setState(prevState => ({ activePage: prevState.activePage - 1 }), this.loadData);
        }
    }

    loadData() {
        const link = 'https://talenttalentapp-hpezeeh7b6cgahgn.australiaeast-01.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        const cookies = Cookies.get('talentAuthToken');

        const { activePage, jobsPerPage, sortBy, filter } = this.state;

        const params = {
            activePage,
            limit: jobsPerPage, 
            sortbyDate: sortBy.date,
            showActive: filter.showActive,
            showClosed: filter.showClosed,
            showDraft: filter.showDraft,
            showExpired: filter.showExpired,
            showUnexpired: filter.showUnexpired
        };

        fetch(`${link}?${new URLSearchParams(params)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cookies}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const totalJobs = data.totalCount; 
                    const totalPages = Math.ceil(totalJobs / jobsPerPage); 

                    this.setState({
                        allJobs: data.myJobs,
                        totalPages,
                        loadJobs: data.myJobs 
                    });
                } else {
                    console.error("Error loading jobs:", data.message);
                }
            })
            .catch(error => console.error("API call error:", error));
    }

    componentDidUpdate(prevProps, prevState) {
        // Only update if the active page changes
        if (prevState.activePage !== this.state.activePage) {
            this.loadData();
        }
    }

    render() {
        const { loadJobs, activePage, totalPages } = this.state;

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="manage-jobs-container">
                    <h2>List of Jobs</h2>
                    <FilterComponent
                        filters={this.state.filter}
                        sortBy={this.state.sortBy}
                        onFilterChange={this.handleFilterChange}
                        onSortChange={this.handleSortChange}
                    />
                    {loadJobs.length > 0 ? (
                        <React.Fragment>
                            <Grid columns={4}>
                                {loadJobs.map(job => (
                                    <Grid.Column key={job.id}>
                                        <JobSummaryCard job={job} />
                                    </Grid.Column>
                                ))}
                            </Grid>

                            {/* Pagination controls */}
                            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                <Button
                                    onClick={() => this.handlePageChange('prev')}
                                    disabled={activePage === 1}
                                >
                                    Previous
                                </Button>
                                <span style={{ margin: '0 10px' }}>Page {activePage} of {totalPages}</span>
                                <Button
                                    onClick={() => this.handlePageChange('next')}
                                    disabled={activePage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </React.Fragment>
                    ) : (
                        <p>No jobs found.</p>
                    )}
                </div>
            </BodyWrapper>
        );
    }
}
