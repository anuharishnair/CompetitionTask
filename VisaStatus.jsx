import React from 'react';

class VisaStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visaType: this.props.visaStatus || '',
            visaExpiryDate: this.props.visaExpiryDate || ''
        };

        this.handleVisaTypeChange = this.handleVisaTypeChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Update state when visaType is changed
    handleVisaTypeChange(event) {
        const selectedVisaType = event.target.value;
        this.setState({
            visaType: selectedVisaType,
            visaExpiryDate: selectedVisaType === 'Work Visa' || selectedVisaType === 'Student Visa' ? this.state.visaExpiryDate : ''
        }, () => {
            // Notify parent about the update
            this.props.updateProfileData({
                visaStatus: this.state.visaType,
                visaExpiryDate: this.state.visaExpiryDate
            });
        });
    }
    componentDidUpdate(prevProps) {        
        if (prevProps.visaStatus !== this.props.visaStatus || prevProps.visaExpiryDate !== this.props.visaExpiryDate) {          
            let formattedExpiryDate = this.props.visaExpiryDate;
            if (formattedExpiryDate) {
                const date = new Date(formattedExpiryDate);
                formattedExpiryDate = date.toISOString().split('T')[0]; 
            }

            this.setState({
                visaType: this.props.visaStatus,
                visaExpiryDate: formattedExpiryDate
            });
        }
    }


    // Update visaExpiryDate state when changed
    handleDateChange(event) {
        this.setState({ visaExpiryDate: event.target.value }, () => {          
            this.props.updateProfileData({
                visaStatus: this.state.visaType,
                visaExpiryDate: this.state.visaExpiryDate
            });
        });
    }

    // Handle form submission and validation
    handleSubmit(event) {
        event.preventDefault();

        const { visaType, visaExpiryDate } = this.state;

        // Validation for required fields
        if (!visaType) {
            TalentUtil.notification.show("Please enter visa type!", "error", null, null);
            return;
        }

        if ((visaType === 'Work Visa' || visaType === 'Student Visa') && !visaExpiryDate) {
            TalentUtil.notification.show("Please enter visa expiry date!", "error", null, null);
            return;
        }

        // If all required fields are filled
        console.log('Visa Type:', visaType);
        console.log('Visa Expiry Date:', visaExpiryDate);

        // Notify parent that the profile is saved
        this.props.saveProfileData({
            visaStatus: visaType,
            visaExpiryDate: visaExpiryDate
        });

        TalentUtil.notification.show('Profile updated successfully!', 'success');
    }

    render() {
        return (
            <div className="visa-status">
                <form onSubmit={this.handleSubmit}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="visaType" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', marginTop: '10px' }}>
                                Visa Type:
                            </label>
                            <select
                                id="visaType"
                                value={this.state.visaType}
                                onChange={this.handleVisaTypeChange}
                                style={{ width: '100%', padding: '8px' }}
                            >
                                <option value="">Select Visa Type</option>
                                <option value="Citizen">Citizen</option>
                                <option value="Permanent Resident">Permanent Resident</option>
                                <option value="Work Visa">Work Visa</option>
                                <option value="Student Visa">Student Visa</option>
                            </select>
                        </div>

                        {(this.state.visaType === 'Work Visa' || this.state.visaType === 'Student Visa') && (
                            <div style={{ flex: 1 }}>
                                <label htmlFor="visaExpiryDate" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', marginTop: '10px' }}>
                                    Visa Expiry Date:
                                </label>
                                <input
                                    id="visaExpiryDate"
                                    type="date"
                                    value={this.state.visaExpiryDate}
                                    onChange={this.handleDateChange}
                                    style={{ width: '100%', padding: '8px' }}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                                alignSelf: 'flex-end'
                            }}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default VisaStatus;
