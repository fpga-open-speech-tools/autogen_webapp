using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using System.Text;

namespace UIConfig.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class CommandController : ControllerBase
  {
    private readonly ILogger<CommandController> _logger;

    public CommandController(ILogger<CommandController> logger)
    {
      _logger = logger;
    }

    private static T _download_serialized_json_data<T>(string url) where T : new()
    {
      using (var w = new WebClient())
      {
        var json_data = string.Empty;
        // attempt to download JSON data as a string
        try
        {
          json_data = w.DownloadString(url);
        }
        catch (Exception) { }
        // if string with JSON data is not empty, deserialize it to class and return its instance 
        return !string.IsNullOrEmpty(json_data) ? JsonConvert.DeserializeObject<T>(json_data) : new T();
      }
    }

    public string ParseDeviceIPString(string deviceIP)
    {
      var result = "";
      result += deviceIP.Substring(0, 3) + "."
        + deviceIP.Substring(3, 3) + "."
        + deviceIP.Substring(6, 3) + "."
        + deviceIP.Substring(9, 3);

      return result;
    }

    /// <summary>
    /// Requests the given IP/Port UI Config over HTTP.
    /// </summary>
    /// <param name="ip">FormatDesired(aaabbbcccdddd, ex: 192.168.0.1 --> 192168000001)</param>
    /// <param name="port">Format Desired(xxxx, ex: 8001)</param>
    /// <returns>Returns the Response (from CFG server response) to the Client</returns>
    [HttpGet("{deviceIP}/{devicePort}/{link}/{value}/{module}")]
    public void Get(string deviceIP, string devicePort, string link, string value, string module)
    {
      System.Diagnostics.Debug.WriteLine("Link: " + link + " Value: " + value + " Module: " + module);

      string url = "http://" + ParseDeviceIPString(deviceIP) + ":" + devicePort 
        + "/sendCmd";
      string command = 
        "{" +
        "\"link\":\"" + link + "\"," +
        "\"value\":\"" + value + "\"," +
        "\"module\":\"" + module + "\"" +
        "}";

      byte[] data = Encoding.ASCII.GetBytes(command);
      using var client = new WebClient();
      _ = client.UploadData(url, "PUT", data);

    }

  }

}
