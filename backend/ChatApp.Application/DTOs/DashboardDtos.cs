namespace ChatApp.Application.DTOs;

public class DashboardStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalConversations { get; set; }
    public int TotalMessages { get; set; }
}

public class UserDashboardStatsDto
{
    public int TotalConversations { get; set; }
    public int TotalUnreadMessages { get; set; }
}
