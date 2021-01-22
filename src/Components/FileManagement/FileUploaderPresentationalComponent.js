"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploaderPresentationalComponent = void 0;
var React = __importStar(require("react"));
var react_bootstrap_1 = require("react-bootstrap");
exports.FileUploaderPresentationalComponent = function (props) {
    var dragging = props.dragging, file = props.file, onSelectFileClick = props.onSelectFileClick, onDrag = props.onDrag, onDragStart = props.onDragStart, onDragEnd = props.onDragEnd, onDragOver = props.onDragOver, onDragEnter = props.onDragEnter, onDragLeave = props.onDragLeave, onDrop = props.onDrop;
    var uploaderClasses = "file-uploader flex-right";
    if (dragging) {
        uploaderClasses += " file-uploader--dragging";
    }
    return (<div className={uploaderClasses} onDrag={onDrag} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className="file-uploader__contents">
        <react_bootstrap_1.Button variant="primary" className="float-right btn-simple btn-icon" onClick={onSelectFileClick}>
          <i className="fa fa-upload large-icon"/>
        </react_bootstrap_1.Button>
      </div>
      {props.children}
    </div>);
};
