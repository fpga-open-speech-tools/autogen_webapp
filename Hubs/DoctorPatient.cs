using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenSpeechTools.Hubs
{
  public class DoctorPatient : Hub
  {
    private List<string> ActiveUsers = new List<string>();
    private List<Group> ActiveGroups = new List<Group>();

    public async Task SendMessage(string user, string message)
    {
      await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public async Task RequestFeedback(string user, string group)
    {
      await Clients.Group(group).SendAsync("FeedbackRequested", user);
    }

    public async Task SendFeedback(string user, int feedback,string feedbackNotes, string group)
    {
      await Clients.Group(group).SendAsync("ReceiveFeedback", Context.ConnectionId, feedback, feedbackNotes);
    }

    public async Task AddToGroup(string groupName)
    {
      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
      await Clients.Client(Context.ConnectionId).SendAsync("AddedToGroup", "You have joined the session: " + groupName);
      await Clients.Group(groupName).SendAsync("GroupMessage", $"{Context.ConnectionId} has joined the group {groupName}.");
    }

    public async Task RemoveFromGroup(string groupName)
    {
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
      await Clients.Client(Context.ConnectionId).SendAsync("LeftGroup", "You have left the session: " + groupName);
      await Clients.Group(groupName).SendAsync("GroupMessage", $"{Context.ConnectionId} has left the group {groupName}.");
    }

    public async Task AfterConnected()
    {
      ActiveUsers.Add(Context.ConnectionId);
      await Clients.Client(Context.ConnectionId).SendAsync("Connected","Connection Successful. ID: " + Context.ConnectionId);
    }

    public async Task OnDisconnect(string groupName)
    {
      await Clients.Group(groupName).SendAsync("UserDisconnected", Context.ConnectionId);
      await Clients.Client(Context.ConnectionId).SendAsync("Disconnected", "Connection Ended.");
      ActiveUsers.Remove(Context.ConnectionId);
      RemoveUserFromGroup(groupName, Context.ConnectionId);
    }
    public async  Task EndGroup(string groupName)
    {
      await Clients.Group(groupName).SendAsync("GroupMessage", "Session Ended");
      await Clients.Group(groupName).SendAsync("GroupEnded", "Session Ended");
      RemoveUsersFromGroup(groupName);
    }

    public void RemoveUserFromGroup(string groupID,string userID)
    {
      for (int i = 0; i < ActiveGroups.Count; i++)
      {
        if (ActiveGroups[i].GroupID.Equals(groupID))
        {
          for(int j = 0; j < ActiveGroups[i].GroupUsers.Count; j++)
          {
            if (ActiveGroups[i].GroupUsers.Contains(userID))
            {
              ActiveGroups[i].GroupUsers.Remove(userID);
            }
          }
        }
      }

    }
    
    public void RemoveUsersFromGroup(string groupID)
    {
      for(int i=0; i < ActiveGroups.Count;i++)
      {
        if (ActiveGroups[i].GroupID.Equals(groupID)){
          ActiveGroups[i].GroupUsers.Clear();
        }
      }
    }


  }
  public class Group
  {
    public string GroupID;
    public List<string> GroupUsers;
  }

}