import React from 'react';
import Cookies from 'js-cookie';
import SocialMediaLinkedAccount from './SocialMediaLinkedAccount.jsx';
import { IndividualDetailSection } from './ContactDetail.jsx';
import FormItemWrapper from '../Form/FormItemWrapper.jsx';
import { Address, Nationality } from './Location.jsx';
import Language from './Language.jsx';
import Skill from './Skill.jsx';
import Education from './Education.jsx';
import Certificate from './Certificate.jsx';
import VisaStatus from './VisaStatus.jsx';
import PhotoUpload from './PhotoUpload.jsx';
import VideoUpload from './VideoUpload.jsx';
import CVUpload from './CVUpload.jsx';
import SelfIntroduction from './SelfIntroduction.jsx';
import Experience from './Experience.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import { LoggedInNavigation } from '../Layout/LoggedInNavigation.jsx';
import TalentStatus from './TalentStatus.jsx';

export default class AccountProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            profileData: {
                address: {
                    number: "",
                    street: "",
                    suburb: "",
                    postCode: 0,
                    city: "",
                    country: ""
                },
                nationality: null,
                education: [],
                languages: [],
                skills: [],
                experience: [],
                certifications: [],
                visaStatus: null,
                visaExpiryDate: null,
                profilePhoto: null,
                linkedAccounts: {
                    linkedIn: "",
                    github: ""
                },
                jobSeekingStatus: {
                    Status: "",           
                    AvailableDate: null   
                },
                id: "",
                firstName: "",
                middleName: null,
                lastName: "",
                gender: null,
                email: null,
                phone: null,
                mobilePhone: null,
                isMobilePhoneVerified: false,
                profilePhotoUrl: "",
                videoName: null,
                videoUrl: "",
                cvName: null,
                cvUrl: "",
                summary: null,
                description: null

            },
            loaderData: loaderData,

        }

        this.updateWithoutSave = this.updateWithoutSave.bind(this)
        this.updateAndSaveData = this.updateAndSaveData.bind(this)
        this.updateForComponentId = this.updateForComponentId.bind(this)
        this.saveProfile = this.saveProfile.bind(this)
        this.loadData = this.loadData.bind(this)
        this.init = this.init.bind(this);
    };

    init() {
        var loaderData = Object.assign({}, this.state.loaderData);
        loaderData.allowedUsers = loaderData.allowedUsers.concat("Talent");
        loaderData.isLoading = false;
        this.setState({ loaderData: loaderData }, function () {
        }.bind(this));
    }

    componentDidMount() {
        this.init();
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://advancedtalentprofile-e2gkffcccyg0hhdm.australiaeast-01.azurewebsites.net/profile/profile/getTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                if (res && res.data) {
                    this.updateWithoutSave(res.data);
                } else {
                    console.warn('No data returned from the API.');
                }
            }.bind(this),
            error: function (xhr, status, error) {
                console.error('Error fetching profile data:', error);
            }
        });
    }

    //updates component's state without saving data
    updateWithoutSave(newValues) {
        console.log('updateWithoutSave Updating field with value:', newValues);
        let newProfile = Object.assign({}, this.state.profileData, newValues);      
        this.setState({ profileData: newProfile }, () => {

            // Validate the update
            if (this.state.profileData.id === newProfile.id) {
                console.log('Profile updated successfully.');
            } else {
                console.warn('Profile update failed.');
            }
        });
    }

    //updates component's state and saves data
    updateAndSaveData(newValues) {
        console.log("updateAndSaveData: ", newValues);

        let newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        }, this.saveProfile)
    }


    updateForComponentId(componentId, newValues) {
        this.updateAndSaveData(newValues)
    }

    saveProfile() {
        console.log("inside saveProfile Payload being sent to API:", this.state.profileData);
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://advancedtalentprofile-e2gkffcccyg0hhdm.australiaeast-01.azurewebsites.net/profile/profile/updateTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.profileData),
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }

    render() {
        const profile = {
            firstName: this.state.profileData.firstName,
            lastName: this.state.profileData.lastName,
            email: this.state.profileData.email,
            phone: this.state.profileData.phone
        };
        //console.log('INSIDE Render photoURL:', this.state.profileData.profilePhotoUrl);
        return (
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="profile">
                                <form className="ui form">
                                    <div className="ui grid">
                                        <FormItemWrapper
                                            title='Linked Accounts'
                                            tooltip='Linking to online social networks adds credibility to your profile'
                                        >
                                            <SocialMediaLinkedAccount
                                                linkedAccounts={this.state.profileData.linkedAccounts}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Description'
                                            tooltip='Introduce yourself'
                                        >
                                            <SelfIntroduction
                                                summary={this.state.profileData.summary}
                                                description={this.state.profileData.description}
                                                updateProfileData={this.updateAndSaveData}
                                                updateWithoutSave={this.updateWithoutSave}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='User Details'
                                            tooltip='Enter your contact details'
                                        >
                                            <IndividualDetailSection
                                                controlFunc={this.updateForComponentId}
                                                details={profile}
                                                componentId='contactDetails'
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Address'
                                            tooltip='Enter your current address'>
                                            <Address
                                                addressData={this.state.profileData.address}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Nationality'
                                            tooltip='Select your nationality'
                                        >
                                            <Nationality
                                                nationalityData={this.state.profileData.nationality}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Languages'
                                            tooltip='Select languages that you speak'
                                        >
                                            <Language
                                                UserId={this.state.profileData.id}
                                                languageData={this.state.profileData.languages}
                                                updateProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Skills'
                                            tooltip='List your skills'
                                        >
                                            <Skill
                                                skillData={this.state.profileData.skills}
                                                updateProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Work experience'
                                            tooltip='Add your work experience'
                                        >
                                            <Experience
                                                experienceData={this.state.profileData.experience}
                                                updateProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        {/*
                                    <FormItemWrapper
                                        title='Education'
                                        tooltip='Add your educational background'
                                    >
                                        <Education
                                            educationData={this.state.profileData.education}
                                            updateProfileData={this.updateAndSaveData}
                                        />
                                    </FormItemWrapper>
                                    <FormItemWrapper
                                        title='Certification'
                                        tooltip='List your certificates, honors and awards'
                                    >
                                        <Certificate
                                            certificateData={this.state.profileData.certifications}
                                            updateProfileData={this.updateAndSaveData}
                                        />                                                                        
                                    </FormItemWrapper>
                                    */}
                                        <FormItemWrapper
                                            title='Visa Status'
                                            tooltip='What is your current Visa/Citizenship status?'
                                        >
                                            <VisaStatus
                                                visaStatus={this.state.profileData.visaStatus}
                                                visaExpiryDate={this.state.profileData.visaExpiryDate}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Status'
                                            tooltip='What is your current status in jobseeking?'
                                        >
                                            <TalentStatus
                                                status={this.state.profileData.jobSeekingStatus}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Profile Photo'
                                            tooltip='Please upload your profile photo'
                                            hideSegment={true}
                                        >
                                            <PhotoUpload  
                                                photoName={this.state.profileData.profilePhoto}
                                                imageId={this.state.profileData.profilePhotoUrl}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                                bearToken={Cookies.get('talentAuthToken')}
                                                savePhotoUrl='https://advancedtalentprofile-e2gkffcccyg0hhdm.australiaeast-01.azurewebsites.net/profile/profile/updateProfilePhoto'
                                            />
                                        </FormItemWrapper>{/*
                                    <FormItemWrapper
                                        title='Profile Video'
                                        tooltip='Upload a brief self-introduction video'
                                        hideSegment={true}
                                    >
                                        <VideoUpload
                                            videoName={this.state.profileData.videoName}
                                            updateProfileData={this.updateWithoutSave}
                                            saveVideoUrl={'http://localhost:60290/profile/profile/updateTalentVideo'}
                                        />
                                    </FormItemWrapper>
                                    <FormItemWrapper
                                        title='CV'
                                        tooltip='Upload your CV. Accepted files are pdf, doc & docx)'
                                        hideSegment={true}
                                    >
                                        <CVUpload
                                            cvName={this.state.profileData.cvName}
                                            cvUrl={this.state.profileData.cvUrl}
                                            updateProfileData={this.updateWithoutSave}
                                            saveCVUrl={'http://localhost:60290/profile/profile/updateTalentCV'}
                                        />
                                        </FormItemWrapper>
                                    */}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        );
    }
}
