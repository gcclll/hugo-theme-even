$(document).ready(function () {
  Even.backToTop();
  Even.mobileNavbar();
  Even.toc();
  Even.fancybox();
  addCopyButton();
  foldChapters();
});

Even.responsiveTable();
Even.flowchart();
Even.sequence();

if (window.hljs) {
  hljs.initHighlighting();
  Even.highlight();
} else {
  Even.chroma();
}

// copy codes
// based on https://xinyo.org/archives/66226
function foldChapters() {
  if (window.g_fold_chapter !== 1) return;
  $(".post-content .outline-3>div").hide();
  $(".post-content .outline-3>h3").append(
    '<img class="more" src="/img/more.svg"/>'
  );
  $(".post-content .outline-3>h3>img.more").click(function () {
    $(this).parent().siblings().toggle();
  });
}

function toggleFoldName(fold) {
  return fold ? "展开" : "折叠";
}

function fold(el, btn) {
  var fn = el._fold ? "removeClass" : "addClass";
  el._fold = !el._fold;
  el[fn]("fold");
  btn.text(toggleFoldName(el._fold));
}

function addCopyButton() {
  //用 div 包裹 figure 便于定位
  $(".src .highlight").wrap('<div class="highlight-wrapper"></div>');
  //添加复制按钮
  var $hls = $(".highlight"),
    $hlw = $(".highlight-wrapper");
  if (window.g_need_fold === 1) {
    $hlw.each(function () {
      var parent = $(this);
      if (parent.height() <= 450) return;
      var btn = $(
        '<div class="fold-code btn btn-outline-secondary">' +
          toggleFoldName(true) +
          "</div>"
      );

      btn.insertBefore(parent.children().get(0));
      parent._fold = true;
      btn.on("click", function () {
        fold(parent, $(this));
      });
      parent.addClass("fold");
    });
  }
  $hls.before('<div class="copy-code btn btn-outline-secondary">复制</div>');

  //为复制按钮添加click事件
  $(".copy-code").on("click", function () {
    //初始化
    $("textarea").remove("#targetId");

    //获取对应的代码
    var codeText = "";
    $(this)
      .next("div.highlight")
      .find("pre.chroma>code")
      .each(function (i) {
        // 过滤掉行号的那个 pre
        if (i > 0) {
          codeText += $(this).text() + "\n";
        }
      });

    //添加 <textarea> DOM节点，将获取的代码写入
    var target = document.createElement("textarea");
    target.style.opacity = 0;
    target.style.left = "-9999px";
    target.id = "targetId";
    $(this).append(target);
    target.textContent = codeText;

    //选中textarea内的代码
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // 复制选中的内容
    document.execCommand("copy");

    //删除添加的节点
    $("textarea").remove("#targetId");
    $(this).html("成功");
    var thisCopied = $(this);
    setTimeout(function () {
      thisCopied.html("复制");
    }, 1200);
  });
}
