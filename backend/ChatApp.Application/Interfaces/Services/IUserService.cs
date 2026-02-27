using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Services;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto?> GetUserProfileAsync(string userId);
    Task<bool> DeleteUserAsync(string userId);
    Task<UserResponseDto?> UpdateProfileAsync(string userId, UpdateProfileRequestDto request);
    Task<UserResponseDto> CreateUserAsync(CreateUserRequestDto request, string createdBy);
    Task<UserResponseDto?> AdminUpdateUserAsync(string userId, AdminUpdateUserRequestDto request, string updatedBy);
}