using ChatApp.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [HttpGet("admin")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        var stats = await _service.GetAdminDashboardAsync();
        return Ok(stats);
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetUserDashboard()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var stats = await _service.GetUserDashboardAsync(userId);
        return Ok(stats);
    }

    [HttpGet("admin/user-trend")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetUserCreationTrend([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var trend = await _service.GetUserCreationTrendAsync(startDate, endDate);
        return Ok(trend);
    }
}
