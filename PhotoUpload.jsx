import React, { Component } from 'react';
import 'regenerator-runtime/runtime';

export default class PhotoUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePhoto: this.props.imageId || null, 
            profilePhotoUrl: this.props.imageId || null,
            file: null, 
            uploading: false,
            isEditing: false, 
        };
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleUploadClick = this.handleUploadClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleUploadAction = this.handleUploadAction.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        // Handle prop change if needed 
        if (this.props.imageId !== prevProps.imageId) {
            console.log("componentDidUpdate triggered: Image ID changed");
            this.setState({
                profilePhotoUrl: this.props.imageId,
                profilePhoto: this.props.photoName || null,
            });
        }
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            const self = this;
            reader.onload = function (e) {
                self.setState({
                    profilePhoto: e.target.result, 
                    file: file, 
                    isEditing: true, 
                    profilePhotoUrl: e.target.result, 
                });
            };
            reader.readAsDataURL(file); 
        }
    }

    handleUploadClick() {
        // Trigger the file input to allow user to choose a new file
        if (this.fileInput) {
            this.fileInput.value = null; 
        }
        this.fileInput.click(); 
    }

    handleCancelClick() {
        // Reset the state to the original photo or clear if not available
        this.setState({
            profilePhoto: this.props.imageId || null,
            profilePhotoUrl: this.props.imageId || null,
            file: null,
            isEditing: false, 
        });
    }

    handleUploadAction(event) {
        event.preventDefault();

        if (!this.state.file && !this.state.profilePhoto) {
            console.log("No file selected or no photo to upload");
            return; 
        }

        console.log("File selected:", this.state.file ? this.state.file.name : "No file selected");
        this.setState({ uploading: true });

        const formData = new FormData();
        formData.append('file', this.state.file || ''); 

        const self = this;

        fetch(this.props.savePhotoUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.props.bearToken, 
            },
            body: formData,
        })
            .then(function (response) {
                if (!response.ok) {
                    console.error('Failed to upload photo. Response not OK:', response);
                    throw new Error('Failed to upload photo.');
                }
                return response.json(); 
            })
            .then(function (data) {
                if (data.profilePhotoUrl) {
                    const newImageUrl = data.profilePhotoUrl;
                    const fileName = newImageUrl.split('/').pop();

                    // Update parent with the new image
                    const updatedData = {
                        profilePhoto: fileName,
                        profilePhotoUrl: newImageUrl,
                    };

                    // Call the saveProfileData function after successful upload
                    if (self.props.saveProfileData) {
                        self.props.saveProfileData(updatedData); 
                    }

                    // Update local state with the new image data
                    self.setState({
                        profilePhoto: fileName,
                        profilePhotoUrl: newImageUrl,
                        isEditing: false, 
                    });
                } else {
                    console.log("Error: No profile photo URL returned from server.");
                }

                self.setState({
                    uploading: false,
                    file: null, 
                });
            })
            .catch(function (error) {
                console.error("Error during upload:", error);
                self.setState({ uploading: false });
            });
    }

    handleEditClick(event) {
        event.preventDefault();
        this.setState({
            profilePhoto: null, 
            file: null, 
            isEditing: true, 
        });

        // Trigger file input click to allow user to select a new file
        if (this.fileInput) {
            this.fileInput.click();
        }
    }

    render() {
        const { profilePhoto, uploading, isEditing, profilePhotoUrl } = this.state;

        const buttonStyle = {
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '4px',
        };

        const profileContainerStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '10px 0',
        };

        return (
            <div className="photo-upload">
                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={input => { this.fileInput = input; }}
                    onChange={this.handleFileChange}
                />

                <div style={profileContainerStyle}>
                    {profilePhotoUrl ? (
                        <div>
                            <img
                                src={profilePhotoUrl}
                                alt="Profile"
                                className="profile-photo"
                                style={{
                                    maxWidth: '200px', maxHeight: '200px',
                                    display: 'block', margin: '10px auto',
                                }}
                            />
                            <div style={{ marginTop: '10px' }}>
                                {!isEditing ? (
                                    <button
                                        style={Object.assign({}, buttonStyle, { backgroundColor: 'green', color: 'white', marginRight: '10px' })}
                                        onClick={this.handleEditClick}
                                    >
                                        Edit Photo
                                    </button>
                                ) : (
                                    <button
                                        style={Object.assign({}, buttonStyle, { backgroundColor: 'blue', color: 'white', marginRight: '10px' })}
                                        onClick={this.handleUploadAction}
                                    >
                                        Upload Photo
                                    </button>
                                )}
                                <button
                                    style={Object.assign({}, buttonStyle, { backgroundColor: 'grey', color: 'white' })}
                                    onClick={this.handleCancelClick}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <img
                            src="/icons/camera.png"
                            alt="Camera Icon"
                            style={{
                                display: 'inline-block',
                                marginRight: '10px',
                                width: '50px',
                                height: '50px',
                                cursor: 'pointer',
                            }}
                            onClick={this.handleUploadClick}
                        />
                    )}
                </div>
            </div>
        );
    }
}
