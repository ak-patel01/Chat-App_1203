using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Repositories;

public interface IDashboardRepository
{
    Task<DashboardStatsDto> GetAdminStatsAsync();
    Task<UserDashboardStatsDto> GetUserStatsAsync(string userId);
    Task<List<UserCreationTrendDto>> GetUserCreationTrendAsync(DateTime startDateUtc, DateTime endDateUtc);
}