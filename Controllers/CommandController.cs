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


    //JsonResultModel class
    public class JsonResultModel
    {
      public string ErrorMessage { get; set; }
      public bool IsSuccess { get; set; }
      public string Results { get; set; }
    }

    public static JsonResultModel HTTP_PUT(string Url, string Data)
    {
      JsonResultModel model = new JsonResultModel();
      string Out = String.Empty;
      string Error = String.Empty;
      System.Net.WebRequest req = System.Net.WebRequest.Create(Url);

      try
      {
        req.Method = "PUT";
        req.Timeout = 1000;
        req.ContentType = "application/json";
        byte[] sentData = Encoding.UTF8.GetBytes(Data);
        req.ContentLength = sentData.Length;

        using (Stream sendStream = req.GetRequestStream())
        {
          sendStream.Write(sentData, 0, sentData.Length);
          sendStream.Close();

        }

        System.Net.WebResponse res = req.GetResponse();
        System.IO.Stream ReceiveStream = res.GetResponseStream();
        using (System.IO.StreamReader sr = new
        System.IO.StreamReader(ReceiveStream, Encoding.UTF8))
        {

          Char[] read = new Char[256];
          int count = sr.Read(read, 0, 256);

          while (count > 0)
          {
            String str = new String(read, 0, count);
            Out += str;
            count = sr.Read(read, 0, 256);
          }
        }
      }
      catch (ArgumentException ex)
      {
        Error = string.Format("HTTP_ERROR :: The second HttpWebRequest object has raised an Argument Exception as 'Connection' Property is set to 'Close' :: {0}", ex.Message);
      }
      catch (WebException ex)
      {
        Error = string.Format("HTTP_ERROR :: WebException raised! :: {0}", ex.Message);
      }
      catch (Exception ex)
      {
        Error = string.Format("HTTP_ERROR :: Exception raised! :: {0}", ex.Message);
      }

      model.Results = Out;
      model.ErrorMessage = Error;
      if (!string.IsNullOrWhiteSpace(Out))
      {
        model.IsSuccess = true;
      }
      return model;
    }

    /// <summary>
    /// Requests the given IP/Port UI Config over HTTP.
    /// </summary>
    /// <param name="ip">FormatDesired(aaabbbcccdddd, ex: 192.168.0.1 --> 192168000001)</param>
    /// <param name="port">Format Desired(xxxx, ex: 8001)</param>
    /// <returns>Returns the Response (from CFG server response) to the Client</returns>
    [HttpGet("{ip1}/{ip2}/{ip3}/{ip4}/{devicePort}/{link}/{value}/{module}")]
    public void Get(
      string ip1, string ip2, string ip3, string ip4, string devicePort, 
      string link, string value, string module)
    {
      System.Diagnostics.Debug.WriteLine("Link: " + link + " Value: " + value + " Module: " + module);
      var deviceIP = ip1 + "." + ip2 + "." + ip3 + "." + ip4;
      string url = "http://" + deviceIP + ":" + devicePort 
        + "/sendCmd";
      string command = 
        "{" +
        "\"link\":\"" + link + "\"," +
        "\"value\":\"" + value + "\"," +
        "\"module\":\"" + module + "\"" +
        "}";
      HTTP_PUT(url, command);
    }

  }

}
