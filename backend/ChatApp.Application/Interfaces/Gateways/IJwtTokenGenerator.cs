using ChatApp.Application.DTOs;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Interfaces.Gateways;

public interface IJwtTokenGenerator
{
    AuthResponseDto GenerateToken(ApplicationUser user, string role);
}