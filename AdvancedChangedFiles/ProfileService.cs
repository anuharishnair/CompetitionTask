using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;
using System.Collections.Concurrent;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        private readonly IRepository<UserLanguage> _userLanguageRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Employer> _employerRepository;
        private readonly IRepository<Job> _jobRepository;
        private readonly IRepository<Recruiter> _recruiterRepository;
        private readonly IFileService _fileService;


        // Dictionary to cache profiles, thread-safe
        private static readonly ConcurrentDictionary<string, TalentProfileViewModel> _profileCache = new ConcurrentDictionary<string, TalentProfileViewModel>();
        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            // Implement language addition logic
            throw new NotImplementedException();
        }
    
        public async Task<TalentProfileViewModel> GetTalentProfile(string id)
        {
            // Check if the profile is already cached
            if (_profileCache.TryGetValue(id, out TalentProfileViewModel cachedProfile))
            {
                return cachedProfile; 
            }

            // Retrieve the talent user from the repository
            var talent = await _userRepository.GetByIdAsync(id);
            if (talent == null) return null; 

            // Retrieve URLs if they exist
            var profilePhotoUrl = !string.IsNullOrWhiteSpace(talent.ProfilePhoto)
                ? await _fileService.GetFileURL(talent.ProfilePhoto, FileType.ProfilePhoto)
                : "";

            var videoUrl = !string.IsNullOrWhiteSpace(talent.VideoName)
                ? await _fileService.GetFileURL(talent.VideoName, FileType.UserVideo)
                : "";

            var cvUrl = !string.IsNullOrWhiteSpace(talent.CvName)
                ? await _fileService.GetFileURL(talent.CvName, FileType.UserCV)
                : "";

            // Map properties to view models
            var languages = talent.Languages?.Select(lang => new AddLanguageViewModel
            {
                Id = lang.Id,
                Name = lang.Language,
                Level = lang.LanguageLevel,
                CurrentUserId = talent.Id
            }).ToList();

            var skills = talent.Skills?.Select(skill => new AddSkillViewModel
            {
                Id = skill.Id,
                Name = skill.Skill,
                Level = skill.ExperienceLevel
            }).ToList();

            var education = talent.Education?.Select(edu => new AddEducationViewModel
            {
                Id = edu.Id,
                InstituteName = edu.InstituteName,
                Degree = edu.Degree,
                Title = edu.Title,
                YearOfGraduation = edu.YearOfGraduation,
                Country = edu.Country
            }).ToList();

            var certifications = talent.Certifications?.Select(cert => new AddCertificationViewModel
            {
                Id = cert.Id,
                CertificationName = cert.CertificationName,
                CertificationFrom = cert.CertificationFrom,
                CertificationYear = cert.CertificationYear
            }).ToList();

            var experience = talent.Experience?.Select(exp => new ExperienceViewModel
            {
                Id = exp.Id,
                Company = exp.Company,
                Position = exp.Position,
                Responsibilities = exp.Responsibilities,
                Start = exp.Start,
                End = exp.End
            }).ToList();

            // Construct TalentProfileViewModel
            var profile = new TalentProfileViewModel
            {
                Id = talent.Id,
                FirstName = talent.FirstName,
                MiddleName = talent.MiddleName,
                LastName = talent.LastName,
                Gender = talent.Gender,
                Email = talent.Email,
                Phone = talent.Phone,
                MobilePhone = talent.MobilePhone,
                IsMobilePhoneVerified = talent.IsMobilePhoneVerified,
                Address = talent.Address,
                Nationality = talent.Nationality,
                VisaStatus = talent.VisaStatus,
                VisaExpiryDate = talent.VisaExpiryDate,
                ProfilePhoto = talent.ProfilePhoto,
                ProfilePhotoUrl = profilePhotoUrl,
                VideoName = talent.VideoName,
                VideoUrl = videoUrl,
                CvName = talent.CvName,
                CvUrl = cvUrl,
                Summary = talent.Summary,
                Description = talent.Description,
                LinkedAccounts = talent.LinkedAccounts,
                JobSeekingStatus = talent.JobSeekingStatus,
                Languages = languages,
                Skills = skills,
                Education = education,
                Certifications = certifications,
                Experience = experience
            };

            // Cache the profile before returning
            _profileCache[id] = profile;

            return profile;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
