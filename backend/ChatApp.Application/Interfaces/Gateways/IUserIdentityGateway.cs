using ChatApp.Domain.Entities;

namespace ChatApp.Application.Interfaces.Gateways;

public interface IUserIdentityGateway
{
    Task<(bool Succeeded, string[] Errors, ApplicationUser? User)> CreateUserAsync(string name, string email, string phoneNumber, string userType, string password, string createdBy);
    Task<IReadOnlyList<string>> GetRolesAsync(string userId);
    Task EnsureRoleExistsAsync(string roleName);
    Task AddToRoleAsync(string userId, string roleName);
    Task RemoveFromRolesAsync(string userId, IEnumerable<string> roles);
}