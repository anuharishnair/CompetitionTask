import React, { Component } from 'react';

export default class SelfIntroduction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: props.summary || '',
            description: props.description || '',
            originalSummary: props.summary || '',
            originalDescription: props.description || '',
            summaryError: '',
            descriptionError: '',
            isEditing: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    handleInputChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value });

        // Validation
        if (name === 'summary') {
            if (value.length > 150) {
                this.setState({ summaryError: 'Summary must be no more than 150 characters.' });
            } else {
                this.setState({ summaryError: '' });
            }
        }

        if (name === 'description') {
            if (value.length < 150 || value.length > 600) {
                this.setState({ descriptionError: 'Description must be between 150-600 characters.' });
            } else {
                this.setState({ descriptionError: '' });
            }
        }
    }

    save() {
        var summary = this.state.summary;
        var description = this.state.description;

        // Final validation check before saving
        if (summary.length > 150) {
            this.setState({ summaryError: 'Summary must be no more than 150 characters.' });
            return;
        }

        if (description.length < 150 || description.length > 600) {
            this.setState({ descriptionError: 'Description must be between 150-600 characters.' });
            return;
        }

        var data = {
            summary: summary,
            description: description
        };

        this.props.updateProfileData(data);

        // Update original values after saving
        this.setState({
            originalSummary: summary,
            originalDescription: description,
            isEditing: false
        });
    }

    cancel() {
        // Reset to original values
        this.setState({
            summary: this.state.originalSummary,
            description: this.state.originalDescription,
            summaryError: '',
            descriptionError: '',
            isEditing: false
        });
    }

    toggleEdit() {
        this.setState({ isEditing: true });
    }

    render() {
        return (
            <div>
                <div className="field" style={{ marginTop: '10px' }}>
                    <input
                        type="text"
                        name="summary"
                        placeholder="Please provide a short summary about yourself"
                        value={this.state.summary}
                        onChange={this.handleInputChange}
                        style={{ marginBottom: '5px', width: '100%' }}
                        disabled={!this.state.isEditing}
                    />
                    <small style={{ display: 'block', marginBottom: '10px', color: 'gray' }}>
                        Summary must be no more than 150 characters.
                    </small>
                    <p className="error-message" style={{ color: 'red' }}>{this.state.summaryError}</p>
                </div>

                <div className="field">                 
                    <textarea
                        name="description"
                        placeholder="Please tell us about any hobbies, additional expertise, or anything else you'd like to add"
                        value={this.state.description}
                        onChange={this.handleInputChange}
                        style={{ marginBottom: '5px', width: '100%', height: '100px' }}
                        disabled={!this.state.isEditing}
                    ></textarea>
                    <small style={{ display: 'block', marginBottom: '10px', color: 'gray' }}>
                        Description must be between 150-600 characters.
                    </small>
                    <p className="error-message" style={{ color: 'red' }}>{this.state.descriptionError}</p>
                </div>

                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                    {!this.state.isEditing ? (
                        <button
                            type="button"
                            className="ui teal button"
                            onClick={this.toggleEdit}       
                        >
                            Edit
                        </button>
                    ) : (
                        <div>
                            <button
                                type="button"
                                className="ui teal button"
                                onClick={this.save}
                                style={{ marginTop: '10px', marginRight: '10px' }}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="ui button"
                                onClick={this.cancel}
                                style={{ marginTop: '10px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
