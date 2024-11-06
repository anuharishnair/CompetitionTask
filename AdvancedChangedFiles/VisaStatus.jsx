import React from 'react';
import { SingleInput } from '../Form/SingleInput.jsx';

class VisaStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visaType: '',
            visaExpiryDate: ''
        };

        this.handleVisaTypeChange = this.handleVisaTypeChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleVisaTypeChange(event) {
        const selectedVisaType = event.target.value;
        this.setState({
            visaType: selectedVisaType,
            visaExpiryDate: selectedVisaType === 'Work Visa' || selectedVisaType === 'Student Visa' ? this.state.visaExpiryDate : ''
        });
    }

    handleDateChange(event) {
        this.setState({ visaExpiryDate: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('Visa Type:', this.state.visaType);
        console.log('Visa Expiry Date:', this.state.visaExpiryDate);
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
                                <SingleInput
                                    id="visaExpiryDate"
                                    type="date"
                                    value={this.state.visaExpiryDate}
                                    onChange={this.handleDateChange}
                                    style={{ width: '100%', padding: '8px' }}
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
