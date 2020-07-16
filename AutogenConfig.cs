using System;

namespace Autogen
{
  public class AutogenConfig
  {
    [Serializable]
    public class EffectContainer
    {
      public string name { get; set; }
      public Page[] pages { get; set; }
    }

    [Serializable]
    public class Page
    {
      public string name { get; set; }
      public Panel[] panels { get; set; }
    }

    [Serializable]
    public class Panel
    {
      public string name { get; set; }
      public Control[] controls { get; set; }
    }

    [Serializable]
    public class Control
    {
      public string style { get; set; }
      public string linkerName { get; set; }
      public float min { get; set; }
      public float max { get; set; }
      public string title { get; set; }
      public string dataType { get; set; }
      public float defaultValue { get; set; }
      public string units { get; set; }
      public string type { get; set; }
      public string module { get; set; }
    }

  }
}

