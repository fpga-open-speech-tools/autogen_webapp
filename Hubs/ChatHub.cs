using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace OpenSpeechTools.Hubs
{
  public class ChatHub : Hub
  {
    public async Task SendMessage(string user, string message)
    {
      await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public async Task RequestFeedback(string user, string group)
    {
      await Clients.Group(group).SendAsync("FeedbackRequested", user);
    }

    public async Task SendFeedback(string user, bool feedback, string group)
    {
      await Clients.Group(group).SendAsync("ReceiveFeedback", user, feedback);
    }

    public async Task AddToGroup(string groupName)
    {
      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

      await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has joined the group {groupName}.");
    }

    public async Task RemoveFromGroup(string groupName)
    {
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

      await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has left the group {groupName}.");
    }

  }
}