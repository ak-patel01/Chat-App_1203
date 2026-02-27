using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserRepository(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IReadOnlyList<ApplicationUser>> GetAllUsersAsync()
    {
        return await _userManager.Users
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();
    }

    public async Task<ApplicationUser?> GetUserByIdAsync(string id)
    {
        return await _userManager.FindByIdAsync(id);
    }

    public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
    {
        return await _userManager.FindByEmailAsync(email);
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return false;

        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }

    public async Task<ApplicationUser?> UpdateUserAsync(ApplicationUser user)
    {
        var entity = await _userManager.FindByIdAsync(user.Id);
        if (entity == null) return null;

        entity.Name = user.Name;
        entity.PhoneNumber = user.PhoneNumber;
        entity.UserType = user.UserType;
        entity.UpdatedAt = user.UpdatedAt;
        entity.UpdatedBy = user.UpdatedBy;

        var result = await _userManager.UpdateAsync(entity);
        return result.Succeeded ? entity : null;
    }
}
