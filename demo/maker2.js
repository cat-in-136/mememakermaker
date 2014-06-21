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
        step3activate();
      }, function onFailure(that) {
        infoout.html("failed to load image.");
        form.addClass("has-error");

        step2deactivate();
        step3deactivate();
      });
    }
  };
  $("#img-url").on("change", onStep1Input);
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

      $("input[name=text-ctrl-N-textAlign]", panel).attr("name", "text-ctrl-"+index+"-textAlign");
      $("#text-ctrl-"+index+"-left", panel).parent().addClass("active");
      $("#text-ctrl-"+index+"-left", panel).attr("checked", "checked");

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

      $("#text-ctrl-"+index+"-text", panel).on("keyup", mememaker2.updateMeme);
      $("#text-ctrl-"+index+"-text", panel).on("change", mememaker2.updateMeme);
      $("input[type=radio], input[type=number], input[type=checkbox], input[type=color]", panel).on("change", function () {
        step2updateMeme();
      });
      $("#text-ctrl-"+index+"-stroke-use").on("change", function () {
        if ($("#text-ctrl-"+index+"-stroke-use").is(":checked")) {
          $("#text-ctrl-"+index+"-stroke").removeAttr("disabled");
        } else {
          $("#text-ctrl-"+index+"-stroke").attr("disabled", "disabled");
        }
      });
      step2updateMeme();
    })(step2getNumTextCtrl() + 1);

  }
  function step2updateMeme() {
    var setting = {};
    for (var index = 1; $("#text-ctrl-form > div#text-ctrl-panel-" + index).length != 0; index++) {
      setting["text" + index] = {
        value: "#text-ctrl-"+index+"-text",
        textAlign: $("input[name=text-ctrl-"+index+"-textAlign]:checked").val(),
        x: parseInt($("#text-ctrl-"+index+"-x").val()),
        y: parseInt($("#text-ctrl-"+index+"-y").val()),
        strokeStyle: ($("#text-ctrl-"+index+"-stroke-use").is(':checked'))? $("#text-ctrl-"+index+"-stroke").val() : "transparent",
        fillStyle: $("#text-ctrl-"+index+"-fill").val()
      };
    }
    console.debug(setting);
    mememaker2.resetTextSetting(setting);
    mememaker2.updateMeme();
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

  function step3activate() {
    $("#panel-step3").fadeIn();
  }
  function step3deactivate() {
    $("#panel-step3").fadeOut();
  }
  function onCodeToShareCodeBtnClicked() {
    var setting = mememaker2.getSetting();
    delete setting["noAutoUpdate"];
    var view = $("<div></div>");
    view.append($("<canvas></canvas>", { id: canvas.id }));
    for (var index = 1; setting["text" + index]; index++) {
      view.append($("<input />", {
        type: "text",
        id: setting["text" + index].value,
        value: $(setting["text" + index].value).val()
      }));
    }

    var code = view.html() +
               "<script type=\"application/javascript\">\n" +
               "$(function () {\n" +
               "  $.MemeMaker2(\n" +
               "    " + JSON.stringify(setting) + "\n" +
               "  ).then(function onFulFill(that) {\n" +
               "  });\n" +
               "});\n" +
               "</script>";
    $("#code-share-output").children().remove();
    $("#code-share-output").append(
      $("<pre></pre>").append($("<code></code>").text(code))
    );
  }
  $("#code-share-code-btn").on("click", onCodeToShareCodeBtnClicked);
});

$("#panel-step1").show();
$("#panel-step2").hide();
$("#panel-step3").hide();

/* vim:set fileencoding=UTF-8 tabstop=2 shiftwidth=2 softtabstop=2 expandtab: */
