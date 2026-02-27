using ChatApp.Application.Interfaces.Gateways;
using ChatApp.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ChatApp.Infrastructure.Identity;

public class IdentityUserGateway : IUserIdentityGateway
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public IdentityUserGateway(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<(bool Succeeded, string[] Errors, ApplicationUser? User)> CreateUserAsync(
        string name,
        string email,
        string phoneNumber,
        string userType,
        string password,
        string createdBy)
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            Name = name,
            PhoneNumber = phoneNumber,
            UserType = userType,
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            return (false, result.Errors.Select(e => e.Description).ToArray(), null);
        }

        return (true, Array.Empty<string>(), user);
    }

    public async Task<IReadOnlyList<string>> GetRolesAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Array.Empty<string>();

        return (await _userManager.GetRolesAsync(user)).ToList();
    }

    public async Task EnsureRoleExistsAsync(string roleName)
    {
        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            await _roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    public async Task AddToRoleAsync(string userId, string roleName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user != null)
        {
            await _userManager.AddToRoleAsync(user, roleName);
        }
    }

    public async Task RemoveFromRolesAsync(string userId, IEnumerable<string> roles)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user != null)
        {
            await _userManager.RemoveFromRolesAsync(user, roles);
        }
    }
}
