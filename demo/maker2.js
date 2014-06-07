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
            img: url
          }).then(function onFulFill(that) {
            mememaker2 = that;
            form.addClass("has-success");

            onStep2Activate(mememaker2);
          }, function onFailure(that) {
          console.error(that);
            infoout.html("failed to load image.");
            form.addClass("has-error");

            onStep2Deactivate(mememaker2);
          });
        }
      };
      $("#img-url").on("change", onStep1Input);
      $("#img-url").on("keyup", onStep1Input);
      onStep1Input();

      function onStep2Activate(mememaker2) {
        $("#text-ctrl-paginate li:not(.next)").remove();
        $("#text-ctrl-form > div").remove();

        var panelTemplate = $("#text-ctrl-form > template")[0];
        var panel = null;
        if ("content" in panelTemplate) {
          panel = document.createElement("div"); 
          panel.id = "text-ctrl-panel-1";
          panel.appendChild(document.importNode(panelTemplate.content, true));
        } else {
          panel = document.createElement("div"); 
          $(panelTemplate).each(function(v) {
            panel.appendChild(v.cloneNode(true));
          });
        }
        $("*[id]", panel).attr("id", function(index, val) {
          return val.replace("text-ctrl-N-", "text-ctrl-1-");
        });
        $("*[for]", panel).attr("for", function(index, val) {
          return val.replace("text-ctrl-N-", "text-ctrl-1-");
        });
        $("#text-ctrl-form").append(panel);

        $("#text-ctrl-paginate li.active").removeClass("active");
        $("<li></li>", {
          "class": "active",
          "data-form-id": "text-ctrl-panel-" + 1
        }).append($("<a></a>", {
          href: "javascript:void();",
          text: 1 + "",
          click: function () {
            onStep2ShowTab(1);
          }
        })).insertBefore("#text-ctrl-paginate li.next");
        mememaker2.updateSetting("text" + 1, { value: "#text-ctrl-1-text" });
        mememaker2.applyAutoUpdate();
        mememaker2.updateMeme();

        $("#panel-step2").fadeIn();
      }
      function onStep2Deactivate(mememaker2) {
        $("#panel-step2").fadeOut();
      }
      function onStep2ShowTab(index) {
        $("#text-ctrl-paginate li.active").removeClass("active");
        $("#text-ctrl-paginate li[data-form-id=text-ctrl-panel-"+index+"]").addClass("active");
        $("#text-ctrl-form > div:not(#text-ctrl-panel-"+index+")").fadeOut();
        $("#text-ctrl-form > div#text-ctrl-panel-"+index).fadeIn();
      }


    });

    $("#panel-step1").show();
    $("#panel-step2").hide();
