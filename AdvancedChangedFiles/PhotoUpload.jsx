import React, { Component } from 'react';

export default class PhotoUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImage: null,
            imagePreviewUrl: '',
            isImageUploaded: false
        };

        // Create a ref for the file input element
        this.fileInputRef = React.createRef();

        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.openFilePicker = this.openFilePicker.bind(this);
    }

    // Handle file selection and validate image type
    handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            // Check if the file is an image (JPG, JPEG, PNG)
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const imagePreviewUrl = URL.createObjectURL(file);
                this.setState({
                    selectedImage: file,
                    imagePreviewUrl,
                    isImageUploaded: false
                });
            } else {
                alert("Please select a valid image (JPG, PNG)");
            }
        }
    }

    // Handle image upload (can be integrated with an API to save the image)
    handleImageUpload() {
        if (this.state.selectedImage) {            
            console.log("Uploading image:", this.state.selectedImage);
            this.setState({ isImageUploaded: true });
        } else {
            alert("Please select an image to upload.");
        }
    }

    // Function to open the file picker when camera icon is clicked
    openFilePicker() {
        this.fileInputRef.current.click();  
    }

    render() {
        return (
            <div className="photo-upload">
                <div className="photo-upload-container">
                    {/* If image is uploaded, show the uploaded image */}
                    {this.state.isImageUploaded && this.state.imagePreviewUrl ? (
                        <div>
                            <img src={this.state.imagePreviewUrl} alt="Uploaded" style={{ width: '150px', height: '150px' }} />
                        </div>
                    ) : (
                        <div className="camera-icon" style={{ cursor: 'pointer', fontSize: '50px' }} onClick={this.openFilePicker}>
                            <span role="img" aria-label="camera">📸</span> 
                        </div>
                    )}

                    {/* File picker to select an image, hidden by default */}
                    <input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={this.handleImageChange}
                        style={{ display: 'none' }}
                        ref={this.fileInputRef}  
                    />

                    {/* Show the image thumbnail and upload button after selecting an image */}
                    {this.state.selectedImage && !this.state.isImageUploaded && (
                        <div>
                            <img
                                src={this.state.imagePreviewUrl}
                                alt="Selected"
                                style={{ width: '100px', height: '100px', marginTop: '10px' }}
                            />
                            <button
                                onClick={this.handleImageUpload}
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    padding: '8px 16px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    marginTop: '10px'
                                }}
                            >
                                Upload
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
