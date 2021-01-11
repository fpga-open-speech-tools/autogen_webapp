# OpenSpeechTools
Web Application  (Server + Client) In ASP.net | Server Code-> C# | Client -> Typescript |

# Installation
- Create armhf debug build to serve application from device
```
$ dotnet publish -c Debug -r linux-arm
```
- Copy debug build directory (<Project-Folder>/bin/Debug/netcoreapp3.1/linux-arm/publish) to device. 
  
- Add executable permissions to program on the device.
  
```
 $ chmod +x <location-of-webapp>/OpenSpeechTools 
```

- Change Directory to Executable location, Run.
```
$ cd <location-of-webapp>
$ ./OpenSpeechTools
```
**Note:** The web application uses relative pathing, so the program must be run from the directory it's located in to properly serve the web application.
