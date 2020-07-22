using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;


namespace OpenSpeechTools.Hubs
{
  public class ModelData : Hub
  {
    public async Task SendDataPacket(object obj)
    {
      await Clients.All.SendAsync("Update", obj);
    }

    public async Task ModelUpdated(object obj)
    {
      await Clients.All.SendAsync("ModelUpdated", obj);
    }

    public async Task AfterConnected()
    {
      await Clients.Client(Context.ConnectionId).SendAsync("Connected", "Connection Successful. ID: " + Context.ConnectionId);
    }

  }
}