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
  $.fn.mememaker2 = function (options) {
    var defaults = {
      img: null
    };
    var setting = $.extend(defaults, options);
    var canvas = this[0];

    (function delayImgLoad(url) {
      // TODO ES6 Promise migration (i.e. (new Promise(...) )
      var defer = $.Deferred();
      try {
        var img = new Image();
        img.onload = function () { defer.resolve(img); };
        img.onerror = function (ex) { defer.reject(ex); };
        img.src = url;
      } catch (ex) {
        defer.reject(ex);
      }

      return defer;
    })(setting.img).then(function onFulFill (img) {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
  
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
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
      } catch (ex) {
        console.error("Render error!", ex);
      }  
    }, function onReject(ex) {
      console.error("Image loading error!", ex);
    });

    return this;
  };
})(jQuery);

/* vim:set fileencoding=UTF-8 tabstop=2 shiftwidth=2 softtabstop=2 expandtab: */
