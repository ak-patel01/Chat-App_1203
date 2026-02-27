using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.API.Controllers;

[ApiController]
[Route("api/user")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get all users (SuperAdmin only)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var user = await _userService.GetUserProfileAsync(userId);
        if (user == null) return NotFound();
        return Ok(user);
    }

    /// <summary>
    /// Update current user profile
    /// </summary>
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequestDto request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var updated = await _userService.UpdateProfileAsync(userId, request);
        if (updated == null) return NotFound(new { message = "User not found" });
        return Ok(updated);
    }

    /// <summary>
    /// Create a new user (SuperAdmin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDto request)
    {
        try
        {
            var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";
            var user = await _userService.CreateUserAsync(request, adminId);
            return CreatedAtAction(nameof(GetAllUsers), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update any user's details (SuperAdmin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> AdminUpdateUser(string id, [FromBody] AdminUpdateUserRequestDto request)
    {
        var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";
        var updated = await _userService.AdminUpdateUserAsync(id, request, adminId);
        if (updated == null) return NotFound(new { message = "User not found" });
        return Ok(updated);
    }

    /// <summary>
    /// Delete a user by ID (SuperAdmin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result) return NotFound(new { message = "User not found" });
        return Ok(new { message = "User deleted successfully" });
    }
}
