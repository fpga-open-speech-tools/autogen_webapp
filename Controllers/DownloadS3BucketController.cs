using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using Newtonsoft.Json;
using System.Text;

namespace Autogen.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class DownloadS3BucketController : ControllerBase
  {
    private readonly ILogger<DownloadS3BucketController> _logger;

    public DownloadS3BucketController(ILogger<DownloadS3BucketController> logger)
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
    /// <param name="ip1">FormatDesired(aaa/bbb/ccc/ddd, ex: 192/168/0/1 --> 192.168.0.1)</param>
    /// <param name="ip2">FormatDesired(aaa/bbb/ccc/ddd, ex: 192/168/0/1 --> 192.168.0.1)</param>
    /// <param name="ip3">FormatDesired(aaa/bbb/ccc/ddd, ex: 192/168/0/1 --> 192.168.0.1)</param>
    /// <param name="ip4">FormatDesired(aaa/bbb/ccc/ddd, ex: 192/168/0/1 --> 192.168.0.1)</param>
    /// <param name="port">Format Desired(xxxx, ex: 8001)</param>
    /// <param name="devicename">Name of deviceFammily. ex, "DE-10"</param>
    /// <param name="projectname">Name of Project. ex, "passthrough"</param>
    /// <returns>Returns the Response (from CFG server response) to the Client</returns>
    [HttpGet("{ip1}/{ip2}/{ip3}/{ip4}/{devicePort}/{bucketname}/{devicename}/{projectname}")]
    public AutogenConfig.Configuration
      Get(string ip1,string ip2, string ip3, string ip4, string devicePort, string bucketname, string devicename, string projectname)
    {
      var deviceIP = ip1 + "." + ip2 + "." + ip3 + "." + ip4;
      System.Diagnostics.Debug.WriteLine
        ("IP: " + deviceIP  + " Port: " + devicePort + " downloadURL: " + devicename + "/" + projectname);

      AutogenConfig.Configuration result = new AutogenConfig.Configuration();

      string baseURL = "http://" + deviceIP + ":" + devicePort;

      string command =
        "{" +
        "\"downloadurl\":\"" + devicename + "/" + projectname + "\"," +
        "\"bucketname\":\"" + bucketname + "\"," +
        "\"devicename\":\"" + devicename + "\"," +
        "\"projectname\":\"" + projectname + "\"" +
        "}";
      System.Diagnostics.Debug.WriteLine("URL: " + devicename + "/" + projectname);
      try
      {
        byte[] data = Encoding.ASCII.GetBytes(command);
        using var client = new WebClient();
        _ = client.UploadData(baseURL + "/download", "PUT", data);
        result = _download_serialized_json_data<AutogenConfig.Configuration>(baseURL + "/configuration");
      }
      catch(Exception e)
      {
        System.Diagnostics.Debug.WriteLine(e);
        result = new AutogenConfig.Configuration()
        {
          name = "Demo Upload Failed"
        };
      }
      

      return result;
    }
  }

}
