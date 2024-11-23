import React, { Component } from "react";

class LanguageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: this.props.languageData || [],
            newLanguage: {
                name: "",
                level: "Basic",
                currentUserId: this.props.UserId
            },
            isAdding: false,
            editingId: null
        };

        // Binding methods to avoid 'this' issues in older React versions
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.UserId !== this.props.UserId) {
            this.setState({
                newLanguage: Object.assign({}, this.state.newLanguage, {
                    currentUserId: this.props.UserId
                })
            });
        }

        if (prevProps.languageData !== this.props.languageData) {
            this.setState({ languages: this.props.languageData });
        }
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState(function (prevState) {
            return {
                newLanguage: Object.assign({}, prevState.newLanguage, { [name]: value })
            };
        });
    }

    handleSave() {
        const { name, level } = this.state.newLanguage;
        if (!name.trim()) {
            alert("Please enter a language name.");
            return;
        }

        let updatedLanguages;
        const { editingId, languages } = this.state;

        if (editingId !== null) {
            // Edit the existing language
            updatedLanguages = languages.map(function (lang) {
                return lang.id === editingId ? Object.assign({}, this.state.newLanguage) : lang;
            }.bind(this));
        } else {
            // Add a new language
            updatedLanguages = languages.concat(Object.assign({}, this.state.newLanguage));
        }

        this.setState({
            languages: updatedLanguages,
            newLanguage: { name: "", level: "Basic", currentUserId: this.props.UserId },
            isAdding: false, 
            editingId: null
        });

        // Call the method to update the profile with the new/updated language
        this.props.updateProfileData({ languages: updatedLanguages });
    }

    handleCancel() {
        this.setState({
            newLanguage: { name: "", level: "Basic", currentUserId: this.props.UserId },
            isAdding: false,
            editingId: null
        });
    }

    handleEdit(id, event) {
        event.preventDefault();
        const lang = this.state.languages.find(function (l) {
            return l.id === id;
        });
        this.setState({
            newLanguage: Object.assign({}, lang),
            editingId: id,
            isAdding: false
        });
    }

    handleDelete(id) {
        const updatedLanguages = this.state.languages.filter(function (lang) {
            return lang.id !== id;
        });
        this.setState({ languages: updatedLanguages });
        this.props.updateProfileData({ languages: updatedLanguages });
    }

    render() {
        const { languages, newLanguage, isAdding, editingId } = this.state;
        const languageLevels = ["Basic", "Conversational", "Fluent", "Native/Bilingual"];

        return (
            <div style={{ width: "100%" }}>
                <table className="ui table" style={{ border: "none", borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", padding: "10px" }}>Language</th>
                            <th style={{ textAlign: "left", padding: "10px" }}>Level</th>
                            <th style={{ textAlign: "center", padding: "10px" }}>
                                {!isAdding && editingId === null && (
                                    <button className="ui teal button" onClick={() => this.setState({ isAdding: true })}>
                                        + Add New
                                    </button>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {languages.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center", color: "gray", padding: "10px" }}>
                                    No data
                                </td>
                            </tr>
                        ) : (
                            languages.map((lang) => (
                                <tr key={lang.id}>
                                    {editingId === lang.id ? (
                                        <td colSpan="3">
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={newLanguage.name}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Enter language name"
                                                    style={{ marginRight: "10px" }}
                                                />
                                                <select
                                                    name="level"
                                                    value={newLanguage.level}
                                                    onChange={this.handleInputChange}
                                                    style={{ marginRight: "10px" }}
                                                >
                                                    {languageLevels.map(function (level) {
                                                        return <option key={level} value={level}>{level}</option>;
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
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span>{lang.name}</span>
                                                <span>{lang.level}</span>
                                                <div>
                                                    <button
                                                        onClick={(event) => this.handleEdit(lang.id, event)}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            marginRight: "10px"
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => this.handleDelete(lang.id)}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer"
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
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newLanguage.name}
                                            onChange={this.handleInputChange}
                                            placeholder="Enter language name"
                                            style={{ marginRight: "10px" }}
                                        />
                                        <select
                                            name="level"
                                            value={newLanguage.level}
                                            onChange={this.handleInputChange}
                                            style={{ marginRight: "10px" }}
                                        >
                                            {languageLevels.map((level) => (
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

export default LanguageComponent;
