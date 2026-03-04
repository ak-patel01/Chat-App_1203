namespace ChatApp.Application.Utils;

public static class Utils
{
    public static DateTime EnsureUtc(DateTime date)
    {
        return date.Kind == DateTimeKind.Utc ? date : DateTime.SpecifyKind(date, DateTimeKind.Utc);
    }
}
