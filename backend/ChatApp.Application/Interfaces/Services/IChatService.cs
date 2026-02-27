using ChatApp.Application.DTOs;

namespace ChatApp.Application.Interfaces.Services;

public interface IChatService
{
    Task<bool> SendMessageAsync(SendMessageDto request, string senderId);
}