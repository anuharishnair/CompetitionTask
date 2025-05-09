import React, { Component } from 'react';

class TalentStatus extends Component {
    constructor(props) {
        super(props);
        // Check localStorage for the saved status on initial load
        const savedStatus = localStorage.getItem('jobSeekingStatus');
        this.state = {
            selectedStatus: savedStatus || '',  
            availableDate: null,
            statusOptions: [
                "Actively looking for a job",
                "Not looking for a job at the moment",
                "Currently employed but open to offers",
                "Will be available on later date",
            ]
        };

        this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    handleStatusChange(event) {
        const selectedStatus = event.target.value;
        this.setState(
            {
                selectedStatus,
                availableDate: null,
            },
            () => {           

                // Save the selected status to localStorage to persist it after page refresh
                localStorage.setItem('jobSeekingStatus', selectedStatus);

                // Call the update function to update the profile data
                this.props.updateProfileData({
                    jobSeekingStatus: {
                        status: selectedStatus,
                        availableDate: this.state.availableDate,
                    }
                });

                // Call saveProfileData after updating the status
                this.props.saveProfileData({
                    jobSeekingStatus: {
                        status: selectedStatus,
                        availableDate: this.state.availableDate,
                    }
                });

                // Show the success notification after status is updated
                TalentUtil.notification.show('Profile updated successfully!', 'success');
            }
        );
    }

    render() {
        return (
            <div className="job-seeking-status">
                <form>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', marginTop: '10px' }}>
                            Current Status
                        </label>
                        {this.state.statusOptions.map((status, index) => (
                            <div key={index}>
                                <label>
                                    <input
                                        type="radio"
                                        value={status}
                                        checked={this.state.selectedStatus === status} 
                                        onChange={this.handleStatusChange}
                                    />
                                    {status}
                                </label>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        );
    }
}

export default TalentStatus;
