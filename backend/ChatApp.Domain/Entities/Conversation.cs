namespace ChatApp.Domain.Entities;

public class Conversation : BaseEntity
{
    public string? Title { get; set; }
    public bool IsGroup { get; set; } = false;

    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();
}
