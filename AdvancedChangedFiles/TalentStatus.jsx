import React, { Component } from 'react';

class JobSeekingStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStatus: ''
        };

        this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    handleStatusChange(event) {
        const selectedStatus = event.target.value;
        this.setState({ selectedStatus }, () => {
            console.log('Selected Job Seeking Status:', selectedStatus);

            // Show the success notification after status is updated
            TalentUtil.notification.show('Profile updated successfully!', 'success');
        });
    }

    render() {
        return (
            <div className="job-seeking-status">
                <form>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', marginTop: '10px' }}>
                            Current Status
                        </label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="Actively looking for a job"
                                    checked={this.state.selectedStatus === "Actively looking for a job"}
                                    onChange={this.handleStatusChange}
                                />
                                Actively looking for a job
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="Not looking for a job at the moment"
                                    checked={this.state.selectedStatus === "Not looking for a job at the moment"}
                                    onChange={this.handleStatusChange}
                                />
                                Not looking for a job at the moment
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="Currently employed but open to offers"
                                    checked={this.state.selectedStatus === "Currently employed but open to offers"}
                                    onChange={this.handleStatusChange}
                                />
                                Currently employed but open to offers
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="Will be available on later date"
                                    checked={this.state.selectedStatus === "Will be available on later date"}
                                    onChange={this.handleStatusChange}
                                />
                                Will be available on later date
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default JobSeekingStatus;
