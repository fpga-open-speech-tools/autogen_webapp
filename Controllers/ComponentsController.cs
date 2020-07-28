using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Hosting;

namespace Autogen.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class ComponentsController : ControllerBase
  {
    private readonly IWebHostEnvironment _webHostEnvironment;

    public ComponentsController(IWebHostEnvironment webHostEnvironment)
    {
      _webHostEnvironment = webHostEnvironment;
    }


    public string FetchConfiguration()
    {
      string webRootPath = _webHostEnvironment.WebRootPath;
      //string contentRootPath = _webHostEnvironment.ContentRootPath;

      //path = Path.Combine(webRootPath, "");
      return webRootPath;

    }


    [HttpGet]
    [Route("~/components")]
    public string Get()
    {

      var result = FetchConfiguration();
      System.Diagnostics.Debug.WriteLine("Attempting to Get Components Path: " + result);
      return result;
    }

  }

}
