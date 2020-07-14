using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;


namespace OpenSpeechTools.Hubs
{
  public class Controls : Hub
  {
    public async Task SendControl(object obj)
    {
      await Clients.AllExcept(Context.ConnectionId).SendAsync("ReceiveControl", obj);
    }
    public async Task ControlReceipt(object obj)
    {
      await Clients.AllExcept(Context.ConnectionId).SendAsync("ControlReceipt", obj);
    }

    public async Task UpdateControls(object obj)
    {
      await Clients.AllExcept(Context.ConnectionId).SendAsync("UpdateControls", obj);
    }

    public async Task AfterConnected()
    {
      await Clients.Client(Context.ConnectionId).SendAsync("Connected", "Connection Successful. ID: " + Context.ConnectionId);
    }

  }
}