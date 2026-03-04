using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetAdminDashboardAsync();
    Task<UserDashboardStatsDto> GetUserDashboardAsync(string userId);
    Task<List<UserCreationTrendDto>> GetUserCreationTrendAsync(DateTime? startDate, DateTime? endDate);
}