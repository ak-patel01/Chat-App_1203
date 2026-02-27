using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetAdminDashboardAsync();
    Task<UserDashboardStatsDto> GetUserDashboardAsync(string userId);
}