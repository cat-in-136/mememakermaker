/* Meme Maker Maker
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function($) {
  // TODO ES6 Promise migration (i.e. (new Promise(...) )
  $.MemeMaker2 = function (options) {
    var defaults = {
      img: null
    };
    var setting = $.extend(defaults, options);

    var that = $(setting.canvas);
    var defer = $.Deferred();
    var canvas = that[0];
    var memeimg = null;

    var updateSetting = function () {
      if (arguments.length == 0) {
        // do nothing
      } else if (arguments.length == 1) {
        setting = $.extend(setting, options);
      } else if (arguments.length == 2) {
        setting[arguments[0]] = arguments[1];
      } else {
        jQuery.error("wrong number of arguments to updateSetting");
      }
    };

    var updateMeme = function () {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(memeimg, 0, 0);
      ctx.font        = "bold 20px sans-serif bold";
      ctx.strokeStyle = "#000000";
      ctx.fillStyle   = "#ffffff";
  
      for (var i = 1; setting["text" + i]; i++) {
        var textsetting = setting["text" + i];
        var textvalue = $(textsetting.value).val();
        if (textvalue) {
          ctx.textAlign = textsetting.textAlign || "center";
          ctx.textBaseline = textsetting.textBaseline || "top";
          var textX = textsetting.x;
          if (!textX) {
            if (ctx.textAlign == "left")   { textX = 0;                }
            if (ctx.textAlign == "right")  { textX = canvas.width;     }
            if (ctx.textAlign == "center") { textX = canvas.width / 2; }
          }
          var textY = textsetting.x;
          if (!textY) {
            if (ctx.textBaseline == "top")    { textY = 0;                }
            if (ctx.textBaseline == "bottom") { textY = canvas.height - 20;}
            if (ctx.textBaseline == "midlle") { textY = canvas.height / 2;}
          }
          if (textsetting.strokeStyle) { ctx.strokeStyle = textsetting.strokeStyle; }
          if (textsetting.fillStyle)   { ctx.fillStyle   = textsetting.fillStyle;   }
          ctx.strokeText(textvalue, textX, textY);
          ctx.fillText(textvalue, textX, textY);
        }
      }
    };

    var applyAutoUpdate = function () {
      for (var i = 1; setting["text" + i]; i++) {
        var textbox = $(setting["text" + i].value);
        textbox.off("change.mememaker2");
        textbox.off("keyup.mememaker2");
        textbox.on("change.mememaker2", updateMeme);
        textbox.on("keyup.mememaker2", updateMeme);
      }
    };

    var release = function () {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 1; setting["text" + i]; i++) {
        var textbox = $(setting["text" + i].value);

        textbox.off("change.mememaker2");
        textbox.off("keyup.mememaker2");
      }

      setting = $.extend({}, defaults);
    };

    (function delayImgLoad(url) {
      var d = $.Deferred();
      try {
        var img = new Image();
        img.onload = function () { d.resolve(img); };
        img.onerror = function (ex) { d.reject(ex); };
        img.src = url;
      } catch (ex) {
        d.reject(ex);
      }
      return d.promise();
    })(setting.img).then(function onFulFill (img) {
      try {
        memeimg = img;
        canvas.width = img.width;
        canvas.height = img.height;

        if (!setting.noAutoUpdate) {
          applyAutoUpdate();
        }

        updateMeme();

        defer.resolve(that);
      } catch (ex) {
        console.error("Render error!", ex);
        defer.reject(ex);
      }  
    }, function onReject(ex) {
      console.error("Image loading error!", ex);
      defer.reject(ex);
    });

    that.updateSetting = updateSetting;
    that.updateMeme = updateMeme;
    that.applyAutoUpdate = applyAutoUpdate;
    that.release = release;
    return defer.promise();
  };

})(jQuery);

/* vim:set fileencoding=UTF-8 tabstop=2 shiftwidth=2 softtabstop=2 expandtab: */
