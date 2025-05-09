import React from 'react';
import Cookies from 'js-cookie';

export default class Skills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skills: [],
            isAdding: false,
            isEditing: null,
            newSkill: {
                name: '',
                level: 'Beginner',
            },
            skillLevels: ['Beginner', 'Intermediate', 'Expert'],
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
            newSkill: { name: '', level: 'Beginner' },
        });
    }

    handleCancelClick() {
        this.setState({
            isAdding: false,
            isEditing: null,
            newSkill: { name: '', level: 'Beginner' },
        });
    }

    handleEditClick(skill, event) {
        event.preventDefault();
        this.setState({
            isEditing: skill.id,
            isAdding: false,
            newSkill: { name: skill.name, level: skill.level },
        });
    }

    handleDeleteClick(id, event) {
        event.preventDefault();
        const updatedSkills = this.state.skills.filter(skill => skill.id !== id);
        this.setState({ skills: updatedSkills });
        TalentUtil.notification.show('Profile updated successfully!', 'success');
    }
    handleSaveClick(event) {
        event.preventDefault();
        const { isEditing, newSkill, skills } = this.state;

        if (newSkill.name.trim() === '') {
            TalentUtil.notification.show("Please enter a skill!", "error", null, null);
            return;
        }

        if (isEditing) {
            const updatedSkills = skills.map(skill => {
                if (skill.id === isEditing) {
                    return {
                        id: skill.id,
                        name: newSkill.name,
                        level: newSkill.level,
                    };
                }
                return skill;
            });
            this.setState({
                skills: updatedSkills,
                isEditing: null,
                newSkill: { name: '', level: 'Beginner' },
            }, () => {
                TalentUtil.notification.show('Profile updated successfully!', 'success');
            });
        } else {
            const newSkillEntry = {
                id: Date.now(),
                name: newSkill.name,
                level: newSkill.level,
            };
            const updatedSkills = skills.concat(newSkillEntry);
            this.setState({
                skills: updatedSkills,
                isAdding: false,
                newSkill: { name: '', level: 'Beginner' },
            }, () => {
                TalentUtil.notification.show("Profile updated successfully!", "success");
            });
        }
    }


    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        const updatedNewSkill = Object.assign({}, this.state.newSkill, { [name]: value });
        this.setState({ newSkill: updatedNewSkill });
    }

    render() {
        const { skills, isAdding, isEditing, newSkill, skillLevels } = this.state;

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <table className="ui table" style={{ flex: 1, border: 'none' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Skill</th>
                                <th style={{ textAlign: 'left' }}>Level</th>
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
                            {skills.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '20px 0', textAlign: 'center', color: 'gray' }}>No data</td>
                                </tr>
                            ) : (
                                skills.map(skill => (
                                    <tr key={skill.id}>
                                        {isEditing === skill.id ? (
                                            <React.Fragment>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={newSkill.name}
                                                        onChange={this.handleChange}
                                                        style={{ width: '100%' }}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        name="level"
                                                        value={newSkill.level}
                                                        onChange={this.handleChange}
                                                        style={{ width: '100%' }}
                                                    >
                                                        {skillLevels.map(level => (
                                                            <option key={level} value={level}>
                                                                {level}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button className="ui teal button" onClick={this.handleSaveClick}>
                                                        Update
                                                    </button>
                                                    <button className="ui button" onClick={this.handleCancelClick}>
                                                        Cancel
                                                    </button>
                                                </td>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <td>{skill.name}</td>
                                                <td>{skill.level}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        style={{
                                                            color: 'black',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={event => this.handleEditClick(skill, event)}
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
                                                        onClick={event => this.handleDeleteClick(skill.id, event)}
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
                                    <td>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Add Skill"
                                            value={newSkill.name}
                                            onChange={this.handleChange}
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="level"
                                            value={newSkill.level}
                                            onChange={this.handleChange}
                                            style={{ width: '100%' }}
                                        >
                                            {skillLevels.map(level => (
                                                <option key={level} value={level}>
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="ui teal button" onClick={this.handleSaveClick}>
                                            Add
                                        </button>
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
