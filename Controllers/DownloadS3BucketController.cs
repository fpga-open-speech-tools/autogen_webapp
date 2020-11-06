using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using System.IO;
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
    private static string _download_json_data(string url,string method, string data){
      var json_data = string.Empty;
      // attempt to download JSON data as a string
      try
      {
        json_data = HTTP_REQ(url,method,data).Output;
      }
      catch (Exception) { }
      if (json_data == "")
      {
        json_data = json_data = "{\"name\":\"ERROR\",\"views\":[],\"data\":[],\"containers\":[]}";
      }
      System.Diagnostics.Debug.WriteLine("JSON Data" + json_data);
      return json_data;
    }
    private static T _download_serialized_json_data<T>(string url,string method, string data) where T : new()
    {

        var json_data = string.Empty;
        // attempt to download JSON data as a string
        try
        {
          json_data = HTTP_REQ(url,method, data).Output;
        }
        catch (Exception) { }
        if (json_data == "")
        {
          json_data = "{\"name\":\"ERROR\",\"views\":[],\"data\":[],\"containers\":[]}";
        }
        System.Diagnostics.Debug.WriteLine("JSON Data" + json_data);

      // if string with JSON data is not empty, deserialize it to class and return its instance 
      return !string.IsNullOrEmpty(json_data) ? JsonConvert.DeserializeObject<T>(json_data) : new T();

      
    }

    //JsonResultModel class
    public class JsonResultModel
    {
      public string ErrorMessage { get; set; }
      public bool IsSuccess { get; set; }
      public string Output { get; set; }
    }

    public static JsonResultModel HTTP_REQ(string Url,string method, string PostData)
    {
      JsonResultModel model = new JsonResultModel();
      string Out = String.Empty;
      string Error = String.Empty;
      WebRequest req = WebRequest.Create(Url);

      try
      {
        req.Method = method;
        req.Timeout = 1000;
        req.ContentType = "application/json";

        if (method.Equals("POST"))
        {
          using (var streamWriter = new StreamWriter(req.GetRequestStream()))
          {
            streamWriter.Write(PostData);
          }
        }

        WebResponse res = req.GetResponse();
        Stream ReceiveStream = res.GetResponseStream();
        using (StreamReader sr = new
        StreamReader(ReceiveStream, Encoding.UTF8))
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

      model.Output = Out;
      model.ErrorMessage = Error;
      System.Diagnostics.Debug.WriteLine(Error + "Output" +  Out);
      if (!string.IsNullOrWhiteSpace(Out))
      {
        model.IsSuccess = true;
      }
      return model;
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
    public string
      Get(string ip1,string ip2, string ip3, string ip4, string devicePort, string bucketname, string devicename, string projectname)
    {
      var deviceIP = ip1 + "." + ip2 + "." + ip3 + "." + ip4;
      System.Diagnostics.Debug.WriteLine
        ("IP: " + deviceIP  + " Port: " + devicePort + " downloadURL: " + devicename + "/" + projectname);

      string result = "";

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
        result = _download_json_data(baseURL+"/configuration","GET","");
      }
      catch(Exception e)
      {
        System.Diagnostics.Debug.WriteLine(e);
        result = "{\"name\":\"ERROR\"}";
      }
      

      return result;
    }
  }

}
