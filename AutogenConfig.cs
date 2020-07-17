using System;

namespace Autogen
{
  public class AutogenConfig
  {
    [Serializable]
    public class Configuration
    {
      public string name { get; set; }
      public Container[] containers { get; set; }
      public Data[] data { get; set; }
      public View[] views { get; set; }

    }

    [Serializable]
    public class Container
    {
      public string name { get; set; }
      public View[] views { get; set; }
    }

    [Serializable]
    public class Data
    {
      public float min { get; set; }
      public float max { get; set; }
      public float step { get; set; }
      public float value { get; set; }
      public string units { get; set; }
      public string[] enumeration { get; set; }
      public DataReference reference { get; set; }
    }



    [Serializable]
    public class View
    {
      public string name { get; set; }
      public ViewType type { get; set; }
      public int[] references { get; set; }

    }
    [Serializable]
    public class ViewType
    {
      public string component { get; set; }
      public string variant { get; set; }
    }

    [Serializable]
    public class DataReference
    {
      public string device { get; set; }
      public string name { get; set; }
    }
  }
}

