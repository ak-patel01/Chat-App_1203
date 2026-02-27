using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Application.Interfaces.Services;

namespace ChatApp.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _repository;

    public DashboardService(IDashboardRepository repository)
    {
        _repository = repository;
    }

    public Task<DashboardStatsDto> GetAdminDashboardAsync()
    {
        return _repository.GetAdminStatsAsync();
    }

    public Task<UserDashboardStatsDto> GetUserDashboardAsync(string userId)
    {
        return _repository.GetUserStatsAsync(userId);
    }
}
