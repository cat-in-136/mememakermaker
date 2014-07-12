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
  try {
    var jsonString = location.search.replace(/^\?/, "");
    var setting = JSON.parse(decodeURIComponent(jsonString));

    var inputForm = $("#main-panel form");
    for (var i = 1; setting["text" + i]; i++) {
      var textId = setting["text" + i].value.replace(/^\#/, "");

      inputForm.append($("<input />", {
                 type: "text",
                 id: textId
               }));
    }

    $.MemeMaker2(setting);
  } catch (e) {
    throw e;
  }

  function onGetPngImageBtnClicked() {
    window.open($("#canvas")[0].toDataURL("image/png"));
  }
  $("#get-png-btn").on("click", onGetPngImageBtnClicked);
});

/* vim:set fileencoding=UTF-8 tabstop=2 shiftwidth=2 softtabstop=2 expandtab: */
