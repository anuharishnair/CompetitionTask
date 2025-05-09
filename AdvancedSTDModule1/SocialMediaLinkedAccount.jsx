import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Button } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            linkedIn: (props.linkedAccounts && props.linkedAccounts.linkedIn) || '',
            github: (props.linkedAccounts && props.linkedAccounts.github) || '',
            modalOpen: false,
            modalMessage: '',
            modalColor: '',
            validationError: false
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        $('.ui.button.social-media').popup();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.linkedAccounts !== this.props.linkedAccounts) {
            this.setState({
                linkedIn: this.props.linkedAccounts.linkedIn || '',
                github: this.props.linkedAccounts.github || ''
            });
        }
    }

    toggleEdit() {
        this.setState(prevState => ({
            isEditing: !prevState.isEditing
        }));
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Function to validate URLs
    validateUrls() {
        const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;
        const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/.*$/;

        const isLinkedInValid = linkedInRegex.test(this.state.linkedIn);
        const isGitHubValid = githubRegex.test(this.state.github);

        if (isLinkedInValid && isGitHubValid) {
            return true;
        }

        TalentUtil.notification.show("Please enter valid LinkedIn and GitHub URLs.", "error", null, null);
        return false;
    }

    save() {
        if (this.validateUrls()) {
            const data = {
                linkedAccounts: {
                    linkedIn: this.state.linkedIn,
                    github: this.state.github
                }
            };           
            this.props.saveProfileData(data);

            TalentUtil.notification.show("Profile updated successfully!", "success", null, null);
            this.toggleEdit();
        }
    }

    cancel() {
        this.setState({
            isEditing: false,
            linkedIn: this.props.linkedAccounts.linkedIn || '',
            github: this.props.linkedAccounts.github || '',
            validationError: false
        });
    }

    render() {
        return (
            <div className="ui sixteen wide column">
                {this.state.isEditing ? (
                    <div>
                        <div className="field">
                            <label>LinkedIn</label>
                            <ChildSingleInput
                                inputType="text"
                                name="linkedIn"
                                value={this.state.linkedIn}
                                controlFunc={(e) => {
                                    this.handleInputChange(e);
                                    this.props.updateProfileData({
                                        linkedIn: e.target.value,
                                        github: this.state.github
                                    });
                                }}
                                maxLength={80}
                                placeholder="e.g. https://www.linkedin.com/in/yourprofile"
                            />
                        </div>
                        <div className="field">
                            <label>GitHub</label>
                            <ChildSingleInput
                                inputType="text"
                                name="github"
                                value={this.state.github}
                                controlFunc={(e) => {
                                    this.handleInputChange(e);
                                    this.props.updateProfileData({
                                        linkedIn: this.state.linkedIn,
                                        github: e.target.value
                                    });
                                }}
                                maxLength={80}
                                placeholder="e.g. https://github.com/yourprofile"
                            />
                        </div>
                        <button type="button" className="ui teal button" onClick={this.save}>Save</button>
                        <button type="button" className="ui button" onClick={this.cancel}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <button className="ui linkedin button social-media" onClick={() => window.open(this.state.linkedIn, '_blank')}>
                            <i className="linkedin icon"></i> LinkedIn
                        </button>
                        <button className="ui black button social-media" onClick={() => window.open(this.state.github, '_blank')}>
                            <i className="github icon"></i> GitHub
                        </button>
                        <button type="button" className="ui right floated teal button" onClick={this.toggleEdit}>Edit</button>
                    </div>
                )}
            </div>
        );
    }
}
