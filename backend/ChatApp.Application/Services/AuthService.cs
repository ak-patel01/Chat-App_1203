using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Gateways;
using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Application.Interfaces.Services;
using ChatApp.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace ChatApp.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IJwtTokenGenerator jwtTokenGenerator,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtTokenGenerator = jwtTokenGenerator;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            throw new Exception("Email already exists");

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Name = request.Name,
            UserType = request.UserType,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"User creation failed: {errors}");
        }

        if (!await _roleManager.RoleExistsAsync("User"))
            await _roleManager.CreateAsync(new IdentityRole("User"));

        if (!await _roleManager.RoleExistsAsync("SuperAdmin"))
            await _roleManager.CreateAsync(new IdentityRole("SuperAdmin"));

        var roleName = user.UserType == "SuperAdmin" ? "SuperAdmin" : "User";
        await _userManager.AddToRoleAsync(user, roleName);

        await _refreshTokenRepository.RevokeByUserIdAsync(user.Id);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, user.Id);

        var response = _jwtTokenGenerator.GenerateToken(user, roleName);
        response.RefreshToken = refreshToken.Token;
        return response;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            throw new Exception("Invalid credentials");

        if (!await _userManager.CheckPasswordAsync(user, request.Password))
            throw new Exception("Invalid credentials");

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "User";

        await _refreshTokenRepository.RevokeByUserIdAsync(user.Id);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, user.Id);

        var response = _jwtTokenGenerator.GenerateToken(user, role);
        response.RefreshToken = refreshToken.Token;
        return response;
    }

    public async Task<AuthResponseDto> RefreshAsync(RefreshTokenRequestDto request)
    {
        var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);
        if (refreshToken == null || refreshToken.IsRevoked)
            throw new UnauthorizedAccessException("Invalid refresh token");

        if (refreshToken.ExpiresAt <= DateTime.UtcNow)
        {
            refreshToken.IsRevoked = true;
            refreshToken.UpdatedAt = DateTime.UtcNow;
            refreshToken.UpdatedBy = refreshToken.UserId;
            await _refreshTokenRepository.SaveChangesAsync();
            throw new UnauthorizedAccessException("Refresh token expired");
        }

        var user = await _userManager.FindByIdAsync(refreshToken.UserId);
        if (user == null)
            throw new UnauthorizedAccessException("User not found");

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "User";

        refreshToken.IsRevoked = true;
        refreshToken.UpdatedAt = DateTime.UtcNow;
        refreshToken.UpdatedBy = user.Id;

        var newRefreshToken = await CreateRefreshTokenAsync(user.Id, user.Id);

        var response = _jwtTokenGenerator.GenerateToken(user, role);
        response.RefreshToken = newRefreshToken.Token;
        return response;
    }

    private async Task<RefreshToken> CreateRefreshTokenAsync(string userId, string actor)
    {
        var token = new RefreshToken
        {
            UserId = userId,
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = actor
        };

        await _refreshTokenRepository.AddAsync(token);
        await _refreshTokenRepository.SaveChangesAsync();
        return token;
    }
}
