var convert = require('xml-js');
//var url = "https://nih-demos.s3.us-west-2.amazonaws.com/";
var devices = [];

export function getDemos(bucket_name, callback){
    var url = "https://"+bucket_name+".s3.us-west-2.amazonaws.com/";
    var myXML = ""
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function(){
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {
                try{
                    myXML = request.responseXML;
                    var myJSON = convert.xml2json(new XMLSerializer().serializeToString(myXML.documentElement), {compact:true, spaces:4});
                    updateDevicesList(JSON.parse(myJSON));
                    callback(devices);
                }
                catch(e){
                   //console.log(e);
                }
            }
        }
    }
    request.send();
}

function updateDevicesList(json){
    devices = [];
    json.ListBucketResult.Contents.forEach((content,index)=>{
        var segment = splitContent(content);
        var nest_level = segment.path.length;
        if(nest_level > 0){
            if(!deviceExists(segment.path[0])){
                addNewDevice(segment.path[0]);
            }
            
            if(nest_level > 1){
                if(!projectExists(segment.path[0],segment.path[1])){
                    addNewProject(segment.path[0],segment.path[1]);
                }

                if(nest_level > 2){
                    addNewProjectFile(segment.path[0],segment.path[1],segment.path[2],parseFloat(segment.size));
                }
                else
                {
                    updateProjectSize(segment.path[0],segment.path[1],parseFloat(segment.size));
                }
            }
        }
    });
}

function deviceExists(device_name){
    var output = false;
    devices.forEach((device)=>{
        if(device.name === device_name){
            output = true;
            return output;
        }
    });
    return output;
}

function projectExists(device_name,project_name){
    var output = false;
    devices.forEach((device)=>{
        if(device.name === device_name){
            device.projects.forEach((project)=>{
                if(project.name === project_name){
                    output = true;
                    return output;
                }
            });
        }
    });
    return output;
}

function splitContent(content_object){
    var key = content_object.Key;
    var size = content_object.Size;
    var parsed_object = 
    {
        path:splitFileString(key._text),
        size:size._text

    };
    return parsed_object;
}

function splitFileString(string){
    var substring = string.split('/');
    var filtered = substring.filter(function(value, index, arr){ return value !== "";});
    return filtered;
}

function addNewDevice(device){
    devices.push({
            name:device,
            projects:[]
        });
}

function addNewProject(device, project){
    devices.forEach((dev)=>{
        if(dev.name === device){
            dev.projects.push({name:project,size:0,files:[]});
            return;
        }
    });
}

function addNewProjectFile(device,project,file_name,file_size){
    devices.forEach((dev)=>{
        if(dev.name===device){
            dev.projects.forEach((proj)=>{
                if(proj.name===project)
                updateProjectSize(device,project,file_size);
                proj.files.push({
                    name:file_name,
                    size:file_size
                });
                return;
            });
        }
    });
}

function updateProjectSize(device, project, size){
    devices.forEach((dev)=>{
        if(dev.name===device){
            dev.projects.forEach((proj)=>{
                if(proj.name===project){
                    size+=size;
                    return;
                }
            }); 
        }
    });
}