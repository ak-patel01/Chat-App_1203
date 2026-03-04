using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Application.Interfaces.Services;
using static ChatApp.Application.Utils.Utils;

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

    public Task<List<UserCreationTrendDto>> GetUserCreationTrendAsync(DateTime? startDate, DateTime? endDate)
    {
        var end = endDate?.Date ?? DateTime.UtcNow.Date;
        var start = startDate?.Date ?? end.AddDays(-29);

        // Compute local bounds and then ensure they are explicitly marked as UTC
        var startUtc = EnsureUtc(start.Date);
        var endOfDayUtc = EnsureUtc(end.Date.AddDays(1).AddTicks(-1));

        return _repository.GetUserCreationTrendAsync(startUtc, endOfDayUtc);
    }
}
