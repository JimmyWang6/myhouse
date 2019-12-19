/*!
 * bootstrap-fileinput v5.0.7
 * http://plugins.krajee.com/file-input
 *
 * Author: Kartik Visweswaran
 * Copyright: 2014 - 2019, Kartik Visweswaran, Krajee.com
 *
 * Licensed under the BSD-3-Clause
 * https://github.com/kartik-v/bootstrap-fileinput/blob/master/LICENSE.md
 */
!function (e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = e(require("jquery")) : e(window.jQuery)
}(function (e) {
    "use strict";
    e.fn.fileinputLocales = {}, e.fn.fileinputThemes = {}, String.prototype.setTokens = function (e) {
        var t, i, a = this.toString();
        for (t in e) e.hasOwnProperty(t) && (i = new RegExp("{" + t + "}", "g"), a = a.replace(i, e[t]));
        return a
    };
    var t, i;
    t = {
        FRAMES: ".kv-preview-thumb",
        SORT_CSS: "file-sortable",
        INIT_FLAG: "init-",
        OBJECT_PARAMS: '<param name="controller" value="true" />\n<param name="allowFullScreen" value="true" />\n<param name="allowScriptAccess" value="always" />\n<param name="autoPlay" value="false" />\n<param name="autoStart" value="false" />\n<param name="quality" value="high" />\n',
        DEFAULT_PREVIEW: '<div class="file-preview-other">\n<span class="{previewFileIconClass}">{previewFileIcon}</span>\n</div>',
        MODAL_ID: "kvFileinputModal",
        MODAL_EVENTS: ["show", "shown", "hide", "hidden", "loaded"],
        logMessages: {
            ajaxError: "{status}: {error}. Error Details: {text}.",
            badDroppedFiles: "Error scanning dropped files!",
            badExifParser: "Error loading the piexif.js library. {details}",
            badInputType: 'The input "type" must be set to "file" for initializing the "bootstrap-fileinput" plugin.',
            exifWarning: 'To avoid this warning, either set "autoOrientImage" to "false" OR ensure you have loaded the "piexif.js" library correctly on your page before the "fileinput.js" script.',
            invalidChunkSize: 'Invalid upload chunk size: "{chunkSize}". Resumable uploads are disabled.',
            invalidThumb: 'Invalid thumb frame with id: "{id}".',
            noResumableSupport: "The browser does not support resumable or chunk uploads.",
            noUploadUrl: 'The "uploadUrl" is not set. Ajax uploads and resumable uploads have been disabled.',
            retryStatus: "Retrying upload for chunk # {chunk} for {filename}... retry # {retry}."
        },
        objUrl: window.URL || window.webkitURL,
        now: function () {
            return new Date
        },
        round: function (e) {
            return e = parseFloat(e), isNaN(e) ? 0 : Math.floor(Math.round(e))
        },
        getFileRelativePath: function (e) {
            return String(e.relativePath || e.webkitRelativePath || t.getFileName(e) || null)
        },
        getFileId: function (e, i) {
            var a = t.getFileRelativePath(e);
            return "function" == typeof i ? i(e) : e && a ? e.size + "_" + a.replace(/\s/gim, "_") : null
        },
        getFrameSelector: function (e, t) {
            return t = t || "", '[id="' + e + '"]' + t
        },
        getZoomSelector: function (e, t) {
            return t = t || "", '[id="zoom-' + e + '"]' + t
        },
        getFrameElement: function (e, i, a) {
            return e.find(t.getFrameSelector(i, a))
        },
        getZoomElement: function (e, i, a) {
            return e.find(t.getZoomSelector(i, a))
        },
        getElapsed: function (t) {
            var i = t, a = "", r = {},
                n = {year: 31536e3, month: 2592e3, week: 604800, day: 86400, hour: 3600, minute: 60, second: 1};
            return Object.keys(n).forEach(function (e) {
                r[e] = Math.floor(i / n[e]), i -= r[e] * n[e]
            }), e.each(r, function (e, t) {
                t > 0 && (a += (a ? " " : "") + t + e.substring(0, 1))
            }), a
        },
        debounce: function (e, t) {
            var i;
            return function () {
                var a = arguments, r = this;
                clearTimeout(i), i = setTimeout(function () {
                    e.apply(r, a)
                }, t)
            }
        },
        stopEvent: function (e) {
            e.stopPropagation(), e.preventDefault()
        },
        getFileName: function (e) {
            return e ? e.fileName || e.name || "" : ""
        },
        createObjectURL: function (e) {
            return t.objUrl && t.objUrl.createObjectURL && e ? t.objUrl.createObjectURL(e) : ""
        },
        revokeObjectURL: function (e) {
            t.objUrl && t.objUrl.revokeObjectURL && e && t.objUrl.revokeObjectURL(e)
        },
        compare: function (e, t, i) {
            return void 0 !== e && (i ? e === t : e.match(t))
        },
        isIE: function (e) {
            var t, i;
            return "Microsoft Internet Explorer" !== navigator.appName ? !1 : 10 === e ? new RegExp("msie\\s" + e, "i").test(navigator.userAgent) : (t = document.createElement("div"), t.innerHTML = "<!--[if IE " + e + "]> <i></i> <![endif]-->", i = t.getElementsByTagName("i").length, document.body.appendChild(t), t.parentNode.removeChild(t), i)
        },
        canAssignFilesToInput: function () {
            var e = document.createElement("input");
            try {
                return e.type = "file", e.files = null, !0
            } catch (t) {
                return !1
            }
        },
        getDragDropFolders: function (e) {
            var t, i, a = e ? e.length : 0, r = 0;
            if (a > 0 && e[0].webkitGetAsEntry()) for (t = 0; a > t; t++) i = e[t].webkitGetAsEntry(), i && i.isDirectory && r++;
            return r
        },
        initModal: function (t) {
            var i = e("body");
            i.length && t.appendTo(i)
        },
        isFunction: function (e) {
            return "function" == typeof e
        },
        isEmpty: function (i, a) {
            return void 0 === i || null === i || !t.isFunction(i) && (0 === i.length || a && "" === e.trim(i))
        },
        isArray: function (e) {
            return Array.isArray(e) || "[object Array]" === Object.prototype.toString.call(e)
        },
        ifSet: function (e, t, i) {
            return i = i || "", t && "object" == typeof t && e in t ? t[e] : i
        },
        cleanArray: function (e) {
            return e instanceof Array || (e = []), e.filter(function (e) {
                return void 0 !== e && null !== e
            })
        },
        spliceArray: function (t, i, a) {
            var r, n, o = 0, l = [];
            if (!(t instanceof Array)) return [];
            for (n = e.extend(!0, [], t), a && n.reverse(), r = 0; r < n.length; r++) r !== i && (l[o] = n[r], o++);
            return a && l.reverse(), l
        },
        getNum: function (e, t) {
            return t = t || 0, "number" == typeof e ? e : ("string" == typeof e && (e = parseFloat(e)), isNaN(e) ? t : e)
        },
        hasFileAPISupport: function () {
            return !(!window.File || !window.FileReader)
        },
        hasDragDropSupport: function () {
            var e = document.createElement("div");
            return !t.isIE(9) && (void 0 !== e.draggable || void 0 !== e.ondragstart && void 0 !== e.ondrop)
        },
        hasFileUploadSupport: function () {
            return t.hasFileAPISupport() && window.FormData
        },
        hasBlobSupport: function () {
            try {
                return !!window.Blob && Boolean(new Blob)
            } catch (e) {
                return !1
            }
        },
        hasArrayBufferViewSupport: function () {
            try {
                return 100 === new Blob([new Uint8Array(100)]).size
            } catch (e) {
                return !1
            }
        },
        hasResumableUploadSupport: function () {
            return t.hasFileUploadSupport() && t.hasBlobSupport() && t.hasArrayBufferViewSupport() && (!!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice || !!Blob.prototype.slice || !1)
        },
        dataURI2Blob: function (e) {
            var i, a, r, n, o, l,
                s = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
                d = t.hasBlobSupport(), c = (d || s) && window.atob && window.ArrayBuffer && window.Uint8Array;
            if (!c) return null;
            for (i = e.split(",")[0].indexOf("base64") >= 0 ? atob(e.split(",")[1]) : decodeURIComponent(e.split(",")[1]), a = new ArrayBuffer(i.length), r = new Uint8Array(a), n = 0; n < i.length; n += 1) r[n] = i.charCodeAt(n);
            return o = e.split(",")[0].split(":")[1].split(";")[0], d ? new Blob([t.hasArrayBufferViewSupport() ? r : a], {type: o}) : (l = new s, l.append(a), l.getBlob(o))
        },
        arrayBuffer2String: function (e) {
            if (window.TextDecoder) return new TextDecoder("utf-8").decode(e);
            var t, i, a, r, n = Array.prototype.slice.apply(new Uint8Array(e)), o = "", l = 0;
            for (t = n.length; t > l;) switch (i = n[l++], i >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    o += String.fromCharCode(i);
                    break;
                case 12:
                case 13:
                    a = n[l++], o += String.fromCharCode((31 & i) << 6 | 63 & a);
                    break;
                case 14:
                    a = n[l++], r = n[l++], o += String.fromCharCode((15 & i) << 12 | (63 & a) << 6 | (63 & r) << 0)
            }
            return o
        },
        isHtml: function (e) {
            var t = document.createElement("div");
            t.innerHTML = e;
            for (var i = t.childNodes, a = i.length; a--;) if (1 === i[a].nodeType) return !0;
            return !1
        },
        isSvg: function (e) {
            return e.match(/^\s*<\?xml/i) && (e.match(/<!DOCTYPE svg/i) || e.match(/<svg/i))
        },
        getMimeType: function (e, t, i) {
            switch (e) {
                case"ffd8ffe0":
                case"ffd8ffe1":
                case"ffd8ffe2":
                    return "image/jpeg";
                case"89504E47":
                    return "image/png";
                case"47494638":
                    return "image/gif";
                case"49492a00":
                    return "image/tiff";
                case"52494646":
                    return "image/webp";
                case"66747970":
                    return "video/3gp";
                case"4f676753":
                    return "video/ogg";
                case"1a45dfa3":
                    return "video/mkv";
                case"000001ba":
                case"000001b3":
                    return "video/mpeg";
                case"3026b275":
                    return "video/wmv";
                case"25504446":
                    return "application/pdf";
                case"25215053":
                    return "application/ps";
                case"504b0304":
                case"504b0506":
                case"504b0508":
                    return "application/zip";
                case"377abcaf":
                    return "application/7z";
                case"75737461":
                    return "application/tar";
                case"7801730d":
                    return "application/dmg";
                default:
                    switch (e.substring(0, 6)) {
                        case"435753":
                            return "application/x-shockwave-flash";
                        case"494433":
                            return "audio/mp3";
                        case"425a68":
                            return "application/bzip";
                        default:
                            switch (e.substring(0, 4)) {
                                case"424d":
                                    return "image/bmp";
                                case"fffb":
                                    return "audio/mp3";
                                case"4d5a":
                                    return "application/exe";
                                case"1f9d":
                                case"1fa0":
                                    return "application/zip";
                                case"1f8b":
                                    return "application/gzip";
                                default:
                                    return t && !t.match(/[^\u0000-\u007f]/) ? "application/text-plain" : i
                            }
                    }
            }
        },
        addCss: function (e, t) {
            e.removeClass(t).addClass(t)
        },
        getElement: function (i, a, r) {
            return t.isEmpty(i) || t.isEmpty(i[a]) ? r : e(i[a])
        },
        uniqId: function () {
            return Math.round((new Date).getTime()) + "_" + Math.round(100 * Math.random())
        },
        htmlEncode: function (e, t) {
            return void 0 === e ? t || null : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
        },
        replaceTags: function (t, i) {
            var a = t;
            return i ? (e.each(i, function (e, t) {
                "function" == typeof t && (t = t()), a = a.split(e).join(t)
            }), a) : a
        },
        cleanMemory: function (e) {
            var i = e.is("img") ? e.attr("src") : e.find("source").attr("src");
            t.revokeObjectURL(i)
        },
        findFileName: function (e) {
            var t = e.lastIndexOf("/");
            return -1 === t && (t = e.lastIndexOf("\\")), e.split(e.substring(t, t + 1)).pop()
        },
        checkFullScreen: function () {
            return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement
        },
        toggleFullScreen: function (e) {
            var i = document, a = i.documentElement;
            a && e && !t.checkFullScreen() ? a.requestFullscreen ? a.requestFullscreen() : a.msRequestFullscreen ? a.msRequestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.webkitRequestFullscreen && a.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) : i.exitFullscreen ? i.exitFullscreen() : i.msExitFullscreen ? i.msExitFullscreen() : i.mozCancelFullScreen ? i.mozCancelFullScreen() : i.webkitExitFullscreen && i.webkitExitFullscreen()
        },
        moveArray: function (t, i, a, r) {
            var n = e.extend(!0, [], t);
            if (r && n.reverse(), a >= n.length) for (var o = a - n.length; o-- + 1;) n.push(void 0);
            return n.splice(a, 0, n.splice(i, 1)[0]), r && n.reverse(), n
        },
        cleanZoomCache: function (e) {
            var t = e.closest(".kv-zoom-cache-theme");
            t.length || (t = e.closest(".kv-zoom-cache")), t.remove()
        },
        closeButton: function (e) {
            return e = e ? "close " + e : "close", '<button type="button" class="' + e + '" aria-label="Close">\n  <span aria-hidden="true">&times;</span>\n</button>'
        },
        getRotation: function (e) {
            switch (e) {
                case 2:
                    return "rotateY(180deg)";
                case 3:
                    return "rotate(180deg)";
                case 4:
                    return "rotate(180deg) rotateY(180deg)";
                case 5:
                    return "rotate(270deg) rotateY(180deg)";
                case 6:
                    return "rotate(90deg)";
                case 7:
                    return "rotate(90deg) rotateY(180deg)";
                case 8:
                    return "rotate(270deg)";
                default:
                    return ""
            }
        },
        setTransform: function (e, t) {
            e && (e.style.transform = t, e.style.webkitTransform = t, e.style["-moz-transform"] = t, e.style["-ms-transform"] = t, e.style["-o-transform"] = t)
        }
    }, i = function (i, a) {
        var r = this;
        r.$element = e(i), r.$parent = r.$element.parent(), r._validate() && (r.isPreviewable = t.hasFileAPISupport(), r.isIE9 = t.isIE(9), r.isIE10 = t.isIE(10), (r.isPreviewable || r.isIE9) && (r._init(a), r._listen()), r.$element.removeClass("file-loading"))
    }, i.prototype = {
        constructor: i, _cleanup: function () {
            var e = this;
            e.reader = null, e.clearFileStack(), e.fileBatchCompleted = !0, e.isError = !1, e.cancelling = !1, e.paused = !1, e.lastProgress = 0, e._initAjax()
        }, _initAjax: function () {
            var e = this;
            e.ajaxQueue = [], e.ajaxRequests = [], e.ajaxQueueIntervalId = null, e.ajaxCurrentThreads = 0, e.ajaxAborted = !1
        }, _init: function (i, a) {
            var r, n, o, l, s = this, d = s.$element;
            s.options = i, e.each(i, function (e, i) {
                switch (e) {
                    case"minFileCount":
                    case"maxFileCount":
                    case"maxTotalFileCount":
                    case"minFileSize":
                    case"maxFileSize":
                    case"maxFilePreviewSize":
                    case"resizeImageQuality":
                    case"resizeIfSizeMoreThan":
                    case"progressUploadThreshold":
                    case"initialPreviewCount":
                    case"zoomModalHeight":
                    case"minImageHeight":
                    case"maxImageHeight":
                    case"minImageWidth":
                    case"maxImageWidth":
                        s[e] = t.getNum(i);
                        break;
                    default:
                        s[e] = i
                }
            }), s.maxTotalFileCount > 0 && s.maxTotalFileCount < s.maxFileCount && (s.maxTotalFileCount = s.maxFileCount), s.rtl && (l = s.previewZoomButtonIcons.prev, s.previewZoomButtonIcons.prev = s.previewZoomButtonIcons.next, s.previewZoomButtonIcons.next = l), !isNaN(s.maxAjaxThreads) && s.maxAjaxThreads < s.resumableUploadOptions.maxThreads && (s.resumableUploadOptions.maxThreads = s.maxAjaxThreads), s._initFileManager(), "function" == typeof s.autoOrientImage && (s.autoOrientImage = s.autoOrientImage()), "function" == typeof s.autoOrientImageInitial && (s.autoOrientImageInitial = s.autoOrientImageInitial()), a || s._cleanup(), s.$form = d.closest("form"), s._initTemplateDefaults(), s.uploadFileAttr = t.isEmpty(d.attr("name")) ? "file_data" : d.attr("name"), o = s._getLayoutTemplate("progress"), s.progressTemplate = o.replace("{class}", s.progressClass), s.progressInfoTemplate = o.replace("{class}", s.progressInfoClass), s.progressPauseTemplate = o.replace("{class}", s.progressPauseClass), s.progressCompleteTemplate = o.replace("{class}", s.progressCompleteClass), s.progressErrorTemplate = o.replace("{class}", s.progressErrorClass), s.isDisabled = d.attr("disabled") || d.attr("readonly"), s.isDisabled && d.attr("disabled", !0), s.isClickable = s.browseOnZoneClick && s.showPreview && (s.dropZoneEnabled || !t.isEmpty(s.defaultPreviewContent)), s.isAjaxUpload = t.hasFileUploadSupport() && !t.isEmpty(s.uploadUrl), s.dropZoneEnabled = t.hasDragDropSupport() && s.dropZoneEnabled, s.isAjaxUpload || (s.dropZoneEnabled = s.dropZoneEnabled && t.canAssignFilesToInput()), s.slug = "function" == typeof i.slugCallback ? i.slugCallback : s._slugDefault, s.mainTemplate = s.showCaption ? s._getLayoutTemplate("main1") : s._getLayoutTemplate("main2"), s.captionTemplate = s._getLayoutTemplate("caption"), s.previewGenericTemplate = s._getPreviewTemplate("generic"), !s.imageCanvas && s.resizeImage && (s.maxImageWidth || s.maxImageHeight) && (s.imageCanvas = document.createElement("canvas"), s.imageCanvasContext = s.imageCanvas.getContext("2d")), t.isEmpty(d.attr("id")) && d.attr("id", t.uniqId()), s.namespace = ".fileinput_" + d.attr("id").replace(/-/g, "_"), void 0 === s.$container ? s.$container = s._createContainer() : s._refreshContainer(), n = s.$container, s.$dropZone = n.find(".file-drop-zone"), s.$progress = n.find(".kv-upload-progress"), s.$btnUpload = n.find(".fileinput-upload"), s.$captionContainer = t.getElement(i, "elCaptionContainer", n.find(".file-caption")), s.$caption = t.getElement(i, "elCaptionText", n.find(".file-caption-name")), t.isEmpty(s.msgPlaceholder) || (r = d.attr("multiple") ? s.filePlural : s.fileSingle, s.$caption.attr("placeholder", s.msgPlaceholder.replace("{files}", r))), s.$captionIcon = s.$captionContainer.find(".file-caption-icon"), s.$previewContainer = t.getElement(i, "elPreviewContainer", n.find(".file-preview")), s.$preview = t.getElement(i, "elPreviewImage", n.find(".file-preview-thumbnails")), s.$previewStatus = t.getElement(i, "elPreviewStatus", n.find(".file-preview-status")), s.$errorContainer = t.getElement(i, "elErrorContainer", s.$previewContainer.find(".kv-fileinput-error")), s._validateDisabled(), t.isEmpty(s.msgErrorClass) || t.addCss(s.$errorContainer, s.msgErrorClass), a ? s._errorsExist() || s.$errorContainer.hide() : (s.$errorContainer.hide(), s.previewInitId = "thumb-" + d.attr("id"), s._initPreviewCache(), s._initPreview(!0), s._initPreviewActions(), s.$parent.hasClass("file-loading") && (s.$container.insertBefore(s.$parent), s.$parent.remove())), s._setFileDropZoneTitle(), d.attr("disabled") && s.disable(), s._initZoom(), s.hideThumbnailContent && t.addCss(s.$preview, "hide-content")
        }, _initFileManager: function () {
            var i = this;
            i.fileManager = {
                stack: {},
                processed: [],
                errors: [],
                loadedImages: {},
                totalImages: 0,
                totalFiles: null,
                totalSize: null,
                uploadedSize: 0,
                stats: {},
                initStats: function (e) {
                    var a = {started: t.now().getTime()};
                    e ? i.fileManager.stats[e] = a : i.fileManager.stats = a
                },
                getUploadStats: function (e, a, r) {
                    var n = i.fileManager, o = e ? n.stats[e] && n.stats[e].started || null : null;
                    o || (o = t.now().getTime());
                    var l = (t.now().getTime() - o) / 1e3,
                        s = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s", "PB/s", "EB/s", "ZB/s", "YB/s"], d = l ? a / l : 0,
                        c = i._getSize(d, s), u = r - a, p = {
                            fileId: e,
                            started: o,
                            elapsed: l,
                            loaded: a,
                            total: r,
                            bps: d,
                            bitrate: c,
                            pendingBytes: u
                        };
                    return e ? n.stats[e] = p : n.stats = p, p
                },
                exists: function (t) {
                    return -1 !== e.inArray(t, i.fileManager.getIdList())
                },
                count: function () {
                    return i.fileManager.getIdList().length
                },
                total: function () {
                    var e = i.fileManager;
                    return e.totalFiles || (e.totalFiles = e.count()), e.totalFiles
                },
                getTotalSize: function () {
                    var t = i.fileManager;
                    return t.totalSize ? t.totalSize : (t.totalSize = 0, e.each(i.fileManager.stack, function (e, i) {
                        var a = parseFloat(i.size);
                        t.totalSize += isNaN(a) ? 0 : a
                    }), t.totalSize)
                },
                add: function (e, a) {
                    a || (a = i.fileManager.getId(e)), a && (i.fileManager.stack[a] = {
                        file: e,
                        name: t.getFileName(e),
                        relativePath: t.getFileRelativePath(e),
                        size: e.size,
                        nameFmt: i._getFileName(e, ""),
                        sizeFmt: i._getSize(e.size)
                    })
                },
                remove: function (e) {
                    var t = e.attr("data-fileid");
                    t && i.fileManager.removeFile(t)
                },
                removeFile: function (e) {
                    delete i.fileManager.stack[e], delete i.fileManager.loadedImages[e]
                },
                move: function (t, a) {
                    var r = {}, n = i.fileManager.stack;
                    (t || a) && t !== a && (e.each(n, function (e, i) {
                        e !== t && (r[e] = i), e === a && (r[t] = n[t])
                    }), i.fileManager.stack = r)
                },
                list: function () {
                    var t = [];
                    return e.each(i.fileManager.stack, function (e, i) {
                        i && i.file && t.push(i.file)
                    }), t
                },
                isPending: function (t) {
                    return -1 === e.inArray(t, i.fileManager.processed) && i.fileManager.exists(t)
                },
                isProcessed: function () {
                    var t = !0, a = i.fileManager;
                    return e.each(a.stack, function (e) {
                        a.isPending(e) && (t = !1)
                    }), t
                },
                clear: function () {
                    var e = i.fileManager;
                    e.totalFiles = null, e.totalSize = null, e.uploadedSize = 0, e.stack = {}, e.errors = [], e.processed = [], e.stats = {}, e.clearImages()
                },
                clearImages: function () {
                    i.fileManager.loadedImages = {}, i.fileManager.totalImages = 0
                },
                addImage: function (e, t) {
                    i.fileManager.loadedImages[e] = t
                },
                removeImage: function (e) {
                    delete i.fileManager.loadedImages[e]
                },
                getImageIdList: function () {
                    return Object.keys(i.fileManager.loadedImages)
                },
                getImageCount: function () {
                    return i.fileManager.getImageIdList().length
                },
                getId: function (e) {
                    return i._getFileId(e)
                },
                getIndex: function (e) {
                    return i.fileManager.getIdList().indexOf(e)
                },
                getThumb: function (t) {
                    var a = null;
                    return i._getThumbs().each(function () {
                        var i = e(this);
                        i.attr("data-fileid") === t && (a = i)
                    }), a
                },
                getThumbIndex: function (e) {
                    var t = e.attr("data-fileid");
                    return i.fileManager.getIndex(t)
                },
                getIdList: function () {
                    return Object.keys(i.fileManager.stack)
                },
                getFile: function (e) {
                    return i.fileManager.stack[e] || null
                },
                getFileName: function (e, t) {
                    var a = i.fileManager.getFile(e);
                    return a ? t ? a.nameFmt || "" : a.name || "" : ""
                },
                getFirstFile: function () {
                    var e = i.fileManager.getIdList(), t = e && e.length ? e[0] : null;
                    return i.fileManager.getFile(t)
                },
                setFile: function (e, t) {
                    i.fileManager.getFile(e) ? i.fileManager.stack[e].file = t : i.fileManager.add(t, e)
                },
                setProcessed: function (e) {
                    i.fileManager.processed.push(e)
                },
                getProgress: function () {
                    var e = i.fileManager.total(), t = i.fileManager.processed.length;
                    return e ? Math.ceil(t / e * 100) : 0
                },
                setProgress: function (e, t) {
                    var a = i.fileManager.getFile(e);
                    !isNaN(t) && a && (a.progress = t)
                }
            }
        }, _setUploadData: function (i, a) {
            var r = this;
            e.each(a, function (e, a) {
                var n = r.uploadParamNames[e] || e;
                t.isArray(a) ? i.append(n, a[0], a[1]) : i.append(n, a)
            })
        }, _initResumableUpload: function () {
            var i = this, a = i.resumableUploadOptions, r = t.logMessages;
            if (i.enableResumableUpload) {
                if (a.fallback !== !1 && "function" != typeof a.fallback && (a.fallback = function (e) {
                    e._log(r.noResumableSupport), e.enableResumableUpload = !1
                }), !t.hasResumableUploadSupport() && a.fallback !== !1) return void a.fallback(i);
                if (!i.uploadUrl && i.enableResumableUpload) return i._log(r.noUploadUrl), void (i.enableResumableUpload = !1);
                if (a.chunkSize = parseFloat(a.chunkSize), a.chunkSize <= 0 || isNaN(a.chunkSize)) return i._log(r.invalidChunkSize, {chunkSize: a.chunkSize}), void (i.enableResumableUpload = !1);
                i.resumableManager = {
                    init: function (e, t, a) {
                        var r = i.resumableManager, n = i.fileManager;
                        r.currThreads = 0, r.logs = [], r.stack = [], r.error = "", r.chunkIntervalId = null, r.id = e, r.file = t.file, r.fileName = t.name, r.fileIndex = a, r.completed = !1, r.testing = !1, r.lastProgress = 0, i.showPreview && (r.$thumb = n.getThumb(e) || null, r.$progress = r.$btnDelete = null, r.$thumb && r.$thumb.length && (r.$progress = r.$thumb.find(".file-thumb-progress"), r.$btnDelete = r.$thumb.find(".kv-file-remove"))), r.chunkSize = 1024 * i.resumableUploadOptions.chunkSize, r.chunkCount = r.getTotalChunks()
                    }, logAjaxError: function (e, t, a) {
                        i.resumableUploadOptions.showErrorLog && i._log(r.ajaxError, {
                            status: e.status,
                            error: a,
                            text: e.responseText || ""
                        })
                    }, reset: function () {
                        var e = i.resumableManager;
                        e.processed = {}
                    }, setProcessed: function (e) {
                        var t, a = i.resumableManager, r = i.fileManager, n = a.id, o = a.$thumb, l = a.$progress,
                            s = o && o.length, d = {id: s ? o.attr("id") : "", index: r.getIndex(n), fileId: n};
                        a.completed = !0, a.lastProgress = 0, r.uploadedSize += a.file.size, s && o.removeClass("file-uploading"), "success" === e ? (i.showPreview && (i._setProgress(101, l), i._setThumbStatus(o, "Success"), i._initUploadSuccess(a.processed[n].data, o)), i.fileManager.removeFile(n), delete a.processed[n], i._raise("fileuploaded", [d.id, d.index, d.fileId]), r.isProcessed() && i._setProgress(101)) : (i.showPreview && (i._setThumbStatus(o, "Error"), i._setPreviewError(o, !0), i._setProgress(101, l, i.msgProgressError), i._setProgress(101, i.$progress, i.msgProgressError), i.cancelling = !0), i.$errorContainer.find('li[data-file-id="' + d.fileId + '"]').length || (t = i.msgResumableUploadRetriesExceeded.setTokens({
                            file: a.fileName,
                            max: i.resumableUploadOptions.maxRetries,
                            error: a.error
                        }), i._showFileError(t, d))), r.isProcessed() && a.reset()
                    }, check: function () {
                        var t = i.resumableManager, a = !0;
                        e.each(t.logs, function (e, t) {
                            return t ? void 0 : (a = !1, !1)
                        }), a && (clearInterval(t.chunkIntervalId), t.setProcessed("success"))
                    }, processedResumables: function () {
                        var e, t = i.resumableManager.logs, a = 0;
                        if (!t || !t.length) return 0;
                        for (e = 0; e < t.length; e++) t[e] === !0 && a++;
                        return a
                    }, getUploadedSize: function () {
                        var e = i.resumableManager, t = e.processedResumables() * e.chunkSize;
                        return t > e.file.size ? e.file.size : t
                    }, getTotalChunks: function () {
                        var e = i.resumableManager, t = parseFloat(e.chunkSize);
                        return !isNaN(t) && t > 0 ? Math.ceil(e.file.size / t) : 0
                    }, getProgress: function () {
                        var e = i.resumableManager, t = e.processedResumables(), a = e.chunkCount;
                        return 0 === a ? 0 : Math.ceil(t / a * 100)
                    }, checkAborted: function (e) {
                        (i.paused || i.cancelling) && (clearInterval(e), i.unlock())
                    }, upload: function () {
                        var e, a = i.resumableManager, r = i.fileManager, n = r.getIdList(), o = "new";
                        e = setInterval(function () {
                            var l;
                            if (a.checkAborted(e), "new" === o && (i.lock(), o = "processing", l = n.shift(), r.initStats(l), r.stack[l] && (a.init(l, r.stack[l], r.getIndex(l)), a.testUpload(), a.uploadResumable())), !r.isPending(l) && a.completed && (o = "new"), r.isProcessed()) {
                                var s = i.$preview.find(".file-preview-initial");
                                s.length && (t.addCss(s, t.SORT_CSS), i._initSortable()), clearInterval(e), i._clearFileInput(), i.unlock(), setTimeout(function () {
                                    var e = i.previewCache.data;
                                    e && (i.initialPreview = e.content, i.initialPreviewConfig = e.config, i.initialPreviewThumbTags = e.tags), i._raise("filebatchuploadcomplete", [i.initialPreview, i.initialPreviewConfig, i.initialPreviewThumbTags, i._getExtraData()])
                                }, i.processDelay)
                            }
                        }, i.processDelay)
                    }, uploadResumable: function () {
                        var e, t = i.resumableManager, a = t.chunkCount;
                        for (e = 0; a > e; e++) t.logs[e] = !(!t.processed[t.id] || !t.processed[t.id][e]);
                        for (e = 0; a > e; e++) t.pushAjax(e, 0);
                        t.chunkIntervalId = setInterval(t.loopAjax, i.queueDelay)
                    }, testUpload: function () {
                        var a, r, n, o, l, s, d, c = i.resumableManager, u = i.resumableUploadOptions,
                            p = i.fileManager, f = c.id;
                        return u.testUrl ? (c.testing = !0, a = new FormData, r = p.stack[f], i._setUploadData(a, {
                            fileId: f,
                            fileName: r.fileName,
                            fileSize: r.size,
                            fileRelativePath: r.relativePath,
                            chunkSize: c.chunkSize,
                            chunkCount: c.chunkCount
                        }), n = function (e) {
                            d = i._getOutData(a, e), i._raise("filetestbeforesend", [f, p, c, d])
                        }, o = function (r, n, o) {
                            d = i._getOutData(a, o, r);
                            var l = i.uploadParamNames, s = l.chunksUploaded || "chunksUploaded", u = [f, p, c, d];
                            r[s] && t.isArray(r[s]) ? (c.processed[f] || (c.processed[f] = {}), e.each(r[s], function (e, t) {
                                c.logs[t] = !0, c.processed[f][t] = !0
                            }), c.processed[f].data = r, i._raise("filetestsuccess", u)) : i._raise("filetesterror", u), c.testing = !1
                        }, l = function (e, t, r) {
                            d = i._getOutData(a, e), i._raise("filetestajaxerror", [f, p, c, d]), c.logAjaxError(e, t, r), c.testing = !1
                        }, s = function () {
                            i._raise("filetestcomplete", [f, p, c, i._getOutData(a)]), c.testing = !1
                        }, void i._ajaxSubmit(n, o, s, l, a, f, c.fileIndex, u.testUrl)) : void (c.testing = !1)
                    }, pushAjax: function (e, t) {
                        i.resumableManager.stack.push([e, t])
                    }, sendAjax: function (e, a) {
                        var n, o = i.fileManager, l = i.resumableManager, s = i.resumableUploadOptions, d = l.chunkSize,
                            c = l.id, u = l.file, p = l.$thumb, f = l.$btnDelete;
                        if (!l.processed[c] || !l.processed[c][e]) {
                            if (l.currThreads++, a > s.maxRetries) return void l.setProcessed("error");
                            var g, m, v, h, w, b,
                                _ = u.slice ? "slice" : u.mozSlice ? "mozSlice" : u.webkitSlice ? "webkitSlice" : "slice",
                                C = u[_](d * e, d * (e + 1));
                            g = new FormData, n = o.stack[c], i._setUploadData(g, {
                                chunkCount: l.chunkCount,
                                chunkIndex: e,
                                chunkSize: d,
                                chunkSizeStart: d * e,
                                fileBlob: [C, l.fileName],
                                fileId: c,
                                fileName: l.fileName,
                                fileRelativePath: n.relativePath,
                                fileSize: u.size,
                                retryCount: a
                            }), l.$progress && l.$progress.length && l.$progress.show(), v = function (r) {
                                m = i._getOutData(g, r), i.showPreview && (p.hasClass("file-preview-success") || (i._setThumbStatus(p, "Loading"), t.addCss(p, "file-uploading")), f.attr("disabled", !0)), i._raise("filechunkbeforesend", [c, e, a, o, l, m])
                            }, h = function (t, n, s) {
                                m = i._getOutData(g, s, t);
                                var d = i.uploadParamNames, u = d.chunkIndex || "chunkIndex",
                                    p = i.resumableUploadOptions, f = [c, e, a, o, l, m];
                                l.currThreads--, t.error ? (p.showErrorLog && i._log(r.retryStatus, {
                                    retry: a + 1,
                                    filename: l.fileName,
                                    chunk: e
                                }), l.pushAjax(e, a + 1), l.error = t.error, i._raise("filechunkerror", f)) : (l.logs[t[u]] = !0, l.processed[c] || (l.processed[c] = {}), l.processed[c][t[u]] = !0, l.processed[c].data = t, i._raise("filechunksuccess", f), l.check())
                            }, w = function (t, r, n) {
                                m = i._getOutData(g, t), l.currThreads--, l.error = n, l.logAjaxError(t, r, n), i._raise("filechunkajaxerror", [c, e, a, o, l, m]), l.pushAjax(e, a + 1)
                            }, b = function () {
                                i._raise("filechunkcomplete", [c, e, a, o, l, i._getOutData(g)])
                            }, i._ajaxSubmit(v, h, b, w, g, c, l.fileIndex)
                        }
                    }, loopAjax: function () {
                        var e = i.resumableManager;
                        if (e.currThreads < i.resumableUploadOptions.maxThreads && !e.testing) {
                            var t, a = e.stack.shift();
                            "undefined" != typeof a && (t = a[0], e.processed[e.id] && e.processed[e.id][t] ? e.processedResumables() >= e.getTotalChunks() && (e.setProcessed("success"), clearInterval(e.chunkIntervalId)) : e.sendAjax(t, a[1]))
                        }
                    }
                }, i.resumableManager.reset()
            }
        }, _initTemplateDefaults: function () {
            var i, a, r, n, o, l, s, d, c, u, p, f, g, m, v, h, w, b, _, C, x, y, T, F, I, P, k, E, S, A, z, D, M, U, $,
                j, R, O, B, L, Z, N = this;
            i = '{preview}\n<div class="kv-upload-progress kv-hidden"></div><div class="clearfix"></div>\n<div class="input-group {class}">\n  {caption}\n<div class="input-group-btn input-group-append">\n      {remove}\n      {cancel}\n      {pause}\n      {upload}\n      {browse}\n    </div>\n</div>', a = '{preview}\n<div class="kv-upload-progress kv-hidden"></div>\n<div class="clearfix"></div>\n{remove}\n{cancel}\n{upload}\n{browse}\n', r = '<div class="file-preview {class}">\n  {close}  <div class="{dropClass} clearfix">\n    <div class="file-preview-thumbnails clearfix">\n    </div>\n    <div class="file-preview-status text-center text-success"></div>\n    <div class="kv-fileinput-error"></div>\n  </div>\n</div>', o = t.closeButton("fileinput-remove"), n = '<i class="glyphicon glyphicon-file"></i>', l = '<div class="file-caption form-control {class}" tabindex="500">\n  <span class="file-caption-icon"></span>\n  <input class="file-caption-name" onkeydown="return false;" onpaste="return false;">\n</div>', s = '<button type="{type}" tabindex="500" title="{title}" class="{css}" {status}>{icon} {label}</button>', d = '<a href="{href}" tabindex="500" title="{title}" class="{css}" {status}>{icon} {label}</a>', c = '<div tabindex="500" class="{css}" {status}>{icon} {label}</div>', u = '<div id="' + t.MODAL_ID + '" class="file-zoom-dialog modal fade" tabindex="-1" aria-labelledby="' + t.MODAL_ID + 'Label"></div>', p = '<div class="modal-dialog modal-lg{rtl}" role="document">\n  <div class="modal-content">\n    <div class="modal-header">\n      <h5 class="modal-title">{heading}</h5>\n      <span class="kv-zoom-title"></span>\n      <div class="kv-zoom-actions">{toggleheader}{fullscreen}{borderless}{close}</div>\n    </div>\n    <div class="modal-body">\n      <div class="floating-buttons"></div>\n      <div class="kv-zoom-body file-zoom-content {zoomFrameClass}"></div>\n{prev} {next}\n    </div>\n  </div>\n</div>\n', f = '<div class="progress">\n    <div class="{class}" role="progressbar" aria-valuenow="{percent}" aria-valuemin="0" aria-valuemax="100" style="width:{percent}%;">\n        {status}\n     </div>\n</div>{stats}', Z = '<div class="text-info file-upload-stats"><span class="pending-time">{pendingTime}</span> <span class="upload-speed">{uploadSpeed}</span></div>', g = " <samp>({sizeText})</samp>", m = '<div class="file-thumbnail-footer">\n    <div class="file-footer-caption" title="{caption}">\n        <div class="file-caption-info">{caption}</div>\n        <div class="file-size-info">{size}</div>\n    </div>\n    {progress}\n{indicator}\n{actions}\n</div>', v = '<div class="file-actions">\n    <div class="file-footer-buttons">\n        {download} {upload} {delete} {zoom} {other}    </div>\n</div>\n{drag}\n<div class="clearfix"></div>', h = '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}" {dataUrl}{dataKey}>{removeIcon}</button>\n', w = '<button type="button" class="kv-file-upload {uploadClass}" title="{uploadTitle}">{uploadIcon}</button>', b = '<a class="kv-file-download {downloadClass}" title="{downloadTitle}" href="{downloadUrl}" download="{caption}" target="_blank">{downloadIcon}</a>', _ = '<button type="button" class="kv-file-zoom {zoomClass}" title="{zoomTitle}">{zoomIcon}</button>', C = '<span class="file-drag-handle {dragClass}" title="{dragTitle}">{dragIcon}</span>', x = '<div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>', y = '<div class="file-preview-frame {frameClass}" id="{previewId}" data-fileindex="{fileindex}" data-fileid="{fileid}" data-template="{template}"', T = y + '><div class="kv-file-content">\n', F = y + ' title="{caption}"><div class="kv-file-content">\n', I = "</div>{footer}\n</div>\n", P = "{content}\n", O = " {style}", k = '<div class="kv-preview-data file-preview-html" title="{caption}"' + O + ">{data}</div>\n", E = '<img src="{data}" class="file-preview-image kv-preview-data" title="{title}" alt="{alt}"' + O + ">\n", S = '<textarea class="kv-preview-data file-preview-text" title="{caption}" readonly' + O + ">{data}</textarea>\n", A = '<iframe class="kv-preview-data file-preview-office" src="https://view.officeapps.live.com/op/embed.aspx?src={data}"' + O + "></iframe>", z = '<iframe class="kv-preview-data file-preview-gdocs" src="https://docs.google.com/gview?url={data}&embedded=true"' + O + "></iframe>", D = '<video class="kv-preview-data file-preview-video" controls' + O + '>\n<source src="{data}" type="{type}">\n' + t.DEFAULT_PREVIEW + "\n</video>\n", M = '<!--suppress ALL --><audio class="kv-preview-data file-preview-audio" controls' + O + '>\n<source src="{data}" type="{type}">\n' + t.DEFAULT_PREVIEW + "\n</audio>\n", U = '<embed class="kv-preview-data file-preview-flash" src="{data}" type="application/x-shockwave-flash"' + O + ">\n", j = '<embed class="kv-preview-data file-preview-pdf" src="{data}" type="application/pdf"' + O + ">\n", $ = '<object class="kv-preview-data file-preview-object file-object {typeCss}" data="{data}" type="{type}"' + O + '>\n<param name="movie" value="{caption}" />\n' + t.OBJECT_PARAMS + " " + t.DEFAULT_PREVIEW + "\n</object>\n", R = '<div class="kv-preview-data file-preview-other-frame"' + O + ">\n" + t.DEFAULT_PREVIEW + "\n</div>\n", B = '<div class="kv-zoom-cache" style="display:none">{zoomContent}</div>', L = {
                width: "100%",
                height: "100%",
                "min-height": "480px"
            }, N._isPdfRendered() && (j = N.pdfRendererTemplate.replace("{renderer}", N._encodeURI(N.pdfRendererUrl))), N.defaults = {
                layoutTemplates: {
                    main1: i,
                    main2: a,
                    preview: r,
                    close: o,
                    fileIcon: n,
                    caption: l,
                    modalMain: u,
                    modal: p,
                    progress: f,
                    stats: Z,
                    size: g,
                    footer: m,
                    indicator: x,
                    actions: v,
                    actionDelete: h,
                    actionUpload: w,
                    actionDownload: b,
                    actionZoom: _,
                    actionDrag: C,
                    btnDefault: s,
                    btnLink: d,
                    btnBrowse: c,
                    zoomCache: B
                },
                previewMarkupTags: {tagBefore1: T, tagBefore2: F, tagAfter: I},
                previewContentTemplates: {
                    generic: P,
                    html: k,
                    image: E,
                    text: S,
                    office: A,
                    gdocs: z,
                    video: D,
                    audio: M,
                    flash: U,
                    object: $,
                    pdf: j,
                    other: R
                },
                allowedPreviewTypes: ["image", "html", "text", "video", "audio", "flash", "pdf", "object"],
                previewTemplates: {},
                previewSettings: {
                    image: {width: "auto", height: "auto", "max-width": "100%", "max-height": "100%"},
                    html: {width: "213px", height: "160px"},
                    text: {width: "213px", height: "160px"},
                    office: {width: "213px", height: "160px"},
                    gdocs: {width: "213px", height: "160px"},
                    video: {width: "213px", height: "160px"},
                    audio: {width: "100%", height: "30px"},
                    flash: {width: "213px", height: "160px"},
                    object: {width: "213px", height: "160px"},
                    pdf: {width: "100%", height: "160px"},
                    other: {width: "213px", height: "160px"}
                },
                previewSettingsSmall: {
                    image: {width: "auto", height: "auto", "max-width": "100%", "max-height": "100%"},
                    html: {width: "100%", height: "160px"},
                    text: {width: "100%", height: "160px"},
                    office: {width: "100%", height: "160px"},
                    gdocs: {width: "100%", height: "160px"},
                    video: {width: "100%", height: "auto"},
                    audio: {width: "100%", height: "30px"},
                    flash: {
                        width: "100%", height: "auto"
                    },
                    object: {width: "100%", height: "auto"},
                    pdf: {width: "100%", height: "160px"},
                    other: {width: "100%", height: "160px"}
                },
                previewZoomSettings: {
                    image: {width: "auto", height: "auto", "max-width": "100%", "max-height": "100%"},
                    html: L,
                    text: L,
                    office: {width: "100%", height: "100%", "max-width": "100%", "min-height": "480px"},
                    gdocs: {width: "100%", height: "100%", "max-width": "100%", "min-height": "480px"},
                    video: {width: "auto", height: "100%", "max-width": "100%"},
                    audio: {width: "100%", height: "30px"},
                    flash: {width: "auto", height: "480px"},
                    object: {width: "auto", height: "100%", "max-width": "100%", "min-height": "480px"},
                    pdf: L,
                    other: {width: "auto", height: "100%", "min-height": "480px"}
                },
                mimeTypeAliases: {"video/quicktime": "video/mp4"},
                fileTypeSettings: {
                    image: function (e, i) {
                        return t.compare(e, "image.*") && !t.compare(e, /(tiff?|wmf)$/i) || t.compare(i, /\.(gif|png|jpe?g)$/i)
                    }, html: function (e, i) {
                        return t.compare(e, "text/html") || t.compare(i, /\.(htm|html)$/i)
                    }, office: function (e, i) {
                        return t.compare(e, /(word|excel|powerpoint|office)$/i) || t.compare(i, /\.(docx?|xlsx?|pptx?|pps|potx?)$/i)
                    }, gdocs: function (e, i) {
                        return t.compare(e, /(word|excel|powerpoint|office|iwork-pages|tiff?)$/i) || t.compare(i, /\.(docx?|xlsx?|pptx?|pps|potx?|rtf|ods|odt|pages|ai|dxf|ttf|tiff?|wmf|e?ps)$/i)
                    }, text: function (e, i) {
                        return t.compare(e, "text.*") || t.compare(i, /\.(xml|javascript)$/i) || t.compare(i, /\.(txt|md|csv|nfo|ini|json|php|js|css)$/i)
                    }, video: function (e, i) {
                        return t.compare(e, "video.*") && (t.compare(e, /(ogg|mp4|mp?g|mov|webm|3gp)$/i) || t.compare(i, /\.(og?|mp4|webm|mp?g|mov|3gp)$/i))
                    }, audio: function (e, i) {
                        return t.compare(e, "audio.*") && (t.compare(i, /(ogg|mp3|mp?g|wav)$/i) || t.compare(i, /\.(og?|mp3|mp?g|wav)$/i))
                    }, flash: function (e, i) {
                        return t.compare(e, "application/x-shockwave-flash", !0) || t.compare(i, /\.(swf)$/i)
                    }, pdf: function (e, i) {
                        return t.compare(e, "application/pdf", !0) || t.compare(i, /\.(pdf)$/i)
                    }, object: function () {
                        return !0
                    }, other: function () {
                        return !0
                    }
                },
                fileActionSettings: {
                    showRemove: !0,
                    showUpload: !0,
                    showDownload: !0,
                    showZoom: !0,
                    showDrag: !0,
                    removeIcon: '<i class="glyphicon glyphicon-trash"></i>',
                    removeClass: "btn btn-sm btn-kv btn-default btn-outline-secondary",
                    removeErrorClass: "btn btn-sm btn-kv btn-danger",
                    removeTitle: "Remove file",
                    uploadIcon: '<i class="glyphicon glyphicon-upload"></i>',
                    uploadClass: "btn btn-sm btn-kv btn-default btn-outline-secondary",
                    uploadTitle: "Upload file",
                    uploadRetryIcon: '<i class="glyphicon glyphicon-repeat"></i>',
                    uploadRetryTitle: "Retry upload",
                    downloadIcon: '<i class="glyphicon glyphicon-download"></i>',
                    downloadClass: "btn btn-sm btn-kv btn-default btn-outline-secondary",
                    downloadTitle: "Download file",
                    zoomIcon: '<i class="glyphicon glyphicon-zoom-in"></i>',
                    zoomClass: "btn btn-sm btn-kv btn-default btn-outline-secondary",
                    zoomTitle: "View Details",
                    dragIcon: '<i class="glyphicon glyphicon-move"></i>',
                    dragClass: "text-info",
                    dragTitle: "Move / Rearrange",
                    dragSettings: {},
                    indicatorNew: '<i class="glyphicon glyphicon-plus-sign text-warning"></i>',
                    indicatorSuccess: '<i class="glyphicon glyphicon-ok-sign text-success"></i>',
                    indicatorError: '<i class="glyphicon glyphicon-exclamation-sign text-danger"></i>',
                    indicatorLoading: '<i class="glyphicon glyphicon-hourglass text-muted"></i>',
                    indicatorPaused: '<i class="glyphicon glyphicon-pause text-primary"></i>',
                    indicatorNewTitle: "Not uploaded yet",
                    indicatorSuccessTitle: "Uploaded",
                    indicatorErrorTitle: "Upload Error",
                    indicatorLoadingTitle: "Uploading ...",
                    indicatorPausedTitle: "Upload Paused"
                }
            }, e.each(N.defaults, function (t, i) {
                return "allowedPreviewTypes" === t ? void (void 0 === N.allowedPreviewTypes && (N.allowedPreviewTypes = i)) : void (N[t] = e.extend(!0, {}, i, N[t]))
            }), N._initPreviewTemplates()
        }, _initPreviewTemplates: function () {
            var i, a = this, r = a.previewMarkupTags, n = r.tagAfter;
            e.each(a.previewContentTemplates, function (e, o) {
                t.isEmpty(a.previewTemplates[e]) && (i = r.tagBefore2, "generic" !== e && "image" !== e && "html" !== e && "text" !== e || (i = r.tagBefore1), a._isPdfRendered() && "pdf" === e && (i = i.replace("kv-file-content", "kv-file-content kv-pdf-rendered")), a.previewTemplates[e] = i + o + n)
            })
        }, _initPreviewCache: function () {
            var i = this;
            i.previewCache = {
                data: {}, init: function () {
                    var e = i.initialPreview;
                    e.length > 0 && !t.isArray(e) && (e = e.split(i.initialPreviewDelimiter)), i.previewCache.data = {
                        content: e,
                        config: i.initialPreviewConfig,
                        tags: i.initialPreviewThumbTags
                    }
                }, count: function (e) {
                    if (!i.previewCache.data || !i.previewCache.data.content) return 0;
                    if (e) {
                        var t = i.previewCache.data.content.filter(function (e) {
                            return null !== e
                        });
                        return t.length
                    }
                    return i.previewCache.data.content.length
                }, get: function (a, r) {
                    var n, o, l, s, d, c, u, p = t.INIT_FLAG + a, f = i.previewCache.data, g = f.config[a],
                        m = f.content[a], v = t.ifSet("previewAsData", g, i.initialPreviewAsData),
                        h = g ? {title: g.title || null, alt: g.alt || null} : {title: null, alt: null},
                        w = function (e, a, r, n, o, l, s, d) {
                            var c = " file-preview-initial " + t.SORT_CSS + (s ? " " + s : ""),
                                u = i.previewInitId + "-" + l, p = g && g.fileId || u;
                            return i._generatePreviewTemplate(e, a, r, n, u, p, !1, null, c, o, l, d, h, g && g.zoomData || a)
                        };
                    return m && m.length ? (r = void 0 === r ? !0 : r, l = t.ifSet("type", g, i.initialPreviewFileType || "generic"), d = t.ifSet("filename", g, t.ifSet("caption", g)), c = t.ifSet("filetype", g, l), s = i.previewCache.footer(a, r, g && g.size || null), u = t.ifSet("frameClass", g), n = v ? w(l, m, d, c, s, p, u) : w("generic", m, d, c, s, p, u, l).setTokens({content: f.content[a]}), f.tags.length && f.tags[a] && (n = t.replaceTags(n, f.tags[a])), t.isEmpty(g) || t.isEmpty(g.frameAttr) || (o = e(document.createElement("div")).html(n), o.find(".file-preview-initial").attr(g.frameAttr), n = o.html(), o.remove()), n) : ""
                }, clean: function (e) {
                    e.content = t.cleanArray(e.content), e.config = t.cleanArray(e.config), e.tags = t.cleanArray(e.tags), i.previewCache.data = e
                }, add: function (e, a, r, n) {
                    var o, l = i.previewCache.data;
                    return e && e.length ? (o = e.length - 1, t.isArray(e) || (e = e.split(i.initialPreviewDelimiter)), n ? (o = l.content.push(e[0]) - 1, l.config[o] = a, l.tags[o] = r) : (l.content = e, l.config = a, l.tags = r), i.previewCache.clean(l), o) : 0
                }, set: function (e, a, r, n) {
                    var o, l, s = i.previewCache.data;
                    if (e && e.length && (t.isArray(e) || (e = e.split(i.initialPreviewDelimiter)), l = e.filter(function (e) {
                        return null !== e
                    }), l.length)) {
                        if (void 0 === s.content && (s.content = []), void 0 === s.config && (s.config = []), void 0 === s.tags && (s.tags = []), n) {
                            for (o = 0; o < e.length; o++) e[o] && s.content.push(e[o]);
                            for (o = 0; o < a.length; o++) a[o] && s.config.push(a[o]);
                            for (o = 0; o < r.length; o++) r[o] && s.tags.push(r[o])
                        } else s.content = e, s.config = a, s.tags = r;
                        i.previewCache.clean(s)
                    }
                }, unset: function (a) {
                    var r = i.previewCache.count(), n = i.reversePreviewOrder;
                    if (r) {
                        if (1 === r) return i.previewCache.data.content = [], i.previewCache.data.config = [], i.previewCache.data.tags = [], i.initialPreview = [], i.initialPreviewConfig = [], void (i.initialPreviewThumbTags = []);
                        i.previewCache.data.content = t.spliceArray(i.previewCache.data.content, a, n), i.previewCache.data.config = t.spliceArray(i.previewCache.data.config, a, n), i.previewCache.data.tags = t.spliceArray(i.previewCache.data.tags, a, n);
                        var o = e.extend(!0, {}, i.previewCache.data);
                        i.previewCache.clean(o)
                    }
                }, out: function () {
                    var e, t, a, r = "", n = i.previewCache.count();
                    if (0 === n) return {content: "", caption: ""};
                    for (t = 0; n > t; t++) a = i.previewCache.get(t), r = i.reversePreviewOrder ? a + r : r + a;
                    return e = i._getMsgSelected(n), {content: r, caption: e}
                }, footer: function (e, a, r) {
                    var n = i.previewCache.data || {};
                    if (t.isEmpty(n.content)) return "";
                    (t.isEmpty(n.config) || t.isEmpty(n.config[e])) && (n.config[e] = {}), a = void 0 === a ? !0 : a;
                    var o, l = n.config[e], s = t.ifSet("caption", l), d = t.ifSet("width", l, "auto"),
                        c = t.ifSet("url", l, !1), u = t.ifSet("key", l, null), p = t.ifSet("fileId", l, null),
                        f = i.fileActionSettings, g = i.initialPreviewShowDelete || !1,
                        m = i.initialPreviewDownloadUrl ? i.initialPreviewDownloadUrl + "?key=" + u + (p ? "&fileId=" + p : "") : "",
                        v = l.downloadUrl || m, h = l.filename || l.caption || "", w = !!v,
                        b = t.ifSet("showRemove", l, t.ifSet("showRemove", f, g)),
                        _ = t.ifSet("showDownload", l, t.ifSet("showDownload", f, w)),
                        C = t.ifSet("showZoom", l, t.ifSet("showZoom", f, !0)),
                        x = t.ifSet("showDrag", l, t.ifSet("showDrag", f, !0)), y = c === !1 && a;
                    return _ = _ && l.downloadUrl !== !1 && !!v, o = i._renderFileActions(l, !1, _, b, C, x, y, c, u, !0, v, h), i._getLayoutTemplate("footer").setTokens({
                        progress: i._renderThumbProgress(),
                        actions: o,
                        caption: s,
                        size: i._getSize(r),
                        width: d,
                        indicator: ""
                    })
                }
            }, i.previewCache.init()
        }, _isPdfRendered: function () {
            var e = this, t = e.usePdfRenderer, i = "function" == typeof t ? t() : !!t;
            return i && e.pdfRendererUrl
        }, _handler: function (e, t, i) {
            var a = this, r = a.namespace, n = t.split(" ").join(r + " ") + r;
            e && e.length && e.off(n).on(n, i)
        }, _encodeURI: function (e) {
            var t = this;
            return t.encodeUrl ? encodeURI(e) : e
        }, _log: function (e, t) {
            var i = this, a = i.$element.attr("id");
            i.showConsoleLogs && (a && (e = '"' + a + '": ' + e), e = "bootstrap-fileinput: " + e, "object" == typeof t && (e = e.setTokens(t)), window.console && "undefined" != typeof window.console.log ? window.console.log(e) : window.alert(e))
        }, _validate: function () {
            var e = this, i = "file" === e.$element.attr("type");
            return i || e._log(t.logMessages.badInputType), i
        }, _errorsExist: function () {
            var t, i = this, a = i.$errorContainer.find("li");
            return a.length ? !0 : (t = e(document.createElement("div")).html(i.$errorContainer.html()), t.find(".kv-error-close").remove(), t.find("ul").remove(), !!e.trim(t.text()).length)
        }, _errorHandler: function (e, t) {
            var i = this, a = e.target.error, r = function (e) {
                i._showError(e.replace("{name}", t))
            };
            r(a.code === a.NOT_FOUND_ERR ? i.msgFileNotFound : a.code === a.SECURITY_ERR ? i.msgFileSecured : a.code === a.NOT_READABLE_ERR ? i.msgFileNotReadable : a.code === a.ABORT_ERR ? i.msgFilePreviewAborted : i.msgFilePreviewError)
        }, _addError: function (e) {
            var t = this, i = t.$errorContainer;
            e && i.length && (i.html(t.errorCloseButton + e), t._handler(i.find(".kv-error-close"), "click", function () {
                setTimeout(function () {
                    t.showPreview && !t.getFrames().length && t.clear(), i.fadeOut("slow")
                }, t.processDelay)
            }))
        }, _setValidationError: function (e) {
            var i = this;
            e = (e ? e + " " : "") + "has-error", i.$container.removeClass(e).addClass("has-error"), t.addCss(i.$captionContainer, "is-invalid")
        }, _resetErrors: function (e) {
            var t = this, i = t.$errorContainer;
            t.isError = !1, t.$container.removeClass("has-error"), t.$captionContainer.removeClass("is-invalid"), i.html(""), e ? i.fadeOut("slow") : i.hide()
        }, _showFolderError: function (e) {
            var t, i = this, a = i.$errorContainer;
            e && (i.isAjaxUpload || i._clearFileInput(), t = i.msgFoldersNotAllowed.replace("{n}", e), i._addError(t), i._setValidationError(), a.fadeIn(800), i._raise("filefoldererror", [e, t]))
        }, _showFileError: function (e, t, i) {
            var a = this, r = a.$errorContainer, n = i || "fileuploaderror", o = t && t.fileId || "",
                l = t && t.id ? '<li data-thumb-id="' + t.id + '" data-file-id="' + o + '">' + e + "</li>" : "<li>" + e + "</li>";
            return 0 === r.find("ul").length ? a._addError("<ul>" + l + "</ul>") : r.find("ul").append(l), r.fadeIn(800), a._raise(n, [t, e]), a._setValidationError("file-input-new"), !0
        }, _showError: function (e, t, i) {
            var a = this, r = a.$errorContainer, n = i || "fileerror";
            return t = t || {}, t.reader = a.reader, a._addError(e), r.fadeIn(800), a._raise(n, [t, e]), a.isAjaxUpload || a._clearFileInput(), a._setValidationError("file-input-new"), a.$btnUpload.attr("disabled", !0), !0
        }, _noFilesError: function (e) {
            var t = this, i = t.minFileCount > 1 ? t.filePlural : t.fileSingle,
                a = t.msgFilesTooLess.replace("{n}", t.minFileCount).replace("{files}", i), r = t.$errorContainer;
            t._addError(a), t.isError = !0, t._updateFileDetails(0), r.fadeIn(800), t._raise("fileerror", [e, a]), t._clearFileInput(), t._setValidationError()
        }, _parseError: function (t, i, a, r) {
            var n, o = this, l = e.trim(a + ""),
                s = void 0 !== i.responseJSON && void 0 !== i.responseJSON.error ? i.responseJSON.error : i.responseText;
            return o.cancelling && o.msgUploadAborted && (l = o.msgUploadAborted), o.showAjaxErrorDetails && s && (s = e.trim(s.replace(/\n\s*\n/g, "\n")), n = s.length ? "<pre>" + s + "</pre>" : "", l += l ? n : s), l || (l = o.msgAjaxError.replace("{operation}", t)), o.cancelling = !1, r ? "<b>" + r + ": </b>" + l : l
        }, _parseFileType: function (e, i) {
            var a, r, n, o, l = this, s = l.allowedPreviewTypes || [];
            if ("application/text-plain" === e) return "text";
            for (o = 0; o < s.length; o++) if (n = s[o], a = l.fileTypeSettings[n], r = a(e, i) ? n : "", !t.isEmpty(r)) return r;
            return "other"
        }, _getPreviewIcon: function (t) {
            var i, a = this, r = null;
            return t && t.indexOf(".") > -1 && (i = t.split(".").pop(), a.previewFileIconSettings && (r = a.previewFileIconSettings[i] || a.previewFileIconSettings[i.toLowerCase()] || null), a.previewFileExtSettings && e.each(a.previewFileExtSettings, function (e, t) {
                return a.previewFileIconSettings[e] && t(i) ? void (r = a.previewFileIconSettings[e]) : void 0
            })), r || a.previewFileIcon
        }, _parseFilePreviewIcon: function (e, t) {
            var i = this, a = i._getPreviewIcon(t), r = e;
            return r.indexOf("{previewFileIcon}") > -1 && (r = r.setTokens({
                previewFileIconClass: i.previewFileIconClass,
                previewFileIcon: a
            })), r
        }, _raise: function (t, i) {
            var a = this, r = e.Event(t);
            if (void 0 !== i ? a.$element.trigger(r, i) : a.$element.trigger(r), r.isDefaultPrevented() || r.result === !1) return !1;
            switch (t) {
                case"filebatchuploadcomplete":
                case"filebatchuploadsuccess":
                case"fileuploaded":
                case"fileclear":
                case"filecleared":
                case"filereset":
                case"fileerror":
                case"filefoldererror":
                case"fileuploaderror":
                case"filebatchuploaderror":
                case"filedeleteerror":
                case"filecustomerror":
                case"filesuccessremove":
                    break;
                default:
                    a.ajaxAborted || (a.ajaxAborted = r.result)
            }
            return !0
        }, _listenFullScreen: function (e) {
            var t, i, a = this, r = a.$modal;
            r && r.length && (t = r && r.find(".btn-fullscreen"), i = r && r.find(".btn-borderless"), t.length && i.length && (t.removeClass("active").attr("aria-pressed", "false"), i.removeClass("active").attr("aria-pressed", "false"), e ? t.addClass("active").attr("aria-pressed", "true") : i.addClass("active").attr("aria-pressed", "true"), r.hasClass("file-zoom-fullscreen") ? a._maximizeZoomDialog() : e ? a._maximizeZoomDialog() : i.removeClass("active").attr("aria-pressed", "false")))
        }, _listen: function () {
            var i, a = this, r = a.$element, n = a.$form, o = a.$container;
            a._handler(r, "click", function (e) {
                r.hasClass("file-no-browse") && (r.data("zoneClicked") ? r.data("zoneClicked", !1) : e.preventDefault())
            }), a._handler(r, "change", e.proxy(a._change, a)), a.showBrowse && a._handler(a.$btnFile, "click", e.proxy(a._browse, a)), a._handler(o.find(".fileinput-remove:not([disabled])"), "click", e.proxy(a.clear, a)), a._handler(o.find(".fileinput-cancel"), "click", e.proxy(a.cancel, a)), a._handler(o.find(".fileinput-pause"), "click", e.proxy(a.pause, a)), a._initDragDrop(), a._handler(n, "reset", e.proxy(a.clear, a)), a.isAjaxUpload || a._handler(n, "submit", e.proxy(a._submitForm, a)), a._handler(a.$container.find(".fileinput-upload"), "click", e.proxy(a._uploadClick, a)), a._handler(e(window), "resize", function () {
                a._listenFullScreen(screen.width === window.innerWidth && screen.height === window.innerHeight)
            }), i = "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", a._handler(e(document), i, function () {
                a._listenFullScreen(t.checkFullScreen())
            }), a._autoFitContent(), a._initClickable(), a._refreshPreview()
        }, _autoFitContent: function () {
            var t, i = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, a = this,
                r = 400 > i ? a.previewSettingsSmall || a.defaults.previewSettingsSmall : a.previewSettings || a.defaults.previewSettings;
            e.each(r, function (e, i) {
                t = ".file-preview-frame .file-preview-" + e, a.$preview.find(t + ".kv-preview-data," + t + " .kv-preview-data").css(i)
            })
        }, _scanDroppedItems: function (e, i, a) {
            a = a || "";
            var r, n, o, l = this, s = function (e) {
                l._log(t.logMessages.badDroppedFiles), l._log(e)
            };
            e.isFile ? e.file(function (e) {
                i.push(e)
            }, s) : e.isDirectory && (n = e.createReader(), (o = function () {
                n.readEntries(function (t) {
                    if (t && t.length > 0) {
                        for (r = 0; r < t.length; r++) l._scanDroppedItems(t[r], i, a + e.name + "/");
                        o()
                    }
                    return null
                }, s)
            })())
        }, _initDragDrop: function () {
            var t = this, i = t.$dropZone;
            t.dropZoneEnabled && t.showPreview && (t._handler(i, "dragenter dragover", e.proxy(t._zoneDragEnter, t)), t._handler(i, "dragleave", e.proxy(t._zoneDragLeave, t)), t._handler(i, "drop", e.proxy(t._zoneDrop, t)), t._handler(e(document), "dragenter dragover drop", t._zoneDragDropInit))
        }, _zoneDragDropInit: function (e) {
            e.stopPropagation(), e.preventDefault()
        }, _zoneDragEnter: function (i) {
            var a = this, r = i.originalEvent.dataTransfer, n = e.inArray("Files", r.types) > -1;
            return a._zoneDragDropInit(i), a.isDisabled || !n ? (i.originalEvent.dataTransfer.effectAllowed = "none", void (i.originalEvent.dataTransfer.dropEffect = "none")) : void (a._raise("fileDragEnter", {
                sourceEvent: i,
                files: r.types.Files
            }) && t.addCss(a.$dropZone, "file-highlighted"))
        }, _zoneDragLeave: function (e) {
            var t = this;
            t._zoneDragDropInit(e), t.isDisabled || t._raise("fileDragLeave", {sourceEvent: e}) && t.$dropZone.removeClass("file-highlighted")
        }, _zoneDrop: function (e) {
            var i, a = this, r = a.$element, n = e.originalEvent.dataTransfer, o = n.files, l = n.items,
                s = t.getDragDropFolders(l), d = function () {
                    a.isAjaxUpload ? a._change(e, o) : (a.changeTriggered = !0, r.get(0).files = o, setTimeout(function () {
                        a.changeTriggered = !1, r.trigger("change" + a.namespace)
                    }, a.processDelay)), a.$dropZone.removeClass("file-highlighted")
                };
            if (e.preventDefault(), !a.isDisabled && !t.isEmpty(o) && a._raise("fileDragDrop", {
                sourceEvent: e,
                files: o
            })) if (s > 0) {
                if (!a.isAjaxUpload) return void a._showFolderError(s);
                for (o = [], i = 0; i < l.length; i++) {
                    var c = l[i].webkitGetAsEntry();
                    c && a._scanDroppedItems(c, o)
                }
                setTimeout(function () {
                    d()
                }, 500)
            } else d()
        }, _uploadClick: function (e) {
            var i, a = this, r = a.$container.find(".fileinput-upload"),
                n = !r.hasClass("disabled") && t.isEmpty(r.attr("disabled"));
            if (!e || !e.isDefaultPrevented()) {
                if (!a.isAjaxUpload) return void (n && "submit" !== r.attr("type") && (i = r.closest("form"), i.length && i.trigger("submit"), e.preventDefault()));
                e.preventDefault(), n && a.upload()
            }
        }, _submitForm: function () {
            var e = this;
            return e._isFileSelectionValid() && !e._abort({})
        }, _clearPreview: function () {
            var i = this, a = i.showUploadedThumbs ? i.getFrames(":not(.file-preview-success)") : i.getFrames();
            a.each(function () {
                var a = e(this), r = a.attr("id"), n = i._getZoom(r);
                a.remove(), t.cleanZoomCache(n)
            }), i.getFrames().length && i.showPreview || i._resetUpload(), i._validateDefaultPreview()
        }, _initSortable: function () {
            var i, a = this, r = a.$preview, n = "." + t.SORT_CSS, o = a.reversePreviewOrder;
            window.KvSortable && 0 !== r.find(n).length && (i = {
                handle: ".drag-handle-init",
                dataIdAttr: "data-preview-id",
                scroll: !1,
                draggable: n,
                onSort: function (i) {
                    var r = i.oldIndex, n = i.newIndex, l = 0;
                    a.initialPreview = t.moveArray(a.initialPreview, r, n, o), a.initialPreviewConfig = t.moveArray(a.initialPreviewConfig, r, n, o), a.previewCache.init(), a.getFrames(".file-preview-initial").each(function () {
                        e(this).attr("data-fileindex", t.INIT_FLAG + l), l++
                    }), a._raise("filesorted", {
                        previewId: e(i.item).attr("id"),
                        oldIndex: r,
                        newIndex: n,
                        stack: a.initialPreviewConfig
                    })
                }
            }, r.data("kvsortable") && r.kvsortable("destroy"), e.extend(!0, i, a.fileActionSettings.dragSettings), r.kvsortable(i))
        }, _setPreviewContent: function (e) {
            var t = this;
            t.$preview.html(e), t._autoFitContent()
        }, _initPreviewImageOrientations: function () {
            var t = this, i = 0;
            t.autoOrientImageInitial && t.getFrames(".file-preview-initial").each(function () {
                var a, r, n, o = e(this), l = t.initialPreviewConfig[i];
                l && l.exif && l.exif.Orientation && (n = o.attr("id"), a = o.find(">.kv-file-content img"), r = t._getZoom(n, " >.kv-file-content img"), t.setImageOrientation(a, r, l.exif.Orientation, o)), i++
            })
        }, _initPreview: function (e) {
            var i, a = this, r = a.initialCaption || "";
            return a.previewCache.count(!0) ? (i = a.previewCache.out(), r = e && a.initialCaption ? a.initialCaption : i.caption, a._setPreviewContent(i.content), a._setInitThumbAttr(), a._setCaption(r), a._initSortable(), t.isEmpty(i.content) || a.$container.removeClass("file-input-new"), void a._initPreviewImageOrientations()) : (a._clearPreview(), void (e ? a._setCaption(r) : a._initCaption()))
        }, _getZoomButton: function (e) {
            var t = this, i = t.previewZoomButtonIcons[e], a = t.previewZoomButtonClasses[e],
                r = ' title="' + (t.previewZoomButtonTitles[e] || "") + '" ',
                n = r + ("close" === e ? ' data-dismiss="modal" aria-hidden="true"' : "");
            return "fullscreen" !== e && "borderless" !== e && "toggleheader" !== e || (n += ' data-toggle="button" aria-pressed="false" autocomplete="off"'), '<button type="button" class="' + a + " btn-" + e + '"' + n + ">" + i + "</button>"
        }, _getModalContent: function () {
            var e = this;
            return e._getLayoutTemplate("modal").setTokens({
                rtl: e.rtl ? " kv-rtl" : "",
                zoomFrameClass: e.frameClass,
                heading: e.msgZoomModalHeading,
                prev: e._getZoomButton("prev"),
                next: e._getZoomButton("next"),
                toggleheader: e._getZoomButton("toggleheader"),
                fullscreen: e._getZoomButton("fullscreen"),
                borderless: e._getZoomButton("borderless"),
                close: e._getZoomButton("close")
            })
        }, _listenModalEvent: function (e) {
            var i = this, a = i.$modal, r = function (e) {
                return {sourceEvent: e, previewId: a.data("previewId"), modal: a}
            };
            a.on(e + ".bs.modal", function (n) {
                var o = a.find(".btn-fullscreen"), l = a.find(".btn-borderless");
                i._raise("filezoom" + e, r(n)), "shown" === e && (l.removeClass("active").attr("aria-pressed", "false"), o.removeClass("active").attr("aria-pressed", "false"), a.hasClass("file-zoom-fullscreen") && (i._maximizeZoomDialog(), t.checkFullScreen() ? o.addClass("active").attr("aria-pressed", "true") : l.addClass("active").attr("aria-pressed", "true")))
            })
        }, _initZoom: function () {
            var i, a = this, r = a._getLayoutTemplate("modalMain"), n = "#" + t.MODAL_ID;
            a.showPreview && (a.$modal = e(n), a.$modal && a.$modal.length || (i = e(document.createElement("div")).html(r).insertAfter(a.$container), a.$modal = e(n).insertBefore(i), i.remove()), t.initModal(a.$modal), a.$modal.html(a._getModalContent()), e.each(t.MODAL_EVENTS, function (e, t) {
                a._listenModalEvent(t)
            }))
        }, _initZoomButtons: function () {
            var t, i, a = this, r = a.$modal.data("previewId") || "", n = a.getFrames().toArray(), o = n.length,
                l = a.$modal.find(".btn-prev"), s = a.$modal.find(".btn-next");
            return n.length < 2 ? (l.hide(), void s.hide()) : (l.show(), s.show(), void (o && (t = e(n[0]), i = e(n[o - 1]), l.removeAttr("disabled"), s.removeAttr("disabled"), t.length && t.attr("id") === r && l.attr("disabled", !0), i.length && i.attr("id") === r && s.attr("disabled", !0))))
        }, _maximizeZoomDialog: function () {
            var t = this, i = t.$modal, a = i.find(".modal-header:visible"), r = i.find(".modal-footer:visible"),
                n = i.find(".modal-body"), o = e(window).height(), l = 0;
            i.addClass("file-zoom-fullscreen"), a && a.length && (o -= a.outerHeight(!0)), r && r.length && (o -= r.outerHeight(!0)), n && n.length && (l = n.outerHeight(!0) - n.height(), o -= l), i.find(".kv-zoom-body").height(o)
        }, _resizeZoomDialog: function (e) {
            var i = this, a = i.$modal, r = a.find(".btn-fullscreen"), n = a.find(".btn-borderless");
            if (a.hasClass("file-zoom-fullscreen")) t.toggleFullScreen(!1), e ? r.hasClass("active") || (a.removeClass("file-zoom-fullscreen"), i._resizeZoomDialog(!0), n.hasClass("active") && n.removeClass("active").attr("aria-pressed", "false")) : r.hasClass("active") ? r.removeClass("active").attr("aria-pressed", "false") : (a.removeClass("file-zoom-fullscreen"), i.$modal.find(".kv-zoom-body").css("height", i.zoomModalHeight)); else {
                if (!e) return void i._maximizeZoomDialog();
                t.toggleFullScreen(!0)
            }
            a.focus()
        }, _setZoomContent: function (i, a) {
            var r, n, o, l, s, d, c, u, p, f, g = this, m = i.attr("id"), v = g._getZoom(m), h = g.$modal,
                w = h.find(".btn-fullscreen"), b = h.find(".btn-borderless"), _ = h.find(".btn-toggleheader");
            n = v.attr("data-template") || "generic", r = v.find(".kv-file-content"), o = r.length ? r.html() : "", p = i.data("caption") || "", f = i.data("size") || "", l = p + " " + f, h.find(".kv-zoom-title").attr("title", e("<div/>").html(l).text()).html(l), s = h.find(".kv-zoom-body"), h.removeClass("kv-single-content"), a ? (u = s.addClass("file-thumb-loading").clone().insertAfter(s), s.html(o).hide(), u.fadeOut("fast", function () {
                s.fadeIn("fast", function () {
                    s.removeClass("file-thumb-loading")
                }), u.remove()
            })) : s.html(o), c = g.previewZoomSettings[n], c && (d = s.find(".kv-preview-data"), t.addCss(d, "file-zoom-detail"), e.each(c, function (e, t) {
                d.css(e, t), (d.attr("width") && "width" === e || d.attr("height") && "height" === e) && d.removeAttr(e)
            })), h.data("previewId", m), g._handler(h.find(".btn-prev"), "click", function () {
                g._zoomSlideShow("prev", m)
            }), g._handler(h.find(".btn-next"), "click", function () {
                g._zoomSlideShow("next", m)
            }), g._handler(w, "click", function () {
                g._resizeZoomDialog(!0)
            }), g._handler(b, "click", function () {
                g._resizeZoomDialog(!1)
            }), g._handler(_, "click", function () {
                var e, t = h.find(".modal-header"), i = h.find(".modal-body .floating-buttons"),
                    a = t.find(".kv-zoom-actions"), r = function (e) {
                        var i = g.$modal.find(".kv-zoom-body"), a = g.zoomModalHeight;
                        h.hasClass("file-zoom-fullscreen") && (a = i.outerHeight(!0), e || (a -= t.outerHeight(!0))), i.css("height", e ? a + e : a)
                    };
                t.is(":visible") ? (e = t.outerHeight(!0), t.slideUp("slow", function () {
                    a.find(".btn").appendTo(i), r(e)
                })) : (i.find(".btn").appendTo(a), t.slideDown("slow", function () {
                    r()
                })), h.focus()
            }), g._handler(h, "keydown", function (t) {
                var i = t.which || t.keyCode, a = e(this).find(".btn-prev"), r = e(this).find(".btn-next"),
                    n = e(this).data("previewId"), o = g.rtl ? 39 : 37, l = g.rtl ? 37 : 39;
                i === o && a.length && !a.attr("disabled") && g._zoomSlideShow("prev", n), i === l && r.length && !r.attr("disabled") && g._zoomSlideShow("next", n)
            })
        }, _zoomPreview: function (e) {
            var i, a = this, r = a.$modal;
            if (!e.length) throw"Cannot zoom to detailed preview!";
            t.initModal(r), r.html(a._getModalContent()), i = e.closest(t.FRAMES), a._setZoomContent(i), r.modal("show"), a._initZoomButtons()
        }, _zoomSlideShow: function (t, i) {
            var a, r, n, o = this, l = o.$modal.find(".kv-zoom-actions .btn-" + t), s = o.getFrames().toArray(),
                d = s.length;
            if (!l.attr("disabled")) {
                for (r = 0; d > r; r++) if (e(s[r]).attr("id") === i) {
                    n = "prev" === t ? r - 1 : r + 1;
                    break
                }
                0 > n || n >= d || !s[n] || (a = e(s[n]), a.length && o._setZoomContent(a, !0), o._initZoomButtons(), o._raise("filezoom" + t, {
                    previewId: i,
                    modal: o.$modal
                }))
            }
        }, _initZoomButton: function () {
            var t = this;
            t.$preview.find(".kv-file-zoom").each(function () {
                var i = e(this);
                t._handler(i, "click", function () {
                    t._zoomPreview(i)
                })
            })
        }, _inputFileCount: function () {
            return this.$element.get(0).files.length
        }, _refreshPreview: function () {
            var t, i = this;
            (i._inputFileCount() || i.isAjaxUpload) && i.showPreview && i.isPreviewable && (i.isAjaxUpload && i.fileManager.count() > 0 ? (t = e.extend(!0, {}, i.fileManager.stack), i.fileManager.clear(), i._clearFileInput()) : t = i.$element.get(0).files, t && t.length && (i.readFiles(t), i._setFileDropZoneTitle()))
        }, _clearObjects: function (t) {
            t.find("video audio").each(function () {
                this.pause(), e(this).remove()
            }), t.find("img object div").each(function () {
                e(this).remove()
            })
        }, _clearFileInput: function () {
            var t, i, a, r = this, n = r.$element;
            r._inputFileCount() && (t = n.closest("form"), i = e(document.createElement("form")), a = e(document.createElement("div")), n.before(a), t.length ? t.after(i) : a.after(i), i.append(n).trigger("reset"), a.before(n).remove(), i.remove())
        }, _resetUpload: function () {
            var e = this;
            e.uploadCache = [], e.$btnUpload.removeAttr("disabled"), e._setProgress(0), e.$progress.hide(), e._resetErrors(!1), e._initAjax(), e.fileManager.clearImages(), e._resetCanvas(), e.overwriteInitial && (e.initialPreview = [], e.initialPreviewConfig = [], e.initialPreviewThumbTags = [], e.previewCache.data = {
                content: [],
                config: [],
                tags: []
            })
        }, _resetCanvas: function () {
            var e = this;
            e.canvas && e.imageCanvasContext && e.imageCanvasContext.clearRect(0, 0, e.canvas.width, e.canvas.height)
        }, _hasInitialPreview: function () {
            var e = this;
            return !e.overwriteInitial && e.previewCache.count(!0)
        }, _resetPreview: function () {
            var e, t, i = this;
            i.previewCache.count(!0) ? (e = i.previewCache.out(), i._setPreviewContent(e.content), i._setInitThumbAttr(), t = i.initialCaption ? i.initialCaption : e.caption, i._setCaption(t)) : (i._clearPreview(), i._initCaption()), i.showPreview && (i._initZoom(), i._initSortable())
        }, _clearDefaultPreview: function () {
            var e = this;
            e.$preview.find(".file-default-preview").remove()
        }, _validateDefaultPreview: function () {
            var e = this;
            e.showPreview && !t.isEmpty(e.defaultPreviewContent) && (e._setPreviewContent('<div class="file-default-preview">' + e.defaultPreviewContent + "</div>"), e.$container.removeClass("file-input-new"), e._initClickable())
        }, _resetPreviewThumbs: function (e) {
            var t, i = this;
            return e ? (i._clearPreview(), void i.clearFileStack()) : void (i._hasInitialPreview() ? (t = i.previewCache.out(), i._setPreviewContent(t.content), i._setInitThumbAttr(), i._setCaption(t.caption), i._initPreviewActions()) : i._clearPreview())
        }, _getLayoutTemplate: function (e) {
            var i = this, a = i.layoutTemplates[e];
            return t.isEmpty(i.customLayoutTags) ? a : t.replaceTags(a, i.customLayoutTags)
        }, _getPreviewTemplate: function (e) {
            var i = this, a = i.previewTemplates, r = a[e] || a.other;
            return t.isEmpty(i.customPreviewTags) ? r : t.replaceTags(r, i.customPreviewTags)
        }, _getOutData: function (e, t, i, a) {
            var r = this;
            return t = t || {}, i = i || {}, a = a || r.fileManager.list(), {
                formdata: e,
                files: a,
                filenames: r.filenames,
                filescount: r.getFilesCount(),
                extra: r._getExtraData(),
                response: i,
                reader: r.reader,
                jqXHR: t
            }
        }, _getMsgSelected: function (e) {
            var t = this, i = 1 === e ? t.fileSingle : t.filePlural;
            return e > 0 ? t.msgSelected.replace("{n}", e).replace("{files}", i) : t.msgNoFilesSelected
        }, _getFrame: function (e, i) {
            var a = this, r = t.getFrameElement(a.$preview, e);
            return !a.showPreview || i || r.length || a._log(t.logMessages.invalidThumb, {id: e}), r
        }, _getZoom: function (e, i) {
            var a = this, r = t.getZoomElement(a.$preview, e, i);
            return a.showPreview && !r.length && a._log(t.logMessages.invalidThumb, {id: e}), r
        }, _getThumbs: function (e) {
            return e = e || "", this.getFrames(":not(.file-preview-initial)" + e)
        }, _getThumbId: function (e) {
            var t = this;
            return t.previewInitId + "-" + e
        }, _getExtraData: function (e, t) {
            var i = this, a = i.uploadExtraData;
            return "function" == typeof i.uploadExtraData && (a = i.uploadExtraData(e, t)), a
        }, _initXhr: function (e, i, a) {
            var r = this, n = r.fileManager, o = function (e) {
                var o = 0, l = e.total, s = e.loaded || e.position, d = n.getUploadStats(i, s, l);
                e.lengthComputable && !r.enableResumableUpload && (o = t.round(s / l * 100)), i ? r._setFileUploadStats(i, o, a, d) : r._setProgress(o, null, null, r._getStats(d)), r._raise("fileajaxprogress", [d])
            };
            return e.upload && (r.progressDelay && (o = t.debounce(o, r.progressDelay)), e.upload.addEventListener("progress", o, !1)), e
        }, _initAjaxSettings: function () {
            var t = this;
            t._ajaxSettings = e.extend(!0, {}, t.ajaxSettings), t._ajaxDeleteSettings = e.extend(!0, {}, t.ajaxDeleteSettings)
        }, _mergeAjaxCallback: function (e, t, i) {
            var a, r = this, n = r._ajaxSettings, o = r.mergeAjaxCallbacks;
            "delete" === i && (n = r._ajaxDeleteSettings, o = r.mergeAjaxDeleteCallbacks), a = n[e], o && "function" == typeof a ? "before" === o ? n[e] = function () {
                a.apply(this, arguments), t.apply(this, arguments)
            } : n[e] = function () {
                t.apply(this, arguments), a.apply(this, arguments)
            } : n[e] = t
        }, _ajaxSubmit: function (t, i, a, r, n, o, l, s) {
            var d, c, u, p, f = this;
            f._raise("filepreajax", [n, o, l]) && (n.append("initialPreview", JSON.stringify(f.initialPreview)), n.append("initialPreviewConfig", JSON.stringify(f.initialPreviewConfig)), n.append("initialPreviewThumbTags", JSON.stringify(f.initialPreviewThumbTags)), f._initAjaxSettings(), f._mergeAjaxCallback("beforeSend", t), f._mergeAjaxCallback("success", i), f._mergeAjaxCallback("complete", a), f._mergeAjaxCallback("error", r), s = s || f.uploadUrlThumb || f.uploadUrl, "function" == typeof s && (s = s()), u = f._getExtraData(o, l) || {}, "object" == typeof u && e.each(u, function (e, t) {
                n.append(e, t)
            }), c = {
                xhr: function () {
                    var t = e.ajaxSettings.xhr();
                    return f._initXhr(t, o, f.fileManager.count())
                },
                url: f._encodeURI(s),
                type: "POST",
                dataType: "json",
                data: n,
                cache: !1,
                processData: !1,
                contentType: !1
            }, d = e.extend(!0, {}, c, f._ajaxSettings), f.ajaxQueue.push(d), p = function () {
                var t, i;
                f.ajaxCurrentThreads < f.maxAjaxThreads && (t = f.ajaxQueue.shift(), "undefined" != typeof t && (f.ajaxCurrentThreads++, i = e.ajax(t).done(function () {
                    clearInterval(f.ajaxQueueIntervalId), f.ajaxCurrentThreads--
                }), f.ajaxRequests.push(i)))
            }, f.ajaxQueueIntervalId = setInterval(p, f.queueDelay))
        }, _mergeArray: function (e, i) {
            var a = this, r = t.cleanArray(a[e]), n = t.cleanArray(i);
            a[e] = r.concat(n)
        }, _initUploadSuccess: function (i, a, r) {
            var n, o, l, s, d, c, u, p, f, g, m = this;
            m.showPreview && "object" == typeof i && !e.isEmptyObject(i) && void 0 !== i.initialPreview && i.initialPreview.length > 0 && (m.hasInitData = !0, c = i.initialPreview || [], u = i.initialPreviewConfig || [], p = i.initialPreviewThumbTags || [], n = void 0 === i.append || i.append, c.length > 0 && !t.isArray(c) && (c = c.split(m.initialPreviewDelimiter)), c.length && (m._mergeArray("initialPreview", c), m._mergeArray("initialPreviewConfig", u), m._mergeArray("initialPreviewThumbTags", p)), void 0 !== a ? r ? (f = a.attr("id"), g = m._getUploadCacheIndex(f), null !== g && (m.uploadCache[g] = {
                id: f,
                content: c[0],
                config: u[0] || [],
                tags: p[0] || [],
                append: n
            })) : (l = m.previewCache.add(c[0], u[0], p[0], n), o = m.previewCache.get(l, !1), s = e(document.createElement("div")).html(o).hide().insertAfter(a), d = s.find(".kv-zoom-cache"), d && d.length && d.insertAfter(a), a.fadeOut("slow", function () {
                var e = s.find(".file-preview-frame");
                e && e.length && e.insertBefore(a).fadeIn("slow").css("display:inline-block"), m._initPreviewActions(), m._clearFileInput(), t.cleanZoomCache(m._getZoom(a.attr("id"))), a.remove(), s.remove(), m._initSortable()
            })) : (m.previewCache.set(c, u, p, n), m._initPreview(), m._initPreviewActions()))
        }, _getUploadCacheIndex: function (e) {
            var t, i, a = this, r = a.uploadCache.length;
            for (t = 0; r > t; t++) if (i = a.uploadCache[t], i.id === e) return t;
            return null
        }, _initSuccessThumbs: function () {
            var i = this;
            i.showPreview && i._getThumbs(t.FRAMES + ".file-preview-success").each(function () {
                var a = e(this), r = a.find(".kv-file-remove");
                r.removeAttr("disabled"), i._handler(r, "click", function () {
                    var e = a.attr("id"), r = i._raise("filesuccessremove", [e, a.attr("data-fileindex")]);
                    t.cleanMemory(a), r !== !1 && a.fadeOut("slow", function () {
                        t.cleanZoomCache(i._getZoom(e)), a.remove(), i.getFrames().length || i.reset()
                    })
                })
            })
        }, _updateInitialPreview: function () {
            var t = this, i = t.uploadCache;
            t.showPreview && (e.each(i, function (e, i) {
                t.previewCache.add(i.content, i.config, i.tags, i.append)
            }), t.hasInitData && (t._initPreview(), t._initPreviewActions()))
        }, _uploadSingle: function (i, a, r) {
            var n, o, l, s, d, c, u, p, f, g, m, v, h, w = this, b = w.fileManager, _ = b.count(), C = new FormData,
                x = w._getThumbId(a), y = _ > 0 || !e.isEmptyObject(w.uploadExtraData),
                T = w.ajaxOperations.uploadThumb, F = b.getFile(a), I = {id: x, index: i, fileId: a},
                P = w.fileManager.getFileName(a, !0);
            w.enableResumableUpload || (w.showPreview && (o = w.fileManager.getThumb(a), u = o.find(".file-thumb-progress"), s = o.find(".kv-file-upload"), d = o.find(".kv-file-remove"), u.show()), 0 === _ || !y || w.showPreview && s && s.hasClass("disabled") || w._abort(I) || (h = function () {
                c ? b.errors.push(a) : b.removeFile(a), b.setProcessed(a), b.isProcessed() && (w.fileBatchCompleted = !0)
            }, l = function () {
                var e;
                w.fileBatchCompleted && setTimeout(function () {
                    var i = 0 === b.count(), a = b.errors.length;
                    w._updateInitialPreview(), w.unlock(i), i && w._clearFileInput(), e = w.$preview.find(".file-preview-initial"), w.uploadAsync && e.length && (t.addCss(e, t.SORT_CSS), w._initSortable()), w._raise("filebatchuploadcomplete", [b.stack, w._getExtraData()]), w.retryErrorUploads && 0 !== a || b.clear(), w._setProgress(101), w.ajaxAborted = !1
                }, w.processDelay)
            }, p = function (l) {
                n = w._getOutData(C, l), b.initStats(a), w.fileBatchCompleted = !1, r || (w.ajaxAborted = !1), w.showPreview && (o.hasClass("file-preview-success") || (w._setThumbStatus(o, "Loading"), t.addCss(o, "file-uploading")), s.attr("disabled", !0), d.attr("disabled", !0)), r || w.lock(), -1 !== b.errors.indexOf(a) && delete b.errors[a], w._raise("filepreupload", [n, x, i]), e.extend(!0, I, n), w._abort(I) && (l.abort(), r || (w._setThumbStatus(o, "New"), o.removeClass("file-uploading"), s.removeAttr("disabled"), d.removeAttr("disabled"), w.unlock()), w._setProgressCancelled())
            }, g = function (l, d, p) {
                var g = w.showPreview && o.attr("id") ? o.attr("id") : x;
                n = w._getOutData(C, p, l), e.extend(!0, I, n), setTimeout(function () {
                    t.isEmpty(l) || t.isEmpty(l.error) ? (w.showPreview && (w._setThumbStatus(o, "Success"), s.hide(), w._initUploadSuccess(l, o, r), w._setProgress(101, u)), w._raise("fileuploaded", [n, g, i]), r ? h() : w.fileManager.remove(o)) : (c = !0, f = w._parseError(T, p, w.msgUploadError, w.fileManager.getFileName(a)), w._showFileError(f, I), w._setPreviewError(o, !0), w.retryErrorUploads || s.hide(), r && h(), w._setProgress(101, w._getFrame(g).find(".file-thumb-progress"), w.msgUploadError))
                }, w.processDelay)
            }, m = function () {
                setTimeout(function () {
                    w.showPreview && (s.removeAttr("disabled"), d.removeAttr("disabled"), o.removeClass("file-uploading")), r ? l() : (w.unlock(!1), w._clearFileInput()), w._initSuccessThumbs()
                }, w.processDelay)
            }, v = function (t, i, n) {
                f = w._parseError(T, t, n, w.fileManager.getFileName(a)), c = !0, setTimeout(function () {
                    var i;
                    r && h(), w.fileManager.setProgress(a, 100), w._setPreviewError(o, !0), w.retryErrorUploads || s.hide(), e.extend(!0, I, w._getOutData(C, t)), w._setProgress(101, i, w.msgAjaxProgressError.replace("{operation}", T)), i = w.showPreview && o ? o.find(".file-thumb-progress") : "", w._setProgress(101, i, w.msgUploadError), w._showFileError(f, I)
                }, w.processDelay)
            }, C.append(w.uploadFileAttr, F.file, P), w._setUploadData(C, {fileId: a}), w._ajaxSubmit(p, g, m, v, C, a, i)))
        }, _uploadBatch: function () {
            var i, a, r, n, o, l, s = this, d = s.fileManager, c = d.total(), u = {},
                p = c > 0 || !e.isEmptyObject(s.uploadExtraData), f = new FormData, g = s.ajaxOperations.uploadBatch;
            if (0 !== c && p && !s._abort(u)) {
                l = function () {
                    s.fileManager.clear(), s._clearFileInput()
                }, i = function (i) {
                    s.lock(), d.initStats();
                    var a = s._getOutData(f, i);
                    s.ajaxAborted = !1, s.showPreview && s._getThumbs().each(function () {
                        var i = e(this), a = i.find(".kv-file-upload"), r = i.find(".kv-file-remove");
                        i.hasClass("file-preview-success") || (s._setThumbStatus(i, "Loading"), t.addCss(i, "file-uploading")), a.attr("disabled", !0), r.attr("disabled", !0)
                    }), s._raise("filebatchpreupload", [a]), s._abort(a) && (i.abort(), s._getThumbs().each(function () {
                        var t = e(this), i = t.find(".kv-file-upload"), a = t.find(".kv-file-remove");
                        t.hasClass("file-preview-loading") && (s._setThumbStatus(t, "New"), t.removeClass("file-uploading")), i.removeAttr("disabled"), a.removeAttr("disabled")
                    }), s._setProgressCancelled())
                }, a = function (i, a, r) {
                    var n = s._getOutData(f, r, i), d = 0, c = s._getThumbs(":not(.file-preview-success)"),
                        u = t.isEmpty(i) || t.isEmpty(i.errorkeys) ? [] : i.errorkeys;
                    t.isEmpty(i) || t.isEmpty(i.error) ? (s._raise("filebatchuploadsuccess", [n]), l(), s.showPreview ? (c.each(function () {
                        var t = e(this);
                        s._setThumbStatus(t, "Success"), t.removeClass("file-uploading"), t.find(".kv-file-upload").hide().removeAttr("disabled")
                    }), s._initUploadSuccess(i)) : s.reset(), s._setProgress(101)) : (s.showPreview && (c.each(function () {
                        var t = e(this);
                        t.removeClass("file-uploading"), t.find(".kv-file-upload").removeAttr("disabled"), t.find(".kv-file-remove").removeAttr("disabled"), 0 === u.length || -1 !== e.inArray(d, u) ? (s._setPreviewError(t, !0), s.retryErrorUploads || (t.find(".kv-file-upload").hide(), s.fileManager.remove(t))) : (t.find(".kv-file-upload").hide(), s._setThumbStatus(t, "Success"), s.fileManager.remove(t)), t.hasClass("file-preview-error") && !s.retryErrorUploads || d++
                    }), s._initUploadSuccess(i)), o = s._parseError(g, r, s.msgUploadError), s._showFileError(o, n, "filebatchuploaderror"), s._setProgress(101, s.$progress, s.msgUploadError))
                }, n = function () {
                    s.unlock(), s._initSuccessThumbs(), s._clearFileInput(), s._raise("filebatchuploadcomplete", [s.fileManager.stack, s._getExtraData()])
                }, r = function (t, i, a) {
                    var r = s._getOutData(f, t);
                    o = s._parseError(g, t, a), s._showFileError(o, r, "filebatchuploaderror"), s.uploadFileCount = c - 1, s.showPreview && (s._getThumbs().each(function () {
                        var t = e(this);
                        t.removeClass("file-uploading"), s.fileManager.getFile(t.attr("data-fileid")) && s._setPreviewError(t)
                    }), s._getThumbs().removeClass("file-uploading"), s._getThumbs(" .kv-file-upload").removeAttr("disabled"), s._getThumbs(" .kv-file-delete").removeAttr("disabled"), s._setProgress(101, s.$progress, s.msgAjaxProgressError.replace("{operation}", g)))
                };
                var m = 0;
                e.each(s.fileManager.stack, function (e, i) {
                    t.isEmpty(i.file) || f.append(s.uploadFileAttr, i.file, i.nameFmt || "untitled_" + m), m++
                }), s._ajaxSubmit(i, a, n, r, f)
            }
        }, _uploadExtraOnly: function () {
            var e, i, a, r, n, o = this, l = {}, s = new FormData, d = o.ajaxOperations.uploadExtra;
            o._abort(l) || (e = function (e) {
                o.lock();
                var t = o._getOutData(s, e);
                o._raise("filebatchpreupload", [t]), o._setProgress(50), l.data = t, l.xhr = e, o._abort(l) && (e.abort(), o._setProgressCancelled())
            }, i = function (e, i, a) {
                var r = o._getOutData(s, a, e);
                t.isEmpty(e) || t.isEmpty(e.error) ? (o._raise("filebatchuploadsuccess", [r]), o._clearFileInput(), o._initUploadSuccess(e), o._setProgress(101)) : (n = o._parseError(d, a, o.msgUploadError), o._showFileError(n, r, "filebatchuploaderror"))
            }, a = function () {
                o.unlock(), o._clearFileInput(), o._raise("filebatchuploadcomplete", [o.fileManager.stack, o._getExtraData()])
            }, r = function (e, t, i) {
                var a = o._getOutData(s, e);
                n = o._parseError(d, e, i), l.data = a, o._showFileError(n, a, "filebatchuploaderror"), o._setProgress(101, o.$progress, o.msgAjaxProgressError.replace("{operation}", d))
            }, o._ajaxSubmit(e, i, a, r, s))
        }, _deleteFileIndex: function (i) {
            var a = this, r = i.attr("data-fileindex"), n = a.reversePreviewOrder;
            r.substring(0, 5) === t.INIT_FLAG && (r = parseInt(r.replace(t.INIT_FLAG, "")), a.initialPreview = t.spliceArray(a.initialPreview, r, n), a.initialPreviewConfig = t.spliceArray(a.initialPreviewConfig, r, n), a.initialPreviewThumbTags = t.spliceArray(a.initialPreviewThumbTags, r, n), a.getFrames().each(function () {
                var i = e(this), a = i.attr("data-fileindex");
                a.substring(0, 5) === t.INIT_FLAG && (a = parseInt(a.replace(t.INIT_FLAG, "")), a > r && (a--, i.attr("data-fileindex", t.INIT_FLAG + a)))
            }))
        }, _initFileActions: function () {
            var i = this;
            i.showPreview && (i._initZoomButton(), i.getFrames(" .kv-file-remove").each(function () {
                var a, r, n, o, l = e(this), s = l.closest(t.FRAMES), d = s.attr("id"), c = s.attr("data-fileindex");
                i._handler(l, "click", function () {
                    return o = i._raise("filepreremove", [d, c]), o !== !1 && i._validateMinCount() ? (a = s.hasClass("file-preview-error"), t.cleanMemory(s), void s.fadeOut("slow", function () {
                        t.cleanZoomCache(i._getZoom(d)), i.fileManager.remove(s), i._clearObjects(s), s.remove(), d && a && i.$errorContainer.find('li[data-thumb-id="' + d + '"]').fadeOut("fast", function () {
                            e(this).remove(), i._errorsExist() || i._resetErrors()
                        }), i._clearFileInput();
                        var o, l = i.previewCache.count(!0), u = i.fileManager.count(),
                            p = i.showPreview && i.getFrames().length;
                        0 !== u || 0 !== l || p ? (r = l + u, r > 1 ? n = i._getMsgSelected(r) : (o = i.fileManager.getFirstFile(), n = o ? o.nameFmt : "_"), i._setCaption(n)) : i.reset(), i._raise("fileremoved", [d, c])
                    })) : !1
                })
            }), i.getFrames(" .kv-file-upload").each(function () {
                var a = e(this);
                i._handler(a, "click", function () {
                    var e = a.closest(t.FRAMES), r = e.attr("data-fileid");
                    i.$progress.hide(), e.hasClass("file-preview-error") && !i.retryErrorUploads || i._uploadSingle(i.fileManager.getIndex(r), r, !1)
                })
            }))
        }, _initPreviewActions: function () {
            var i = this, a = i.$preview, r = i.deleteExtraData || {}, n = t.FRAMES + " .kv-file-remove",
                o = i.fileActionSettings, l = o.removeClass, s = o.removeErrorClass, d = function () {
                    var e = i.isAjaxUpload ? i.previewCache.count(!0) : i._inputFileCount();
                    i.getFrames().length || e || (i._setCaption(""), i.reset(), i.initialCaption = "")
                };
            i._initZoomButton(), a.find(n).each(function () {
                var a, n, o, c, u = e(this), p = u.data("url") || i.deleteUrl, f = u.data("key"),
                    g = i.ajaxOperations.deleteThumb;
                if (!t.isEmpty(p) && void 0 !== f) {
                    "function" == typeof p && (p = p());
                    var m, v, h, w, b, _ = u.closest(t.FRAMES), C = i.previewCache.data, x = _.attr("data-fileindex");
                    x = parseInt(x.replace(t.INIT_FLAG, "")), h = t.isEmpty(C.config) && t.isEmpty(C.config[x]) ? null : C.config[x], b = t.isEmpty(h) || t.isEmpty(h.extra) ? r : h.extra, w = h.filename || h.caption || "", "function" == typeof b && (b = b()), v = {
                        id: u.attr("id"),
                        key: f,
                        extra: b
                    }, n = function (e) {
                        i.ajaxAborted = !1, i._raise("filepredelete", [f, e, b]), i._abort() ? e.abort() : (u.removeClass(s), t.addCss(_, "file-uploading"), t.addCss(u, "disabled " + l))
                    }, o = function (e, r, n) {
                        var o, c;
                        return t.isEmpty(e) || t.isEmpty(e.error) ? (_.removeClass("file-uploading").addClass("file-deleted"), void _.fadeOut("slow", function () {
                            x = parseInt(_.attr("data-fileindex").replace(t.INIT_FLAG, "")), i.previewCache.unset(x), i._deleteFileIndex(_), o = i.previewCache.count(!0), c = o > 0 ? i._getMsgSelected(o) : "", i._setCaption(c), i._raise("filedeleted", [f, n, b]), t.cleanZoomCache(i._getZoom(_.attr("id"))), i._clearObjects(_), _.remove(), d()
                        })) : (v.jqXHR = n, v.response = e, a = i._parseError(g, n, i.msgDeleteError, w), i._showFileError(a, v, "filedeleteerror"), _.removeClass("file-uploading"), u.removeClass("disabled " + l).addClass(s), void d())
                    }, c = function (e, t, a) {
                        var r = i._parseError(g, e, a, w);
                        v.jqXHR = e, v.response = {}, i._showFileError(r, v, "filedeleteerror"), _.removeClass("file-uploading"), u.removeClass("disabled " + l).addClass(s), d()
                    }, i._initAjaxSettings(), i._mergeAjaxCallback("beforeSend", n, "delete"), i._mergeAjaxCallback("success", o, "delete"), i._mergeAjaxCallback("error", c, "delete"), m = e.extend(!0, {}, {
                        url: i._encodeURI(p),
                        type: "POST",
                        dataType: "json",
                        data: e.extend(!0, {}, {key: f}, b)
                    }, i._ajaxDeleteSettings), i._handler(u, "click", function () {
                        return i._validateMinCount() ? (i.ajaxAborted = !1, i._raise("filebeforedelete", [f, b]), void (i.ajaxAborted instanceof Promise ? i.ajaxAborted.then(function (t) {
                            t || e.ajax(m)
                        }) : i.ajaxAborted || e.ajax(m))) : !1
                    })
                }
            })
        }, _hideFileIcon: function () {
            var e = this;
            e.overwriteInitial && e.$captionContainer.removeClass("icon-visible")
        }, _showFileIcon: function () {
            var e = this;
            t.addCss(e.$captionContainer, "icon-visible")
        }, _getSize: function (t, i) {
            var a, r, n = this, o = parseFloat(t), l = n.fileSizeGetter;
            return e.isNumeric(t) && e.isNumeric(o) ? ("function" == typeof l ? r = l(o) : 0 === o ? r = "0.00 B" : (a = Math.floor(Math.log(o) / Math.log(1024)), i || (i = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]), r = 1 * (o / Math.pow(1024, a)).toFixed(2) + " " + i[a]), n._getLayoutTemplate("size").replace("{sizeText}", r)) : ""
        }, _getFileType: function (e) {
            var t = this;
            return t.mimeTypeAliases[e] || e
        }, _generatePreviewTemplate: function (i, a, r, n, o, l, s, d, c, u, p, f, g, m) {
            var v, h, w, b = this, _ = b.slug(r), C = "", x = "",
                y = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, T = _,
                F = _, I = "type-default", P = u || b._renderFileFooter(i, _, d, "auto", s), k = b.preferIconicPreview,
                E = b.preferIconicZoomPreview, S = k ? "other" : i;
            return h = 400 > y ? b.previewSettingsSmall[S] || b.defaults.previewSettingsSmall[S] : b.previewSettings[S] || b.defaults.previewSettings[S], h && e.each(h, function (e, t) {
                x += e + ":" + t + ";"
            }), w = function (a, s, d, u) {
                var m = d ? "zoom-" + o : o, v = b._getPreviewTemplate(a), h = (c || "") + " " + u;
                return b.frameClass && (h = b.frameClass + " " + h), d && (h = h.replace(" " + t.SORT_CSS, "")), v = b._parseFilePreviewIcon(v, r), "text" === a && (s = t.htmlEncode(s)), "object" !== i || n || e.each(b.defaults.fileTypeSettings, function (e, t) {
                    "object" !== e && "other" !== e && t(r, n) && (I = "type-" + e)
                }), t.isEmpty(g) || (void 0 !== g.title && null !== g.title && (T = g.title), void 0 !== g.alt && null !== g.alt && (T = g.alt)), v.setTokens({
                    previewId: m,
                    caption: _,
                    title: T,
                    alt: F,
                    frameClass: h,
                    type: b._getFileType(n),
                    fileindex: p,
                    fileid: l || "",
                    typeCss: I,
                    footer: P,
                    data: s,
                    template: f || i,
                    style: x ? 'style="' + x + '"' : ""
                })
            }, p = p || o.slice(o.lastIndexOf("-") + 1), b.fileActionSettings.showZoom && (C = w(E ? "other" : i, m ? m : a, !0, "kv-zoom-thumb")), C = "\n" + b._getLayoutTemplate("zoomCache").replace("{zoomContent}", C), "function" == typeof b.sanitizeZoomCache && (C = b.sanitizeZoomCache(C)), v = w(k ? "other" : i, a, !1, "kv-preview-thumb"), v + C
        }, _addToPreview: function (e, t) {
            var i = this;
            return i.reversePreviewOrder ? e.prepend(t) : e.append(t)
        }, _previewDefault: function (e, i) {
            var a = this, r = a.$preview;
            if (a.showPreview) {
                var n, o = t.getFileName(e), l = e ? e.type : "", s = e.size || 0, d = a._getFileName(e, ""),
                    c = i === !0 && !a.isAjaxUpload, u = t.createObjectURL(e), p = a.fileManager.getId(e),
                    f = a._getThumbId(p);
                a._clearDefaultPreview(), n = a._generatePreviewTemplate("other", u, o, l, f, p, c, s), a._addToPreview(r, n), a._setThumbAttr(f, d, s), i === !0 && a.isAjaxUpload && a._setThumbStatus(a._getFrame(f), "Error")
            }
        }, _previewFile: function (e, i, a, r, n) {
            if (this.showPreview) {
                var o, l = this, s = t.getFileName(i), d = n.type, c = n.name, u = l._parseFileType(d, s),
                    p = l.$preview, f = i.size || 0,
                    g = "text" === u || "html" === u || "image" === u ? a.target.result : r, m = l.fileManager.getId(i),
                    v = l._getThumbId(m);
                "html" === u && l.purifyHtml && window.DOMPurify && (g = window.DOMPurify.sanitize(g)), o = l._generatePreviewTemplate(u, g, s, d, v, m, !1, f), l._clearDefaultPreview(), l._addToPreview(p, o);
                var h = l._getFrame(v);
                l._validateImageOrientation(h.find("img"), i, v, m, c, d, f, g), l._setThumbAttr(v, c, f), l._initSortable()
            }
        }, _setThumbAttr: function (e, t, i) {
            var a = this, r = a._getFrame(e);
            r.length && (i = i && i > 0 ? a._getSize(i) : "", r.data({caption: t, size: i}))
        }, _setInitThumbAttr: function () {
            var e, i, a, r, n = this, o = n.previewCache.data, l = n.previewCache.count(!0);
            if (0 !== l) for (var s = 0; l > s; s++) e = o.config[s], r = n.previewInitId + "-" + t.INIT_FLAG + s, i = t.ifSet("caption", e, t.ifSet("filename", e)), a = t.ifSet("size", e), n._setThumbAttr(r, i, a)
        }, _slugDefault: function (e) {
            return t.isEmpty(e) ? "" : String(e).replace(/[\[\]\/\{}:;#%=\(\)\*\+\?\\\^\$\|<>&"']/g, "_")
        }, _updateFileDetails: function (e) {
            var i, a, r, n, o, l = this, s = l.$element,
                d = t.isIE(9) && t.findFileName(s.val()) || s[0].files[0] && s[0].files[0].name;
            !d && l.fileManager.count() > 0 ? (o = l.fileManager.getFirstFile(), i = o.nameFmt) : i = d ? l.slug(d) : "_", a = l.isAjaxUpload ? l.fileManager.count() : e, n = l.previewCache.count(!0) + a, r = 1 === a ? i : l._getMsgSelected(n), l.isError ? (l.$previewContainer.removeClass("file-thumb-loading"), l.$previewStatus.html(""), l.$captionContainer.removeClass("icon-visible")) : l._showFileIcon(), l._setCaption(r, l.isError), l.$container.removeClass("file-input-new file-input-ajax-new"), 1 === arguments.length && l._raise("fileselect", [e, i]), l.previewCache.count(!0) && l._initPreviewActions()
        }, _setThumbStatus: function (e, t) {
            var i = this;
            if (i.showPreview) {
                var a = "indicator" + t, r = a + "Title", n = "file-preview-" + t.toLowerCase(),
                    o = e.find(".file-upload-indicator"), l = i.fileActionSettings;
                e.removeClass("file-preview-success file-preview-error file-preview-paused file-preview-loading"), "Success" === t && e.find(".file-drag-handle").remove(), o.html(l[a]), o.attr("title", l[r]), e.addClass(n), "Error" !== t || i.retryErrorUploads || e.find(".kv-file-upload").attr("disabled", !0)
            }
        }, _setProgressCancelled: function () {
            var e = this;
            e._setProgress(101, e.$progress, e.msgCancelled)
        }, _setProgress: function (e, i, a, r) {
            var n = this;
            if (i = i || n.$progress, i.length) {
                var o, l = Math.min(e, 100), s = n.progressUploadThreshold,
                    d = 100 >= e ? n.progressTemplate : n.progressCompleteTemplate,
                    c = 100 > l ? n.progressTemplate : a ? n.paused ? n.progressPauseTemplate : n.progressErrorTemplate : d;
                e >= 100 && (r = ""), t.isEmpty(c) || (o = s && l > s && 100 >= e ? c.setTokens({
                    percent: s,
                    status: n.msgUploadThreshold
                }) : c.setTokens({
                    percent: l,
                    status: e > 100 ? n.msgUploadEnd : l + "%"
                }), r = r || "", o = o.setTokens({stats: r}), i.html(o), a && i.find('[role="progressbar"]').html(a))
            }
        }, _setFileDropZoneTitle: function () {
            var e, i = this, a = i.$container.find(".file-drop-zone"), r = i.dropZoneTitle;
            i.isClickable && (e = t.isEmpty(i.$element.attr("multiple")) ? i.fileSingle : i.filePlural, r += i.dropZoneClickTitle.replace("{files}", e)), a.find("." + i.dropZoneTitleClass).remove(), !i.showPreview || 0 === a.length || i.fileManager.count() > 0 || !i.dropZoneEnabled || !i.isAjaxUpload && i.$element.files || (0 === a.find(t.FRAMES).length && t.isEmpty(i.defaultPreviewContent) && a.prepend('<div class="' + i.dropZoneTitleClass + '">' + r + "</div>"), i.$container.removeClass("file-input-new"), t.addCss(i.$container, "file-input-ajax-new"))
        }, _getStats: function (e) {
            var i, a, r = this;
            return r.showUploadStats && e && e.bitrate ? (a = r._getLayoutTemplate("stats"), i = e.elapsed && e.bps ? r.msgPendingTime.setTokens({time: t.getElapsed(Math.ceil(e.pendingBytes / e.bps))}) : r.msgCalculatingTime, a.setTokens({
                uploadSpeed: e.bitrate,
                pendingTime: i
            })) : ""
        }, _setResumableProgress: function (e, t, i) {
            var a = this, r = a.resumableManager, n = i ? r : a, o = i ? i.find(".file-thumb-progress") : null;
            0 === n.lastProgress && (n.lastProgress = e), e < n.lastProgress && (e = n.lastProgress), a._setProgress(e, o, null, a._getStats(t)), n.lastProgress = e
        }, _setFileUploadStats: function (i, a, r, n) {
            var o = this, l = o.$progress;
            if (o.showPreview || l && l.length) {
                var s, d = o.fileManager, c = d.getThumb(i), u = o.resumableManager, p = 0, f = d.getTotalSize(),
                    g = e.extend(!0, {}, n);
                if (o.enableResumableUpload) {
                    var m, v = n.loaded, h = u.getUploadedSize(), w = u.file.size;
                    v += h, m = d.uploadedSize + v, a = t.round(100 * v / w), n.pendingBytes = w - h, o._setResumableProgress(a, n, c), s = Math.floor(100 * m / f), g.pendingBytes = f - m, o._setResumableProgress(s, g)
                } else d.setProgress(i, a), l = c && c.length ? c.find(".file-thumb-progress") : null, o._setProgress(a, l, null, o._getStats(n)), e.each(d.stats, function (e, t) {
                    p += t.loaded
                }), g.pendingBytes = f - p, s = t.round(p / f * 100), o._setProgress(s, null, null, o._getStats(g))
            }
        }, _validateMinCount: function () {
            var e = this, t = e.isAjaxUpload ? e.fileManager.count() : e._inputFileCount();
            return e.validateInitialCount && e.minFileCount > 0 && e._getFileCount(t - 1) < e.minFileCount ? (e._noFilesError({}), !1) : !0
        }, _getFileCount: function (e, t) {
            var i = this, a = 0;
            return void 0 === t && (t = i.validateInitialCount && !i.overwriteInitial), t && (a = i.previewCache.count(!0), e += a), e
        }, _getFileId: function (e) {
            return t.getFileId(e, this.generateFileId)
        }, _getFileName: function (e, i) {
            var a = this, r = t.getFileName(e);
            return r ? a.slug(r) : i
        }, _getFileNames: function (e) {
            var t = this;
            return t.filenames.filter(function (t) {
                return e ? void 0 !== t : void 0 !== t && null !== t
            })
        }, _setPreviewError: function (e, t) {
            var i = this, a = i.removeFromPreviewOnError && !i.retryErrorUploads;
            if (t && !a || i.fileManager.remove(e), i.showPreview) {
                if (a) return void e.remove();
                i._setThumbStatus(e, "Error"), i._refreshUploadButton(e)
            }
        }, _refreshUploadButton: function (e) {
            var t = this, i = e.find(".kv-file-upload"), a = t.fileActionSettings, r = a.uploadIcon, n = a.uploadTitle;
            i.length && (t.retryErrorUploads && (r = a.uploadRetryIcon, n = a.uploadRetryTitle), i.attr("title", n).html(r))
        }, _checkDimensions: function (e, i, a, r, n, o, l) {
            var s, d, c, u, p = this, f = "Small" === i ? "min" : "max", g = p[f + "Image" + o];
            !t.isEmpty(g) && a.length && (c = a[0], d = "Width" === o ? c.naturalWidth || c.width : c.naturalHeight || c.height, u = "Small" === i ? d >= g : g >= d, u || (s = p["msgImage" + o + i].setTokens({
                name: n,
                size: g
            }), p._showFileError(s, l), p._setPreviewError(r)))
        }, _getExifObj: function (e) {
            var i = this, a = null, r = t.logMessages.exifWarning;
            if ("data:image/jpeg;base64," !== e.slice(0, 23) && "data:image/jpg;base64," !== e.slice(0, 22)) return void (a = null);
            try {
                a = window.piexif ? window.piexif.load(e) : null
            } catch (n) {
                a = null, r = n && n.message || ""
            }
            return a || i._log(t.logMessages.badExifParser, {details: r}), a
        }, setImageOrientation: function (i, a, r, n) {
            var o, l, s, d = this, c = !i || !i.length, u = !a || !a.length, p = !1,
                f = c && n && "image" === n.attr("data-template");
            c && u || (s = "load.fileinputimageorient", f ? (i = a, a = null, i.css(d.previewSettings.image), l = e(document.createElement("div")).appendTo(n.find(".kv-file-content")), o = e(document.createElement("span")).insertBefore(i), i.css("visibility", "hidden").removeClass("file-zoom-detail").appendTo(l)) : p = !i.is(":visible"), i.off(s).on(s, function () {
                p && (d.$preview.removeClass("hide-content"), n.find(".kv-file-content").css("visibility", "hidden"));
                var e = i.get(0), s = a && a.length ? a.get(0) : null, c = e.offsetHeight, u = e.offsetWidth,
                    g = t.getRotation(r);
                if (p && (n.find(".kv-file-content").css("visibility", "visible"), d.$preview.addClass("hide-content")), i.data("orientation", r), s && a.data("orientation", r), 5 > r) return t.setTransform(e, g), void t.setTransform(s, g);
                var m = Math.atan(u / c), v = Math.sqrt(Math.pow(c, 2) + Math.pow(u, 2)),
                    h = v ? c / Math.cos(Math.PI / 2 + m) / v : 1, w = " scale(" + Math.abs(h) + ")";
                t.setTransform(e, g + w), t.setTransform(s, g + w), f && (i.css("visibility", "visible").insertAfter(o).addClass("file-zoom-detail"), o.remove(), l.remove())
            }))
        }, _validateImageOrientation: function (i, a, r, n, o, l, s, d) {
            var c, u, p = this, f = p.autoOrientImage, g = t.getZoomSelector(r, " img");
            return c = f ? p._getExifObj(d) : null, (u = c ? c["0th"][piexif.ImageIFD.Orientation] : null) ? (p.setImageOrientation(i, e(g), u, p._getFrame(r)), p._raise("fileimageoriented", {
                $img: i,
                file: a
            }), void p._validateImage(r, n, o, l, s, d, c)) : void p._validateImage(r, n, o, l, s, d, c)
        }, _validateImage: function (t, i, a, r, n, o, l) {
            var s, d, c, u = this, p = u.$preview, f = u._getFrame(t), g = f.attr("data-fileindex"), m = f.find("img");
            a = a || "Untitled", m.one("load", function () {
                d = f.width(), c = p.width(), d > c && m.css("width", "100%"), s = {
                    ind: g,
                    id: t,
                    fileId: i
                }, u._checkDimensions(g, "Small", m, f, a, "Width", s), u._checkDimensions(g, "Small", m, f, a, "Height", s), u.resizeImage || (u._checkDimensions(g, "Large", m, f, a, "Width", s), u._checkDimensions(g, "Large", m, f, a, "Height", s)), u._raise("fileimageloaded", [t]), u.fileManager.addImage(i, {
                    ind: g,
                    img: m,
                    thumb: f,
                    pid: t,
                    typ: r,
                    siz: n,
                    validated: !1,
                    imgData: o,
                    exifObj: l
                }), f.data("exif", l), u._validateAllImages()
            }).one("error", function () {
                u._raise("fileimageloaderror", [t])
            }).each(function () {
                this.complete ? e(this).trigger("load") : this.error && e(this).trigger("error")
            })
        }, _validateAllImages: function () {
            var t, i = this, a = {val: 0}, r = i.fileManager.getImageCount(), n = i.resizeIfSizeMoreThan;
            r === i.fileManager.totalImages && (i._raise("fileimagesloaded"), i.resizeImage && e.each(i.fileManager.loadedImages, function (e, o) {
                o.validated || (t = o.siz, t && t > 1e3 * n && i._getResizedImage(e, o, a, r), o.validated = !0)
            }))
        }, _getResizedImage: function (i, a, r, n) {
            var o, l, s, d, c, u, p, f, g, m, v = this, h = e(a.img)[0], w = h.naturalWidth, b = h.naturalHeight, _ = 1,
                C = v.maxImageWidth || w, x = v.maxImageHeight || b, y = !(!w || !b), T = v.imageCanvas,
                F = v.imageCanvasContext, I = a.typ, P = a.pid, k = a.ind, E = a.thumb, S = a.exifObj;
            if (c = function (e, t, i) {
                v.isAjaxUpload ? v._showFileError(e, t, i) : v._showError(e, t, i), v._setPreviewError(E)
            }, f = v.fileManager.getFile(i), g = {
                id: P,
                index: k,
                fileId: i
            }, m = [i, P, k], (!f || !y || C >= w && x >= b) && (y && f && v._raise("fileimageresized", m), r.val++, r.val === n && v._raise("fileimagesresized"), !y)) return void c(v.msgImageResizeError, g, "fileimageresizeerror");
            I = I || v.resizeDefaultImageType, l = w > C, s = b > x, _ = "width" === v.resizePreference ? l ? C / w : s ? x / b : 1 : s ? x / b : l ? C / w : 1, v._resetCanvas(), w *= _, b *= _, T.width = w, T.height = b;
            try {
                F.drawImage(h, 0, 0, w, b), d = T.toDataURL(I, v.resizeQuality), S && (p = window.piexif.dump(S), d = window.piexif.insert(p, d)), o = t.dataURI2Blob(d), v.fileManager.setFile(i, o), v._raise("fileimageresized", m), r.val++, r.val === n && v._raise("fileimagesresized", [void 0, void 0]), o instanceof Blob || c(v.msgImageResizeError, g, "fileimageresizeerror")
            } catch (A) {
                r.val++, r.val === n && v._raise("fileimagesresized", [void 0, void 0]), u = v.msgImageResizeException.replace("{errors}", A.message), c(u, g, "fileimageresizeexception")
            }
        }, _initBrowse: function (e) {
            var i = this, a = i.$element;
            i.showBrowse ? i.$btnFile = e.find(".btn-file").append(a) : (a.appendTo(e).attr("tabindex", -1), t.addCss(a, "file-no-browse"))
        }, _initClickable: function () {
            var i, a, r = this;
            r.isClickable && (i = r.$dropZone, r.isAjaxUpload || (a = r.$preview.find(".file-default-preview"), a.length && (i = a)), t.addCss(i, "clickable"), i.attr("tabindex", -1), r._handler(i, "click", function (t) {
                var a = e(t.target);
                e(r.elErrorContainer + ":visible").length || a.parents(".file-preview-thumbnails").length && !a.parents(".file-default-preview").length || (r.$element.data("zoneClicked", !0).trigger("click"), i.blur())
            }))
        }, _initCaption: function () {
            var e = this, i = e.initialCaption || "";
            return e.overwriteInitial || t.isEmpty(i) ? (e.$caption.val(""), !1) : (e._setCaption(i), !0)
        }, _setCaption: function (i, a) {
            var r, n, o, l, s, d, c = this;
            if (c.$caption.length) {
                if (c.$captionContainer.removeClass("icon-visible"), a) r = e("<div>" + c.msgValidationError + "</div>").text(), l = c.fileManager.count(), l ? (d = c.fileManager.getFirstFile(), s = 1 === l && d ? d.nameFmt : c._getMsgSelected(l)) : s = c._getMsgSelected(c.msgNo), n = t.isEmpty(i) ? s : i, o = '<span class="' + c.msgValidationErrorClass + '">' + c.msgValidationErrorIcon + "</span>"; else {
                    if (t.isEmpty(i)) return;
                    r = e("<div>" + i + "</div>").text(), n = r, o = c._getLayoutTemplate("fileIcon")
                }
                c.$captionContainer.addClass("icon-visible"), c.$caption.attr("title", r).val(n), c.$captionIcon.html(o)
            }
        }, _createContainer: function () {
            var t = this, i = {"class": "file-input file-input-new" + (t.rtl ? " kv-rtl" : "")},
                a = e(document.createElement("div")).attr(i).html(t._renderMain());
            return a.insertBefore(t.$element), t._initBrowse(a), t.theme && a.addClass("theme-" + t.theme), a
        }, _refreshContainer: function () {
            var e = this, t = e.$container, i = e.$element;
            i.insertAfter(t), t.html(e._renderMain()), e._initBrowse(t), e._validateDisabled()
        }, _validateDisabled: function () {
            var e = this;
            e.$caption.attr({readonly: e.isDisabled})
        }, _renderMain: function () {
            var e = this, t = e.dropZoneEnabled ? " file-drop-zone" : "file-drop-disabled",
                i = e.showClose ? e._getLayoutTemplate("close") : "",
                a = e.showPreview ? e._getLayoutTemplate("preview").setTokens({
                    "class": e.previewClass,
                    dropClass: t
                }) : "", r = e.isDisabled ? e.captionClass + " file-caption-disabled" : e.captionClass,
                n = e.captionTemplate.setTokens({"class": r + " kv-fileinput-caption"});
            return e.mainTemplate.setTokens({
                "class": e.mainClass + (!e.showBrowse && e.showCaption ? " no-browse" : ""),
                preview: a,
                close: i,
                caption: n,
                upload: e._renderButton("upload"),
                remove: e._renderButton("remove"),
                cancel: e._renderButton("cancel"),
                pause: e._renderButton("pause"),
                browse: e._renderButton("browse")
            })
        }, _renderButton: function (e) {
            var i = this, a = i._getLayoutTemplate("btnDefault"), r = i[e + "Class"], n = i[e + "Title"],
                o = i[e + "Icon"], l = i[e + "Label"], s = i.isDisabled ? " disabled" : "", d = "button";
            switch (e) {
                case"remove":
                    if (!i.showRemove) return "";
                    break;
                case"cancel":
                    if (!i.showCancel) return "";
                    r += " kv-hidden";
                    break;
                case"pause":
                    if (!i.showPause) return "";
                    r += " kv-hidden";
                    break;
                case"upload":
                    if (!i.showUpload) return "";
                    i.isAjaxUpload && !i.isDisabled ? a = i._getLayoutTemplate("btnLink").replace("{href}", i.uploadUrl) : d = "submit";
                    break;
                case"browse":
                    if (!i.showBrowse) return "";
                    a = i._getLayoutTemplate("btnBrowse");
                    break;
                default:
                    return ""
            }
            return r += "browse" === e ? " btn-file" : " fileinput-" + e + " fileinput-" + e + "-button", t.isEmpty(l) || (l = ' <span class="' + i.buttonLabelClass + '">' + l + "</span>"), a.setTokens({
                type: d,
                css: r,
                title: n,
                status: s,
                icon: o,
                label: l
            })
        }, _renderThumbProgress: function () {
            var e = this;
            return '<div class="file-thumb-progress kv-hidden">' + e.progressInfoTemplate.setTokens({
                percent: 101,
                status: e.msgUploadBegin,
                stats: ""
            }) + "</div>"
        }, _renderFileFooter: function (e, i, a, r, n) {
            var o, l, s = this, d = s.fileActionSettings, c = d.showRemove, u = d.showDrag, p = d.showUpload,
                f = d.showZoom, g = s._getLayoutTemplate("footer"), m = s._getLayoutTemplate("indicator"),
                v = n ? d.indicatorError : d.indicatorNew, h = n ? d.indicatorErrorTitle : d.indicatorNewTitle,
                w = m.setTokens({indicator: v, indicatorTitle: h});
            return a = s._getSize(a), l = {
                type: e,
                caption: i,
                size: a,
                width: r,
                progress: "",
                indicator: w
            }, s.isAjaxUpload ? (l.progress = s._renderThumbProgress(), l.actions = s._renderFileActions(l, p, !1, c, f, u, !1, !1, !1)) : l.actions = s._renderFileActions(l, !1, !1, !1, f, u, !1, !1, !1), o = g.setTokens(l), o = t.replaceTags(o, s.previewThumbTags)
        }, _renderFileActions: function (e, t, i, a, r, n, o, l, s, d, c, u) {
            var p = this;
            if (!e.type && d && (e.type = "image"), p.enableResumableUpload ? t = !1 : "function" == typeof t && (t = t(e)), "function" == typeof i && (i = i(e)), "function" == typeof a && (a = a(e)), "function" == typeof r && (r = r(e)), "function" == typeof n && (n = n(e)), !(t || i || a || r || n)) return "";
            var f, g = l === !1 ? "" : ' data-url="' + l + '"', m = "", v = "",
                h = s === !1 ? "" : ' data-key="' + s + '"', w = "", b = "", _ = "",
                C = p._getLayoutTemplate("actions"), x = p.fileActionSettings,
                y = p.otherActionButtons.setTokens({dataKey: h, key: s}),
                T = o ? x.removeClass + " disabled" : x.removeClass;
            return a && (w = p._getLayoutTemplate("actionDelete").setTokens({
                removeClass: T,
                removeIcon: x.removeIcon,
                removeTitle: x.removeTitle,
                dataUrl: g,
                dataKey: h,
                key: s
            })), t && (b = p._getLayoutTemplate("actionUpload").setTokens({
                uploadClass: x.uploadClass,
                uploadIcon: x.uploadIcon,
                uploadTitle: x.uploadTitle
            })), i && (_ = p._getLayoutTemplate("actionDownload").setTokens({
                downloadClass: x.downloadClass,
                downloadIcon: x.downloadIcon,
                downloadTitle: x.downloadTitle,
                downloadUrl: c || p.initialPreviewDownloadUrl
            }), _ = _.setTokens({
                filename: u,
                key: s
            })), r && (m = p._getLayoutTemplate("actionZoom").setTokens({
                zoomClass: x.zoomClass,
                zoomIcon: x.zoomIcon,
                zoomTitle: x.zoomTitle
            })), n && d && (f = "drag-handle-init " + x.dragClass, v = p._getLayoutTemplate("actionDrag").setTokens({
                dragClass: f,
                dragTitle: x.dragTitle,
                dragIcon: x.dragIcon
            })), C.setTokens({"delete": w, upload: b, download: _, zoom: m, drag: v, other: y})
        }, _browse: function (e) {
            var t = this;
            e && e.isDefaultPrevented() || !t._raise("filebrowse") || (t.isError && !t.isAjaxUpload && t.clear(), t.focusCaptionOnBrowse && t.$captionContainer.focus())
        }, _change: function (i) {
            var a = this;
            if (!a.changeTriggered) {
                var r, n, o, l, s = a.$element, d = arguments.length > 1, c = a.isAjaxUpload,
                    u = d ? arguments[1] : s.get(0).files, p = a.fileManager.count(), f = t.isEmpty(s.attr("multiple")),
                    g = !c && f ? 1 : a.maxFileCount, m = a.maxTotalFileCount, v = m > 0 && m > g, h = f && p > 0,
                    w = function (t, i, r, n) {
                        var o = e.extend(!0, {}, a._getOutData(null, {}, {}, u), {id: r, index: n}),
                            l = {id: r, index: n, file: i, files: u};
                        return c ? a._showFileError(t, o) : a._showError(t, l)
                    }, b = function (e, t, i) {
                        var r = i ? a.msgTotalFilesTooMany : a.msgFilesTooMany;
                        r = r.replace("{m}", t).replace("{n}", e), a.isError = w(r, null, null, null), a.$captionContainer.removeClass("icon-visible"), a._setCaption("", !0), a.$container.removeClass("file-input-new file-input-ajax-new")
                    };
                if (a.reader = null, a._resetUpload(), a._hideFileIcon(), a.dropZoneEnabled && a.$container.find(".file-drop-zone ." + a.dropZoneTitleClass).remove(), c || (u = i.target && void 0 === i.target.files ? i.target.value ? [{name: i.target.value.replace(/^.+\\/, "")}] : [] : i.target.files || {}), r = u, t.isEmpty(r) || 0 === r.length) return c || a.clear(), void a._raise("fileselectnone");
                if (a._resetErrors(), l = r.length, o = c ? a.fileManager.count() + l : l, n = a._getFileCount(o, v ? !1 : void 0), g > 0 && n > g) {
                    if (!a.autoReplace || l > g) return void b(a.autoReplace && l > g ? l : n, g);
                    n > g && a._resetPreviewThumbs(c)
                } else {
                    if (v && (n = a._getFileCount(o, !0), m > 0 && n > m)) {
                        if (!a.autoReplace || l > g) return void b(a.autoReplace && l > m ? l : n, m, !0);
                        n > g && a._resetPreviewThumbs(c)
                    }
                    !c || h ? (a._resetPreviewThumbs(!1), h && a.clearFileStack()) : !c || 0 !== p || a.previewCache.count(!0) && !a.overwriteInitial || a._resetPreviewThumbs(!0)
                }
                a.readFiles(r)
            }
        }, _abort: function (t) {
            var i, a = this;
            return a.ajaxAborted && "object" == typeof a.ajaxAborted && void 0 !== a.ajaxAborted.message ? (i = e.extend(!0, {}, a._getOutData(null), t), i.abortData = a.ajaxAborted.data || {}, i.abortMessage = a.ajaxAborted.message, a._setProgress(101, a.$progress, a.msgCancelled), a._showFileError(a.ajaxAborted.message, i, "filecustomerror"), a.cancel(), !0) : !!a.ajaxAborted
        }, _resetFileStack: function () {
            var t = this, i = 0;
            t._getThumbs().each(function () {
                var a = e(this), r = a.attr("data-fileindex"), n = a.attr("id");
                "-1" !== r && -1 !== r && (t.fileManager.getFile(a.attr("data-fileid")) ? a.attr({"data-fileindex": "-1"}) : (a.attr({"data-fileindex": i}), i++), t._getZoom(n).attr({"data-fileindex": a.attr("data-fileindex")}))
            })
        }, _isFileSelectionValid: function (e) {
            var t = this;
            return e = e || 0, t.required && !t.getFilesCount() ? (t.$errorContainer.html(""), t._showFileError(t.msgFileRequired),
                !1) : t.minFileCount > 0 && t._getFileCount(e) < t.minFileCount ? (t._noFilesError({}), !1) : !0
        }, _canPreview: function (e) {
            var i = this;
            if (!(e && i.showPreview && i.$preview && i.$preview.length)) return !1;
            var a, r, n, o, l = e.name || "", s = e.type || "", d = (e.size || 0) / 1e3, c = i._parseFileType(s, l),
                u = i.allowedPreviewTypes, p = i.allowedPreviewMimeTypes, f = i.allowedPreviewExtensions || [],
                g = i.disabledPreviewTypes, m = i.disabledPreviewMimeTypes, v = i.disabledPreviewExtensions || [],
                h = i.maxFilePreviewSize && parseFloat(i.maxFilePreviewSize) || 0,
                w = new RegExp("\\.(" + f.join("|") + ")$", "i"), b = new RegExp("\\.(" + v.join("|") + ")$", "i");
            return a = !u || -1 !== u.indexOf(c), r = !p || -1 !== p.indexOf(s), n = !f.length || t.compare(l, w), o = g && -1 !== g.indexOf(c) || m && -1 !== m.indexOf(s) || v.length && t.compare(l, b) || h && !isNaN(h) && d > h, !o && (a || r || n)
        }, addToStack: function (e, t) {
            this.fileManager.add(e, t)
        }, clearFileStack: function () {
            var e = this;
            return e.fileManager.clear(), e._initResumableUpload(), e.enableResumableUpload ? (null === e.showPause && (e.showPause = !0), null === e.showCancel && (e.showCancel = !1)) : (e.showPause = !1, null === e.showCancel && (e.showCancel = !0)), e.$element
        }, getFileStack: function () {
            return this.fileManager.stack
        }, getFileList: function () {
            return this.fileManager.list()
        }, getFilesCount: function () {
            var e = this, t = e.isAjaxUpload ? e.fileManager.count() : e._inputFileCount();
            return e._getFileCount(t)
        }, readFiles: function (i) {
            this.reader = new FileReader;
            var a, r = this, n = r.$element, o = r.reader, l = r.$previewContainer, s = r.$previewStatus,
                d = r.msgLoading, c = r.msgProgress, u = r.previewInitId, p = i.length, f = r.fileTypeSettings,
                g = r.allowedFileTypes, m = g ? g.length : 0, v = r.allowedFileExtensions,
                h = t.isEmpty(v) ? "" : v.join(", "), w = function (t, n, o, l, s, d) {
                    var c = e.extend(!0, {}, r._getOutData(null, {}, {}, i), {id: o, index: l, fileId: s}), u = "",
                        f = {id: o, index: l, fileId: s, file: n, files: i};
                    d = d || r.removeFromPreviewOnError, d || r._previewDefault(n, !0), u = r._getFrame(o, !0), r.isAjaxUpload ? setTimeout(function () {
                        a(l + 1)
                    }, r.processDelay) : (r.unlock(), p = 0), d && u.length ? u.remove() : (r._initFileActions(), u.find(".kv-file-upload").remove()), r.isError = r.isAjaxUpload ? r._showFileError(t, c) : r._showError(t, f), r._updateFileDetails(p)
                };
            r.fileManager.clearImages(), e.each(i, function (e, t) {
                var i = r.fileTypeSettings.image;
                i && i(t.type) && r.fileManager.totalImages++
            }), a = function (b) {
                if (t.isEmpty(n.attr("multiple")) && (p = 1), b >= p) return r.unlock(), r.isAjaxUpload && r.fileManager.count() > 0 ? r._raise("filebatchselected", [r.fileManager.stack]) : r._raise("filebatchselected", [i]), l.removeClass("file-thumb-loading"), void s.html("");
                r.lock(!0);
                var _, C, x, y, T, F, I, P, k, E, S, A, z, D = i[b], M = u + "-" + r._getFileId(D), U = f.text,
                    $ = f.image, j = f.html, R = r._getFileName(D, ""), O = (D && D.size || 0) / 1e3, B = "",
                    L = t.createObjectURL(D), Z = 0, N = "", H = 0, W = function () {
                        var e = c.setTokens({index: b + 1, files: p, percent: 50, name: R});
                        setTimeout(function () {
                            s.html(e), r._updateFileDetails(p), a(b + 1)
                        }, r.processDelay), r._raise("fileloaded", [D, M, b, o])
                    };
                if (D) {
                    if (P = r.fileManager.getId(D), m > 0) for (C = 0; m > C; C++) F = g[C], I = r.msgFileTypes[F] || F, N += 0 === C ? I : ", " + I;
                    if (R === !1) return void a(b + 1);
                    if (0 === R.length) return x = r.msgInvalidFileName.replace("{name}", t.htmlEncode(t.getFileName(D), "[unknown]")), void w(x, D, M, b, P);
                    if (t.isEmpty(v) || (B = new RegExp("\\.(" + v.join("|") + ")$", "i")), _ = O.toFixed(2), r.isAjaxUpload && r.fileManager.exists(P) || r._getFrame(M, !0).length) return x = r.msgDuplicateFile.setTokens({
                        name: R,
                        size: _
                    }), w(x, D, M, b, P, !0), void (r.isAjaxUpload || (r._clearFileInput(), r.reset()));
                    if (r.maxFileSize > 0 && O > r.maxFileSize) return x = r.msgSizeTooLarge.setTokens({
                        name: R,
                        size: _,
                        maxSize: r.maxFileSize
                    }), void w(x, D, M, b, P);
                    if (null !== r.minFileSize && O <= t.getNum(r.minFileSize)) return x = r.msgSizeTooSmall.setTokens({
                        name: R,
                        size: _,
                        minSize: r.minFileSize
                    }), void w(x, D, M, b, P);
                    if (!t.isEmpty(g) && t.isArray(g)) {
                        for (C = 0; C < g.length; C += 1) y = g[C], k = f[y], Z += k && "function" == typeof k && k(D.type, t.getFileName(D)) ? 1 : 0;
                        if (0 === Z) return x = r.msgInvalidFileType.setTokens({
                            name: R,
                            types: N
                        }), void w(x, D, M, b, P)
                    }
                    if (0 === Z && !t.isEmpty(v) && t.isArray(v) && !t.isEmpty(B) && (T = t.compare(R, B), Z += t.isEmpty(T) ? 0 : T.length, 0 === Z)) return x = r.msgInvalidFileExtension.setTokens({
                        name: R,
                        extensions: h
                    }), void w(x, D, M, b, P);
                    if (!r._canPreview(D)) return r.isAjaxUpload && r.fileManager.add(D), r.showPreview && (l.addClass("file-thumb-loading"), r._previewDefault(D), r._initFileActions()), void setTimeout(function () {
                        r._updateFileDetails(p), a(b + 1), r._raise("fileloaded", [D, M, b])
                    }, 10);
                    E = U(D.type, R), S = j(D.type, R), A = $(D.type, R), s.html(d.replace("{index}", b + 1).replace("{files}", p)), l.addClass("file-thumb-loading"), o.onerror = function (e) {
                        r._errorHandler(e, R)
                    }, o.onload = function (i) {
                        var a, n, l, s, d, c, u = [], p = function (e) {
                            var t = new FileReader;
                            t.onerror = function (e) {
                                r._errorHandler(e, R)
                            }, t.onload = function (e) {
                                r._previewFile(b, D, e, L, n), r._initFileActions(), W()
                            }, e ? t.readAsText(D, r.textEncoding) : t.readAsDataURL(D)
                        };
                        if (n = {name: R, type: D.type}, e.each(f, function (e, t) {
                            "object" !== e && "other" !== e && "function" == typeof t && t(D.type, R) && H++
                        }), 0 === H) {
                            for (l = new Uint8Array(i.target.result), C = 0; C < l.length; C++) s = l[C].toString(16), u.push(s);
                            if (a = u.join("").toLowerCase().substring(0, 8), c = t.getMimeType(a, "", ""), t.isEmpty(c) && (d = t.arrayBuffer2String(o.result), c = t.isSvg(d) ? "image/svg+xml" : t.getMimeType(a, d, D.type)), n = {
                                name: R,
                                type: c
                            }, E = U(c, ""), S = j(c, ""), A = $(c, ""), z = E || S, z || A) return void p(z)
                        }
                        r._previewFile(b, D, i, L, n), r._initFileActions(), W()
                    }, o.onprogress = function (e) {
                        if (e.lengthComputable) {
                            var t = e.loaded / e.total * 100, i = Math.ceil(t);
                            x = c.setTokens({index: b + 1, files: p, percent: i, name: R}), setTimeout(function () {
                                s.html(x)
                            }, r.processDelay)
                        }
                    }, E || S ? o.readAsText(D, r.textEncoding) : A ? o.readAsDataURL(D) : o.readAsArrayBuffer(D), r.fileManager.add(D)
                }
            }, a(0), r._updateFileDetails(p, !1)
        }, lock: function (e) {
            var t = this, i = t.$container;
            return t._resetErrors(), t.disable(), i.addClass("is-locked"), !e && t.showCancel && i.find(".fileinput-cancel").show(), !e && t.showPause && i.find(".fileinput-pause").show(), t._raise("filelock", [t.fileManager.stack, t._getExtraData()]), t.$element
        }, unlock: function (e) {
            var t = this, i = t.$container;
            return void 0 === e && (e = !0), t.enable(), i.removeClass("is-locked"), t.showCancel && i.find(".fileinput-cancel").hide(), t.showPause && i.find(".fileinput-pause").hide(), e && t._resetFileStack(), t._raise("fileunlock", [t.fileManager.stack, t._getExtraData()]), t.$element
        }, resume: function () {
            var e = this, t = !1, i = e.$progress, a = e.resumableManager;
            return e.enableResumableUpload ? (e.paused ? i.html(e.progressPauseTemplate.setTokens({
                percent: 101,
                status: e.msgUploadResume,
                stats: ""
            })) : t = !0, e.paused = !1, t && i.html(e.progressInfoTemplate.setTokens({
                percent: 101,
                status: e.msgUploadBegin,
                stats: ""
            })), setTimeout(function () {
                a.upload()
            }, e.processDelay), e.$element) : e.$element
        }, pause: function () {
            var t, i = this, a = i.resumableManager, r = i.ajaxRequests, n = r.length, o = a.getProgress(),
                l = i.fileActionSettings;
            if (!i.enableResumableUpload) return i.$element;
            if (a.chunkIntervalId && clearInterval(a.chunkIntervalId), i.ajaxQueueIntervalId && clearInterval(i.ajaxQueueIntervalId), i._raise("fileuploadpaused", [i.fileManager, a]), n > 0) for (t = 0; n > t; t += 1) i.paused = !0, r[t].abort();
            return i.showPreview && i._getThumbs().each(function () {
                var t, a = e(this), r = a.attr("data-fileid"), n = i._getLayoutTemplate("stats"),
                    s = a.find(".file-upload-indicator");
                a.removeClass("file-uploading"), s.attr("title") === l.indicatorLoadingTitle && (i._setThumbStatus(a, "Paused"), t = n.setTokens({
                    pendingTime: i.msgPaused,
                    uploadSpeed: ""
                }), i.paused = !0, i._setProgress(o, a.find(".file-thumb-progress"), o + "%", t)), i.fileManager.getFile(r) || a.find(".kv-file-remove").removeClass("disabled").removeAttr("disabled")
            }), i._setProgress(101, i.$progress, i.msgPaused), i.$element
        }, cancel: function () {
            var t, i = this, a = i.ajaxRequests, r = i.resumableManager, n = a.length;
            if (i.enableResumableUpload && r.chunkIntervalId ? (clearInterval(r.chunkIntervalId), r.reset(), i._raise("fileuploadcancelled", [i.fileManager, r])) : i._raise("fileuploadcancelled", [i.fileManager]), i.ajaxQueueIntervalId && clearInterval(i.ajaxQueueIntervalId), i._initAjax(), n > 0) for (t = 0; n > t; t += 1) i.cancelling = !0, a[t].abort();
            return i._getThumbs().each(function () {
                var t = e(this), a = t.attr("data-fileid"), r = t.find(".file-thumb-progress");
                t.removeClass("file-uploading"), i._setProgress(0, r), r.hide(), i.fileManager.getFile(a) || (t.find(".kv-file-upload").removeClass("disabled").removeAttr("disabled"), t.find(".kv-file-remove").removeClass("disabled").removeAttr("disabled")), i.unlock()
            }), setTimeout(function () {
                i._setProgressCancelled()
            }, i.processDelay), i.$element
        }, clear: function () {
            var i, a = this;
            if (a._raise("fileclear")) return a.$btnUpload.removeAttr("disabled"), a._getThumbs().find("video,audio,img").each(function () {
                t.cleanMemory(e(this))
            }), a._clearFileInput(), a._resetUpload(), a.clearFileStack(), a._resetErrors(!0), a._hasInitialPreview() ? (a._showFileIcon(), a._resetPreview(), a._initPreviewActions(), a.$container.removeClass("file-input-new")) : (a._getThumbs().each(function () {
                a._clearObjects(e(this))
            }), a.isAjaxUpload && (a.previewCache.data = {}), a.$preview.html(""), i = !a.overwriteInitial && a.initialCaption.length > 0 ? a.initialCaption : "", a.$caption.attr("title", "").val(i), t.addCss(a.$container, "file-input-new"), a._validateDefaultPreview()), 0 === a.$container.find(t.FRAMES).length && (a._initCaption() || a.$captionContainer.removeClass("icon-visible")), a._hideFileIcon(), a.focusCaptionOnClear && a.$captionContainer.focus(), a._setFileDropZoneTitle(), a._raise("filecleared"), a.$element
        }, reset: function () {
            var e = this;
            if (e._raise("filereset")) return e.lastProgress = 0, e._resetPreview(), e.$container.find(".fileinput-filename").text(""), t.addCss(e.$container, "file-input-new"), (e.getFrames().length || e.dropZoneEnabled) && e.$container.removeClass("file-input-new"), e.clearFileStack(), e._setFileDropZoneTitle(), e.$element
        }, disable: function () {
            var e = this;
            return e.isDisabled = !0, e._raise("filedisabled"), e.$element.attr("disabled", "disabled"), e.$container.find(".kv-fileinput-caption").addClass("file-caption-disabled"), e.$container.find(".fileinput-remove, .fileinput-upload, .file-preview-frame button").attr("disabled", !0), t.addCss(e.$container.find(".btn-file"), "disabled"), e._initDragDrop(), e.$element
        }, enable: function () {
            var e = this;
            return e.isDisabled = !1, e._raise("fileenabled"), e.$element.removeAttr("disabled"), e.$container.find(".kv-fileinput-caption").removeClass("file-caption-disabled"), e.$container.find(".fileinput-remove, .fileinput-upload, .file-preview-frame button").removeAttr("disabled"), e.$container.find(".btn-file").removeClass("disabled"), e._initDragDrop(), e.$element
        }, upload: function () {
            var i, a, r = this, n = r.fileManager, o = n.count(), l = !e.isEmptyObject(r._getExtraData());
            if (r.isAjaxUpload && !r.isDisabled && r._isFileSelectionValid(o)) return r.lastProgress = 0, r._resetUpload(), 0 !== o || l ? (r.cancelling = !1, r.$progress.show(), r.lock(), 0 === o && l ? (r._setProgress(2), void r._uploadExtraOnly()) : r.enableResumableUpload ? r.resume() : ((r.uploadAsync || r.enableResumableUpload) && (a = r._getOutData(null), r._raise("filebatchpreupload", [a]), r.fileBatchCompleted = !1, r.uploadCache = [], e.each(r.getFileStack(), function (e) {
                var t = r._getThumbId(e);
                r.uploadCache.push({id: t, content: null, config: null, tags: null, append: !0})
            }), r.$preview.find(".file-preview-initial").removeClass(t.SORT_CSS), r._initSortable()), r._setProgress(2), r.hasInitData = !1, r.uploadAsync ? (i = 0, void e.each(n.stack, function (e) {
                r._uploadSingle(i, e, !0), i++
            })) : (r._uploadBatch(), r.$element))) : void r._showFileError(r.msgUploadEmpty)
        }, destroy: function () {
            var t = this, i = t.$form, a = t.$container, r = t.$element, n = t.namespace;
            return e(document).off(n), e(window).off(n), i && i.length && i.off(n), t.isAjaxUpload && t._clearFileInput(), t._cleanup(), t._initPreviewCache(), r.insertBefore(a).off(n).removeData(), a.off().remove(), r
        }, refresh: function (i) {
            var a = this, r = a.$element;
            return i = "object" != typeof i || t.isEmpty(i) ? a.options : e.extend(!0, {}, a.options, i), a._init(i, !0), a._listen(), r
        }, zoom: function (e) {
            var i = this, a = i._getFrame(e), r = i.$modal;
            a && (t.initModal(r), r.html(i._getModalContent()), i._setZoomContent(a), r.modal("show"), i._initZoomButtons())
        }, getExif: function (e) {
            var t = this, i = t._getFrame(e);
            return i && i.data("exif") || null
        }, getFrames: function (i) {
            var a, r = this;
            return i = i || "", a = r.$preview.find(t.FRAMES + i), r.reversePreviewOrder && (a = e(a.get().reverse())), a
        }, getPreview: function () {
            var e = this;
            return {content: e.initialPreview, config: e.initialPreviewConfig, tags: e.initialPreviewThumbTags}
        }
    }, e.fn.fileinput = function (a) {
        if (t.hasFileAPISupport() || t.isIE(9)) {
            var r = Array.apply(null, arguments), n = [];
            switch (r.shift(), this.each(function () {
                var o, l = e(this), s = l.data("fileinput"), d = "object" == typeof a && a,
                    c = d.theme || l.data("theme"), u = {}, p = {},
                    f = d.language || l.data("language") || e.fn.fileinput.defaults.language || "en";
                s || (c && (p = e.fn.fileinputThemes[c] || {}), "en" === f || t.isEmpty(e.fn.fileinputLocales[f]) || (u = e.fn.fileinputLocales[f] || {}), o = e.extend(!0, {}, e.fn.fileinput.defaults, p, e.fn.fileinputLocales.en, u, d, l.data()), s = new i(this, o), l.data("fileinput", s)), "string" == typeof a && n.push(s[a].apply(s, r))
            }), n.length) {
                case 0:
                    return this;
                case 1:
                    return n[0];
                default:
                    return n
            }
        }
    }, e.fn.fileinput.defaults = {
        language: "en",
        showCaption: !0,
        showBrowse: !0,
        showPreview: !0,
        showRemove: !0,
        showUpload: !0,
        showUploadStats: !0,
        showCancel: null,
        showPause: null,
        showClose: !0,
        showUploadedThumbs: !0,
        showConsoleLogs: !0,
        browseOnZoneClick: !1,
        autoReplace: !1,
        autoOrientImage: function () {
            var e = window.navigator.userAgent, t = !!e.match(/WebKit/i), i = !!e.match(/iP(od|ad|hone)/i),
                a = i && t && !e.match(/CriOS/i);
            return !a
        },
        autoOrientImageInitial: !0,
        required: !1,
        rtl: !1,
        hideThumbnailContent: !1,
        encodeUrl: !0,
        focusCaptionOnBrowse: !0,
        focusCaptionOnClear: !0,
        generateFileId: null,
        previewClass: "",
        captionClass: "",
        frameClass: "krajee-default",
        mainClass: "file-caption-main",
        mainTemplate: null,
        purifyHtml: !0,
        fileSizeGetter: null,
        initialCaption: "",
        initialPreview: [],
        initialPreviewDelimiter: "*$$*",
        initialPreviewAsData: !1,
        initialPreviewFileType: "image",
        initialPreviewConfig: [],
        initialPreviewThumbTags: [],
        previewThumbTags: {},
        initialPreviewShowDelete: !0,
        initialPreviewDownloadUrl: "",
        removeFromPreviewOnError: !1,
        deleteUrl: "",
        deleteExtraData: {},
        overwriteInitial: !0,
        sanitizeZoomCache: function (t) {
            var i = e(document.createElement("div")).append(t);
            return i.find("input,select,.file-thumbnail-footer").remove(), i.html()
        },
        previewZoomButtonIcons: {
            prev: '<i class="glyphicon glyphicon-triangle-left"></i>',
            next: '<i class="glyphicon glyphicon-triangle-right"></i>',
            toggleheader: '<i class="glyphicon glyphicon-resize-vertical"></i>',
            fullscreen: '<i class="glyphicon glyphicon-fullscreen"></i>',
            borderless: '<i class="glyphicon glyphicon-resize-full"></i>',
            close: '<i class="glyphicon glyphicon-remove"></i>'
        },
        previewZoomButtonClasses: {
            prev: "btn btn-navigate",
            next: "btn btn-navigate",
            toggleheader: "btn btn-sm btn-kv btn-default btn-outline-secondary",
            fullscreen: "btn btn-sm btn-kv btn-default btn-outline-secondary",
            borderless: "btn btn-sm btn-kv btn-default btn-outline-secondary",
            close: "btn btn-sm btn-kv btn-default btn-outline-secondary"
        },
        previewTemplates: {},
        previewContentTemplates: {},
        preferIconicPreview: !1,
        preferIconicZoomPreview: !1,
        allowedFileTypes: null,
        allowedFileExtensions: null,
        allowedPreviewTypes: void 0,
        allowedPreviewMimeTypes: null,
        allowedPreviewExtensions: null,
        disabledPreviewTypes: void 0,
        disabledPreviewExtensions: ["msi", "exe", "com", "zip", "rar", "app", "vb", "scr"],
        disabledPreviewMimeTypes: null,
        defaultPreviewContent: null,
        customLayoutTags: {},
        customPreviewTags: {},
        previewFileIcon: '<i class="glyphicon glyphicon-file"></i>',
        previewFileIconClass: "file-other-icon",
        previewFileIconSettings: {},
        previewFileExtSettings: {},
        buttonLabelClass: "hidden-xs",
        browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>&nbsp;',
        browseClass: "btn btn-primary",
        removeIcon: '<i class="glyphicon glyphicon-trash"></i>',
        removeClass: "btn btn-default btn-secondary",
        cancelIcon: '<i class="glyphicon glyphicon-ban-circle"></i>',
        cancelClass: "btn btn-default btn-secondary",
        pauseIcon: '<i class="glyphicon glyphicon-pause"></i>',
        pauseClass: "btn btn-default btn-secondary",
        uploadIcon: '<i class="glyphicon glyphicon-upload"></i>',
        uploadClass: "btn btn-default btn-secondary",
        uploadUrl: null,
        uploadUrlThumb: null,
        uploadAsync: !0,
        uploadParamNames: {
            chunkCount: "chunkCount",
            chunkIndex: "chunkIndex",
            chunkSize: "chunkSize",
            chunkSizeStart: "chunkSizeStart",
            chunksUploaded: "chunksUploaded",
            fileBlob: "fileBlob",
            fileId: "fileId",
            fileName: "fileName",
            fileRelativePath: "fileRelativePath",
            fileSize: "fileSize",
            retryCount: "retryCount"
        },
        maxAjaxThreads: 5,
        processDelay: 100,
        queueDelay: 10,
        progressDelay: 0,
        enableResumableUpload: !1,
        resumableUploadOptions: {
            fallback: null,
            testUrl: null,
            chunkSize: 2048,
            maxThreads: 4,
            maxRetries: 3,
            showErrorLog: !0
        },
        uploadExtraData: {},
        zoomModalHeight: 480,
        minImageWidth: null,
        minImageHeight: null,
        maxImageWidth: null,
        maxImageHeight: null,
        resizeImage: !1,
        resizePreference: "width",
        resizeQuality: .92,
        resizeDefaultImageType: "image/jpeg",
        resizeIfSizeMoreThan: 0,
        minFileSize: 0,
        maxFileSize: 0,
        maxFilePreviewSize: 25600,
        minFileCount: 0,
        maxFileCount: 0,
        maxTotalFileCount: 0,
        validateInitialCount: !1,
        msgValidationErrorClass: "text-danger",
        msgValidationErrorIcon: '<i class="glyphicon glyphicon-exclamation-sign"></i> ',
        msgErrorClass: "file-error-message",
        progressThumbClass: "progress-bar progress-bar-striped active",
        progressClass: "progress-bar bg-success progress-bar-success progress-bar-striped active",
        progressInfoClass: "progress-bar bg-info progress-bar-info progress-bar-striped active",
        progressCompleteClass: "progress-bar bg-success progress-bar-success",
        progressPauseClass: "progress-bar bg-primary progress-bar-primary progress-bar-striped active",
        progressErrorClass: "progress-bar bg-danger progress-bar-danger",
        progressUploadThreshold: 99,
        previewFileType: "image",
        elCaptionContainer: null,
        elCaptionText: null,
        elPreviewContainer: null,
        elPreviewImage: null,
        elPreviewStatus: null,
        elErrorContainer: null,
        errorCloseButton: t.closeButton("kv-error-close"),
        slugCallback: null,
        dropZoneEnabled: !0,
        dropZoneTitleClass: "file-drop-zone-title",
        fileActionSettings: {},
        otherActionButtons: "",
        textEncoding: "UTF-8",
        ajaxSettings: {},
        ajaxDeleteSettings: {},
        showAjaxErrorDetails: !0,
        mergeAjaxCallbacks: !1,
        mergeAjaxDeleteCallbacks: !1,
        retryErrorUploads: !0,
        reversePreviewOrder: !1,
        usePdfRenderer: function () {
            var e = !!window.MSInputMethodContext && !!document.documentMode;
            return !!navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/i) || e
        },
        pdfRendererUrl: "",
        pdfRendererTemplate: '<iframe class="kv-preview-data file-preview-pdf" src="{renderer}?file={data}" {style}></iframe>'
    }, e.fn.fileinputLocales.en = {
        fileSingle: "file",
        filePlural: "files",
        browseLabel: "Browse &hellip;",
        removeLabel: "Remove",
        removeTitle: "Clear all unprocessed files",
        cancelLabel: "Cancel",
        cancelTitle: "Abort ongoing upload",
        pauseLabel: "Pause",
        pauseTitle: "Pause ongoing upload",
        uploadLabel: "Upload",
        uploadTitle: "Upload selected files",
        msgNo: "No",
        msgNoFilesSelected: "No files selected",
        msgCancelled: "Cancelled",
        msgPaused: "Paused",
        msgPlaceholder: "Select {files}...",
        msgZoomModalHeading: "Detailed Preview",
        msgFileRequired: "You must select a file to upload.",
        msgSizeTooSmall: 'File "{name}" (<b>{size} KB</b>) is too small and must be larger than <b>{minSize} KB</b>.',
        msgSizeTooLarge: 'File "{name}" (<b>{size} KB</b>) exceeds maximum allowed upload size of <b>{maxSize} KB</b>.',
        msgFilesTooLess: "You must select at least <b>{n}</b> {files} to upload.",
        msgFilesTooMany: "Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>.",
        msgTotalFilesTooMany: "You can upload a maximum of <b>{m}</b> files (<b>{n}</b> files detected).",
        msgFileNotFound: 'File "{name}" not found!',
        msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
        msgFileNotReadable: 'File "{name}" is not readable.',
        msgFilePreviewAborted: 'File preview aborted for "{name}".',
        msgFilePreviewError: 'An error occurred while reading the file "{name}".',
        msgInvalidFileName: 'Invalid or unsupported characters in file name "{name}".',
        msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
        msgInvalidFileExtension: 'Invalid extension for file "{name}". Only "{extensions}" files are supported.',
        msgFileTypes: {
            image: "image",
            html: "HTML",
            text: "text",
            video: "video",
            audio: "audio",
            flash: "flash",
            pdf: "PDF",
            object: "object"
        },
        msgUploadAborted: "The file upload was aborted",
        msgUploadThreshold: "Processing...",
        msgUploadBegin: "Initializing...",
        msgUploadEnd: "Done",
        msgUploadResume: "Resuming upload...",
        msgUploadEmpty: "No valid data available for upload.",
        msgUploadError: "Upload Error",
        msgDeleteError: "Delete Error",
        msgProgressError: "Error",
        msgValidationError: "Validation Error",
        msgLoading: "Loading file {index} of {files} &hellip;",
        msgProgress: "Loading file {index} of {files} - {name} - {percent}% completed.",
        msgSelected: "{n} {files} selected",
        msgFoldersNotAllowed: "Drag & drop files only! {n} folder(s) dropped were skipped.",
        msgImageWidthSmall: 'Width of image file "{name}" must be at least {size} px.',
        msgImageHeightSmall: 'Height of image file "{name}" must be at least {size} px.',
        msgImageWidthLarge: 'Width of image file "{name}" cannot exceed {size} px.',
        msgImageHeightLarge: 'Height of image file "{name}" cannot exceed {size} px.',
        msgImageResizeError: "Could not get the image dimensions to resize.",
        msgImageResizeException: "Error while resizing the image.<pre>{errors}</pre>",
        msgAjaxError: "Something went wrong with the {operation} operation. Please try again later!",
        msgAjaxProgressError: "{operation} failed",
        msgDuplicateFile: 'File "{name}" of same size "{size} KB" has already been selected earlier. Skipping duplicate selection.',
        msgResumableUploadRetriesExceeded: "Upload aborted beyond <b>{max}</b> retries for file <b>{file}</b>! Error Details: <pre>{error}</pre>",
        msgPendingTime: "{time} remaining",
        msgCalculatingTime: "calculating time remaining",
        ajaxOperations: {
            deleteThumb: "file delete",
            uploadThumb: "file upload",
            uploadBatch: "batch file upload",
            uploadExtra: "form data upload"
        },
        dropZoneTitle: "Drag & drop files here &hellip;",
        dropZoneClickTitle: "<br>(or click to select {files})",
        previewZoomButtonTitles: {
            prev: "View previous file",
            next: "View next file",
            toggleheader: "Toggle header",
            fullscreen: "Toggle full screen",
            borderless: "Toggle borderless mode",
            close: "Close detailed preview"
        }
    }, e.fn.fileinput.Constructor = i, e(document).ready(function () {
        var t = e("input.file[type=file]");
        t.length && t.fileinput()
    })
});