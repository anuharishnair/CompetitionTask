
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
            {/* Dropdown for filter */}
            <label htmlFor="filter-dropdown" style={{ fontWeight: 'bold' }}>Filter: </label>
            <Dropdown
                selection
                multiple
                options={filterOptions}
                value={Object.keys(filters).filter(key => filters[key])} // Get active filters
                onChange={(e, { value }) => onFilterChange(value)}
                placeholder='Choose filter'
                style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    boxShadow: 'none', 
                }}
            />

            {/* Dropdown for sorting by date */}
            <label htmlFor="filter-dropdown" style={{ fontWeight: 'bold' }}>Sort by date: </label>
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
            loaderData: loader,
            activePage: 1,
            totalPages: 1,
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

    // Handle filter change from multi-select dropdown
    handleFilterChange(selectedFilters) {
        if (selectedFilters === 'reset') {
            // Reset filters to default values
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
        if (direction === 'next' && this.state.activePage < this.state.totalPages) {
            this.setState(prevState => ({ activePage: prevState.activePage + 1 }), this.loadData);
        } else if (direction === 'prev' && this.state.activePage > 1) {
            this.setState(prevState => ({ activePage: prevState.activePage - 1 }), this.loadData);
        }
    }

    loadData() {
        const link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        const cookies = Cookies.get('talentAuthToken');

        const params = {
            activePage: this.state.activePage,
            sortbyDate: this.state.sortBy.date,
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired
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
                    this.setState({
                        loadJobs: data.myJobs,
                        totalPages: Math.ceil(data.totalCount / 4) 
                    });
                } else {
                    console.error("Error loading jobs:", data.message);
                }
            })
            .catch(error => console.error("API call error:", error));
    }

    render() {
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
                    {this.state.loadJobs.length > 0 ? (
                        <React.Fragment>
                            <Grid columns={4}>
                                {this.state.loadJobs.map(job => (
                                    <Grid.Column key={job.id}>
                                        <JobSummaryCard job={job} />
                                    </Grid.Column>
                                ))}
                            </Grid>

                            {/* Pagination controls */}
                            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                <Button
                                    onClick={() => this.handlePageChange('prev')}
                                    disabled={this.state.activePage === 1}
                                >
                                    Previous
                                </Button>
                                <span style={{ margin: '0 10px' }}>Page {this.state.activePage} of {this.state.totalPages}</span>
                                <Button
                                    onClick={() => this.handlePageChange('next')}
                                    disabled={this.state.activePage === this.state.totalPages}
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
