import React from 'react';
import Cookies from 'js-cookie';

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            isAdding: false,
            isEditing: null,
            newLanguage: {
                name: '',
                level: 'Basic',
            },
            languageLevels: ['Basic', 'Conversational', 'Fluent', 'Native/Bilingual'],
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
            newLanguage: { name: '', level: 'Basic' },
        });
    }

    handleCancelClick() {
        this.setState({
            isAdding: false,
            isEditing: null,
            newLanguage: { name: '', level: 'Basic' },
        });
    }

    handleEditClick(language, event) {
        event.preventDefault();
        this.setState({
            isEditing: language.id,
            isAdding: false,
            newLanguage: { name: language.name, level: language.level },
        });
    }

    handleDeleteClick(id, event) {
        event.preventDefault();
        const updatedLanguages = this.state.languages.filter(function (lang) {
            return lang.id !== id;
        });
        this.setState({ languages: updatedLanguages });
    }

    handleSaveClick(event) {
        event.preventDefault();
        const { isEditing, newLanguage, languages } = this.state;

        if (newLanguage.name.trim() === '') {
            TalentUtil.notification.show("Please enter a language name", "error", null, null);
            return;
        }

        if (isEditing) {
            const updatedLanguages = languages.map((lang) => {
                if (lang.id === isEditing) {
                    return {
                        id: lang.id,
                        name: newLanguage.name,
                        level: newLanguage.level,
                    };
                }
                return lang;
            });
            this.setState({
                languages: updatedLanguages,
                isEditing: null,
                newLanguage: { name: '', level: 'Basic' },
            }, () => {
                TalentUtil.notification.show("Profile updated successfully!", "success");
            });
        } else {
            const newLang = {
                id: Date.now(),
                name: newLanguage.name,
                level: newLanguage.level,
            };
            const updatedLanguages = languages.concat(newLang);
            this.setState({
                languages: updatedLanguages,
                isAdding: false,
                newLanguage: { name: '', level: 'Basic' },
            }, () => {
                TalentUtil.notification.show("Profile updated successfully!", "success");
            });
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        const updatedNewLanguage = Object.assign({}, this.state.newLanguage);
        updatedNewLanguage[name] = value;
        this.setState({ newLanguage: updatedNewLanguage });
    }

    render() {
        const { languages, isAdding, isEditing, newLanguage, languageLevels } = this.state;

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <table className="ui table" style={{ flex: 1, border: 'none' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Language</th>
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
                            {languages.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '20px 0', textAlign: 'center', color: 'gray' }}>No data</td>
                                </tr>
                            ) : (
                                languages.map((lang) => (
                                    <tr key={lang.id}>
                                        {isEditing === lang.id ? (
                                            <React.Fragment>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={newLanguage.name}
                                                        onChange={this.handleChange}
                                                        style={{ width: '100%' }}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        name="level"
                                                        value={newLanguage.level}
                                                        onChange={this.handleChange}
                                                        style={{ width: '100%' }}
                                                    >
                                                        {languageLevels.map((level) => (
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
                                                <td>{lang.name}</td>
                                                <td>{lang.level}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        style={{
                                                            color: 'black',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={(event) => this.handleEditClick(lang, event)}
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
                                                        onClick={(event) => this.handleDeleteClick(lang.id, event)}
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
                                            placeholder="Add Language"
                                            value={newLanguage.name}
                                            onChange={this.handleChange}
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="level"
                                            value={newLanguage.level}
                                            onChange={this.handleChange}
                                            style={{ width: '100%' }}
                                        >
                                            {languageLevels.map((level) => (
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
