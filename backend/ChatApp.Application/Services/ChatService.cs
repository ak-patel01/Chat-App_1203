using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces.Services;

namespace ChatApp.Application.Services;

public class ChatService : IChatService
{
    public Task<bool> SendMessageAsync(SendMessageDto request, string senderId)
    {
        return Task.FromResult(false);
    }
}
