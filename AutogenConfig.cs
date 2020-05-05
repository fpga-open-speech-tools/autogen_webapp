using System;

namespace UIConfig
{
  public class AutogenConfig
  {
    [Serializable]
    public class EffectContainer
    {
      public string module;
      public Page[] pages;
    }

    [Serializable]
    public class Page
    {
      public string name;
      public Panel[] panels;
    }

    [Serializable]
    public class Panel
    {
      public string name;
      public Control[] controls;
    }

    [Serializable]
    public class Control
    {
      public string style;
      public string linkerName;
      public float min;
      public float max;
      public string title;
      public string dataType;
      public float defaultValue;
      public string units;
      public string type;
    }

  }
}

