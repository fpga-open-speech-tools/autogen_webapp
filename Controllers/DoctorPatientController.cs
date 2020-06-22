using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using System.Text;

namespace DoctorPatient.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class DoctorPatientController : ControllerBase
  {
    private readonly ILogger<DoctorPatientController> _logger;

    public DoctorPatientController(ILogger<DoctorPatientController> logger)
    {
      _logger = logger;
    }

    private static T _download_serialized_json_data<T>(string url) where T : new()
    {

        var json_data = string.Empty;
        // attempt to download JSON data as a string
        try
        {
          json_data = HTTP_GET(url).Output;
        }
        catch (Exception) { }
        if (json_data == "")
        {
        json_data = "{\"name\":\"ERROR\"}";
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

    public static JsonResultModel HTTP_GET(string Url)
    {
      JsonResultModel model = new JsonResultModel();
      string Out = String.Empty;
      string Error = String.Empty;
      WebRequest req = WebRequest.Create(Url);

      try
      {
        req.Method = "GET";
        req.Timeout = 1000;
        req.ContentType = "application/json";


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

  }

}
