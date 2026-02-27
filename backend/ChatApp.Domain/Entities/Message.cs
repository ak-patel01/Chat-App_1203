namespace ChatApp.Domain.Entities;

public class Message : BaseEntity
{
    public string Content { get; set; } = string.Empty;

    public Guid ConversationId { get; set; }
    public Conversation Conversation { get; set; } = null!;

    public string SenderId { get; set; } = string.Empty;
    public ApplicationUser Sender { get; set; } = null!;

    public bool IsRead { get; set; } = false;
}
