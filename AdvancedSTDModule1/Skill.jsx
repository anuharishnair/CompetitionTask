import React, { Component } from 'react';

class SkillsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skills: this.props.skillData || [],
            newSkill: {
                name: '',
                level: 'Beginner',
            },
            isAdding: false,
            editingId: null,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.skillData !== this.props.skillData) {
            this.setState({ skills: this.props.skillData });
        }
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState(function (prevState) {
            return {
                newSkill: Object.assign({}, prevState.newSkill, { [name]: value }),
            };
        });
    }

    handleSave() {
        const { name, level } = this.state.newSkill;
        if (!name.trim()) {
            TalentUtil.notification.show("Please enter a skill name!", "error", null, null);
            return;
        }

        let updatedSkills;
        const { editingId, skills } = this.state;

        if (editingId !== null) {
            updatedSkills = skills.map(function (skill) {
                return skill.id === editingId ? Object.assign({}, this.state.newSkill) : skill;
            }.bind(this));
        } else {
            updatedSkills = skills.concat(Object.assign({}, this.state.newSkill));
        }

        this.setState({
            skills: updatedSkills,
            newSkill: { name: '', level: 'Beginner' },
            isAdding: false,
            editingId: null,
        });

        this.props.updateProfileData({ skills: updatedSkills });
        TalentUtil.notification.show("Profile updated successfully!", "success", null, null);
        window.location.reload();
    }

    handleCancel() {
        this.setState({
            newSkill: { name: '', level: 'Beginner' },
            isAdding: false,
            editingId: null,
        });
    }

    handleEdit(id, event) {
        event.preventDefault();
        const skill = this.state.skills.find(function (s) {
            return s.id === id;
        });
        this.setState({
            newSkill: Object.assign({}, skill),
            editingId: id,
            isAdding: false,
        });
    }

    handleDelete(id) {
        const updatedSkills = this.state.skills.filter(function (skill) {
            return skill.id !== id;
        });
        this.setState({ skills: updatedSkills });
        this.props.updateProfileData({ skills: updatedSkills });
    }

    renderNoDataRow() {
        return (
            <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'gray', padding: '10px' }}>
                    No data
                </td>
            </tr>
        );
    }

    renderEditSkillRow(skill) {
        const skillLevels = ['Beginner', 'Intermediate', 'Expert'];
        return (
            <tr key={skill.id}>
                <td colSpan="3">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <input
                            type="text"
                            name="name"
                            value={this.state.newSkill.name}
                            onChange={this.handleInputChange}
                            placeholder="Enter skill name"
                            style={{ marginRight: '10px' }}
                        />
                        <select
                            name="level"
                            value={this.state.newSkill.level}
                            onChange={this.handleInputChange}
                            style={{ marginRight: '10px' }}
                        >
                            {['Beginner', 'Intermediate', 'Expert'].map(function (level) {
                                return (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                );
                            })}
                        </select>
                        <button className="ui teal button" onClick={this.handleSave}>
                            Save
                        </button>
                        <button className="ui button" onClick={this.handleCancel}>
                            Cancel
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    renderSkillRow(skill) {
        return (
            <tr key={skill.id}>
                <td colSpan="3">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{skill.name}</span>
                        <span>{skill.level}</span>
                        <div>
                            <button
                                onClick={(event) => this.handleEdit(skill.id, event)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginRight: '10px',
                                }}
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => this.handleDelete(skill.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    render() {
        const { skills, isAdding, editingId } = this.state;

        return (
            <div style={{ width: '100%' }}>
                <table className="ui table" style={{ border: 'none', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Skill</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Level</th>
                            <th style={{ textAlign: 'center', padding: '10px' }}>
                                {!isAdding && editingId === null && (
                                    <button className="ui teal button" onClick={() => this.setState({ isAdding: true })}>
                                        + Add New
                                    </button>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.length === 0
                            ? this.renderNoDataRow()
                            : skills.map(skill =>
                                editingId === skill.id
                                    ? this.renderEditSkillRow(skill)
                                    : this.renderSkillRow(skill)
                            )}

                        {isAdding && this.renderEditSkillRow({ id: 'new', name: '', level: 'Beginner' })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default SkillsComponent;
