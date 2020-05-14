namespace AvailableDemos
{
  public class Demo
  {
    public string name { get; set; }
    public s3bucketurl downloadurl { get; set; }
    public string imageurl { get; set; }
    public string videourl { get; set; }
    public long filesize { get; set; }
  }

  public class s3bucketurl
  {
    public string devicename { get; set; }
    public string projectname { get; set; }
  }
}

