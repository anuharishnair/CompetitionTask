import React, { Component } from "react";

class Experience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            experiences: this.props.experienceData || [],
            newExperience: {
                id: null,
                company: "",
                position: "",
                responsibilities: "",
                start: "",
                end: "",
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
                newExperience: Object.assign({}, this.state.newExperience, {
                })
            });
        }

        if (prevProps.experienceData !== this.props.experienceData) {
            this.setState({ experiences: this.props.experienceData });
        }
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState(function (prevState) {
            return {
                newExperience: Object.assign({}, prevState.newExperience, { [name]: value })
            };
        });
    }

    handleSave() {
        const { company, position, responsibilities, start, end } = this.state.newExperience;
        if (!company.trim() || !position.trim()) {
            alert("Please fill out the company and position fields.");
            return;
        }

        var updatedExperiences;
        const { editingId, experiences } = this.state;

        if (editingId !== null) {
            // Edit the existing experience
            updatedExperiences = experiences.map(function (exp) {
                return exp.id === editingId ? Object.assign({}, this.state.newExperience) : exp;
            }.bind(this));
        } else {
            // Add a new experience
            updatedExperiences = experiences.concat(Object.assign({}, this.state.newExperience));
        }

        this.setState({
            experiences: updatedExperiences,
            newExperience: { id: null, company: "", position: "", responsibilities: "", start: "", end: "" },
            isAdding: false,
            editingId: null
        });

        // Send the raw date values (without formatting) in the payload
        this.props.updateProfileData({
            experience: updatedExperiences.map(function (exp) {
                return Object.assign({}, exp, {
                    start: exp.start, 
                    end: exp.end     
                });
            })
        });
    }

    handleCancel() {
        this.setState({
            newExperience: { id: null, company: "", position: "", responsibilities: "", start: "", end: "" },
            isAdding: false,
            editingId: null
        });
    }

    handleEdit(id, event) {
        event.preventDefault();
        const exp = this.state.experiences.find(function (e) {
            return e.id === id;
        });
        //console.log("startdate before format:", exp.start);
        const formattedStart = this.formatDate(exp.start);
        const formattedEnd = this.formatDate(exp.end);
        this.setState({
            newExperience: Object.assign({}, exp, {
                start: formattedStart,
                end: formattedEnd
            }),
            editingId: id,
            isAdding: false
        });
        //console.log("startdate after format:", formattedStart);
    }



    handleDelete(id) {
        const updatedExperiences = this.state.experiences.filter(function (exp) {
            return exp.id !== id;
        });
        this.setState({ experiences: updatedExperiences });
        this.props.updateProfileData({ experience: updatedExperiences });
    }

    // Helper function to format date to YYYY-MM-DD 
    formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');        
        return `${year}-${month}-${day}`; 
    }


    render() {
        const { experiences, newExperience, isAdding, editingId } = this.state;

        return (
            <div style={{ width: "100%" }}>
                <table className="ui table" style={{ border: "none", borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", padding: "10px" }}>Company</th>
                            <th style={{ textAlign: "left", padding: "10px" }}>Position</th>
                            <th style={{ textAlign: "left", padding: "10px" }}>Responsibilities</th>
                            <th style={{ textAlign: "left", padding: "10px" }}>Start Date</th>
                            <th style={{ textAlign: "left", padding: "10px" }}>End Date</th>
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
                        {experiences.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", color: "gray", padding: "10px" }}>
                                    No data
                                </td>
                            </tr>
                        ) : (
                            experiences.map((exp) => (
                                <tr key={exp.id}>
                                    {editingId === exp.id ? (
                                        <td colSpan="6">
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={newExperience.company}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Enter company name"
                                                    style={{ marginRight: "10px" }}
                                                />
                                                <input
                                                    type="text"
                                                    name="position"
                                                    value={newExperience.position}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Enter position"
                                                    style={{ marginRight: "10px" }}
                                                />
                                                <input
                                                    type="text"
                                                    name="responsibilities"
                                                    value={newExperience.responsibilities}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Enter responsibilities"
                                                    style={{ marginRight: "10px" }}
                                                />
                                                <input
                                                    type="date"
                                                    name="start"
                                                    value={newExperience.start}
                                                    onChange={this.handleInputChange}
                                                    min={new Date().toISOString().split('T')[0]}  // Min date logic
                                                    style={{ marginRight: "10px" }}
                                                />
                                                <input
                                                    type="date"
                                                    name="end"
                                                    value={newExperience.end}
                                                    onChange={this.handleInputChange}
                                                    min={new Date().toISOString().split('T')[0]}  // Min date logic
                                                    style={{ marginRight: "10px" }}
                                                />
                                                <button className="ui teal button" onClick={this.handleSave}>
                                                    Save
                                                </button>
                                                <button className="ui button" onClick={this.handleCancel}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    ) : (
                                        <td colSpan="6">
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span>{exp.company}</span>
                                                <span>{exp.position}</span>
                                                <span>{exp.responsibilities}</span>
                                                <span>{this.formatDate(exp.start)}</span> 
                                                <span>{this.formatDate(exp.end)}</span> 
                                                <div>
                                                    <button
                                                        onClick={(event) => this.handleEdit(exp.id, event)}
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
                                                        onClick={() => this.handleDelete(exp.id)}
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
                                <td colSpan="6">
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <input
                                            type="text"
                                            name="company"
                                            value={newExperience.company}
                                            onChange={this.handleInputChange}
                                            placeholder="Enter company name"
                                            style={{ marginRight: "10px" }}
                                        />
                                        <input
                                            type="text"
                                            name="position"
                                            value={newExperience.position}
                                            onChange={this.handleInputChange}
                                            placeholder="Enter position"
                                            style={{ marginRight: "10px" }}
                                        />
                                        <input
                                            type="text"
                                            name="responsibilities"
                                            value={newExperience.responsibilities}
                                            onChange={this.handleInputChange}
                                            placeholder="Enter responsibilities"
                                            style={{ marginRight: "10px" }}
                                        />
                                        <input
                                            type="date"
                                            name="start"
                                            value={newExperience.start}
                                            onChange={this.handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            style={{ marginRight: "10px" }}
                                        />
                                        <input
                                            type="date"
                                            name="end"
                                            value={newExperience.end}
                                            onChange={this.handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            style={{ marginRight: "10px" }}
                                        />
                                        <button className="ui teal button" onClick={this.handleSave}>
                                            Save
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

export default Experience;