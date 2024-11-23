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

        // Binding methods to avoid 'this' issues in older React versions
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
            alert('Please enter a skill name.');
            return;
        }

        let updatedSkills;
        const { editingId, skills } = this.state;

        if (editingId !== null) {
            // Edit the existing skill
            updatedSkills = skills.map(function (skill) {
                return skill.id === editingId ? Object.assign({}, this.state.newSkill) : skill;
            }.bind(this));
        } else {
            // Add a new skill
            updatedSkills = skills.concat(Object.assign({}, this.state.newSkill));
        }

        this.setState({
            skills: updatedSkills,
            newSkill: { name: '', level: 'Beginner' },
            isAdding: false,
            editingId: null,
        });

        // Call the method to update the profile with the new/updated skill
        this.props.updateProfileData({ skills: updatedSkills });
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

    render() {
        const { skills, newSkill, isAdding, editingId } = this.state;
        const skillLevels = ['Beginner', 'Intermediate', 'Expert'];

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
                        {skills.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', color: 'gray', padding: '10px' }}>
                                    No data
                                </td>
                            </tr>
                        ) : (
                            skills.map((skill) => (
                                <tr key={skill.id}>
                                    {editingId === skill.id ? (
                                        <td colSpan="3">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={newSkill.name}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Enter skill name"
                                                    style={{ marginRight: '10px' }}
                                                />
                                                <select
                                                    name="level"
                                                    value={newSkill.level}
                                                    onChange={this.handleInputChange}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    {skillLevels.map(function (level) {
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
                                    ) : (
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
                                    )}
                                </tr>
                            ))
                        )}
                        {isAdding && (
                            <tr>
                                <td colSpan="3">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newSkill.name}
                                            onChange={this.handleInputChange}
                                            placeholder="Enter skill name"
                                            style={{ marginRight: '10px' }}
                                        />
                                        <select
                                            name="level"
                                            value={newSkill.level}
                                            onChange={this.handleInputChange}
                                            style={{ marginRight: '10px' }}
                                        >
                                            {skillLevels.map((level) => (
                                                <option key={level} value={level}>
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                        <button className="ui teal button" onClick={this.handleSave}>
                                            Add
                                        </button>
                                        <button className="ui button" onClick={this.handleCancel}>
                                            Cancel
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default SkillsComponent;
