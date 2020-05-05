using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon;
using System.Threading.Tasks;

namespace AvailableDemos.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class AvailableDemosController : ControllerBase
  {
    private readonly ILogger<AvailableDemosController> _logger;

    public AvailableDemosController(ILogger<AvailableDemosController> logger)
    {
      _logger = logger;
    }


    [HttpGet]
    public IEnumerable<Demo> Get()
    {
      List<Demo> ret = new List<Demo>();
      S3Client = new AmazonS3Client(AKID, SKID, bucketRegion);
      System.Diagnostics.Debug.WriteLine("Entering Demo URL");
      ListingObjectsAsync().Wait();
      System.Diagnostics.Debug.WriteLine("S3 Returns:");
      foreach (var a in S3Returns)
      {
        Demo newDemo = new Demo()
        {
          name = a,
          downloadurl = "DE10-Nano " + a + " ",
          videourl = "a",
          imageurl = "b"
        };
        ret.Add(newDemo);
        System.Diagnostics.Debug.WriteLine("Demo: " + a);
      }
      System.Diagnostics.Debug.WriteLine("Expected Number of Effects to Send as JSON: " + ret.Count);
      return Enumerable.Range(0, ret.Count).Select(index => ret[index]).ToArray();
    }









    private static readonly RegionEndpoint bucketRegion = RegionEndpoint.USWest2;
    private const string AKID = "AKIAJF2KLRDIKEFGMG3A";
    private const string SKID = "e7pH3HyZ9ijstzDTZwUM2xOB8O9wsatMAoqPfbFd";

    private static IAmazonS3 S3Client;
    private const string bucketName = "nih-demos";
    private static List<string> S3Returns;
    static async Task ListingObjectsAsync()
    {
      try
      {
        S3Returns = new List<string>();
        ListObjectsV2Request request = new ListObjectsV2Request
        {
          BucketName = bucketName,
          MaxKeys = 1000
        };

        ListObjectsV2Response response;
        do
        {
          response = await S3Client.ListObjectsV2Async(request);

          // Process the response.
          foreach (S3Object entry in response.S3Objects)
          {
            System.Diagnostics.Debug.WriteLine("key = {0} size = {1}",
                entry.Key, entry.Size);
            string demoName = "";
            int slashIndex = entry.Key.IndexOf('/');
            System.Diagnostics.Debug.WriteLine("Key Length: " + entry.Key.Length + " first slash: " + 
              slashIndex);
            if (entry.Key.Length > slashIndex+1) {
              demoName = entry.Key.Substring(slashIndex+1);
              demoName = demoName.Substring(0, demoName.IndexOf('/'));
              if (S3Returns.Count < 1)
              {
                S3Returns.Add(demoName);
              }
              else
              {
                if (!S3Returns.Contains(demoName))
                {
                  S3Returns.Add(demoName);
                }
              }
            }

            

          }
          System.Diagnostics.Debug.WriteLine("Next Continuation Token: {0}", response.NextContinuationToken);
          request.ContinuationToken = response.NextContinuationToken;
        } while (response.IsTruncated);
      }
      catch (AmazonS3Exception amazonS3Exception)
      {
        System.Diagnostics.Debug.WriteLine("S3 error occurred. Exception: " + amazonS3Exception.ToString());
      }
      catch (Exception e)
      {
        System.Diagnostics.Debug.WriteLine("Exception: " + e.ToString());
      }
    }


  }

}
