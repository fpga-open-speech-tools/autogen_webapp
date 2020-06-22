"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_bootstrap_1 = require("react-bootstrap");
exports.FileUploaderPresentationalComponent = function (props) {
    var dragging = props.dragging, file = props.file, onSelectFileClick = props.onSelectFileClick, onDrag = props.onDrag, onDragStart = props.onDragStart, onDragEnd = props.onDragEnd, onDragOver = props.onDragOver, onDragEnter = props.onDragEnter, onDragLeave = props.onDragLeave, onDrop = props.onDrop;
    var uploaderClasses = "file-uploader flex-right";
    if (dragging) {
        uploaderClasses += " file-uploader--dragging";
    }
    var fileName = file ? file.name : "No File Uploaded!";
    return (React.createElement("div", { className: uploaderClasses, onDrag: onDrag, onDragStart: onDragStart, onDragEnd: onDragEnd, onDragOver: onDragOver, onDragEnter: onDragEnter, onDragLeave: onDragLeave, onDrop: onDrop },
        React.createElement("div", { className: "file-uploader__contents" },
            React.createElement(react_bootstrap_1.Button, { variant: "primary", className: "float-right btn-simple btn-icon", onClick: onSelectFileClick },
                React.createElement("i", { className: "fa fa-upload large-icon" }))),
        props.children));
};
//# sourceMappingURL=FileUploaderPresentationalComponent.js.map