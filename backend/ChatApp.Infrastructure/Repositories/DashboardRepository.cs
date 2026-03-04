using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Repositories;
using ChatApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly ApplicationDbContext _context;

    public DashboardRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetAdminStatsAsync()
    {
        return new DashboardStatsDto
        {
            TotalUsers = await _context.ApplicationUsers.CountAsync(),
            TotalConversations = await _context.Conversations.CountAsync(),
            TotalMessages = await _context.Messages.CountAsync()
        };
    }

    public async Task<UserDashboardStatsDto> GetUserStatsAsync(string userId)
    {
        var conversationIds = await _context.ConversationParticipants
            .Where(cp => cp.UserId == userId)
            .Select(cp => cp.ConversationId)
            .ToListAsync();

        var unreadCount = await _context.Messages
            .Where(m => conversationIds.Contains(m.ConversationId) && !m.IsRead && m.SenderId != userId)
            .CountAsync();

        return new UserDashboardStatsDto
        {
            TotalConversations = conversationIds.Count,
            TotalUnreadMessages = unreadCount
        };
    }

    public async Task<List<UserCreationTrendDto>> GetUserCreationTrendAsync(DateTime startDateUtc, DateTime endDateUtc)
    {
        var dbCounts = await _context.ApplicationUsers
            .Where(u => u.CreatedAt >= startDateUtc && u.CreatedAt <= endDateUtc)
            .GroupBy(u => u.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Date, x => x.Count);

        var result = new List<UserCreationTrendDto>();
        for (var date = startDateUtc.Date; date <= endDateUtc.Date; date = date.AddDays(1))
        {
            result.Add(new UserCreationTrendDto
            {
                Date = date.ToString("yyyy-MM-dd"),
                Count = dbCounts.TryGetValue(date, out var count) ? count : 0
            });
        }

        return result;
    }
}
