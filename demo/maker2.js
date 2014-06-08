/* Meme Maker Maker
 *
 * Copyright 2014 @cat_in_136
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

$(function () {
  var mememaker2 = null;

  function onStep1Input() {
    var infoout = $("#img-url-infoout");
    var form = $("#img-url").parent();
    var url = $("#img-url").val();

    infoout.html("");
    form.removeClass("has-error has-success");
    if (mememaker2) {
      mememaker2.release();
      mememaker2 = null;
    }

    if (url == "") {
      $("#panel-step2").hide();
    } else {
      $.MemeMaker2({
        canvas: "#canvas",
        img: url,
        noAutoUpdate: true
      }).then(function onFulFill(that) {
        mememaker2 = that;
        form.addClass("has-success");

        step2activate();
      }, function onFailure(that) {
      console.error(that);
        infoout.html("failed to load image.");
        form.addClass("has-error");

        step2deactivate();
      });
    }
  };
  $("#img-url").on("change", onStep1Input);
  $("#img-url").on("keyup", onStep1Input);
  onStep1Input();

  function step2activate() {
    $("#text-ctrl-paginate li:not(.next)").remove();
    $("#text-ctrl-form > div").remove();

    step2addTab();

    $("#panel-step2").fadeIn();
  }
  function step2deactivate() {
    $("#panel-step2").fadeOut();
  }
  function step2getNumTextCtrl() {
    var index = 1;
    // seek the last index.
    while ($("#text-ctrl-form > div#text-ctrl-panel-" + index).length != 0) {
      index++;
    }
    return index - 1;
  }
  function step2addTab() {
    (function (index) {
      var panelTemplate = $("#text-ctrl-form > template")[0];
      var panel = null;
      if ("content" in panelTemplate) {
        panel = $("<div></div>", { id: "text-ctrl-panel-" + index });
        panel.append(document.importNode(panelTemplate.content, true));
      } else {
        panel = $("<div></div>", { id: "text-ctrl-panel-" + index });
        $(panelTemplate).children().each(function(v) {
          panel.append(v.cloneNode(true));
        });
      }
      $("*[id]", panel).attr("id", function(i, val) {
        return val.replace("text-ctrl-N-", "text-ctrl-"+index+"-");
      });
      $("*[for]", panel).attr("for", function(i, val) {
        return val.replace("text-ctrl-N-", "text-ctrl-"+index+"-");
      });
      $("#text-ctrl-"+index+"-left").click();
      $("#text-ctrl-form").append(panel);

      $("#text-ctrl-paginate li.active").removeClass("active");
      $("<li></li>", {
        "class": "active",
        "data-form-id": "text-ctrl-panel-" + index
      }).append($("<a></a>", {
        href: "javascript:void();",
        text: "" + index,
        click: function () {
          step2showTab(index);
        }
      })).insertBefore("#text-ctrl-paginate li.next");

      mememaker2.updateSetting("text" + index, { value: "#text-ctrl-"+index+"-text" });
      $("#text-ctrl-"+index+"-text").on("keyup", mememaker2.updateMeme);
      $("#text-ctrl-"+index+"-text").on("change", mememaker2.updateMeme);
      mememaker2.updateMeme();
    })(step2getNumTextCtrl() + 1);

  }
  function step2showTab(index) {
    $("#text-ctrl-paginate li.active").removeClass("active");
    $("#text-ctrl-paginate li[data-form-id=text-ctrl-panel-"+index+"]").addClass("active");
    $("#text-ctrl-form > div:not(#text-ctrl-panel-"+index+")").slideUp();
    $("#text-ctrl-form > div#text-ctrl-panel-"+index).slideDown();
  }
  function onStep2AddTab() {
    step2addTab();
    step2showTab(step2getNumTextCtrl());
  }
  $("#text-ctrl-add-next").on("click", onStep2AddTab);

});

$("#panel-step1").show();
$("#panel-step2").hide();

/* vim:set fileencoding=UTF-8 tabstop=2 shiftwidth=2 softtabstop=2 expandtab: */
