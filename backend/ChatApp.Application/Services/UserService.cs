using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Gateways;
using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Application.Interfaces.Services;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserIdentityGateway _identityGateway;

    public UserService(IUserRepository userRepository, IUserIdentityGateway identityGateway)
    {
        _userRepository = userRepository;
        _identityGateway = identityGateway;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return users.Select(MapToDto);
    }

    public async Task<UserResponseDto?> GetUserProfileAsync(string userId)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        return user == null ? null : MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        return await _userRepository.DeleteUserAsync(userId);
    }

    public async Task<UserResponseDto?> UpdateProfileAsync(string userId, UpdateProfileRequestDto request)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null) return null;

        user.Name = request.Name;
        user.PhoneNumber = request.PhoneNumber;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = userId;

        await _userRepository.UpdateUserAsync(user);
        return MapToDto(user);
    }

    public async Task<UserResponseDto> CreateUserAsync(CreateUserRequestDto request, string createdBy)
    {
        var existing = await _userRepository.GetUserByEmailAsync(request.Email);
        if (existing != null)
            throw new Exception("A user with this email already exists");

        var created = await _identityGateway.CreateUserAsync(
            request.Name,
            request.Email,
            request.PhoneNumber,
            request.UserType,
            request.Password,
            createdBy);

        if (!created.Succeeded || created.User == null)
        {
            var errors = string.Join(", ", created.Errors);
            throw new Exception($"User creation failed: {errors}");
        }

        var roleName = request.UserType == "SuperAdmin" ? "SuperAdmin" : "User";
        await _identityGateway.EnsureRoleExistsAsync(roleName);
        await _identityGateway.AddToRoleAsync(created.User.Id, roleName);

        return MapToDto(created.User);
    }

    public async Task<UserResponseDto?> AdminUpdateUserAsync(string userId, AdminUpdateUserRequestDto request, string updatedBy)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null) return null;

        var oldRoles = await _identityGateway.GetRolesAsync(userId);

        user.Name = request.Name;
        user.PhoneNumber = request.PhoneNumber;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = updatedBy;

        if (user.UserType != request.UserType)
        {
            if (oldRoles.Any())
                await _identityGateway.RemoveFromRolesAsync(userId, oldRoles);

            var newRole = request.UserType == "SuperAdmin" ? "SuperAdmin" : "User";
            await _identityGateway.EnsureRoleExistsAsync(newRole);
            await _identityGateway.AddToRoleAsync(userId, newRole);
            user.UserType = request.UserType;
        }

        await _userRepository.UpdateUserAsync(user);
        return MapToDto(user);
    }

    private static UserResponseDto MapToDto(ApplicationUser user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            UserType = user.UserType,
            CreatedAt = user.CreatedAt
        };
    }
}
