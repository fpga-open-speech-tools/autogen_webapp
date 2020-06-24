using System;

namespace RegisterConfig
{

    [Serializable]
    public class RegisterConfig
    {
      public Register[] registers { get; set; }
    }

    [Serializable]
    public class Register
    {
      public string module { get; set; }
      public string link {get;set;}
      public string value { get; set; }
    }

}

