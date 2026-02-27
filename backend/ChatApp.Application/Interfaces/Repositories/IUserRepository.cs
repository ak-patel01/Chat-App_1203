using ChatApp.Domain.Entities;

namespace ChatApp.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<IReadOnlyList<ApplicationUser>> GetAllUsersAsync();
    Task<ApplicationUser?> GetUserByIdAsync(string id);
    Task<ApplicationUser?> GetUserByEmailAsync(string email);
    Task<bool> DeleteUserAsync(string id);
    Task<ApplicationUser?> UpdateUserAsync(ApplicationUser user);
}