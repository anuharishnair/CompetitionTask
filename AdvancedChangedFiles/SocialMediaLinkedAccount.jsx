import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            linkedIn: props.linkedAccounts.linkedIn || '',
            github: props.linkedAccounts.github || ''
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
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

    save() {
        const data = {
            linkedIn: this.state.linkedIn,
            github: this.state.github
        };
        this.props.updateProfileData(data);
        this.toggleEdit();
    }

    cancel() {
        this.setState({
            isEditing: false,
            linkedIn: this.props.linkedAccounts.linkedIn || '',
            github: this.props.linkedAccounts.github || ''
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
                                controlFunc={this.handleInputChange}
                                maxLength={80}
                                placeholder="Enter your LinkedIn URL"
                            />
                        </div>
                        <div className="field">
                            <label>GitHub</label>
                            <ChildSingleInput
                                inputType="text"
                                name="github"
                                value={this.state.github}
                                controlFunc={this.handleInputChange}
                                maxLength={80}
                                placeholder="Enter your GitHub URL"
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
