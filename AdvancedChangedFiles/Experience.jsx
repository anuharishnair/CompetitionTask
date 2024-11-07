/* Work Experience Section */
import React from 'react';
import Cookies from 'js-cookie';

// Helper function to format dates
function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options).replace(/(\d+)(st|nd|rd|th)/, '$1$2');
}

export default class WorkExperience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            experiences: [],
            isAdding: false,
            isEditing: null,
            newExperience: {
                company: '',
                position: '',
                responsibilities: '',
                startDate: '',
                endDate: '',
            },
        };

        // Binding methods
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleAddClick() {
        this.setState({
            isAdding: true,
            isEditing: null,
            newExperience: { company: '', position: '', responsibilities: '', startDate: '', endDate: '' },
        });
    }

    handleCancelClick() {
        this.setState({
            isAdding: false,
            isEditing: null,
            newExperience: { company: '', position: '', responsibilities: '', startDate: '', endDate: '' },
        });
    }

    handleEditClick(experience, event) {
        event.preventDefault();
        this.setState({
            isEditing: experience.id,
            isAdding: false,
            newExperience: {
                company: experience.company,
                position: experience.position,
                responsibilities: experience.responsibilities,
                startDate: experience.startDate,
                endDate: experience.endDate,
            },
        });
    }

    handleDeleteClick(id, event) {
        event.preventDefault();
        const updatedExperiences = this.state.experiences.filter(exp => exp.id !== id);
        this.setState({ experiences: updatedExperiences });
    }

    handleSaveClick(event) {
        event.preventDefault();
        const { isEditing, newExperience, experiences } = this.state;

        // Validate all required fields
        if (
            newExperience.company.trim() === '' ||
            newExperience.position.trim() === '' ||
            newExperience.responsibilities.trim() === '' ||
            newExperience.startDate.trim() === '' ||
            newExperience.endDate.trim() === ''
        ) {
            TalentUtil.notification.show("Please fill in all required fields!", "error", null, null);
            return;
        }

        if (isEditing) {
            const updatedExperiences = experiences.map(exp =>
                exp.id === isEditing ? Object.assign({}, exp, newExperience) : exp
            );
            this.setState({
                experiences: updatedExperiences,
                isEditing: null,
                newExperience: { company: '', position: '', responsibilities: '', startDate: '', endDate: '' },
            }, () => {
                TalentUtil.notification.show('Profile updated successfully!', 'success');
            });
        } else {
            const newExperienceEntry = Object.assign({ id: Date.now() }, newExperience);
            const updatedExperiences = experiences.concat(newExperienceEntry);
            this.setState({
                experiences: updatedExperiences,
                isAdding: false,
                newExperience: { company: '', position: '', responsibilities: '', startDate: '', endDate: '' },
            }, () => {
                TalentUtil.notification.show('Profile updated successfully!', 'success');
            });
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(prevState => {
            const newExperience = Object.assign({}, prevState.newExperience);
            newExperience[name] = value;
            return { newExperience };
        });
    }

    render() {
        const { experiences, isAdding, isEditing, newExperience } = this.state;

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <table className="ui table" style={{ flex: 1, border: 'none' }}>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Responsibilities</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th style={{ textAlign: 'center' }}>
                                    <button
                                        style={{ marginLeft: '10px' }}
                                        className="ui teal button"
                                        onClick={this.handleAddClick}
                                        type="button"
                                    >
                                        + Add New
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {experiences.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '20px 0', textAlign: 'center', color: 'gray' }}>No data</td>
                                </tr>
                            ) : (
                                experiences.map(experience => (
                                    <tr key={experience.id}>
                                        {isEditing === experience.id ? (
                                            <React.Fragment>
                                                <td><input type="text" name="company" value={newExperience.company} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                                <td><input type="text" name="position" value={newExperience.position} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                                <td><input type="text" name="responsibilities" value={newExperience.responsibilities} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                                <td><input type="date" name="startDate" value={newExperience.startDate} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                                <td><input type="date" name="endDate" value={newExperience.endDate} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button className="ui teal button" onClick={this.handleSaveClick}>Update</button>
                                                    <button className="ui button" onClick={this.handleCancelClick}>Cancel</button>
                                                </td>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <td>{experience.company}</td>
                                                <td>{experience.position}</td>
                                                <td>{experience.responsibilities}</td>
                                                <td>{formatDate(experience.startDate)}</td>
                                                <td>{formatDate(experience.endDate)}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        style={{
                                                            color: 'black',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={this.handleEditClick.bind(this, experience)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        style={{
                                                            color: 'black',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={this.handleDeleteClick.bind(this, experience.id)}
                                                    >
                                                        ❌
                                                    </button>
                                                </td>
                                            </React.Fragment>
                                        )}
                                    </tr>
                                ))
                            )}
                            {isAdding && (
                                <tr>
                                    <td><input type="text" name="company" placeholder="Add Company" value={newExperience.company} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                    <td><input type="text" name="position" placeholder="Add Position" value={newExperience.position} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                    <td><input type="text" name="responsibilities" placeholder="Add Responsibilities" value={newExperience.responsibilities} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                    <td><input type="date" name="startDate" value={newExperience.startDate} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                    <td><input type="date" name="endDate" value={newExperience.endDate} onChange={this.handleChange} style={{ width: '100%' }} /></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="ui teal button" onClick={this.handleSaveClick}>Add</button>
                                        <button className="ui button" onClick={this.handleCancelClick}>Cancel</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
