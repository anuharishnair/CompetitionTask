using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private readonly string _wwwRootPath;
        private readonly ILogger<FileService> _logger;

        public FileService(IHostingEnvironment environment, ILogger<FileService> logger)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _logger = logger;         
            _wwwRootPath = _environment.WebRootPath; 
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            try
            {               
                if (string.IsNullOrEmpty(_wwwRootPath))
                {
                    throw new InvalidOperationException("Web root path is not set.");
                }

                // Construct the directory path using the WebRootPath and the provided type
                var directoryPath = Path.Combine(_wwwRootPath, "images");
                var fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine(directoryPath, fileName);

                // Ensure the directory exists
                Directory.CreateDirectory(directoryPath);

                // Save the file asynchronously
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file.");
                return null;
            }
        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            try
            {
                var filePath = Path.Combine(_wwwRootPath, "images", type.ToString(), id);

                if (File.Exists(filePath))
                {
                    // Asynchronously delete the file
                    await Task.Run(() => File.Delete(filePath));
                    return true;
                }

                return false; // Return false if file doesn't exist
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file.");
                return false; // Return false if an error occurs
            }
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            try
            {
                // Construct the relative file path directly inside the 'images' folder
                var filePath = Path.Combine("images", id); 

                //base URL
                var baseUrl = "https://advancedtalentprofile-e2gkffcccyg0hhdm.australiaeast-01.azurewebsites.net"; 

                // Combine the base URL with the relative file path to generate the full URL
                var fileUrl = Path.Combine(baseUrl, filePath).Replace("\\", "/"); 

                _logger.LogInformation($"Generated file URL: {fileUrl}");

                return await Task.FromResult(fileUrl); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating file URL.");
                return await Task.FromResult<string>(null); 
            }
        }

    }

}
